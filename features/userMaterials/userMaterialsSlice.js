import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabase'

const initialState = {
	user_materials: [],
	user_materials_loading: false,
	user_materials_error: false,
}

export const getUserMaterials = createAsyncThunk(
	'userMaterials/getUserMaterials',
	async (_, thunkAPI) => {
		const { data: userMaterials, error } = await supabase
			.from('materials')
			.select(
				'id, title_ru, title_fr, img, level, section, user_materials!inner(material_id)'
			)
			.eq('user_materials.user_id', supabase.auth.user().id)

		if (error) {
			return thunkAPI.rejectWithValue(error)
		}

		return userMaterials
	}
)

export const addBeingStudiedMaterial = createAsyncThunk(
	'userMaterials/addBeingStudiedMaterial',
	async (param, thunkAPI) => {
		const { data: material, error } = await supabase
			.from('user_materials')
			.insert([
				{
					user_id: supabase.auth.user().id,
					material_id: param,
				},
			])
	}
)

const userMaterialsSlice = createSlice({
	name: 'userMaterials',
	initialState,
	extraReducers: {
		[getUserMaterials.pending]: state => {
			state.user_materials_loading = true
		},
		[getUserMaterials.fulfilled]: (state, { payload }) => {
			console.log(payload)
			state.user_materials = payload
			state.user_materials_loading = false
		},
		[getUserMaterials.rejected]: (state, { payload }) => {
			state.user_materials_loading = false
			state.user_materials_error = payload
		},
	},
})

export default userMaterialsSlice.reducer
