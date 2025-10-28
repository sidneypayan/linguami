import { supabase } from '../../lib/supabase'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
	editingContent: {},
	contentType: 'materials',
	isEditingContent: false,
	create_content_loading: true,
	create_content_error: null,
	edit_content_loading: true,
	edit_content_error: null,
}

export const createContent = createAsyncThunk(
	'content/createContent',
	async ({ content, contentType, files }, thunkAPI) => {
		const { error } = await supabase.from(contentType).insert(content).select()

		if (files) {
			const uploadFiles = async (file, fileName, fileType) => {
				const { data, error } = await supabase.storage
					.from('linguami')
					.upload(`${fileType}/${fileName}`, file, {
						cacheControl: '3600',
						upsert: false,
					})

				if (error) console.log(error)
			}

			// files.map(file => uploadFiles(file.file, file.fileName, file.fileType))

			await Promise.all(
				files.map(file => uploadFiles(file.file, file.fileName, file.fileType))
			)
		}
		if (error) return thunkAPI.rejectWithValue(error.message)
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
		const { error } = await supabase
			.from(contentType)
			.update(content)
			.eq('id', content.id)
			.select()

		if (error) return thunkAPI.rejectWithValue(error.message)
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
				toast.success('POST SUCCESS !')
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
				toast.success('EDIT SUCCESS !')
			})
			.addCase(updateContent.rejected, (_, { payload }) => {
				state.edit_content_loading = true
				toast.error(payload)
			})
	},
})

export default contentSlice.reducer
export const { toggleContentType } = contentSlice.actions
