import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-toastify'
import { getaddWordsToUserDictionaryMessage } from '../../utils/helpers'

const initialState = {
	user_words: [],
	user_words_loading: true,
	user_words_pending: false,
	user_material_words: [],
	user_material_words_pending: false,
	translation: {},
	translation_loading: false,
	translation_error: null,
	isTranslationOpen: false,
	word_sentence: [],
}

// ---------------------------------------------
// TRANSLATE
// ---------------------------------------------
export const translateWord = createAsyncThunk(
	'words/translateWord',
	async (param, thunkAPI) => {
		try {
			let { word, sentence, userLearningLanguage } = param
			const langPair = userLearningLanguage === 'ru' ? 'ru-fr' : 'fr-ru'

			// Normalisation mot (cyrillique uniquement côté ru)
			if (userLearningLanguage === 'ru') {
				// Inclut А-Я а-я Ё ё, avec flag unicode
				const matches = word.match(/[А-Яа-яЁё]+/gu)
				word = matches ? matches.join('') : ''
			}

			const url =
				`https://dictionary.yandex.net/api/v1/dicservice.json/lookup` +
				`?key=dict.1.1.20180305T123901Z.013e5aa10ad8d371.11feed250196fcfb1631d44fbf20d837c8c1e072` +
				`&lang=${langPair}&text=${encodeURIComponent(word)}&flags=004`

			const { data } = await axios.get(url)

			if (!data?.def?.length) {
				// Pas de traduction trouvée → on renvoie quand même le mot + phrase
				return { word, sentence }
			}

			return { word, data, sentence }
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

// ---------------------------------------------
// INSERT (v2: .select())
// ---------------------------------------------
export const addWordToDictionary = createAsyncThunk(
	'words/addWordsToUserDictionary',
	async (word, thunkAPI) => {
		const {
			originalWord,
			translatedWord,
			userId,
			materialId,
			word_sentence,
			lang,
		} = word

		try {
			const { data, error } = await supabase
				.from('user_words')
				.insert([
					{
						word_ru: originalWord,
						word_fr: translatedWord,
						user_id: userId,
						material_id: materialId,
						word_sentence: word_sentence,
					},
				])
				.select('*') // v2: indispensable si on veut les lignes

			if (error) {
				// v2 renvoie souvent code '23505' pour doublon
				const isDuplicate =
					error?.code === '23505' ||
					(typeof error?.message === 'string' &&
						error.message.toLowerCase().includes('duplicate key value'))
				const key = isDuplicate ? 'duplicate_translation' : 'unexpected_error'
				const message = getaddWordsToUserDictionaryMessage(key, lang)
				return thunkAPI.rejectWithValue({ error: message })
			}

			const message = getaddWordsToUserDictionaryMessage(
				'success_add_translation',
				lang
			)

			return { success: message, data: data || [] }
		} catch (error) {
			const message = getaddWordsToUserDictionaryMessage(
				'unexpected_error',
				lang
			)
			return thunkAPI.rejectWithValue({ error: message })
		}
	}
)

// ---------------------------------------------
// READS
// ---------------------------------------------
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

			if (error) return thunkAPI.rejectWithValue(error)
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

			if (error) return thunkAPI.rejectWithValue(error)
			return data
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

// ---------------------------------------------
// DELETE ONE (v2: .select('id'))
// ---------------------------------------------
export const deleteUserWord = createAsyncThunk(
	'words/deleteUserWord',
	async (id, thunkAPI) => {
		try {
			const { data, error } = await supabase
				.from('user_words')
				.delete()
				.eq('id', id)
				.select('id') // v2: sinon data=null

			if (error) return thunkAPI.rejectWithValue(error)

			const deletedId = Array.isArray(data) ? data[0]?.id : data?.id
			if (!deletedId) {
				return thunkAPI.rejectWithValue({
					error:
						"Impossible de supprimer ce mot (vérifiez RLS/permissions ou l'existence).",
				})
			}
			return deletedId
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

// ---------------------------------------------
// DELETE MANY (v2: .select('id') → array d'ids)
// ---------------------------------------------
export const deleteUserWords = createAsyncThunk(
	'words/deleteUserWords',
	async (ids, thunkAPI) => {
		try {
			const { data, error } = await supabase
				.from('user_words')
				.delete()
				.in('id', ids)
				.select('id') // v2: sinon data=null

			if (error) return thunkAPI.rejectWithValue(error)

			const deletedIds = Array.isArray(data) ? data.map(r => r.id) : []
			if (deletedIds.length === 0) {
				return thunkAPI.rejectWithValue({
					error:
						'Aucune ligne supprimée (vérifiez RLS/permissions ou les identifiants).',
				})
			}
			return deletedIds
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
			// TRANSLATE
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

					asp = wordInfos.asp === 'несов' ? 'imperfectif' : 'perfectif'
					form = wordInfos.pos === 'verb' ? 'infinitif' : 'nominatif'

					const definitions = wordInfos.tr.map(def => def.text).splice(0, 5)

					state.translation = { word, asp, inf, form, definitions }
					state.translation_error = null
				} else {
					state.translation_error = 'Aucune traduction trouvée'
					state.translation = { word }
				}
				state.translation_loading = false
				state.word_sentence = payload.sentence
			})
			.addCase(translateWord.rejected, (state, { payload }) => {
				state.translation_loading = false
				state.translation_error =
					payload?.message || 'Erreur lors de la traduction'
			})

			// ADD
			.addCase(addWordToDictionary.fulfilled, (state, { payload }) => {
				const rows = payload.data || []
				state.user_words = [...state.user_words, ...rows]
				state.user_material_words = [...state.user_material_words, ...rows]
				toast.success(payload.success)
			})
			.addCase(addWordToDictionary.rejected, (_, action) => {
				const errorMessage = action.payload?.error || 'Erreur inconnue'
				toast.error(errorMessage)
			})

			// READS
			.addCase(getAllUserWords.fulfilled, (state, { payload }) => {
				state.user_words = payload || []
				state.user_words_loading = false
			})
			.addCase(getUserMaterialWords.fulfilled, (state, { payload }) => {
				state.user_material_words = payload || []
			})

			// DELETE ONE
			.addCase(deleteUserWord.pending, state => {
				state.user_material_words_pending = true
			})
			.addCase(deleteUserWord.fulfilled, (state, { payload: deletedId }) => {
				state.user_material_words = state.user_material_words.filter(
					w => w.id !== deletedId
				)
				state.user_words = state.user_words.filter(w => w.id !== deletedId)
				state.user_material_words_pending = false
			})
			.addCase(deleteUserWord.rejected, (state, action) => {
				state.user_material_words_pending = false
				if (action.payload?.error) toast.error(action.payload.error)
			})

			// DELETE MANY
			.addCase(deleteUserWords.pending, state => {
				state.user_words_pending = true
			})
			.addCase(deleteUserWords.fulfilled, (state, { payload: deletedIds }) => {
				const remove = new Set(deletedIds)
				state.user_words = state.user_words.filter(w => !remove.has(w.id))
				state.user_material_words = state.user_material_words.filter(
					w => !remove.has(w.id)
				)
				state.user_words_pending = false
			})
			.addCase(deleteUserWords.rejected, (state, action) => {
				state.user_words_pending = false
				if (action.payload?.error) toast.error(action.payload.error)
			})
	},
})

export const { toggleTranslationContainer, cleanTranslation } =
	wordsSlice.actions

export default wordsSlice.reducer
