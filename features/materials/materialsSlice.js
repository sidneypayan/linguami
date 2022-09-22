import { supabase } from '../../lib/supabase'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
	materials: [],
	filtered_materials: [],
	level: 'all',
	search: '',
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

export const getMaterial = createAsyncThunk(
	'materials/getMaterial',
	async (param, thunkAPI) => {
		try {
			let { data: material, error } = await supabase
				.from('materials')
				.select('*')
				.eq('id', param)
				.single()
			return material
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

const materialsSlice = createSlice({
	name: 'materials',
	initialState,
	reducers: {
		filterMaterials: (state, { payload }) => {
			const { section, level } = payload

			state.filtered_materials = state.materials.filter(
				item => item.section === section && item.level === level
			)

			state.level = level
		},
		showAllMaterials: state => {
			state.filtered_materials = state.materials
		},
		searchMaterial: (state, { payload }) => {
			state.filtered_materials = state.filtered_materials.filter(item =>
				item.title.toLowerCase().includes(payload)
			)
		},
	},
	extraReducers: {
		[getMaterials.pending]: state => {
			state.materials_loading = true
		},
		[getMaterials.fulfilled]: (state, { payload }) => {
			state.materials_loading = false
			state.materials = payload
			state.filtered_materials = payload
		},
		[getMaterials.rejected]: (state, { payload }) => {
			state.materials_loading = false
			state.materials_error = payload
		},
		[getMaterial.pending]: state => {
			state.single_material_loading = true
		},
		[getMaterial.fulfilled]: (state, { payload }) => {
			state.single_material_loading = false
			state.single_material = payload
		},
		[getMaterial.rejected]: (state, { payload }) => {
			state.single_material_loading = false
			single_material_error = payload
		},
	},
})

export default materialsSlice.reducer

export const { filterMaterials, showAllMaterials, searchMaterial } =
	materialsSlice.actions
