import axios from 'axios'
import { parse, serialize } from 'cookie'
import { createClient } from '@supabase/supabase-js'

const MAX_GUEST_TRANSLATIONS = 20
const COOKIE_NAME = 'guest_trans_count'
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 an

// Initialiser Supabase pour le tracking côté serveur
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY // Clé service pour bypass RLS
)

/**
 * Récupère l'adresse IP du client
 */
function getClientIP(req) {
	// Essayer différentes sources d'IP (proxy, cloudflare, etc.)
	const forwarded = req.headers['x-forwarded-for']
	const ip = forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress
	return ip || 'unknown'
}

/**
 * Vérifie et incrémente le compteur de traductions côté serveur (par IP)
 * Protection impossible à contourner en supprimant les cookies
 */
async function checkAndIncrementServerCount(ipAddress) {
	try {
		// Vérifier si cette IP existe déjà
		const { data: existing, error: fetchError } = await supabase
			.from('guest_translation_tracking')
			.select('*')
			.eq('ip_address', ipAddress)
			.single()

		if (fetchError && fetchError.code !== 'PGRST116') {
			// PGRST116 = pas trouvé, c'est OK
			// 42P01 = table n'existe pas
			if (fetchError.code === '42P01') {
				console.warn('guest_translation_tracking table does not exist, skipping server-side tracking')
			} else {
				console.error('Error fetching translation count:', fetchError)
			}
			// Continuer sans bloquer l'utilisateur
			return { count: 0, limitReached: false }
		}

		if (existing) {
			// IP existe déjà, vérifier la limite
			if (existing.translation_count >= MAX_GUEST_TRANSLATIONS) {
				return {
					count: existing.translation_count,
					limitReached: true
				}
			}

			// Incrémenter le compteur
			const { error: updateError } = await supabase
				.from('guest_translation_tracking')
				.update({
					translation_count: existing.translation_count + 1,
					updated_at: new Date().toISOString()
				})
				.eq('ip_address', ipAddress)

			if (updateError) {
				console.error('Error updating translation count:', updateError)
			}

			return {
				count: existing.translation_count + 1,
				limitReached: false
			}
		} else {
			// Nouvelle IP, créer l'entrée
			const { error: insertError } = await supabase
				.from('guest_translation_tracking')
				.insert({
					ip_address: ipAddress,
					translation_count: 1
				})

			if (insertError) {
				console.error('Error inserting translation count:', insertError)
			}

			return {
				count: 1,
				limitReached: false
			}
		}
	} catch (error) {
		console.error('Error in checkAndIncrementServerCount:', error)
		// En cas d'erreur, on ne bloque pas l'utilisateur
		return { count: 0, limitReached: false }
	}
}

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	try {
		const { word, sentence, userLearningLanguage, locale = 'fr', isAuthenticated = false } = req.body

		// Pour les utilisateurs connectés, pas de limite
		if (isAuthenticated) {
			const translationResult = await performTranslation({ word, sentence, userLearningLanguage, locale })
			return res.status(200).json(translationResult)
		}

		// Pour les invités : double vérification (cookie + IP dans Supabase)
		const clientIP = getClientIP(req)

		// Vérifier le compteur côté serveur (imparable)
		const serverCheck = await checkAndIncrementServerCount(clientIP)

		if (serverCheck.limitReached) {
			return res.status(429).json({
				error: 'Translation limit reached',
				message: 'Limite de traductions atteinte. Créez un compte pour continuer.',
				limitReached: true,
				count: serverCheck.count,
				max: MAX_GUEST_TRANSLATIONS
			})
		}

		// Vérifier aussi le cookie (première barrière, plus rapide)
		const cookies = parse(req.headers.cookie || '')
		let cookieCount = parseInt(cookies[COOKIE_NAME] || '0', 10)

		if (cookieCount >= MAX_GUEST_TRANSLATIONS) {
			return res.status(429).json({
				error: 'Translation limit reached',
				message: 'Limite de traductions atteinte. Créez un compte pour continuer.',
				limitReached: true,
				count: cookieCount,
				max: MAX_GUEST_TRANSLATIONS
			})
		}

		// Effectuer la traduction
		const translationResult = await performTranslation({ word, sentence, userLearningLanguage, locale })

		// Synchroniser le cookie avec le compteur serveur
		res.setHeader('Set-Cookie', serialize(COOKIE_NAME, String(serverCheck.count), {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: COOKIE_MAX_AGE,
			path: '/'
		}))

		// Retourner la réponse
		return res.status(200).json(translationResult)

	} catch (error) {
		console.error('Translation API error:', error)
		return res.status(500).json({
			error: 'Internal server error',
			message: error.message
		})
	}
}

/**
 * Effectue l'appel à l'API Yandex pour la traduction
 * Retourne les données (ne gère pas la réponse HTTP)
 */
async function performTranslation({ word, sentence, userLearningLanguage, locale }) {
	// Normalisation du mot (cyrillique uniquement pour le russe)
	let normalizedWord = word
	if (userLearningLanguage === 'ru') {
		const matches = word.match(/[А-Яа-яЁё]+/gu)
		normalizedWord = matches ? matches.join('') : ''
	}

	if (!normalizedWord) {
		throw new Error('Invalid word')
	}

	const langPair = `${userLearningLanguage}-${locale}`

	// Paires de langues supportées par Yandex Dictionary
	const supportedPairs = [
		'ru-fr', 'ru-en', 'ru-ru',
		'fr-ru', 'fr-fr', 'fr-en',
		'en-ru', 'en-fr', 'en-en'
	]

	// Vérifier si la paire de langues est supportée
	if (!supportedPairs.includes(langPair)) {
		console.warn(`Unsupported language pair: ${langPair}`)
		// Retourner un résultat vide au lieu de crasher
		return {
			word: normalizedWord,
			data: null,
			sentence,
			unsupportedPair: true
		}
	}

	try {
		const url =
			`https://dictionary.yandex.net/api/v1/dicservice.json/lookup` +
			`?key=dict.1.1.20180305T123901Z.013e5aa10ad8d371.11feed250196fcfb1631d44fbf20d837c8c1e072` +
			`&lang=${langPair}&text=${encodeURIComponent(normalizedWord)}&flags=004`

		console.log(`Translating: "${normalizedWord}" from ${langPair}`)
		const { data } = await axios.get(url)

		return {
			word: normalizedWord,
			data: data?.def?.length ? data : null,
			sentence
		}
	} catch (error) {
		console.error(`Yandex API error for ${langPair}:`, error.response?.data || error.message)

		// Si l'API Yandex retourne une erreur, ne pas crasher complètement
		return {
			word: normalizedWord,
			data: null,
			sentence,
			apiError: true,
			errorMessage: error.message
		}
	}
}
