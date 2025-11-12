import { useEffect, useRef } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

/**
 * Cloudflare Turnstile Widget Component
 *
 * Anti-bot protection using Cloudflare Turnstile (free alternative to reCAPTCHA)
 *
 * @param {function} onSuccess - Callback called when the challenge is completed successfully
 * @param {function} onError - Callback called when an error occurs
 * @param {string} action - Optional action name for analytics (e.g., 'signup', 'login')
 */
const TurnstileWidget = ({ onSuccess, onError, action = 'submit' }) => {
	const theme = useTheme()
	const turnstileRef = useRef(null)

	const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

	if (!siteKey) {
		console.error('❌ NEXT_PUBLIC_TURNSTILE_SITE_KEY is not defined in environment variables')
		return null
	}

	const handleSuccess = (token) => {
		console.log('✅ Turnstile challenge completed')
		if (onSuccess) {
			onSuccess(token)
		}
	}

	const handleError = (error) => {
		console.error('❌ Turnstile error:', error)
		if (onError) {
			onError(error)
		}
	}

	const handleExpire = () => {
		console.warn('⚠️ Turnstile token expired')
		if (onError) {
			onError('Token expired')
		}
	}

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				my: 2,
			}}
		>
			<Turnstile
				ref={turnstileRef}
				siteKey={siteKey}
				onSuccess={handleSuccess}
				onError={handleError}
				onExpire={handleExpire}
				options={{
					action: action,
					theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
					size: 'normal',
					retry: 'auto',
					language: 'auto',
				}}
			/>
		</Box>
	)
}

export default TurnstileWidget
