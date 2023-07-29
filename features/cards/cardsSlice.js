import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	words: [],
	isFlashcardsOpen: false,
}

const cardsSlice = createSlice({
	name: 'cards',
	initialState,
	reducers: {
		toggleFlashcardsContainer: (state, { payload }) => {
			state.isFlashcardsOpen = payload
		},
	},
})

export const { toggleFlashcardsContainer } = cardsSlice.actions
export default cardsSlice.reducer
