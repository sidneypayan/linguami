'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Box, CircularProgress, Typography } from '@mui/material'

/**
 * OAuth callback and email confirmation page
 * Handles redirects after:
 * - Email confirmation
 * - OAuth login (Google, VK ID)
 * - Magic Link
 * - Password reset
 */
export default function AuthCallback() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [statusMessage, setStatusMessage] = useState('Verifying your account...')

	useEffect(() => {
		const handleCallback = async () => {
			try {
				// Get URL parameters
				const hashParams = new URLSearchParams(window.location.hash.substring(1))
				// searchParams now from useSearchParams hook

				// Check if it's a VK ID callback (code authorization flow)
				const vkCode = searchParams.get('code')
				const vkType = searchParams.get('type')
				const deviceId = searchParams.get('device_id')

				if (vkCode && vkType === 'code_v2') {
					console.log('🔐 VK ID callback detected, exchanging code for tokens...')
					console.log('VK Code (first 10 chars):', vkCode.substring(0, 10) + '...')
					console.log('Device ID (first 10 chars):', deviceId ? deviceId.substring(0, 10) + '...' : 'undefined')
					console.log('Type:', vkType)
					console.log('Redirect URI:', `${window.location.origin}/auth/callback`)
					setStatusMessage('Connecting with VK ID...')

					try {
						// Exchange code for token via backend API
						console.log('🔄 Exchanging code for token...')
						const exchangeResponse = await fetch('/api/auth/vkid/exchange-code', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								code: vkCode,
								deviceId: deviceId,
								redirectUri: `${window.location.origin}/auth/callback`,
							}),
						})

						console.log('Exchange response status:', exchangeResponse.status)

						if (!exchangeResponse.ok) {
							const errorData = await exchangeResponse.json().catch(() => ({ error: 'Unknown error' }))
							console.error('❌ Exchange failed with error:', errorData)
							throw new Error(errorData.error || 'Failed to exchange code')
						}

						const { access_token, user } = await exchangeResponse.json()

						console.log('✅ Token received from VK ID')
						console.log('👤 User info:', user.first_name, user.last_name, user.email || '(no email)')

						// Validate token and create/login user on our backend
						console.log('🔄 Validating with backend...')
						const response = await fetch('/api/auth/vkid/validate', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								token: access_token,
								firstName: user.first_name,
								lastName: user.last_name,
								avatar: user.avatar,
								email: user.email,
								userId: user.user_id,
								provider: 'vk',
							}),
						})

						console.log('Validation response status:', response.status)

						const data = await response.json().catch(() => ({ error: 'Failed to parse response' }))

						if (!response.ok) {
							console.error('❌ Validation failed with error:', data)
							throw new Error(data.error || 'Authentication failed')
						}

						console.log('✅ Backend validation successful')
						console.log('User ID:', data.userId)

						// Set Supabase session with tokens
						console.log('🔑 Setting Supabase session...')
						const { error: sessionError } = await supabase.auth.setSession({
							access_token: data.access_token,
							refresh_token: data.refresh_token,
						})

						if (sessionError) {
							throw sessionError
						}

						console.log('✅ VK ID authentication complete')
						setStatusMessage('Connection successful!')

						// Redirect to materials page
						router.replace('/materials')
						return
					} catch (vkError) {
						console.error('❌ VK ID authentication error:', vkError)
						console.error('Error name:', vkError.name)
						console.error('Error message:', vkError.message)
						console.error('Error stack:', vkError.stack)
						console.error('Full error object:', JSON.stringify(vkError, null, 2))

						// Wait 5 seconds before redirect to see the error
						const errorMessage = vkError.message || 'Unknown error'
						setStatusMessage(`Erreur VK ID: ${errorMessage}`)
						console.log(`⏳ Waiting 5 seconds before redirecting to login...`)
						await new Promise(resolve => setTimeout(resolve, 5000))

						console.log('🔀 Redirecting to login page...')
						router.replace('/login?error=vkid')
						return
					}
				}

				// Check if it's an email confirmation or recovery callback
				const type = searchParams.get('type')
				const accessToken = hashParams.get('access_token')
				const refreshToken = hashParams.get('refresh_token')
					console.log('🔍 OAuth Callback Debug:', {
				type,
				hasAccessToken: !!accessToken,
				hasRefreshToken: !!refreshToken,
				hash: window.location.hash,
				search: window.location.search
			})

			// Check if it's a Google OAuth callback with PKCE (has code but not VK type)
			const isGooglePKCE = vkCode && (!vkType || vkType !== 'code_v2')
			if (!accessToken && !refreshToken && isGooglePKCE) {
					console.log('🔐 OAuth PKCE flow detected (Google/Facebook)')
					setStatusMessage('Completing authentication...')

					// Wait for Supabase to process the PKCE token
					await new Promise(resolve => setTimeout(resolve, 500))

					// Check if session was established
					const { data: { session }, error: sessionError } = await supabase.auth.getSession()

					if (sessionError || !session) {
						console.error('❌ No session after PKCE exchange:', sessionError)
						router.replace('/login?error=auth_failed')
						return
					}

					console.log('✅ OAuth PKCE session established')
					setStatusMessage('Redirecting...')
					router.replace('/materials')
					return
				}
				// If type=recovery but no tokens in hash, it's PKCE
				// Supabase will automatically exchange the PKCE token for a session
				if (type === 'recovery' && !accessToken) {
					console.log('🔐 Password recovery with PKCE detected')
					setStatusMessage('Verifying reset link...')

					// Wait for Supabase to process the PKCE token
					await new Promise(resolve => setTimeout(resolve, 500))

					// Check if session was established
					const { data: { session }, error: sessionError } = await supabase.auth.getSession()

					if (sessionError || !session) {
						console.error('❌ No session after PKCE exchange:', sessionError)
						router.replace('/reset-password?error=access_denied&error_code=otp_expired')
						return
					}

					console.log('✅ PKCE session established, redirecting to password reset')
					router.replace('/reset-password')
					return
				}

				if (accessToken && refreshToken) {
					setStatusMessage('Logging in...')

					// Set session with tokens
					const { error: sessionError } = await supabase.auth.setSession({
						access_token: accessToken,
						refresh_token: refreshToken,
					})

					if (sessionError) {
						console.error('Error setting session:', sessionError)
						// Redirect to login on error
						router.replace('/login?error=session')
						return
					}

					// Check if user has a profile
					const { data: { user } } = await supabase.auth.getUser()

					if (user) {
						// Check if profile exists
						const { data: profile } = await supabase
							.from('users_profile')
							.select('id, learning_language')
							.eq('id', user.id)
							.maybeSingle()

						// If profile already exists (normal case)
						if (profile) {
							setStatusMessage('Redirecting...')

							// Success - redirect to home page
							if (type === 'signup') {
								// New confirmed user
								router.replace('/?welcome=true')
							} else if (type === 'recovery') {
								// Password reset
								router.replace('/reset-password')
							} else {
								// OAuth or Magic Link login
								router.replace('/materials')
							}
						} else {
							// Profile not yet created (rare because of auto trigger)
							// Wait and retry
							setStatusMessage('Finalizing your profile...')
							await new Promise(resolve => setTimeout(resolve, 1000))
							router.replace('/')
						}
					}
				} else {
					// No valid tokens - redirect to login
					router.replace('/login')
				}
			} catch (error) {
				console.error('Error in auth callback:', error)
				router.replace('/login?error=callback')
			}
		}

		handleCallback()
	}, [router, searchParams])

	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
			}}>
			<CircularProgress
				size={60}
				sx={{
					color: 'white',
					mb: 3,
				}}
			/>
			<Typography
				variant="h5"
				sx={{
					color: 'white',
					fontWeight: 600,
					textAlign: 'center',
					px: 3,
				}}>
				{statusMessage}
			</Typography>
			<Typography
				variant="body1"
				sx={{
					color: 'rgba(255, 255, 255, 0.8)',
					mt: 1,
					textAlign: 'center',
					px: 3,
				}}>
				You will be redirected in a moment
			</Typography>
		</Box>
	)
}

