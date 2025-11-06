import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

// Instance FFmpeg singleton
let ffmpegInstance = null
let ffmpegLoaded = false

/**
 * Initialise FFmpeg (seulement une fois)
 */
async function loadFFmpeg() {
	if (ffmpegLoaded && ffmpegInstance) {
		return ffmpegInstance
	}

	try {
		ffmpegInstance = new FFmpeg()

		// Charger les fichiers WASM depuis un CDN
		const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
		await ffmpegInstance.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
			wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
		})

		ffmpegLoaded = true
		return ffmpegInstance
	} catch (error) {
		console.error('Erreur lors du chargement de FFmpeg:', error)
		throw new Error('Impossible de charger le convertisseur audio')
	}
}

/**
 * Convertit un fichier audio en format m4a optimisé (AAC 96kbps mono)
 * @param {File} audioFile - Fichier audio original (mp3, wav, etc.)
 * @returns {Promise<Object>} - Objet avec le fichier converti et les métadonnées
 */
export async function convertAudioToM4a(audioFile) {
	try {
		// Charger FFmpeg
		const ffmpeg = await loadFFmpeg()

		// Obtenir les données du fichier
		const inputData = await fetchFile(audioFile)

		// Extraire le nom de fichier sans extension
		const originalName = audioFile.name
		const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName
		const outputFileName = `${baseName}.m4a`

		// Écrire le fichier d'entrée dans le système de fichiers virtuel de FFmpeg
		await ffmpeg.writeFile('input', inputData)

		// Exécuter la conversion
		// -i input : fichier d'entrée
		// -vn : ignorer la vidéo (pour les fichiers avec album art)
		// -c:a aac : codec audio AAC
		// -b:a 96k : bitrate 96 kbps
		// -ac 1 : mono (1 canal)
		// -ar 44100 : sample rate 44.1 kHz
		await ffmpeg.exec([
			'-i', 'input',
			'-vn',
			'-c:a', 'aac',
			'-b:a', '96k',
			'-ac', '1',
			'-ar', '44100',
			'output.m4a'
		])

		// Lire le fichier de sortie
		const outputData = await ffmpeg.readFile('output.m4a')

		// Créer un nouveau Blob à partir des données
		const outputBlob = new Blob([outputData.buffer], { type: 'audio/mp4' })

		// Créer un objet File à partir du Blob
		const outputFile = new File([outputBlob], outputFileName, { type: 'audio/mp4' })

		// Nettoyer les fichiers temporaires
		await ffmpeg.deleteFile('input')
		await ffmpeg.deleteFile('output.m4a')

		// Calculer les économies
		const originalSize = audioFile.size
		const convertedSize = outputFile.size
		const savings = ((1 - convertedSize / originalSize) * 100).toFixed(1)

		console.log(`✓ Audio converti: ${(originalSize / 1024).toFixed(1)} KB → ${(convertedSize / 1024).toFixed(1)} KB (-${savings}%)`)

		return {
			file: outputFile,
			fileName: outputFileName,
			size: convertedSize,
			originalSize: originalSize,
			savings: savings,
		}
	} catch (error) {
		console.error('Erreur lors de la conversion audio:', error)
		throw new Error('Impossible de convertir le fichier audio')
	}
}

/**
 * Convertit plusieurs fichiers audio
 * @param {File[]} audioFiles - Tableau de fichiers audio
 * @returns {Promise<Object[]>} - Tableau d'objets avec les fichiers convertis
 */
export async function convertAudiosToM4a(audioFiles) {
	return Promise.all(audioFiles.map(file => convertAudioToM4a(file)))
}
