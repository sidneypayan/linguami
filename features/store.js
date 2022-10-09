import { configureStore } from '@reduxjs/toolkit'
import materialsSlice from './materials/materialsSlice'
import createMaterialSlice from './createMaterial/createMaterialSlice'
import wordsSlice from './words/wordsSlice'
import cardsSlice from './cards/cardsSlice'
import userMaterialsSlice from './userMaterials/userMaterialsSlice'

export const store = configureStore({
	reducer: {
		materials: materialsSlice,
		createMaterial: createMaterialSlice,
		words: wordsSlice,
		cards: cardsSlice,
		userMaterials: userMaterialsSlice,
	},
})
