import { useEffect, useRef, useState } from 'react'
import { Button, Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import toast from '@/utils/toast'

// VK Logo Component
const VkLogo = ({ size = 24 }) => (
	<svg width={size} height={size} viewBox="0 0 48 48" fill="none">
		<circle cx="24" cy="24" r="24" fill="#0077FF"/>
		<path d="M25.54 34h-2.18c-6.87 0-10.8-4.7-10.98-12.48h3.45c.12 5.88 2.7 8.37 4.77 8.88V21.52h3.24v5.1c2.04-.22 4.17-2.55 4.89-5.1h3.24c-.54 3.06-2.82 5.31-4.44 6.24 1.62.75 4.17 2.67 5.16 6.24h-3.57c-.75-2.37-2.61-4.2-5.1-4.44v4.44h-.48z" fill="white"/>
	</svg>
)

// OK (Odnoklassniki) Logo Component
const OkLogo = ({ size = 24 }) => (
	<svg width={size} height={size} viewBox="0 0 48 48" fill="none">
		<circle cx="24" cy="24" r="24" fill="#EE8208"/>
		<path d="M24 13c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zm0 15c5.52 0 10 4.48 10 10v1H14v-1c0-5.52 4.48-10 10-10z" fill="white"/>
		<circle cx="24" cy="19" r="3" fill="#EE8208"/>
		<path d="M24 28c-2.76 0-5 2.24-5 5h10c0-2.76-2.24-5-5-5z" fill="#EE8208"/>
		<rect x="21" y="31" width="6" height="3" rx="1.5" fill="white"/>
	</svg>
)

// Mail.ru Logo Component
const MailLogo = ({ size = 24 }) => (
	<svg width={size} height={size} viewBox="0 0 48 48" fill="none">
		<circle cx="24" cy="24" r="24" fill="#168DE2"/>
		<path d="M33 17H15c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V19c0-1.1-.9-2-2-2zm0 4l-9 5.62L15 21v-2l9 5.62L33 19v2z" fill="white"/>
	</svg>
)

const VkIdButton = ({ buttonStyles }) => {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [sdkReady, setSdkReady] = useState(false)
	const sdkLoadedRef = useRef(false)
	const sdkInitializedRef = useRef(false)

	useEffect(() => {
		// Prevent loading SDK multiple times
		if (sdkLoadedRef.current) {
			return
		}

		sdkLoadedRef.current = true

		// Load VK ID SDK - Try multiple CDN sources
		const cdnSources = [
			'https://unpkg.com/@vkid/sdk@3.0.0/dist-sdk/umd/index.js',
			'https://cdn.jsdelivr.net/npm/@vkid/sdk@3.0.0/dist-sdk/umd/index.js',
			'https://unpkg.com/@vkid/sdk@latest/dist-sdk/umd/index.js'
		]

		let currentCdnIndex = 0

		const loadScript = () => {
			if (currentCdnIndex >= cdnSources.length) {
				console.error('❌ Failed to load VK ID SDK from all CDN sources')
				return
			}

			const script = document.createElement('script')
			script.src = cdnSources[currentCdnIndex]
			script.async = true

			script.onload = () => {
				console.log('✅ VK ID SDK script loaded')
				initVkId()
			}

			script.onerror = (error) => {
				console.warn(`⚠️ Failed to load from ${cdnSources[currentCdnIndex]}, trying next...`)
				if (script.parentNode) {
					script.parentNode.removeChild(script)
				}
				currentCdnIndex++
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

	const initVkId = () => {
		// Prevent multiple initializations
		if (sdkInitializedRef.current) {
			return
		}

		if (!window.VKIDSDK || !process.env.NEXT_PUBLIC_VK_APP_ID) {
			console.error('❌ VK ID SDK not loaded or APP ID missing')
			return
		}

		try {
			sdkInitializedRef.current = true

			// Initialize VK ID SDK
			window.VKIDSDK.Config.init({
				app: parseInt(process.env.NEXT_PUBLIC_VK_APP_ID),
				redirectUrl: `${window.location.origin}/auth/callback`,
				mode: window.VKIDSDK.ConfigAuthMode.InNewTab, // Use popup mode instead of redirect
			})

			setSdkReady(true)
			console.log('✅ VK ID SDK initialized successfully')
		} catch (error) {
			console.error('Error initializing VK ID:', error)
		}
	}

	const handleVkIdClick = async () => {
		if (!sdkReady || isLoading) {
			if (!sdkReady) {
				toast.error('VK ID est en cours de chargement...')
			}
			return
		}

		setIsLoading(true)

		try {
			console.log('🔐 Starting VK ID authentication...')
			console.log('SDK Ready:', sdkReady)
			console.log('VKIDSDK:', window.VKIDSDK)

			// Trigger VK ID authentication popup with timeout
			console.log('📞 Calling window.VKIDSDK.Auth.login()...')

			const authPromise = window.VKIDSDK.Auth.login()
			console.log('⏳ Login promise created, waiting for result...')

			const authResult = await authPromise

			console.log('Auth result:', authResult)

			if (!authResult || !authResult.token) {
				throw new Error('No token received from VK ID')
			}

			console.log('✅ VK ID authentication successful')
			const { token, type } = authResult

			console.log('Token type:', type)

			if (type !== 'silent_token' && type !== 'oauth_token') {
				throw new Error('Invalid token type')
			}

			// Get user info from VK ID
			console.log('👤 Getting user info from VK ID...')
			const userData = await window.VKIDSDK.Auth.getUserInfo(token)
			console.log('✅ User info received:', userData.first_name, userData.last_name)

			// Validate token and create/login user on our backend
			console.log('🔄 Validating with backend...')
			const response = await fetch('/api/auth/vkid/validate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					token: token.access_token,
					firstName: userData.first_name,
					lastName: userData.last_name,
					avatar: userData.avatar,
					email: userData.email,
					userId: userData.user_id,
					provider: userData.provider || 'vk', // vk, ok, or mail
				}),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Authentication failed')
			}

			console.log('✅ Backend validation successful')

			// Set Supabase session with tokens
			console.log('🔑 Setting Supabase session...')
			const { error: sessionError } = await supabase.auth.setSession({
				access_token: data.access_token,
				refresh_token: data.refresh_token,
			})

			if (sessionError) {
				throw sessionError
			}

			console.log('✅ Session created successfully')

			// Success - redirect to home
			toast.success('Connexion réussie !')
			await router.replace('/')
		} catch (error) {
			console.error('❌ VK ID login error:', error)
			console.error('Error details:', {
				message: error.message,
				code: error.code,
				name: error.name,
				stack: error.stack
			})

			// Check if user closed the popup
			if (error.message?.includes('closed') || error.code === 'access_denied') {
				console.log('ℹ️ User closed VK ID popup')
			} else {
				toast.error('Erreur lors de la connexion avec VK ID')
			}

			setIsLoading(false)
		}
	}

	return (
		<Button
			variant="outlined"
			fullWidth
			onClick={handleVkIdClick}
			disabled={!sdkReady || isLoading}
			sx={buttonStyles}
			aria-label="Sign in with VK, Odnoklassniki or Mail.ru">
			<Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.25, sm: 1.5 }, justifyContent: 'center' }}>
				{/* Icons */}
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
					<VkLogo size={24} />
					<OkLogo size={24} />
					<MailLogo size={24} />
				</Box>

				{/* Text */}
				<Typography sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', sm: '0.95rem' } }}>
					{isLoading ? 'Connexion...' : 'VK • OK • Mail.ru'}
				</Typography>
			</Box>
		</Button>
	)
}

export default VkIdButton
