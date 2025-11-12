import { useEffect, useRef, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useRouter } from 'next/router'
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
		// Check if we're in local development (HTTP)
		// VK ID requires HTTPS, so skip initialization on plain HTTP
		const isLocal = typeof window !== 'undefined' && window.location.protocol === 'http:'
		setIsLocalDev(isLocal)

		if (isLocal) {
			console.warn('⚠️ VK ID OneTap requires HTTPS. Disabled in local HTTP environment.')
			console.log('💡 VK ID will work in production (HTTPS) or with an HTTPS tunnel.')
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

			// Validate token and create/login user on our backend
			console.log('🔄 Validating with backend...')
			const response = await fetch('/api/auth/vkid/validate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					token: tokenData.access_token,
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

	// Don't render anything in local HTTP environment
	if (isLocalDev) {
		return null
	}

	return (
		<Box
			sx={{
				position: 'relative',
				width: '100%',
				minHeight: 48,
				...buttonStyles,
			}}
		>
			{/* Container for VK ID OneTap widget */}
			<div ref={containerRef} id="vkid-onetap-container" style={{ width: '100%' }} />

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
