import { supabase } from '../../lib/supabase'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
	material: {},
	materialEdit: {},
	edit: false,
}

export const postMaterial = createAsyncThunk(
	'createMaterial/postMaterial',
	async (material, thunkAPI) => {
		const {
			lang,
			section,
			book_name,
			chapter,
			level,
			title_ru,
			title_fr,
			img,
			audio,
			video,
			content,
			content_accents,
		} = material

		const { error } = await supabase.from('materials').insert([
			{
				lang: lang,
				section: section,
				book_name: book_name,
				chapter: chapter,
				level: level,
				title_ru: title_ru,
				title_fr: title_fr,
				img: img,
				audio: audio,
				video: video,
				content: content,
				content_accents: content_accents,
			},
		])
		if (error) return thunkAPI.rejectWithValue(error.message)
	}
)

export const postPost = createAsyncThunk(
	'createMaterial/postPost',
	async (post, thunkAPI) => {
		const { lang, title, img, content, description } = post
		const { error } = await supabase.from('posts').insert([
			{
				lang: lang,
				title: title,
				img: img,
				content: content,
				description: description,
			},
		])
		if (error) return thunkAPI.rejectWithValue(error.message)
	}
)

export const editMaterial = createAsyncThunk(
	'createMaterial/editMaterial',
	async (id, thunkAPI) => {
		const { data: material, error } = await supabase
			.from('materials')
			.select('*')
			.eq('id', id)

		if (error) return thunkAPI.rejectWithValue(error.message)

		return material
	}
)

export const updateMaterial = createAsyncThunk(
	'createMaterial/updateMaterial',
	async (material, thunkAPI) => {
		const { error } = await supabase
			.from('materials')
			.update(material)
			.eq('id', material.id)

		if (error) return thunkAPI.rejectWithValue(error.message)
	}
)

const createMaterialSlice = createSlice({
	name: 'createMaterial',
	initialState,
	extraReducers: {
		[postMaterial.fulfilled]: () => {
			toast.success('POST SUCCESS !')
		},
		[postMaterial.rejected]: (_, { payload }) => {
			toast.error(payload)
		},
		[postPost.fulfilled]: () => {
			toast.success('POST SUCCESS !')
		},
		[postPost.rejected]: (_, { payload }) => {
			toast.error(payload)
		},
		[editMaterial.fulfilled]: (state, { payload }) => {
			const [material] = payload
			state.edit = true
			state.materialEdit = material
		},
		[editMaterial.rejected]: (_, { payload }) => {
			toast.error(payload)
		},
		[updateMaterial.fulfilled]: state => {
			state.edit = false
			state.materialEdit = {}
			toast.success('EDIT SUCCESS !')
		},
		[updateMaterial.rejected]: (_, { payload }) => {
			toast.error(payload)
		},
	},
})

export default createMaterialSlice.reducer
