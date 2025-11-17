import { configureStore } from '@reduxjs/toolkit'
import contentSlice from './content/contentSlice'
import wordsSlice from './words/wordsSlice'
import cardsSlice from './cards/cardsSlice'
import lessonsSlice from './lessons/lessonsSlice'
import coursesSlice from './courses/coursesSlice'

export const store = configureStore({
	reducer: {
		content: contentSlice,
		words: wordsSlice,
		cards: cardsSlice,
		lessons: lessonsSlice,
		courses: coursesSlice,
	},
})
