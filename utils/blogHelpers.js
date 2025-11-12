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
