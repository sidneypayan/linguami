import { configureStore } from '@reduxjs/toolkit'
import materialsSlice from './materials/materialsSlice'
import createContentSlice from './createContent/createContentSlice'
import wordsSlice from './words/wordsSlice'
import cardsSlice from './cards/cardsSlice'

export const store = configureStore({
	reducer: {
		materials: materialsSlice,
		createContent: createContentSlice,
		words: wordsSlice,
		cards: cardsSlice,
	},
})
