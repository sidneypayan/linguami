/**
 * Calcule le temps de lecture estimé d'un article
 * Basé sur une vitesse moyenne de 200 mots par minute
 *
 * @param {string} content - Contenu markdown de l'article
 * @returns {number} Temps de lecture en minutes
 */
export function calculateReadingTime(content) {
	if (!content) return 0

	// Retirer le frontmatter YAML
	const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---/, '')

	// Retirer les balises markdown et HTML
	const plainText = contentWithoutFrontmatter
		.replace(/[#*`_~\[\]()]/g, '') // Markdown syntax
		.replace(/<[^>]*>/g, '') // HTML tags
		.replace(/!\[.*?\]\(.*?\)/g, '') // Images
		.replace(/\[.*?\]\(.*?\)/g, '') // Links
		.trim()

	// Compter les mots
	const words = plainText.split(/\s+/).filter(word => word.length > 0)
	const wordCount = words.length

	// Calculer le temps (200 mots/minute en moyenne)
	const minutes = Math.ceil(wordCount / 200)

	return minutes
}

/**
 * Formate le temps de lecture pour l'affichage
 *
 * @param {number} minutes - Temps en minutes
 * @param {string} lang - Langue (fr, ru, en)
 * @returns {string} Temps formaté (ex: "5 min de lecture")
 */
export function formatReadingTime(minutes, lang = 'fr') {
	const translations = {
		fr: `${minutes} min de lecture`,
		ru: `${minutes} мин чтения`,
		en: `${minutes} min read`
	}

	return translations[lang] || translations.fr
}
