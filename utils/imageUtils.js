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

/**
 * Obtient l'URL d'une image optimisée selon la taille demandée
 * Les images optimisées sont stockées dans des sous-dossiers (thumbnails, small, medium, large)
 * et converties en format WebP
 *
 * @param {string} imageName - Le nom de l'image (ex: "dialogues.jpg")
 * @param {string} size - La taille souhaitée: 'thumbnail', 'small', 'medium', 'large'
 * @returns {string} L'URL complète de l'image optimisée
 *
 * @example
 * getOptimizedImageUrl('dialogues.jpg', 'small')
 * // => "https://...supabase.co/storage/v1/object/public/linguami/image/small/dialogues.webp"
 */
export const getOptimizedImageUrl = (imageName, size = 'medium') => {
	if (!imageName) return ''

	const folders = {
		thumbnail: 'thumbnails',
		small: 'small',
		medium: 'medium',
		large: 'large',
	}

	const folder = folders[size] || folders.medium

	// Retirer l'extension et ajouter .webp
	const baseName = imageName.replace(/\.[^/.]+$/, '')
	const webpFileName = `${baseName}.webp`

	return `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}${folder}/${webpFileName}`
}

/**
 * Obtient plusieurs URLs d'images optimisées pour utilisation avec srcset
 * Utile pour le responsive design avec le composant Image de Next.js
 *
 * @param {string} imageName - Le nom de l'image
 * @returns {Object} Un objet avec les URLs pour chaque taille
 *
 * @example
 * const urls = getResponsiveImageUrls('dialogues.jpg')
 * // => { thumbnail: "...", small: "...", medium: "...", large: "..." }
 */
export const getResponsiveImageUrls = (imageName) => {
	return {
		thumbnail: getOptimizedImageUrl(imageName, 'thumbnail'),
		small: getOptimizedImageUrl(imageName, 'small'),
		medium: getOptimizedImageUrl(imageName, 'medium'),
		large: getOptimizedImageUrl(imageName, 'large'),
	}
}
