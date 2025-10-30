/**
 * Fonction pour sanitizer les inputs utilisateur et prévenir les injections XSS/SQL
 */

/**
 * Échappe les caractères HTML dangereux
 */
const escapeHtml = (text) => {
	if (typeof text !== 'string') return text

	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		'/': '&#x2F;',
	}

	return text.replace(/[&<>"'\/]/g, (char) => map[char])
}

/**
 * Nettoie une chaîne de caractères en supprimant les balises script et les caractères dangereux
 */
const sanitizeString = (str) => {
	if (typeof str !== 'string') return str

	// Supprimer les balises script
	let cleaned = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

	// Supprimer les événements JavaScript inline
	cleaned = cleaned.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')

	// Supprimer les attributs javascript:
	cleaned = cleaned.replace(/javascript:/gi, '')

	// Supprimer les balises iframe
	cleaned = cleaned.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')

	return cleaned.trim()
}

/**
 * Valide et sanitize une URL
 */
const sanitizeUrl = (url) => {
	if (!url || typeof url !== 'string') return ''

	// Supprimer les espaces
	url = url.trim()

	// Vérifier que l'URL commence par http:// ou https://
	if (!url.match(/^https?:\/\//i)) {
		// Si c'est juste un chemin relatif, le garder tel quel
		if (url.startsWith('/')) {
			return url
		}
		// Sinon, ajouter https://
		url = 'https://' + url
	}

	// Bloquer les protocoles dangereux
	if (url.match(/^(javascript|data|vbscript):/i)) {
		return ''
	}

	return url
}

/**
 * Valide et sanitize un nom de fichier
 */
const sanitizeFilename = (filename) => {
	if (!filename || typeof filename !== 'string') return ''

	// Supprimer les caractères spéciaux dangereux
	let cleaned = filename.replace(/[^a-zA-Z0-9._-]/g, '_')

	// Limiter la longueur
	if (cleaned.length > 255) {
		const ext = cleaned.split('.').pop()
		cleaned = cleaned.substring(0, 250) + '.' + ext
	}

	return cleaned
}

/**
 * Valide qu'un nombre est bien un nombre et dans une plage acceptable
 */
const sanitizeNumber = (num, min = -Infinity, max = Infinity) => {
	const parsed = typeof num === 'string' ? parseFloat(num) : num

	if (isNaN(parsed)) return null

	// Vérifier la plage
	if (parsed < min) return min
	if (parsed > max) return max

	return parsed
}

/**
 * Sanitize un objet entier récursivement
 */
const sanitizeObject = (obj, options = {}) => {
	if (!obj || typeof obj !== 'object') return obj

	const {
		allowedTags = [], // Balises HTML autorisées (ex: ['br', 'p'])
		urlFields = [], // Champs qui contiennent des URLs
		numberFields = [], // Champs qui doivent être des nombres
		filenameFields = [], // Champs qui contiennent des noms de fichiers
	} = options

	const sanitized = Array.isArray(obj) ? [] : {}

	for (const key in obj) {
		const value = obj[key]

		// Sauter les valeurs null/undefined
		if (value === null || value === undefined) {
			sanitized[key] = value
			continue
		}

		// Traiter les objets imbriqués
		if (typeof value === 'object' && !Array.isArray(value)) {
			sanitized[key] = sanitizeObject(value, options)
			continue
		}

		// Traiter les tableaux
		if (Array.isArray(value)) {
			sanitized[key] = value.map(item =>
				typeof item === 'object' ? sanitizeObject(item, options) : sanitizeString(String(item))
			)
			continue
		}

		// Traiter les différents types de champs
		if (urlFields.includes(key)) {
			sanitized[key] = sanitizeUrl(value)
		} else if (numberFields.includes(key)) {
			sanitized[key] = sanitizeNumber(value)
		} else if (filenameFields.includes(key)) {
			sanitized[key] = sanitizeFilename(value)
		} else if (typeof value === 'string') {
			// Pour les champs de texte normaux
			sanitized[key] = sanitizeString(value)

			// Si des balises sont autorisées, on ne les échappe pas
			if (allowedTags.length === 0) {
				// Par défaut, échapper tout le HTML
				// Sauf si le champ contient déjà des <br> (pour body et body_accents)
				if (key === 'body' || key === 'body_accents') {
					// Garder les <br> mais échapper le reste
					const parts = sanitized[key].split('<br>')
					sanitized[key] = parts
						.map(part => escapeHtml(part))
						.join('<br>')
				}
			}
		} else {
			sanitized[key] = value
		}
	}

	return sanitized
}

/**
 * Valide les types de fichiers uploadés
 */
const validateFileType = (filename, allowedTypes = ['image', 'audio']) => {
	if (!filename || typeof filename !== 'string') return false

	const ext = filename.split('.').pop().toLowerCase()

	const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
	const audioExtensions = ['mp3', 'wav', 'ogg', 'm4a', 'flac']

	if (allowedTypes.includes('image') && imageExtensions.includes(ext)) {
		return true
	}

	if (allowedTypes.includes('audio') && audioExtensions.includes(ext)) {
		return true
	}

	return false
}

export {
	escapeHtml,
	sanitizeString,
	sanitizeUrl,
	sanitizeFilename,
	sanitizeNumber,
	sanitizeObject,
	validateFileType,
}
