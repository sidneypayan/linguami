import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabase'

const initialState = {
	lessons: [],
	lessons_loading: true,
	lessons_pending: false,
}

export const getLessons = createAsyncThunk(
	'lessons/getLessons',
	async (param, thunkAPI) => {
		const { lang } = param

		try {
			const { data } = await supabase
				.from('lessons')
				.select('*')
				.eq('lang', lang)
				.order('order', { ascending: true })
			return data
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

const lessonsSlice = createSlice({
	name: 'lessons',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(getLessons.pending, state => {
				state.lessons_loading = true
			})
			.addCase(getLessons.fulfilled, (state, { payload }) => {
				state.lessons_loading = false
				state.lessons = payload
			})
			.addCase(getLessons.rejected, (state, { payload }) => {
				state.lessons_loading = false
				state.lessons_error = payload
			})
	},
})

export default lessonsSlice.reducer
