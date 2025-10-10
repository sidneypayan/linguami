import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-toastify'

const initialState = {
	user_words: [],
	user_words_loading: true,
	user_words_pending: false,
	user_material_words: [],
	user_material_words_pending: false,
	translation: {},
	translation_loading: false,
	translation_error: false,
	isTranslationOpen: false,
	word_sentence: [],
}

export const translateWord = createAsyncThunk(
	'words/translateWord',
	async (param, thunkAPI) => {
		let { word, sentence, userLearningLanguage } = param
		const langPair = userLearningLanguage === 'ru' ? 'ru-fr' : 'fr-ru'

		word =
			userLearningLanguage === 'ru'
				? word.match(/[\u0430-\u044f\ё]+/gi).join('')
				: word

		try {
			const { data } = await axios.get(
				`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20180305T123901Z.013e5aa10ad8d371.11feed250196fcfb1631d44fbf20d837c8c1e072&lang=${langPair}&text=${word}&flags=004`
			)
			if (!data.def.length) {
				return { word, sentence }
			}
			// return thunkAPI.rejectWithValue('Aucune traduction trouvée')
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

			if (error) {
				const message = error.message.includes('duplicate key value')
					? 'Ce mot est déjà enregistré.'
					: error.message

				return thunkAPI.rejectWithValue({ error: message })
			}

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

	async (userId, thunkAPI) => {
		try {
			const { data, error } = await supabase
				.from('user_words')
				.select('*')
				.eq('user_id', userId)

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
				.match({ id: param })

			return data.id
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)
export const deleteUserWords = createAsyncThunk(
	'words/deleteUserWords',
	async (param, thunkAPI) => {
		try {
			const { data, error } = await supabase
				.from('user_words')
				.delete()
				.in('id', param)

			return data.id
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
	extraReducers: builder => {
		builder
			.addCase(translateWord.pending, state => {
				state.translation_loading = true
			})
			.addCase(translateWord.fulfilled, (state, { payload }) => {
				const word = payload.word
				if (payload.data) {
					let asp
					let form

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

					state.translation = { word, asp, inf, form, definitions }
					state.translation_error = false
				} else {
					state.translation_error = 'Aucune traduction trouvée'
					state.translation = { word }
				}
				state.translation_loading = false
				state.word_sentence = payload.sentence
			})
			.addCase(translateWord.rejected, (state, { payload }) => {
				state.translation_loading = false
				state.translation_error = payload
			})
			.addCase(addWordToDictionary.fulfilled, (state, { payload }) => {
				state.user_words = [...state.user_words, ...payload]
				state.user_material_words = state.user_material_words = [
					...state.user_material_words,
					...payload,
				]
				toast.success('Mot ajouté avec succès')
			})
			.addCase(addWordToDictionary.rejected, (state, action) => {
				const errorMessage = action.payload?.error || 'Erreur inconnue'
				toast.error(errorMessage)
			})
			.addCase(getAllUserWords.fulfilled, (state, { payload }) => {
				state.user_words = payload
				state.user_words_loading = false
			})
			.addCase(getUserMaterialWords.fulfilled, (state, { payload }) => {
				state.user_material_words = payload
			})
			.addCase(deleteUserWord.pending, state => {
				state.user_material_words_pending = true
			})
			.addCase(deleteUserWord.fulfilled, (state, { payload }) => {
				state.user_material_words = state.user_material_words.filter(
					word => word.id !== payload
				)
				state.user_words = state.user_words.filter(word => word.id !== payload)
				state.user_material_words_pending = false
			})
			.addCase(deleteUserWords.pending, state => {
				state.user_words_pending = true
			})
			.addCase(deleteUserWords.fulfilled, (state, { payload }) => {
				state.user_words = state.user_words.filter(word => word.id !== payload)
				state.user_words_pending = false
			})
	},
})

export const { toggleTranslationContainer, cleanTranslation } =
	wordsSlice.actions

export default wordsSlice.reducer
