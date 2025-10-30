import { supabase } from '../../lib/supabase'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { getToastMessage } from '../../utils/toastMessages'
import { sanitizeObject, sanitizeFilename, validateFileType } from '../../utils/sanitize'

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
			// Sanitize le contenu avant de l'insérer
			const sanitizedContent = sanitizeObject(content, {
				urlFields: ['video', 'img', 'audio', 'image'],
				numberFields: ['level', 'book_id', 'chapter_number'],
				filenameFields: ['image', 'audio'],
			})

			const { error } = await supabase.from(contentType).insert(sanitizedContent).select()

			if (error) return thunkAPI.rejectWithValue(error.message)

			if (files && files.length > 0) {
				const uploadFiles = async (file, fileName, fileType) => {
					// Valider le type de fichier
					if (!validateFileType(fileName, [fileType])) {
						throw new Error(`Type de fichier non autorisé pour ${fileName}`)
					}

					// Sanitize le nom de fichier
					const safeName = sanitizeFilename(fileName)

					const { data, error } = await supabase.storage
						.from('linguami')
						.upload(`${fileType}/${safeName}`, file, {
							cacheControl: '3600',
							upsert: false,
						})

					if (error) {
						console.error(`Erreur upload ${safeName}:`, error)
						throw error
					}

					return data
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
				urlFields: ['video', 'img', 'audio', 'image'],
				numberFields: ['level', 'book_id', 'chapter_number'],
				filenameFields: ['image', 'audio'],
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
