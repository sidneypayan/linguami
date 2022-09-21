import { configureStore } from '@reduxjs/toolkit'
import materialsSlice from './materials/materialsSlice'

export const store = configureStore({
	reducer: {
		materials: materialsSlice,
	},
})
