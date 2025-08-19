import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabase'

const initialState = {
	activities: [],
	activities_loading: true,
	activities_pending: false,
}

export const getActivities = createAsyncThunk(
	'activities/getActivities',
	async (param, thunkAPI) => {
		try {
			const { data, error } = await supabase
				.from('h5p')
				.select('*')
				.eq('material_id', param)

			return data
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

const activitiesSlice = createSlice({
	name: 'activities',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(getActivities.pending, state => {
				state.activities_loading = true
			})
			.addCase(getActivities.fulfilled, (state, { payload }) => {
				state.activities_loading = false
				state.activities = payload
			})
			.addCase(getActivities.rejected, (state, { payload }) => {
				state.activities_loading = false
				state.activities_error = payload
			})
	},
})

export default activitiesSlice.reducer
