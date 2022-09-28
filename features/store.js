import { configureStore } from '@reduxjs/toolkit'
import materialsSlice from './materials/materialsSlice'
import createMaterialSlice from './createMaterial/createMaterialSlice'

export const store = configureStore({
	reducer: {
		materials: materialsSlice,
		createMaterial: createMaterialSlice,
	},
})
