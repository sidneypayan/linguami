/**
 * Configuration ElevenLabs pour la génération audio
 * Utilisé pour les dialogues de la Méthode Linguami
 */

export const ELEVENLABS_CONFIG = {
	apiKey: process.env.ELEVENLABS_API_KEY,
	baseUrl: 'https://api.elevenlabs.io/v1',

	// Configuration des voix par langue et genre
	voices: {
		fr: {
			male: '5jCmrHdxbpU36l1wb3Ke', // Voix masculine française
			female: 'JvD1a0L9rABccms2q9zH', // Voix féminine française
		},
		ru: {
			male: 'rQOBu7YxCDxGiFdTm28w', // Voix masculine russe
			female: 'C3FusDjPequ6qFchqpzu', // Voix féminine russe
		},
	},

	// Paramètres de génération audio par défaut
	defaultSettings: {
		model_id: 'eleven_multilingual_v2',
		voice_settings: {
			stability: 0.5,
			similarity_boost: 0.75,
			style: 0.0,
			use_speaker_boost: true,
		},
	},

	// Mapping des personnages vers les voix
	// Utilisé dans les dialogues pour savoir quelle voix utiliser
	characterVoiceMapping: {
		fr: {
			// Personnages masculins par défaut
			homme: 'male',
			monsieur: 'male',
			serveur: 'male',
			agent: 'male',
			employé: 'male',
			professeur_m: 'male',
			// Personnages féminins par défaut
			femme: 'female',
			madame: 'female',
			serveuse: 'female',
			employée: 'female',
			professeure: 'female',
		},
		ru: {
			// Personnages masculins
			мужчина: 'male',
			господин: 'male',
			официант: 'male',
			агент: 'male',
			сотрудник: 'male',
			преподаватель_м: 'male',
			// Personnages féminins
			женщина: 'female',
			госпожа: 'female',
			официантка: 'female',
			сотрудница: 'female',
			преподавательница: 'female',
		},
	},
}

/**
 * Obtenir l'ID de voix pour un personnage et une langue
 * @param {string} lang - Code langue ('fr' ou 'ru')
 * @param {string} character - Nom du personnage (ex: "Serveur", "Madame Dupont")
 * @param {string} explicitGender - Genre explicite ('male' ou 'female'), override auto-detection
 * @returns {string} Voice ID ElevenLabs
 */
export function getVoiceIdForCharacter(lang, character, explicitGender = null) {
	if (!ELEVENLABS_CONFIG.voices[lang]) {
		console.warn(`Langue non supportée: ${lang}`)
		return ELEVENLABS_CONFIG.voices.fr.male // Fallback
	}

	// Si genre explicite fourni, l'utiliser
	if (explicitGender && (explicitGender === 'male' || explicitGender === 'female')) {
		return ELEVENLABS_CONFIG.voices[lang][explicitGender]
	}

	// Sinon, détecter basé sur le nom du personnage
	const characterLower = character.toLowerCase()
	const mapping = ELEVENLABS_CONFIG.characterVoiceMapping[lang] || {}

	// Chercher une correspondance exacte
	for (const [key, gender] of Object.entries(mapping)) {
		if (characterLower.includes(key)) {
			return ELEVENLABS_CONFIG.voices[lang][gender]
		}
	}

	// Par défaut, alternance male/female basé sur hash du nom
	const hash = character.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
	const gender = hash % 2 === 0 ? 'male' : 'female'
	return ELEVENLABS_CONFIG.voices[lang][gender]
}

/**
 * Obtenir tous les paramètres pour générer un audio
 * @param {string} lang - Code langue
 * @param {string} character - Nom du personnage
 * @param {string} gender - Genre explicite (optionnel)
 * @returns {object} Configuration complète
 */
export function getAudioGenerationConfig(lang, character, gender = null) {
	return {
		...ELEVENLABS_CONFIG.defaultSettings,
		voice_id: getVoiceIdForCharacter(lang, character, gender),
	}
}
