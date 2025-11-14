import { supabase } from '@/lib/supabase'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from '@/utils/toast'
import { getToastMessage } from '@/utils/toastMessages'
import { sanitizeObject, sanitizeFilename, validateFileType } from '@/utils/sanitize'
import { optimizeImage } from '@/utils/imageOptimizer'

/**
 * Upload un fichier vers R2 via l'API route
 */
async function uploadToR2(path, file, contentType) {
	const formData = new FormData()
	formData.append('file', file)
	formData.append('path', path)
	formData.append('contentType', contentType)

	const response = await fetch('/api/upload-r2', {
		method: 'POST',
		body: formData,
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.error || 'Erreur upload R2')
	}

	return response.json()
}

const initialState = {
	editingContent: {},
	contentType: 'materials',
	isEditingContent: false,
	create_content_loading: false,
	create_content_error: null,
	edit_content_loading: false,
	edit_content_error: null,
}

export const createContent = createAsyncThunk(
	'content/createContent',
	async ({ content, contentType, files }, thunkAPI) => {
		try {
			// Clone le contenu pour pouvoir le modifier
			let finalContent = { ...content }

			// Map pour stocker les fichiers optimisés/convertis
			const processedFilesMap = new Map()

			// Si on a des fichiers image, les optimiser AVANT l'insert
			if (files && files.length > 0) {
				for (const fileData of files) {
					if (fileData.fileType === 'image') {

						const optimized = await optimizeImage(fileData.file)

						// Stocker les fichiers optimisés pour l'upload plus tard
						processedFilesMap.set(fileData.fileName, { type: 'image', data: optimized })

						// Mettre à jour le nom du fichier dans le contenu (juste le nom, sans https://)
						finalContent['image_filename'] = optimized.main.fileName
					} else if (fileData.fileType === 'audio') {
						// Pour les fichiers audio, stocker le nom du fichier
						finalContent['audio_filename'] = fileData.fileName
					}
				}
			}

			// Sanitize le contenu avant de l'insérer
			const sanitizedContent = sanitizeObject(finalContent, {
				urlFields: ['video_url'], // Seulement video_url est une URL complète
				numberFields: ['book_id', 'chapter_number'], // level n'est PAS un nombre, c'est une string (beginner, intermediate, advanced)
				filenameFields: ['image_filename', 'audio_filename'], // Ce sont des noms de fichiers, pas des URLs
			})

			const { error } = await supabase.from(contentType).insert(sanitizedContent).select()

			if (error) return thunkAPI.rejectWithValue(error.message)

			// Upload des fichiers APRÈS l'insert réussi
			if (files && files.length > 0) {
				const uploadFiles = async (file, fileName, fileType) => {
					// Valider le type de fichier
					if (!validateFileType(fileName, [fileType])) {
						throw new Error(`Type de fichier non autorisé pour ${fileName}`)
					}

					// Si c'est une image optimisée, uploader les versions optimisées vers R2
					if (fileType === 'image' && processedFilesMap.has(fileName)) {
						const optimized = processedFilesMap.get(fileName).data

						// Upload de la version principale vers R2
						await uploadToR2(
							`image/materials/${optimized.main.fileName}`,
							optimized.main.file,
							'image/webp'
						)

						// Upload du thumbnail vers R2
						await uploadToR2(
							`image/materials/thumbnails/${optimized.thumbnail.fileName}`,
							optimized.thumbnail.file,
							'image/webp'
						)

					} else {
						// Pour les fichiers non traités (audio, etc.), upload normal vers R2
						const safeName = sanitizeFilename(fileName)

						// Déterminer le content type
						let contentType = 'application/octet-stream'
						if (fileType === 'audio') {
							contentType = file.type || 'audio/mpeg'
						}

						// Utiliser la langue depuis le contenu pour l'audio
						const lang = finalContent.lang || 'fr'
						const path = fileType === 'audio'
							? `audio/${lang}/${safeName}`
							: `${fileType}/${safeName}`

						await uploadToR2(path, file, contentType)
					}
				}

				await Promise.all(
					files.map(file => uploadFiles(file.file, file.fileName, file.fileType))
				)
			}
		} catch (err) {
			return thunkAPI.rejectWithValue(err.message || 'Erreur lors de la création du contenu')
		}
	}
)

export const editContent = createAsyncThunk(
	'content/editContent',
	async ({ id, contentType }, thunkAPI) => {
		const { data: content, error } = await supabase
			.from(contentType)
			.select('*')
			.eq('id', id)

		if (error) return thunkAPI.rejectWithValue(error.message)

		return content
	}
)

export const updateContent = createAsyncThunk(
	'content/updateContent',
	async ({ content, contentType }, thunkAPI) => {
		try {
			// Sanitize le contenu avant de le mettre à jour
			const sanitizedContent = sanitizeObject(content, {
				urlFields: ['video_url', 'img'], // Seulement les URLs complètes
				numberFields: ['book_id', 'chapter_number'], // level n'est PAS un nombre
				filenameFields: ['image_filename', 'audio_filename'], // Ce sont des noms de fichiers
			})

			const { error } = await supabase
				.from(contentType)
				.update(sanitizedContent)
				.eq('id', content.id)
				.select()

			if (error) return thunkAPI.rejectWithValue(error.message)
		} catch (err) {
			return thunkAPI.rejectWithValue(err.message || 'Erreur lors de la mise à jour du contenu')
		}
	}
)

const contentSlice = createSlice({
	name: 'content',
	initialState,
	reducers: {
		toggleContentType: (state, { payload }) => {
			state.contentType = payload
		},
	},
	extraReducers: builder => {
		builder
			.addCase(createContent.pending, state => {
				state.create_content_loading = true
				state.create_content_error = null
			})
			.addCase(createContent.fulfilled, state => {
				toast.success(getToastMessage('contentPostSuccess'))
				state.create_content_loading = false
				state.create_content_error = null
			})
			.addCase(createContent.rejected, (state, { payload }) => {
				state.create_content_loading = false
				state.create_content_error = payload
				toast.error(payload)
			})
			.addCase(editContent.pending, state => {
				state.edit_content_loading = true
				state.edit_content_error = null
			})
			.addCase(editContent.fulfilled, (state, { payload }) => {
				const [content] = payload
				state.isEditingContent = true
				state.editingContent = content
				state.edit_content_loading = false
				state.edit_content_error = null
			})
			.addCase(editContent.rejected, (_, { payload }) => {
				state.edit_content_error = payload
				toast.error(payload)
			})
			.addCase(updateContent.fulfilled, state => {
				state.isEditingContent = false
				state.editingContent = {}
				toast.success(getToastMessage('contentEditSuccess'))
			})
			.addCase(updateContent.rejected, (_, { payload }) => {
				state.edit_content_loading = true
				toast.error(payload)
			})
	},
})

export default contentSlice.reducer
export const { toggleContentType } = contentSlice.actions
