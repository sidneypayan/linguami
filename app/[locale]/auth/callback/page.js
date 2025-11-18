'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Box, CircularProgress, Typography } from '@mui/material'
import { logger } from '@/utils/logger'
import { exchangeVkCode, validateVkAuth } from '@/app/actions/vkauth'

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


					setStatusMessage('Connecting with VK ID...')

					try {
						// Exchange code for token via Server Action

						const exchangeResult = await exchangeVkCode({
							code: vkCode,
							deviceId: deviceId,
							redirectUri: `${window.location.origin}/auth/callback`,
						})

						if (!exchangeResult.success) {
							logger.error('❌ Exchange failed with error:', exchangeResult.error)
							throw new Error(exchangeResult.error || 'Failed to exchange code')
						}

						const { access_token, user } = exchangeResult


						// Validate token and create/login user via Server Action

						const data = await validateVkAuth({
							token: access_token,
							firstName: user.first_name,
							lastName: user.last_name,
							avatar: user.avatar,
							email: user.email,
							userId: user.user_id,
							provider: 'vk',
						})

						if (!data.success) {
							logger.error('❌ Validation failed with error:', data.error)
							throw new Error(data.error || 'Authentication failed')
						}

						// Set Supabase session with tokens

						const { error: sessionError } = await supabase.auth.setSession({
							access_token: data.access_token,
							refresh_token: data.refresh_token,
						})

						if (sessionError) {
							throw sessionError
						}

						setStatusMessage('Connection successful!')

						// Redirect to materials page
						router.replace('/materials')
						return
					} catch (vkError) {
						logger.error('❌ VK ID authentication error:', vkError)
						logger.error('Error name:', vkError.name)
						logger.error('Error message:', vkError.message)
						logger.error('Error stack:', vkError.stack)
						logger.error('Full error object:', JSON.stringify(vkError, null, 2))

						// Wait 5 seconds before redirect to see the error
						const errorMessage = vkError.message || 'Unknown error'
						setStatusMessage(`Erreur VK ID: ${errorMessage}`)

						await new Promise(resolve => setTimeout(resolve, 5000))

						router.replace('/login?error=vkid')
						return
					}
				}

				// Check if it's an email confirmation or recovery callback
				const type = searchParams.get('type')
				const accessToken = hashParams.get('access_token')
				const refreshToken = hashParams.get('refresh_token')

			// Check if it's a Google OAuth callback with PKCE (has code but not VK type)
			const isGooglePKCE = vkCode && (!vkType || vkType !== 'code_v2')
			if (!accessToken && !refreshToken && isGooglePKCE) {
					setStatusMessage('Completing authentication...')

					// Wait for Supabase to process the PKCE token
					await new Promise(resolve => setTimeout(resolve, 500))

					// Check if session was established
					const { data: { session }, error: sessionError } = await supabase.auth.getSession()

					if (sessionError || !session) {
						logger.error('❌ No session after PKCE exchange:', sessionError)
						router.replace('/login?error=auth_failed')
						return
					}

					setStatusMessage('Redirecting...')
					router.replace('/materials')
					return
				}
				// If type=recovery but no tokens in hash, it's PKCE
				// Supabase will automatically exchange the PKCE token for a session
				if (type === 'recovery' && !accessToken) {

					setStatusMessage('Verifying reset link...')

					// Wait for Supabase to process the PKCE token
					await new Promise(resolve => setTimeout(resolve, 500))

					// Check if session was established
					const { data: { session }, error: sessionError } = await supabase.auth.getSession()

					if (sessionError || !session) {
						logger.error('❌ No session after PKCE exchange:', sessionError)
						router.replace('/reset-password?error=access_denied&error_code=otp_expired')
						return
					}

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
						logger.error('Error setting session:', sessionError)
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
				logger.error('Error in auth callback:', error)
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

