// Helper pour les messages toast traduits
// Peut être utilisé même dans les contextes où useTranslation n'est pas disponible

import commonFr from '../locales/fr/common.json'
import commonRu from '../locales/ru/common.json'
import commonEn from '../locales/en/common.json'

// Détecte la langue du navigateur
const getBrowserLanguage = () => {
	if (typeof window === 'undefined') return 'fr'

	// 1. Essayer de lire depuis le cookie NEXT_LOCALE
	try {
		const cookies = document.cookie.split(';')
		const localeCookie = cookies.find(c => c.trim().startsWith('NEXT_LOCALE='))
		if (localeCookie) {
			const locale = localeCookie.split('=')[1]
			if (locale) return locale
		}
	} catch {}

	// 2. Vérifier l'URL (pathname commence par /ru, /fr, ou /en)
	try {
		const pathname = window.location.pathname
		if (pathname.startsWith('/ru')) return 'ru'
		if (pathname.startsWith('/en')) return 'en'
		if (pathname.startsWith('/fr')) return 'fr'
	} catch {}

	// 3. Vérifier localStorage
	try {
		const stored = localStorage.getItem('NEXT_LOCALE')
		if (stored) return stored
	} catch {}

	// 4. Fallback: détecter depuis navigator
	const browserLang = navigator.language || navigator.userLanguage
	if (browserLang.startsWith('ru')) return 'ru'
	if (browserLang.startsWith('en')) return 'en'
	return 'fr'
}

// Récupère un message traduit selon la clé
export const getToastMessage = (key, locale = null) => {
	const lang = locale || getBrowserLanguage()
	let messages
	if (lang === 'ru') messages = commonRu
	else if (lang === 'en') messages = commonEn
	else messages = commonFr
	return messages[key] || messages.genericError || 'Une erreur est survenue'
}

// Factory pour créer les fonctions de messages avec une locale donnée
export const createToastMessages = (locale = null) => ({
	profileLoadError: () => getToastMessage('profileLoadError', locale),
	confirmationEmailSent: () => getToastMessage('confirmationEmailSent', locale),
	invalidCredentials: () => getToastMessage('invalidCredentials', locale),
	emailNotConfirmed: () => getToastMessage('emailNotConfirmed', locale),
	loginSuccess: () => getToastMessage('loginSuccess', locale),
	passwordResetEmailSent: () => getToastMessage('passwordResetEmailSent', locale),
	passwordUpdateSuccess: () => getToastMessage('passwordUpdateSuccess', locale),
	passwordUpdateError: () => getToastMessage('passwordUpdateError', locale),
	languageUpdateError: () => getToastMessage('languageUpdateError', locale),
	magicLinkSent: () => getToastMessage('magicLinkSent', locale),
	genericError: () => getToastMessage('genericError', locale),
})

// Instance par défaut (détection automatique)
export const toastMessages = createToastMessages()
