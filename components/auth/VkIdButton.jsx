import { useEffect, useRef, useState } from 'react'
import { Button, Box, Typography, useTheme } from '@mui/material'
import { LoginRounded } from '@mui/icons-material'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import toast from '@/utils/toast'

const VkIdButton = () => {
	const router = useRouter()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const buttonRef = useRef(null)
	const [isLoading, setIsLoading] = useState(false)
	const sdkLoadedRef = useRef(false)
	const sdkInitializedRef = useRef(false)

	console.log('✅ VkIdButton component mounted')

	useEffect(() => {
		// Prevent loading SDK multiple times
		if (sdkLoadedRef.current) {
			console.log('⏭️ SDK already loaded, skipping...')
			return
		}

		sdkLoadedRef.current = true
		console.log('🚀 VK ID SDK loading...')

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
				console.log('✅ VK ID SDK script loaded from:', cdnSources[currentCdnIndex])
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
			console.log('⏭️ VK ID SDK already initialized, skipping...')
			return
		}

		console.log('🔍 VK ID Debug:', {
			sdkLoaded: !!window.VKIDSDK,
			appId: process.env.NEXT_PUBLIC_VK_APP_ID,
			hasAppId: !!process.env.NEXT_PUBLIC_VK_APP_ID
		})

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
				mode: window.VKIDSDK.ConfigAuthMode.InNewTab,
			})

			// Create One Tap button
			const oneTap = new window.VKIDSDK.OneTap()

			// Render button
			if (buttonRef.current) {
				oneTap.render({
					container: buttonRef.current,
					scheme: isDark ? window.VKIDSDK.Scheme.DARK : window.VKIDSDK.Scheme.LIGHT,
					lang: window.VKIDSDK.Languages.RUS,
					styles: {
						width: '100%',
						height: 48,
						borderRadius: 12,
					},
				})
					.on(window.VKIDSDK.WidgetEvents.ERROR, handleError)
					.on(window.VKIDSDK.OneTapInternalEvents.LOGIN_SUCCESS, handleSuccess)
			}
		} catch (error) {
			console.error('Error initializing VK ID:', error)
		}
	}

	const handleSuccess = async (payload) => {
		// Prevent multiple simultaneous authentications
		if (isLoading) {
			console.log('⏭️ Authentication already in progress, skipping...')
			return
		}

		setIsLoading(true)
		try {
			console.log('🔐 VK ID authentication started...')
			const { token, type } = payload

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

			// Use replace instead of push to avoid navigation issues
			await router.replace('/')
		} catch (error) {
			console.error('❌ VK ID login error:', error)
			toast.error('Erreur lors de la connexion avec VK ID')
			setIsLoading(false)
		}
		// Don't set isLoading to false on success - let the redirect happen
	}

	const handleError = (error) => {
		console.error('VK ID widget error:', error)
	}

	// Fallback button if SDK fails to load
	const handleFallbackClick = () => {
		toast.error('VK ID est temporairement indisponible')
	}

	const buttonStyles = {
		py: { xs: 1.75, sm: 1.75 },
		borderRadius: 2.5,
		border: '2px solid',
		borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(102, 126, 234, 0.2)',
		color: isDark ? '#cbd5e1' : '#4a5568',
		textTransform: 'none',
		fontWeight: 600,
		fontSize: '0.95rem',
		transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
		position: 'relative',
		overflow: 'hidden',
		background: isDark
			? 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)'
			: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)',
		'&:hover': {
			borderColor: '#667eea',
			background: isDark
				? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)'
				: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
			transform: 'translateY(-2px)',
			boxShadow: isDark
				? '0 8px 24px rgba(139, 92, 246, 0.35)'
				: '0 8px 24px rgba(102, 126, 234, 0.25)',
		},
	}

	return (
		<Box
			sx={{
				position: 'relative',
				width: '100%',
				minHeight: '48px',
			}}>
			{/* VK ID SDK container */}
			<div
				ref={buttonRef}
				style={{
					width: '100%',
					display: isLoading ? 'none' : 'block',
				}}
			/>

			{/* Fallback button (shown if SDK doesn't load) */}
			{!buttonRef.current && (
				<Button
					variant="outlined"
					fullWidth
					onClick={handleFallbackClick}
					sx={buttonStyles}
					disabled={isLoading}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}>
						<LoginRounded sx={{ fontSize: '1.5rem', color: '#0077FF' }} />
						<Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
							VK ID
						</Typography>
					</Box>
				</Button>
			)}

			{/* Loading overlay */}
			{isLoading && (
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
						backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
						borderRadius: 2.5,
					}}>
					<Typography sx={{ color: '#667eea', fontWeight: 600 }}>
						Connexion...
					</Typography>
				</Box>
			)}
		</Box>
	)
}

export default VkIdButton
