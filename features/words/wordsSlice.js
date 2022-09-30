import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
	userWords: [],
	translation_loading: false,
	translation: {},
	addedWords: {},
	isTranslationOpen: false,
}

export const translateWord = createAsyncThunk(
	'words/translateWord',
	async (word, thunkAPI) => {
		word = word.match(/[\u0430-\u044f]+/gi).join('')

		try {
			const { data } = await axios.get(
				`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20180305T123901Z.013e5aa10ad8d371.11feed250196fcfb1631d44fbf20d837c8c1e072&lang=ru-fr&text=${word}&flags=004`
			)
			return { word, data }
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

// export const addWordToUserDictionary = createAsyncThunk(
// 	'words/addWordsToUserDictionary',
// 	async (word, thunkAPI) => {
// 		// console.log(word)
// 	}
// )

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

			state.translation = { word, asp, inf, form, definitions }
			state.translation_loading = false
		},
		[translateWord.rejected]: (state, { payload }) => {
			state.translation_loading = false
		},
	},
})

export const { toggleTranslationContainer, cleanTranslation } =
	wordsSlice.actions

export default wordsSlice.reducer
