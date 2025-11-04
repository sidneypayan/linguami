import imageCompression from 'browser-image-compression'

/**
 * Optimise une image et crée plusieurs versions
 * @param {File} imageFile - Fichier image original
 * @returns {Promise<Object>} - Objet avec les versions optimisées
 */
export async function optimizeImage(imageFile) {
	try {
		// Configuration pour la version principale (800x800)
		const mainOptions = {
			maxSizeMB: 0.5, // 500KB max
			maxWidthOrHeight: 800,
			useWebWorker: true,
			fileType: 'image/webp',
		}

		// Configuration pour le thumbnail (200x200)
		const thumbnailOptions = {
			maxSizeMB: 0.1, // 100KB max
			maxWidthOrHeight: 200,
			useWebWorker: true,
			fileType: 'image/webp',
		}

		// Optimiser les deux versions en parallèle
		const [mainImage, thumbnailImage] = await Promise.all([
			imageCompression(imageFile, mainOptions),
			imageCompression(imageFile, thumbnailOptions),
		])

		// Générer le nom de fichier (avec extension .webp)
		const originalName = imageFile.name
		const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName
		const webpFileName = `${baseName}.webp`

		return {
			main: {
				file: mainImage,
				fileName: webpFileName,
				size: mainImage.size,
			},
			thumbnail: {
				file: thumbnailImage,
				fileName: webpFileName,
				size: thumbnailImage.size,
			},
			originalSize: imageFile.size,
			savings: ((1 - (mainImage.size + thumbnailImage.size) / imageFile.size) * 100).toFixed(1),
		}
	} catch (error) {
		console.error('Erreur lors de l\'optimisation de l\'image:', error)
		throw error
	}
}

/**
 * Optimise plusieurs images
 * @param {File[]} imageFiles - Tableau de fichiers images
 * @returns {Promise<Object[]>} - Tableau d'objets avec les versions optimisées
 */
export async function optimizeImages(imageFiles) {
	return Promise.all(imageFiles.map(file => optimizeImage(file)))
}
