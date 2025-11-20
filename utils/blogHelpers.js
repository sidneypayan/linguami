/**
 * Utilitaires pour le blog
 */

/**
 * Trie les posts de blog par date (du plus récent au plus ancien)
 * @param {Object} a - Premier post avec frontmatter.date
 * @param {Object} b - Deuxième post avec frontmatter.date
 * @returns {number} - Résultat de comparaison pour Array.sort()
 */
export const sortPostsByDate = (a, b) => {
	return new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
}

/**
 * Formate une date pour l'affichage dans le blog
 * Convertit les dates ISO (2025-11-19T20:01:02.741+00:00) en format lisible
 * @param {string} dateString - Date au format ISO ou autre format valide
 * @param {string} locale - Locale pour le formatage (fr, en, ru)
 * @returns {string} - Date formatée (ex: "19 nov. 2025")
 */
export const formatBlogDate = (dateString, locale = 'fr') => {
	if (!dateString) return ''

	try {
		const date = new Date(dateString)

		// Vérifier si la date est valide
		if (isNaN(date.getTime())) return dateString

		// Format court : "19 nov. 2025" (fr) ou "Nov 19, 2025" (en)
		return new Intl.DateTimeFormat(locale, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		}).format(date)
	} catch (error) {
		// En cas d'erreur, retourner la chaîne d'origine
		return dateString
	}
}
