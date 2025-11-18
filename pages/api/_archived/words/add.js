import { createClient } from '@supabase/supabase-js'
import { validateWordPair } from '@/utils/validation'
import { logger } from '@/utils/logger'

export default async function handler(req, res) {
	// Seulement accepter POST
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	try {
		// Vérifier l'authentification
		const authHeader = req.headers.authorization
		if (!authHeader) {
			return res.status(401).json({ error: 'Non authentifié' })
		}

		// Créer un client Supabase avec le token de l'utilisateur
		const token = authHeader.replace('Bearer ', '')
		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
			{
				global: {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			}
		)

		// Vérifier l'utilisateur
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser()

		if (authError || !user) {
			logger.error('Erreur auth:', authError)
			return res.status(401).json({ error: 'Non authentifié' })
		}

		const { learningLangWord, browserLangWord, contextSentence, materialId, userLearningLanguage, locale } = req.body

		// Validation et sanitization
		const validation = validateWordPair({ learningLangWord, browserLangWord, contextSentence })

		if (!validation.isValid) {
			return res.status(400).json({
				error: 'Données invalides',
				errors: validation.errors,
			})
		}

		// Déterminer dans quelles colonnes insérer les mots selon les langues
		const wordData = {
			word_ru: null,
			word_fr: null,
			word_en: null,
		}

		// La langue source (apprise) détermine où va learningLangWord
		if (userLearningLanguage === 'ru') {
			wordData.word_ru = validation.sanitized.learningLangWord
		} else if (userLearningLanguage === 'fr') {
			wordData.word_fr = validation.sanitized.learningLangWord
		} else if (userLearningLanguage === 'en') {
			wordData.word_en = validation.sanitized.learningLangWord
		}

		// La langue cible (de l'interface) détermine où va browserLangWord (la traduction)
		if (locale === 'ru') {
			wordData.word_ru = validation.sanitized.browserLangWord
		} else if (locale === 'fr') {
			wordData.word_fr = validation.sanitized.browserLangWord
		} else if (locale === 'en') {
			wordData.word_en = validation.sanitized.browserLangWord
		}

		// Préparer les données nettoyées
		const cleanData = {
			...wordData,
			user_id: user.id, // Utiliser l'ID de l'utilisateur authentifié
			material_id: materialId || null,
			word_sentence: validation.sanitized.contextSentence || '',
			word_lang: userLearningLanguage, // Track the language being learned
			// Champs SRS
			card_state: 'new',
			ease_factor: 2.5,
			interval: 0,
			learning_step: null,
			next_review_date: null,
			last_review_date: null,
			reviews_count: 0,
			lapses: 0,
			is_suspended: false,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		}

		// Insérer en base avec le client authentifié (RLS appliquée)
		const { data, error } = await supabase
			.from('user_words')
			.insert([cleanData])
			.select('*')

		if (error) {
			// Vérifier si c'est un doublon
			const isDuplicate =
				error?.code === '23505' ||
				(typeof error?.message === 'string' &&
					error.message.toLowerCase().includes('duplicate key value'))

			if (isDuplicate) {
				return res.status(409).json({
					error: 'Ce mot existe déjà dans votre dictionnaire',
				})
			}

			logger.error('Erreur Supabase:', error.message, '- Code:', error.code)
			return res.status(500).json({
				error: "Erreur lors de l'ajout du mot",
				details: error.message || 'Erreur inconnue',
				code: error.code,
			})
		}

		return res.status(201).json({
			success: true,
			data: data[0],
			message: 'Mot ajouté avec succès',
		})
	} catch (error) {
		logger.error('Erreur serveur:', error)
		return res.status(500).json({
			error: 'Erreur interne du serveur',
		})
	}
}
