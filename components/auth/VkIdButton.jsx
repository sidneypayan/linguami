'use client'

import { useEffect, useRef, useState } from 'react'
import { Box, CircularProgress, Button, Typography } from '@mui/material'
import { useRouter, usePathname, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from '@/utils/toast'
import { useTheme } from '@mui/material/styles'

const VkIdButton = ({ buttonStyles }) => {
	const router = useRouter()
	const theme = useTheme()
	const [isLoading, setIsLoading] = useState(false)
	const [sdkReady, setSdkReady] = useState(false)
	const [widgetLoading, setWidgetLoading] = useState(true)
	const [isLocalDev, setIsLocalDev] = useState(false)
	const sdkLoadedRef = useRef(false)
	const sdkInitializedRef = useRef(false)
	const oneTapInstanceRef = useRef(null)
	const containerRef = useRef(null)

	useEffect(() => {
		// Skip VK ID on localhost to avoid errors
		// VK ID only works on HTTPS (production or ngrok tunnel)
		const isLocal = typeof window !== 'undefined' && window.location.protocol === 'http:'
		setIsLocalDev(isLocal)

		if (isLocal) {
			setWidgetLoading(false)
			return
		}

		// Prevent loading SDK multiple times
		if (sdkLoadedRef.current) {
			console.log('🔄 VK ID SDK already loading/loaded, skipping...')
			return
		}

		console.log('📦 Loading VK ID SDK...')
		sdkLoadedRef.current = true

		// Load VK ID SDK - Try multiple CDN sources
		const cdnSources = [
			'https://unpkg.com/@vkid/sdk@2/dist-sdk/umd/index.js',
			'https://cdn.jsdelivr.net/npm/@vkid/sdk@2/dist-sdk/umd/index.js',
			'https://unpkg.com/@vkid/sdk@latest/dist-sdk/umd/index.js'
		]

		let currentCdnIndex = 0

		const loadScript = () => {
			if (currentCdnIndex >= cdnSources.length) {
				console.error('❌ Failed to load VK ID SDK from all CDN sources')
				toast.error('Impossible de charger VK ID. Veuillez réessayer.')
				return
			}

			console.log(`🔗 Trying to load VK ID SDK from: ${cdnSources[currentCdnIndex]}`)
			const script = document.createElement('script')
			script.src = cdnSources[currentCdnIndex]
			script.async = true
			script.crossOrigin = 'anonymous'

			script.onload = () => {
				console.log(`✅ VK ID SDK script loaded successfully from: ${cdnSources[currentCdnIndex]}`)
				initVkId()
			}

			script.onerror = (error) => {
				console.error(`❌ Failed to load from ${cdnSources[currentCdnIndex]}:`, error)
				console.error('Error type:', error.type)
				console.error('Error target:', error.target)
				if (script.parentNode) {
					script.parentNode.removeChild(script)
				}
				currentCdnIndex++
				console.log(`⏭️ Trying next CDN source (${currentCdnIndex + 1}/${cdnSources.length})...`)
				loadScript()
			}

			document.body.appendChild(script)
		}

		loadScript()

		return () => {
			// Cleanup - remove all VK ID scripts
			const scripts = document.querySelectorAll('script[src*="vkid"]')
			scripts.forEach(script => {
				if (script.parentNode) {
					script.parentNode.removeChild(script)
				}
			})
		}
	}, [])

	// Generate PKCE code verifier and challenge
	const generateCodeVerifier = () => {
		const array = new Uint8Array(32)
		crypto.getRandomValues(array)
		return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
	}

	const generateCodeChallenge = async (verifier) => {
		const encoder = new TextEncoder()
		const data = encoder.encode(verifier)
		const digest = await crypto.subtle.digest('SHA-256', data)
		return btoa(String.fromCharCode(...new Uint8Array(digest)))
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=/g, '')
	}

	const initVkId = async () => {
		// Prevent multiple initializations
		if (sdkInitializedRef.current) {
			console.log('🔄 VK ID SDK already initialized, skipping...')
			return
		}

		if (!window.VKIDSDK) {
			console.error('❌ VK ID SDK not loaded (window.VKIDSDK is undefined)')
			return
		}

		if (!process.env.NEXT_PUBLIC_VK_APP_ID) {
			console.error('❌ NEXT_PUBLIC_VK_APP_ID is not defined')
			toast.error('Configuration VK ID manquante')
			return
		}

		try {
			sdkInitializedRef.current = true

			const appId = parseInt(process.env.NEXT_PUBLIC_VK_APP_ID)
			const redirectUrl = `${window.location.origin}/auth/callback`

			// Generate PKCE parameters
			const codeVerifier = generateCodeVerifier()
			const codeChallenge = await generateCodeChallenge(codeVerifier)

			// Store code verifier for later use
			sessionStorage.setItem('vk_code_verifier', codeVerifier)

			console.log('🔧 Initializing VK ID SDK with:')
			console.log('  - App ID:', appId)
			console.log('  - Redirect URL:', redirectUrl)
			console.log('  - Origin:', window.location.origin)
			console.log('  - Code Challenge (first 20 chars):', codeChallenge.substring(0, 20) + '...')

			// Initialize VK ID SDK with code challenge (workaround for PKCE bug)
			window.VKIDSDK.Config.init({
				app: appId,
				redirectUrl: redirectUrl,
				codeChallenge: codeChallenge,
				responseMode: window.VKIDSDK.ConfigResponseMode.Callback,
				scope: 'email', // Request email permission
			})

			console.log('✅ VK ID SDK initialized successfully with PKCE')

			// Create and render OneTap widget
			renderOneTapWidget()

			setSdkReady(true)
		} catch (error) {
			console.error('❌ Error initializing VK ID:', error)
			console.error('Error message:', error.message)
			console.error('Error stack:', error.stack)
			toast.error('Erreur lors de l\'initialisation de VK ID')
			setWidgetLoading(false)
		}
	}

	const renderOneTapWidget = () => {
		if (!containerRef.current || !window.VKIDSDK) {
			console.error('❌ Container ref or VKIDSDK not available')
			setWidgetLoading(false)
			return
		}

		try {
			console.log('🎨 Rendering VK ID OneTap widget...')

			// Create OneTap instance
			const oneTap = new window.VKIDSDK.OneTap()

			// Determine color scheme based on theme
			const scheme = theme.palette.mode === 'dark'
				? window.VKIDSDK.Scheme.DARK
				: window.VKIDSDK.Scheme.LIGHT

			// Render the widget
			oneTap
				.render({
					container: containerRef.current,
					scheme: scheme,
					lang: window.VKIDSDK.Languages.RUS,
					styles: {
						width: '100%',
						height: 48,
						borderRadius: 12,
					},
				})
				.on(window.VKIDSDK.WidgetEvents.ERROR, (error) => {
					console.error('❌ VK ID Widget Error:', error)
					console.error('Error type:', typeof error)
					console.error('Error details:', JSON.stringify(error, null, 2))
					console.error('Error properties:', Object.keys(error))
					if (error.message) console.error('Error message:', error.message)
					if (error.code) console.error('Error code:', error.code)
					if (error.description) console.error('Error description:', error.description)
					toast.error('Erreur lors du chargement du widget VK ID')
					setWidgetLoading(false)
				})
				.on(window.VKIDSDK.OneTapInternalEvents.LOGIN_SUCCESS, async (payload) => {
					console.log('✅ VK ID OneTap LOGIN_SUCCESS event received')
					console.log('Payload:', payload)
					await handleOneTapSuccess(payload)
				})

			oneTapInstanceRef.current = oneTap
			setWidgetLoading(false)

			console.log('✅ VK ID OneTap widget rendered successfully')
		} catch (error) {
			console.error('❌ Error rendering OneTap widget:', error)
			console.error('Error message:', error.message)
			console.error('Error stack:', error.stack)
			toast.error('Erreur lors du rendu du widget VK ID')
			setWidgetLoading(false)
		}
	}

	const handleOneTapSuccess = async (payload) => {
		if (isLoading) {
			console.log('⚠️ Already processing authentication, skipping...')
			return
		}

		setIsLoading(true)

		try {
			console.log('🔐 Processing VK ID OneTap authentication...')
			console.log('Code (first 10 chars):', payload.code ? payload.code.substring(0, 10) + '...' : 'undefined')
			console.log('Device ID (first 10 chars):', payload.device_id ? payload.device_id.substring(0, 10) + '...' : 'undefined')

			// Get stored code verifier
			const codeVerifier = sessionStorage.getItem('vk_code_verifier')
			if (!codeVerifier) {
				throw new Error('Code verifier not found in session storage')
			}

			console.log('Code Verifier (first 20 chars):', codeVerifier.substring(0, 20) + '...')

			// Exchange code for token using VK ID SDK (client-side with PKCE)
			console.log('🔄 Exchanging code for token using SDK...')
			const tokenData = await window.VKIDSDK.Auth.exchangeCode(
				payload.code,
				payload.device_id,
				codeVerifier
			)

			console.log('✅ Token exchange successful')
			console.log('Has access_token:', !!tokenData.access_token)
			console.log('Has refresh_token:', !!tokenData.refresh_token)

			if (!tokenData.access_token) {
				throw new Error('No access token received from SDK')
			}

			// Get user info via backend API (to avoid CORS issues)
			console.log('🔍 Fetching user info via backend...')
			const userInfoResponse = await fetch('/api/auth/vkid/get-user-info', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					accessToken: tokenData.access_token,
				}),
			})

			if (!userInfoResponse.ok) {
				const errorData = await userInfoResponse.json().catch(() => ({ error: 'Failed to get user info' }))
				console.error('❌ Failed to get user info:', errorData)
				throw new Error(errorData.error || 'Failed to get user info')
			}

			const { user } = await userInfoResponse.json()

			console.log('✅ User info received')
			console.log('Raw user object:', JSON.stringify(user, null, 2))
			console.log('👤 User:', user.first_name, user.last_name, user.email || '(no email)')
			console.log('User ID:', user.user_id)
			console.log('Avatar:', user.avatar)

			// Log all available fields to debug
			console.log('🔍 Available user fields:', Object.keys(user))
			console.log('First Name:', user.first_name)
			console.log('Last Name:', user.last_name)
			console.log('Email:', user.email)
			console.log('User ID:', user.user_id)

			// Prepare data for validation
			const validationPayload = {
				token: tokenData.access_token,
				firstName: user.first_name,
				lastName: user.last_name,
				avatar: user.avatar,
				email: user.email,
				userId: user.user_id,
				provider: 'vk',
			}

			// Validate token and create/login user on our backend
			console.log('🔄 Validating with backend...')
			console.log('Validation payload:', JSON.stringify(validationPayload, null, 2))
			console.log('Token present:', !!validationPayload.token)
			console.log('UserId present:', !!validationPayload.userId)

			const response = await fetch('/api/auth/vkid/validate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(validationPayload),
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
				console.error('❌ Session error:', sessionError)
				throw sessionError
			}

			console.log('✅ VK ID authentication complete')
			toast.success('Connexion réussie !')

			// Clean up stored code verifier
			sessionStorage.removeItem('vk_code_verifier')

			// Redirect to home
			router.push('/')
		} catch (error) {
			console.error('❌ VK ID authentication error:', error)
			console.error('Error name:', error.name)
			console.error('Error message:', error.message)
			console.error('Error stack:', error.stack)
			toast.error(`Erreur d'authentification: ${error.message}`)
			setIsLoading(false)
		}
	}

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (oneTapInstanceRef.current) {
				try {
					// Cleanup OneTap instance if it has a destroy method
					if (typeof oneTapInstanceRef.current.destroy === 'function') {
						oneTapInstanceRef.current.destroy()
					}
				} catch (error) {
					console.error('Error cleaning up OneTap instance:', error)
				}
			}
		}
	}, [])

	// Show mock button on localhost for styling purposes (non-functional)
	if (isLocalDev) {
		return (
			<Button
				fullWidth
				sx={buttonStyles}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.25, sm: 1.5 }, justifyContent: 'center' }}>
					<Box
						component="svg"
						sx={{ width: 24, height: 24 }}
						viewBox="0 0 48 48"
						fill="none"
					>
						<path
							d="M0 23.04C0 12.1788 0 6.74826 3.37413 3.37413C6.74826 0 12.1788 0 23.04 0H24.96C35.8212 0 41.2517 0 44.6259 3.37413C48 6.74826 48 12.1788 48 23.04V24.96C48 35.8212 48 41.2517 44.6259 44.6259C41.2517 48 35.8212 48 24.96 48H23.04C12.1788 48 6.74826 48 3.37413 44.6259C0 41.2517 0 35.8212 0 24.96V23.04Z"
							fill="#0077FF"
						/>
						<path
							d="M25.54 34.5801C14.6 34.5801 8.3601 27.0801 8.1001 14.6001H13.5801C13.7601 23.7601 17.8 27.6401 21 28.4401V14.6001H26.1602V22.5001C29.3202 22.1601 32.6398 18.5601 33.7598 14.6001H38.9199C38.0599 19.4801 34.4599 23.0801 31.8999 24.5601C34.4599 25.7601 38.5601 28.9001 40.1201 34.5801H34.4396C33.2396 30.7801 30.1797 27.8203 26.1602 27.4003V34.5801H25.54Z"
							fill="white"
						/>
					</Box>
					<Typography sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', sm: '0.95rem' } }}>
						VK ID
					</Typography>
				</Box>
			</Button>
		)
	}

	return (
		<Box
			sx={{
				...buttonStyles,
				position: 'relative',
				width: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: 48,
			}}
		>
			{/* Container for VK ID OneTap widget */}
			<div
				ref={containerRef}
				id="vkid-onetap-container"
				style={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			/>

			{/* Loading indicator */}
			{(widgetLoading || isLoading) && (
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						bgcolor: 'rgba(255, 255, 255, 0.8)',
						borderRadius: '12px',
						zIndex: 1,
					}}
				>
					<CircularProgress size={24} />
				</Box>
			)}
		</Box>
	)
}

export default VkIdButton
