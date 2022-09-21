import { supabase } from '../../lib/supabase'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
	materials: [],
	materials_loading: true,
	materials_error: false,
	single_material: {},
	single_material_loading: false,
	single_material_error: false,
}

export const getMaterials = createAsyncThunk(
	'materials/getMaterials',
	async (param, thunkAPI) => {
		try {
			let { data: materials, error } = await supabase
				.from('materials')
				.select('*')
				.eq('lang', 'ru')
				.eq('section', param)
			return materials
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

const materialsSlice = createSlice({
	name: 'materials',
	initialState,
	extraReducers: {
		[getMaterials.pending]: state => {
			state.materials_loading = true
		},
		[getMaterials.fulfilled]: (state, { payload }) => {
			state.materials_loading = false
			state.materials = payload
		},
		[getMaterials.rejected]: (state, { payload }) => {
			state.materials_loading = false
			state.materials_error = payload
		},
	},
})

export default materialsSlice.reducer
