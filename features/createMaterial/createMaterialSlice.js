import { supabase } from '../../lib/supabase'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
	material: {},
	materialEdit: {},
	edit: false,
	edit_loading: false,
	edit_error: false,
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
		const { data, error } = await supabase.from('materials').insert([
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
	}
)

export const postPost = createAsyncThunk(
	'createMaterial/postMaterial',
	async (post, thunkAPI) => {
		const { lang, title, img, content, description } = post
		const { data, error } = await supabase.from('posts').insert([
			{
				lang: lang,
				title: title,
				img: img,
				content: content,
				description: description,
			},
		])
	}
)

export const editMaterial = createAsyncThunk(
	'createMaterial/editMaterial',
	async (id, thunkAPI) => {
		const { data: material, error } = await supabase
			.from('materials')
			.select('*')
			.eq('id', id)
		if (error) return error

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

		if (error) return error
	}
)

const createMaterialSlice = createSlice({
	name: 'createMaterial',
	initialState,
	extraReducers: {
		[editMaterial.pending]: state => {
			state.edit_loading = true
		},
		[editMaterial.fulfilled]: (state, { payload }) => {
			const [material] = payload
			console.log(payload)
			state.edit = true
			state.edit_loading = false
			state.materialEdit = material
		},
		[editMaterial.rejected]: (state, { payload }) => {
			state.edit_loading = false
			state.edit_error = payload
		},

		[updateMaterial.fulfilled]: (state, { payload }) => {
			state.edit = false
			state.materialEdit = {}
		},
		[updateMaterial.rejected]: (state, { payload }) => {
			state.edit_loading = false
			state.edit_error = payload
		},
	},
})

export default createMaterialSlice.reducer
