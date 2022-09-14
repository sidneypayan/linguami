import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
	material: {},
}

export const createMaterial = createSlice({
	name: 'material',
	initialState,
})
