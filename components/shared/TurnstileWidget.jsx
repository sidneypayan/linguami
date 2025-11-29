import { useRef, useImperativeHandle, forwardRef } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { useThemeMode } from '@/context/ThemeContext'
import { logger } from '@/utils/logger'

/**
 * Cloudflare Turnstile Widget Component
 *
 * Anti-bot protection using Cloudflare Turnstile (free alternative to reCAPTCHA)
 *
 * @param {function} onSuccess - Callback called when the challenge is completed successfully
 * @param {function} onError - Callback called when an error occurs
 * @param {string} action - Optional action name for analytics (e.g., 'signup', 'login')
 */
const TurnstileWidget = forwardRef(({ onSuccess, onError, action = 'submit' }, ref) => {
	const { isDark } = useThemeMode()
	const turnstileRef = useRef(null)

	// Expose reset method to parent
	useImperativeHandle(ref, () => ({
		reset: () => {
			if (turnstileRef.current) {
				turnstileRef.current.reset()
			}
		}
	}))

	const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

	if (!siteKey) {
		logger.error('NEXT_PUBLIC_TURNSTILE_SITE_KEY is not defined in environment variables')
		return null
	}

	const handleSuccess = (token) => {
		if (onSuccess) {
			onSuccess(token)
		} else {
			logger.error('onSuccess callback is not defined!')
		}
	}

	const handleError = (error) => {
		logger.error('Turnstile error:', error)
		if (onError) {
			onError(error)
		}
	}

	const handleExpire = () => {
		logger.warn('Turnstile token expired')
		if (onError) {
			onError('Token expired')
		}
	}

	return (
		<div className="flex justify-center items-center my-4">
			<Turnstile
				ref={turnstileRef}
				siteKey={siteKey}
				onSuccess={handleSuccess}
				onError={handleError}
				onExpire={handleExpire}
				options={{
					action: action,
					theme: isDark ? 'dark' : 'light',
					size: 'normal',
					retry: 'auto',
					language: 'auto',
				}}
			/>
		</div>
	)
})

TurnstileWidget.displayName = 'TurnstileWidget'

export default TurnstileWidget
