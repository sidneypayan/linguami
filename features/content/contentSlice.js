import { supabase } from '../../lib/supabase'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
	contentEdit: {},
	contentType: 'materials',
	edit: false,
	create_content_error: true,
}

export const createContent = createAsyncThunk(
	'content/createContent',
	async ({ content, contentType }, thunkAPI) => {
		const { error } = await supabase.from(contentType).insert(content)
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

		if (error) return thunkAPI.rejectWithValue(error.message)
	}
)

const contentSlice = createSlice({
	name: 'content',
	initialState,
	reducers: {},
	extraReducers: {
		[createContent.pending]: state => {
			state.create_content_error = true
		},
		[createContent.fulfilled]: state => {
			toast.success('POST SUCCESS !')
			state.create_content_error = false
		},
		[createContent.rejected]: (state, { payload }) => {
			state.create_content_error = true
			toast.error(payload)
		},
		[editContent.fulfilled]: (state, { payload }) => {
			const [content] = payload
			state.edit = true
			state.contentEdit = content
		},
		[editContent.rejected]: (_, { payload }) => {
			toast.error(payload)
		},
		[updateContent.fulfilled]: state => {
			state.edit = false
			state.contentEdit = {}
			toast.success('EDIT SUCCESS !')
		},
		[updateContent.rejected]: (_, { payload }) => {
			toast.error(payload)
		},
	},
})

export default contentSlice.reducer
