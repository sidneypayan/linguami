import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabase'

const initialState = {
	activities: [],
	activities_loading: true,
	activities_pending: false,
	activities_error: null,
	activities_count: 0,
	activities_count_loading: false,
}

export const getActivities = createAsyncThunk(
	'activities/getActivities',
	async ({ id, type }, thunkAPI) => {
		try {
			const { data } = await supabase
				.from('h5p')
				.select('*')
				.eq('material_id', id)
				.eq('type', type)
				.order('order', { ascending: true })

			return data
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

export const getActivitiesCount = createAsyncThunk(
	'activities/getActivitiesCount',
	async ({ id, type }, thunkAPI) => {
		try {
			const response = await fetch(
				`/api/activities/count?id=${id}&type=${type}`
			)
			const data = await response.json()

			if (!response.ok) {
				return thunkAPI.rejectWithValue(data.error)
			}

			return data.count
		} catch (error) {
			return thunkAPI.rejectWithValue(error.message)
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
				state.activities_error = null
			})
			.addCase(getActivities.fulfilled, (state, { payload }) => {
				state.activities_loading = false
				state.activities = payload
			})
			.addCase(getActivities.rejected, (state, { payload }) => {
				state.activities_loading = false
				state.activities_error = payload
			})
			.addCase(getActivitiesCount.pending, state => {
				state.activities_count_loading = true
			})
			.addCase(getActivitiesCount.fulfilled, (state, { payload }) => {
				state.activities_count_loading = false
				state.activities_count = payload
			})
			.addCase(getActivitiesCount.rejected, state => {
				state.activities_count_loading = false
				state.activities_count = 0
			})
	},
})

export default activitiesSlice.reducer
