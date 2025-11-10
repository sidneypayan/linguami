/**
 * Décode les entités HTML courantes
 */
export function decodeHtmlEntities(text) {
	const entities = {
		'&quot;': '"',
		'&#34;': '"',
		'&apos;': "'",
		'&#39;': "'",
		'&amp;': '&',
		'&lt;': '<',
		'&gt;': '>',
		'&nbsp;': ' ',
	}

	return text.replace(/&[a-z0-9#]+;/gi, (match) => {
		return entities[match] || match
	})
}

/**
 * Crée un slug URL-friendly à partir d'un texte
 * Utilisé pour générer des IDs d'ancres pour les titres d'articles
 */
export function slugify(text) {
	// D'abord décoder les entités HTML si présentes
	const decoded = decodeHtmlEntities(text)

	return decoded
		.toLowerCase()
		.normalize('NFD') // Décompose les caractères accentués
		.replace(/[\u0300-\u036f]/g, '') // Enlève les accents
		.replace(/["""«»]/g, '') // Enlève tous types de guillemets
		.replace(/[()]/g, '') // Enlève les parenthèses
		.replace(/[^a-z0-9\s-]/g, '') // Enlève tous les autres caractères spéciaux
		.trim()
		.replace(/\s+/g, '-') // Remplace les espaces par des tirets
		.replace(/-+/g, '-') // Évite les tirets multiples
		.replace(/^-+|-+$/g, '') // Enlève les tirets en début et fin
}
