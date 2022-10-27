import { supabase } from '../../lib/supabase'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
	material: {},
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
		const { lang, title, img, content } = post
		const { data, error } = await supabase.from('posts').insert([
			{
				lang: lang,
				title: title,
				img: img,
				content: content,
			},
		])
	}
)

const createMaterialSlice = createSlice({
	name: 'createMaterial',
	initialState,
})

export default createMaterialSlice.reducer
