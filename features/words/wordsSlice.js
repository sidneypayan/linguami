import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { supabase } from '../../lib/supabase'

const initialState = {
	user_words: [],
	translation_loading: false,
	translation_error: false,
	translation: {},
	addedWords: {},
	isTranslationOpen: false,
	user_material_words: [],
	user_words: [],
	word_sentence: [],
}

export const translateWord = createAsyncThunk(
	'words/translateWord',
	async (param, thunkAPI) => {
		const { word, sentence } = param

		word = word.match(/[\u0430-\u044f]+/gi).join('')

		try {
			const { data } = await axios.get(
				`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20180305T123901Z.013e5aa10ad8d371.11feed250196fcfb1631d44fbf20d837c8c1e072&lang=ru-fr&text=${word}&flags=004`
			)
			if (!data.def.length)
				return thunkAPI.rejectWithValue('Aucune traduction trouvée')
			return { word, data, sentence }
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

export const addWordToDictionary = createAsyncThunk(
	'words/addWordsToUserDictionary',
	async (word, thunkAPI) => {
		const { originalWord, translatedWord, userId, materialId, word_sentence } =
			word
		try {
			const { data, error } = await supabase.from('user_words').insert([
				{
					word_ru: originalWord,
					word_fr: translatedWord,
					user_id: userId,
					material_id: materialId,
					word_sentence: word_sentence,
				},
			])

			return data
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

export const getUserMaterialWords = createAsyncThunk(
	'words/getUserMaterialWords',

	async (param, thunkAPI) => {
		const { userId, materialId } = param
		try {
			const { data, error } = await supabase
				.from('user_words')
				.select('*')
				.eq('user_id', userId)
				.eq('material_id', materialId)

			return data
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

export const getAllUserWords = createAsyncThunk(
	'words/getAllUserWords',

	async (param, thunkAPI) => {
		try {
			const { data, error } = await supabase
				.from('user_words')
				.select('*')
				.eq('user_id', param)

			return data
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

export const deleteUserWord = createAsyncThunk(
	'words/deleteUserWord',
	async (param, thunkAPI) => {
		try {
			const { data, error } = await supabase
				.from('user_words')
				.delete()
				.eq('id', param)

			return param
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

const wordsSlice = createSlice({
	name: 'words',
	initialState,
	reducers: {
		toggleTranslationContainer: state => {
			state.isTranslationOpen = !state.isTranslationOpen
		},
		cleanTranslation: state => {
			state.translation = {}
		},
	},
	extraReducers: {
		[translateWord.pending]: state => {
			state.translation_loading = true
		},
		[translateWord.fulfilled]: (state, { payload }) => {
			let asp
			let form
			const word = payload.word
			const wordInfos = payload.data.def[0]
			const inf = wordInfos.text || null

			if (wordInfos.asp === 'несов') {
				asp = 'imperfectif'
			} else {
				asp = 'perfectif'
			}

			if (wordInfos.pos === 'verb') {
				form = 'infinitif'
			} else {
				form = 'nominatif'
			}

			const definitions = wordInfos.tr.map(def => def.text).splice(0, 5)
			state.translation_error = false
			state.translation = { word, asp, inf, form, definitions }
			state.translation_loading = false
			state.word_sentence = payload.sentence
		},
		[translateWord.rejected]: (state, { payload }) => {
			state.translation_loading = false
			state.translation_error = payload
		},
		[addWordToDictionary.fulfilled]: (state, { payload }) => {
			state.user_words = [...state.user_words, ...payload]
			state.user_material_words = state.user_material_words = [
				...state.user_material_words,
				...payload,
			]
		},
		[getAllUserWords.fulfilled]: (state, { payload }) => {
			state.user_words = payload
		},
		[getUserMaterialWords.fulfilled]: (state, { payload }) => {
			state.user_material_words = payload
		},
		[deleteUserWord.fulfilled]: (state, { payload }) => {
			state.user_material_words = state.user_material_words.filter(
				word => word.id !== payload
			)
			state.user_words = state.user_words.filter(word => word.id !== payload)
		},
	},
})

export const { toggleTranslationContainer, cleanTranslation } =
	wordsSlice.actions

export default wordsSlice.reducer
