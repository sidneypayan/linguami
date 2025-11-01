/**
 * Ajoute un paramètre de cache-busting à une URL d'image
 * pour forcer le navigateur à recharger l'image même si le nom est identique
 * @param {string} imageUrl - L'URL de l'image
 * @returns {string} L'URL avec un paramètre de cache-busting
 */
export const addCacheBuster = (imageUrl) => {
	if (!imageUrl) return imageUrl

	// Si c'est une URL complète du storage Supabase
	if (imageUrl.includes(process.env.NEXT_PUBLIC_SUPABASE_IMAGE)) {
		const separator = imageUrl.includes('?') ? '&' : '?'
		return `${imageUrl}${separator}t=${Date.now()}`
	}

	// Si c'est juste un nom de fichier, ajouter le préfixe et le cache-buster
	const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_IMAGE
	return `${baseUrl}/${imageUrl}?t=${Date.now()}`
}

/**
 * Obtient l'URL complète d'une image avec cache-busting
 * @param {string} imagePath - Le chemin de l'image (peut être complet ou relatif)
 * @returns {string} L'URL complète avec cache-busting
 */
export const getImageUrl = (imagePath) => {
	if (!imagePath) return ''

	// Si déjà une URL complète
	if (imagePath.startsWith('http')) {
		const separator = imagePath.includes('?') ? '&' : '?'
		return `${imagePath}${separator}t=${Date.now()}`
	}

	// Construire l'URL complète
	// Vérifier si imagePath commence déjà par un /
	const separator = imagePath.startsWith('/') ? '' : '/'
	return `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}${separator}${imagePath}?t=${Date.now()}`
}
