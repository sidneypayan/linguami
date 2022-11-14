import { supabase } from '../../lib/supabase'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
	contentEdit: {},
	contentType: 'materials',
	edit: false,
}

export const createContent = createAsyncThunk(
	'createContent/createContent',
	async ({ content, contentType }, thunkAPI) => {
		const { error } = await supabase.from(contentType).insert([content])
		if (error) return thunkAPI.rejectWithValue(error.message)
	}
)

export const editContent = createAsyncThunk(
	'createContent/editContent',
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
	'createContent/updateContent',
	async ({ content, contentType }, thunkAPI) => {
		console.log(content, contentType)
		const { error } = await supabase
			.from(contentType)
			.update(content)
			.eq('id', content.id)

		if (error) return thunkAPI.rejectWithValue(error.message)
	}
)

const createContentSlice = createSlice({
	name: 'createContent',
	initialState,
	reducers: {
		toggleContentType(state, { payload }) {
			state.contentType = payload
		},
	},
	extraReducers: {
		[createContent.fulfilled]: () => {
			toast.success('POST SUCCESS !')
		},
		[createContent.rejected]: (_, { payload }) => {
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

export default createContentSlice.reducer
export const { toggleContentType } = createContentSlice.actions
