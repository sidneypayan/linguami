/**
 * Conditional Logger Utility
 *
 * Provides logging functions that:
 * - Only log in development for debug/info/warn
 * - Always log errors (needed in production for monitoring)
 * - Can be extended with external logging services (Sentry, LogRocket)
 *
 * Usage:
 * import { logger } from '@/utils/logger'
 *
 * logger.log('Debug info')     // Only in dev
 * logger.warn('Warning')       // Only in dev
 * logger.error('Error', error) // Always logged
 */

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
	/**
	 * Debug logging - only in development
	 * Use for general debugging information
	 */
	log: (...args) => {
		if (isDevelopment) {
			console.log(...args)
		}
	},

	/**
	 * Warning logging - only in development
	 * Use for non-critical issues that should be addressed
	 */
	warn: (...args) => {
		if (isDevelopment) {
			console.warn(...args)
		}
	},

	/**
	 * Error logging - always logged (dev + production)
	 * Use for critical errors that need monitoring
	 *
	 * In production, these should be sent to an error tracking service
	 * (Sentry, LogRocket, etc.)
	 */
	error: (...args) => {
		console.error(...args)

		// TODO: Send to error tracking service in production
		// if (!isDevelopment) {
		//   Sentry.captureException(args[0])
		// }
	},

	/**
	 * Info logging - only in development
	 * Use for informational messages
	 */
	info: (...args) => {
		if (isDevelopment) {
			console.info(...args)
		}
	},
}
