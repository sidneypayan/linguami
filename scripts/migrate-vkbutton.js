const fs = require('fs');
const content = `'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from '@/utils/toast'
import { useThemeMode } from '@/context/ThemeContext'
import { logger } from '@/utils/logger'
import { getVkUserInfo, validateVkAuth } from '@/app/actions/vkauth'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const VkIdButton = ({ buttonClassName }) => {
	const router = useRouter()
	const { isDark } = useThemeMode()
	const [isLoading, setIsLoading] = useState(false)
	const [sdkReady, setSdkReady] = useState(false)
	const [widgetLoading, setWidgetLoading] = useState(true)
	const [isLocalDev, setIsLocalDev] = useState(false)
	const sdkLoadedRef = useRef(false)
	const sdkInitializedRef = useRef(false)
	const oneTapInstanceRef = useRef(null)
	const containerRef = useRef(null)

	useEffect(() => {
		const isLocal = typeof window !== 'undefined' && window.location.protocol === 'http:'
		setIsLocalDev(isLocal)

		if (isLocal) {
			setWidgetLoading(false)
			return
		}

		if (sdkLoadedRef.current) {
			return
		}

		sdkLoadedRef.current = true

		const cdnSources = [
			'https://unpkg.com/@vkid/sdk@2/dist-sdk/umd/index.js',
			'https://cdn.jsdelivr.net/npm/@vkid/sdk@2/dist-sdk/umd/index.js',
		]

		let currentCdnIndex = 0

		const loadScript = () => {
			if (currentCdnIndex >= cdnSources.length) {
				toast.error('Impossible de charger VK ID')
				return
			}

			const script = document.createElement('script')
			script.src = cdnSources[currentCdnIndex]
			script.async = true
			script.crossOrigin = 'anonymous'

			script.onload = () => {
				initVkId()
			}

			script.onerror = () => {
				if (script.parentNode) script.parentNode.removeChild(script)
				currentCdnIndex++
				loadScript()
			}

			document.body.appendChild(script)
		}

		loadScript()
	}, [])

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
		if (sdkInitializedRef.current || !window.VKIDSDK || !process.env.NEXT_PUBLIC_VK_APP_ID) {
			setWidgetLoading(false)
			return
		}

		try {
			sdkInitializedRef.current = true

			const appId = parseInt(process.env.NEXT_PUBLIC_VK_APP_ID)
			const redirectUrl = window.location.origin + '/auth/callback'

			const codeVerifier = generateCodeVerifier()
			const codeChallenge = await generateCodeChallenge(codeVerifier)

			sessionStorage.setItem('vk_code_verifier', codeVerifier)

			window.VKIDSDK.Config.init({
				app: appId,
				redirectUrl: redirectUrl,
				codeChallenge: codeChallenge,
				responseMode: window.VKIDSDK.ConfigResponseMode.Callback,
				scope: 'email',
			})

			renderOneTapWidget()
			setSdkReady(true)
		} catch (error) {
			logger.error('Error initializing VK ID:', error)
			setWidgetLoading(false)
		}
	}

	const renderOneTapWidget = () => {
		if (!containerRef.current || !window.VKIDSDK) {
			setWidgetLoading(false)
			return
		}

		try {
			const oneTap = new window.VKIDSDK.OneTap()

			oneTap
				.render({
					container: containerRef.current,
					scheme: isDark ? window.VKIDSDK.Scheme.DARK : window.VKIDSDK.Scheme.LIGHT,
					lang: window.VKIDSDK.Languages.RUS,
					styles: { width: '100%', height: 48, borderRadius: 12 },
				})
				.on(window.VKIDSDK.WidgetEvents.ERROR, () => {
					setWidgetLoading(false)
				})
				.on(window.VKIDSDK.OneTapInternalEvents.LOGIN_SUCCESS, handleOneTapSuccess)

			oneTapInstanceRef.current = oneTap
			setWidgetLoading(false)
		} catch (error) {
			logger.error('Error rendering OneTap widget:', error)
			setWidgetLoading(false)
		}
	}

	const handleOneTapSuccess = async (payload) => {
		if (isLoading) return
		setIsLoading(true)

		try {
			const codeVerifier = sessionStorage.getItem('vk_code_verifier')
			if (!codeVerifier) throw new Error('Code verifier not found')

			const tokenData = await window.VKIDSDK.Auth.exchangeCode(payload.code, payload.device_id, codeVerifier)
			if (!tokenData.access_token) throw new Error('No access token received')

			const userInfoResult = await getVkUserInfo({ accessToken: tokenData.access_token })
			if (!userInfoResult.success) throw new Error(userInfoResult.error || 'Failed to get user info')

			const { user } = userInfoResult

			const data = await validateVkAuth({
				token: tokenData.access_token,
				firstName: user.first_name,
				lastName: user.last_name,
				avatar: user.avatar,
				email: user.email,
				userId: user.user_id,
				provider: 'vk',
			})

			if (!data.success) throw new Error(data.error || 'Authentication failed')

			const { error: sessionError } = await supabase.auth.setSession({
				access_token: data.access_token,
				refresh_token: data.refresh_token,
			})

			if (sessionError) throw sessionError

			toast.success('Connexion reussie !')
			sessionStorage.removeItem('vk_code_verifier')
			router.push('/')
		} catch (error) {
			logger.error('VK ID authentication error:', error)
			toast.error('Erreur d\'authentification: ' + error.message)
			setIsLoading(false)
		}
	}

	useEffect(() => {
		return () => {
			if (oneTapInstanceRef.current?.destroy) {
				try { oneTapInstanceRef.current.destroy() } catch {}
			}
		}
	}, [])

	if (isLocalDev) {
		return (
			<Button variant="outline" className={buttonClassName}>
				<div className="flex items-center gap-2.5 justify-center">
					<svg className="w-6 h-6" viewBox="0 0 48 48" fill="none">
						<path d="M0 23.04C0 12.1788 0 6.74826 3.37413 3.37413C6.74826 0 12.1788 0 23.04 0H24.96C35.8212 0 41.2517 0 44.6259 3.37413C48 6.74826 48 12.1788 48 23.04V24.96C48 35.8212 48 41.2517 44.6259 44.6259C41.2517 48 35.8212 48 24.96 48H23.04C12.1788 48 6.74826 48 3.37413 44.6259C0 41.2517 0 35.8212 0 24.96V23.04Z" fill="#0077FF"/>
						<path d="M25.54 34.5801C14.6 34.5801 8.3601 27.0801 8.1001 14.6001H13.5801C13.7601 23.7601 17.8 27.6401 21 28.4401V14.6001H26.1602V22.5001C29.3202 22.1601 32.6398 18.5601 33.7598 14.6001H38.9199C38.0599 19.4801 34.4599 23.0801 31.8999 24.5601C34.4599 25.7601 38.5601 28.9001 40.1201 34.5801H34.4396C33.2396 30.7801 30.1797 27.8203 26.1602 27.4003V34.5801H25.54Z" fill="white"/>
					</svg>
					<span className="font-semibold">VK ID</span>
				</div>
			</Button>
		)
	}

	return (
		<div className={cn(buttonClassName, 'relative w-full flex items-center justify-center min-h-[48px]')}>
			<div ref={containerRef} id="vkid-onetap-container" className="w-full flex items-center justify-center" />
			{(widgetLoading || isLoading) && (
				<div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl z-10">
					<Loader2 className="w-6 h-6 animate-spin" />
				</div>
			)}
		</div>
	)
}

export default VkIdButton
`;
fs.writeFileSync('components/auth/VkIdButton.jsx', content);
console.log('VkIdButton.jsx migrated');
