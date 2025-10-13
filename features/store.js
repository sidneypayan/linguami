import { configureStore } from '@reduxjs/toolkit'
import materialsSlice from './materials/materialsSlice'
import contentSlice from './content/contentSlice'
import wordsSlice from './words/wordsSlice'
import cardsSlice from './cards/cardsSlice'
import activitiesSlice from './activities/activitiesSlice'
import lessonsSlice from './lessons/lessonsSlice'
import booksSlice from './books/booksSlice'

export const store = configureStore({
	reducer: {
		materials: materialsSlice,
		content: contentSlice,
		words: wordsSlice,
		cards: cardsSlice,
		activities: activitiesSlice,
		lessons: lessonsSlice,
		books: booksSlice,
	},
})
