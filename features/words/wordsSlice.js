import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { supabase } from '@/lib/supabase'
import toast from '@/utils/toast'
import { calculateNextReview, initializeCard, getDueCards } from '@/utils/spacedRepetition'
import { logger } from '@/utils/logger'
// Les limites de traduction sont maintenant gérées côté serveur via cookie HttpOnly

/**
 * Fonction helper privée pour obtenir les messages d'ajout de mots au dictionnaire
 * @param {string} code - Code du message (success_add_translation, duplicate_translation, unexpected_error)
 * @param {string} lang - Langue du message ('fr', 'ru', 'en')
 * @returns {string} - Message traduit
 */
const getaddWordsToUserDictionaryMessage = (code, lang = 'fr') => {
	const messages = {
		success_add_translation: {
			fr: 'Traduction ajoutée avec succès.',
			ru: 'Перевод успешно добавлен.',
		},
		duplicate_translation: {
			fr: 'Cette traduction est déjà enregistrée.',
			ru: 'Этот перевод уже существует.',
		},
		unexpected_error: {
			fr: 'Une erreur inattendue est survenue.',
			ru: 'An unexpected error occurred.',
		},
	}

	return messages[code]?.[lang] || messages[code]?.['en'] || 'Unknown error'
}

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
			const { word, sentence, userLearningLanguage, locale = 'fr', isAuthenticated = false } = param

			// Appel à notre API - la limite est vérifiée côté serveur via cookie HttpOnly
			const { data } = await axios.post('/api/translations/translate', {
				word,
				sentence,
				userLearningLanguage,
				locale,
				isAuthenticated
			})

			// Retourner les données
			return {
				word: data.word,
				data: data.data,
				sentence: data.sentence
			}
		} catch (error) {
			// Si c'est une erreur 429, c'est que la limite serveur est atteinte
			if (error.response?.status === 429) {
				return thunkAPI.rejectWithValue({
					message: error.response?.data?.message || 'Limite de traductions atteinte. Créez un compte pour continuer.',
					limitReached: true
				})
			}

			return thunkAPI.rejectWithValue({
				message: error.response?.data?.message || error.message || 'Erreur lors de la traduction',
				limitReached: false
			})
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
			userLearningLanguage,
			locale,
		} = word

		// Déterminer dans quelles colonnes insérer les mots selon les langues
		const wordData = {
			word_ru: null,
			word_fr: null,
			word_en: null,
		}

		// La langue source (du matériel) détermine où va l'originalWord
		if (userLearningLanguage === 'ru') {
			wordData.word_ru = originalWord
		} else if (userLearningLanguage === 'fr') {
			wordData.word_fr = originalWord
		} else if (userLearningLanguage === 'en') {
			wordData.word_en = originalWord
		}

		// La langue cible (de l'interface) détermine où va la translatedWord
		if (locale === 'ru') {
			wordData.word_ru = translatedWord
		} else if (locale === 'fr') {
			wordData.word_fr = translatedWord
		} else if (locale === 'en') {
			wordData.word_en = translatedWord
		}

		const insertData = {
			...wordData,
			user_id: userId,
			material_id: materialId,
			word_sentence: word_sentence,
			// Initialize SRS fields for new words
			card_state: 'new',
			ease_factor: 2.5,
			interval: 0,
			learning_step: null,
			next_review_date: null,
			last_review_date: null,
			reviews_count: 0,
			lapses: 0,
			is_suspended: false,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		}

		// Add word_lang to track the language being learned
		insertData.word_lang = userLearningLanguage

		try {
			const { data, error } = await supabase
				.from('user_words')
				.insert([insertData])
				.select('*') // v2: indispensable si on veut les lignes

			if (error) {
				logger.error('❌ Supabase insert error:', error)
				logger.error('❌ Error details:', {
					code: error?.code,
					message: error?.message,
					details: error?.details,
					hint: error?.hint
				})
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
			logger.error('❌ Catch block error:', error)
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
	async (param, thunkAPI) => {
		try {
			const { userId, userLearningLanguage } = param

			// Filter by word_lang column - much faster than JOIN
			const { data, error } = await supabase
				.from('user_words')
				.select('*')
				.eq('user_id', userId)
				.eq('word_lang', userLearningLanguage)

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

// ---------------------------------------------
// UPDATE WORD REVIEW (SRS)
// ---------------------------------------------
export const updateWordReview = createAsyncThunk(
	'words/updateWordReview',
	async ({ wordId, buttonType, currentCard }, thunkAPI) => {
		try {
			// Calculate next review using SRS algorithm
			const updatedCard = calculateNextReview(currentCard, buttonType)

			// Extract only the fields we need to update
			const fieldsToUpdate = {
				card_state: updatedCard.card_state,
				ease_factor: updatedCard.ease_factor,
				interval: updatedCard.interval,
				learning_step: updatedCard.learning_step,
				next_review_date: updatedCard.next_review_date,
				last_review_date: updatedCard.last_review_date,
				reviews_count: updatedCard.reviews_count,
				lapses: updatedCard.lapses,
				updated_at: new Date().toISOString(), // Add updated_at timestamp
			}

			const { data, error } = await supabase
				.from('user_words')
				.update(fieldsToUpdate)
				.eq('id', wordId)
				.select('*')

			if (error) return thunkAPI.rejectWithValue(error)

			return data[0]
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

// ---------------------------------------------
// INITIALIZE SRS FIELDS FOR EXISTING WORDS
// ---------------------------------------------
export const initializeWordSRS = createAsyncThunk(
	'words/initializeWordSRS',
	async (wordId, thunkAPI) => {
		try {
			const fieldsToUpdate = {
				card_state: 'new',
				ease_factor: 2.5,
				interval: 0,
				learning_step: null,
				next_review_date: null,
				last_review_date: null,
				reviews_count: 0,
				lapses: 0,
				updated_at: new Date().toISOString(),
			}

			const { data, error } = await supabase
				.from('user_words')
				.update(fieldsToUpdate)
				.eq('id', wordId)
				.select('*')

			if (error) return thunkAPI.rejectWithValue(error)

			return data[0]
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

// ---------------------------------------------
// SUSPEND CARD (exclude from reviews)
// ---------------------------------------------
export const suspendCard = createAsyncThunk(
	'words/suspendCard',
	async (wordId, thunkAPI) => {
		try {
			const { data, error } = await supabase
				.from('user_words')
				.update({
					is_suspended: true,
					updated_at: new Date().toISOString()
				})
				.eq('id', wordId)
				.select('*')

			if (error) return thunkAPI.rejectWithValue(error)

			return data[0]
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

const wordsSlice = createSlice({
	name: 'words',
	initialState,
	reducers: {
		toggleTranslationContainer: (state, action) => {
			// Si un payload est fourni, utiliser sa valeur
			// Sinon, inverser l'état actuel
			state.isTranslationOpen = action.payload !== undefined
				? action.payload
				: !state.isTranslationOpen
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
				state.translation_error = payload?.message || 'Erreur lors de la traduction'
			})

			// ADD
			.addCase(addWordToDictionary.fulfilled, (state, { payload }) => {
				const rows = payload.data || []
				state.user_words = [...state.user_words, ...rows]
				state.user_material_words = [...state.user_material_words, ...rows]
				toast.success(payload.success)

				// Add XP for each word added
				rows.forEach(word => {
					fetch('/api/xp/add', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							actionType: 'word_added',
							sourceId: word.id?.toString() || '',
							description: 'Added word to dictionary'
						})
					}).catch(err => logger.error('Error adding XP:', err))
				})
			})
			.addCase(addWordToDictionary.rejected, (_, action) => {
				const errorMessage = action.payload?.error || 'Erreur inconnue'
				toast.error(errorMessage)
			})

			// READS
			.addCase(getAllUserWords.pending, state => {
				state.user_words_loading = true
			})
			.addCase(getAllUserWords.fulfilled, (state, { payload }) => {
				state.user_words = payload || []
				state.user_words_loading = false
			})
			.addCase(getAllUserWords.rejected, state => {
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

			// UPDATE REVIEW
			.addCase(updateWordReview.fulfilled, (state, { payload }) => {
				// Update the word in both arrays
				const updateWord = (word) => word.id === payload.id ? payload : word
				state.user_words = state.user_words.map(updateWord)
				state.user_material_words = state.user_material_words.map(updateWord)
			})
			.addCase(updateWordReview.rejected, (_, action) => {
				// Error toast will be shown by the component
				logger.error(action.payload)
			})

			// INITIALIZE SRS
			.addCase(initializeWordSRS.fulfilled, (state, { payload }) => {
				const updateWord = (word) => word.id === payload.id ? payload : word
				state.user_words = state.user_words.map(updateWord)
				state.user_material_words = state.user_material_words.map(updateWord)
			})
			.addCase(initializeWordSRS.rejected, (_, action) => {
				logger.error('Erreur lors de l\'initialisation SRS:', action.payload)
			})

			// SUSPEND CARD
			.addCase(suspendCard.fulfilled, (state, { payload }) => {
				const updateWord = (word) => word.id === payload.id ? payload : word
				state.user_words = state.user_words.map(updateWord)
				state.user_material_words = state.user_material_words.map(updateWord)
				// Success toast will be shown by the component
			})
			.addCase(suspendCard.rejected, (_, action) => {
				// Error toast will be shown by the component
				logger.error(action.payload)
			})
	},
})

export const { toggleTranslationContainer, cleanTranslation } =
	wordsSlice.actions

export default wordsSlice.reducer
