import { configureStore, createSlice } from '@reduxjs/toolkit'
import contentSlice from './content/contentSlice'
// import wordsSlice from './words/wordsSlice' // ✅ MIGRATED to React Query + TranslationContext
import cardsSlice from './cards/cardsSlice'
// import lessonsSlice from './lessons/lessonsSlice' // ✅ MIGRATED to React Query (lib/lessons-client.js)
// import coursesSlice from './courses/coursesSlice' // ✅ MIGRATED to React Query (lib/courses-client.js)

// Temporary minimal words slice for Flashcards compatibility
// TODO: Remove when Phase 2 (Flashcards migration) is complete
const wordsSliceMinimal = createSlice({
	name: 'words',
	initialState: {
		user_words: [],
		user_words_loading: false,
		user_material_words: [],
		user_material_words_pending: false,
	},
	reducers: {},
	extraReducers: (builder) => {
		// Listen to actions dispatched from DictionaryClient (temporary sync)
		builder
			.addCase('words/getAllUserWords/pending', (state) => {
				state.user_words_loading = true
			})
			.addCase('words/getAllUserWords/fulfilled', (state, action) => {
				state.user_words_loading = false
				state.user_words = action.payload
			})
	}
})

export const store = configureStore({
	reducer: {
		content: contentSlice,
		words: wordsSliceMinimal.reducer, // ⚠️ Temporary minimal slice for Flashcards
		cards: cardsSlice, // 🔴 TODO: Migrate in Phase 2 (Flashcards SRS)
		// ✅ lessons: MIGRATED to React Query (lib/lessons-client.js)
		// ✅ courses: MIGRATED to React Query (lib/courses-client.js)
	},
})
