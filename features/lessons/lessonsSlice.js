import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '@/lib/supabase'
import toast from '@/utils/toast'
import { getToastMessage } from '@/utils/toastMessages'

const initialState = {
	lessons: [],
	lessons_loading: true,
	lessons_pending: false,
	lessons_error: null,
	user_lessons_status: [],
	user_lessons_status_loading: true,
	user_lessons_status_error: null,
	user_lesson_status: [],
	user_lesson_status_loading: true,
	user_lesson_status_error: null,
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

export const addLessonToStudied = createAsyncThunk(
	'lessons/addLessonToStudied',
	async (id, thunkAPI) => {
		const {
			data: { user },
		} = await supabase.auth.getUser()

		const { data: doLessonExists, error } = await supabase
			.from('user_lessons')
			.select('lesson_id')
			.match({ user_id: user.id, lesson_id: id })

		if (doLessonExists.length < 1) {
			const { data: lesson, error } = await supabase
				.from('user_lessons')
				.insert([
					{
						user_id: user.id,
						lesson_id: id,
						is_studied: true,
					},
				])
				.select()
		} else {
			const { error } = await supabase
				.from('user_lessons')
				.update({ is_studied: true })
				.match({ user_id: user.id, lesson_id: id })
				.select()
		}
	}
)

export const getUserLessonsStatus = createAsyncThunk(
	'lessons/getUserLessonsStatus',
	async (_, thunkAPI) => {
		const {
			data: { user },
		} = await supabase.auth.getUser()

		const { data: userLessonsStatus, error } = await supabase
			.from('user_lessons')
			.select('lesson_id, is_studied')
			.eq('user_id', user.id)

		if (error) {
			return thunkAPI.rejectWithValue(error)
		}

		return userLessonsStatus
	}
)

export const getUserLessonStatus = createAsyncThunk(
	'lessons/getUserLessonStatus',
	async (param, thunkAPI) => {
		const {
			data: { user },
		} = await supabase.auth.getUser()

		const { data: userLessonStatus, error } = await supabase
			.from('user_lessons')
			.select('is_studied')
			.match({ user_id: user.id, lesson_id: param })

		if (error) {
			return thunkAPI.rejectWithValue(error)
		}

		if (userLessonStatus[0]) return userLessonStatus[0]

		return { is_studied: false }
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
				state.lessons_error = null
			})
			.addCase(getLessons.fulfilled, (state, { payload }) => {
				state.lessons_loading = false
				state.lessons_error = null
				state.lessons = payload
			})
			.addCase(getLessons.rejected, (state, { payload }) => {
				state.lessons_loading = false
				state.lessons_error = payload
			})
			.addCase(getUserLessonsStatus.pending, state => {
				state.user_lessons_status_loading = true
				state.user_lessons_status_error = null
			})
			.addCase(getUserLessonsStatus.fulfilled, (state, { payload }) => {
				state.user_lessons_status = payload
				state.user_lessons_status_loading = false
				state.user_lessons_status_error = null
			})
			.addCase(getUserLessonsStatus.rejected, (state, { payload }) => {
				state.user_lessons_status_loading = false
				state.user_lessons_status_error = payload
			})
			.addCase(getUserLessonStatus.pending, state => {
				state.user_lesson_status_loading = true
				state.user_lesson_status_error = null
			})
			.addCase(getUserLessonStatus.fulfilled, (state, { payload }) => {
				state.user_lesson_status = payload
				state.user_lesson_status_loading = false
				state.user_lesson_status_error = null
			})
			.addCase(getUserLessonStatus.rejected, (state, { payload }) => {
				state.user_lesson_status_loading = false
				state.user_lesson_status_error = payload
			})
			.addCase(addLessonToStudied.fulfilled, () => {
				toast.success(getToastMessage('congratsProgress'))
			})
	},
})

export default lessonsSlice.reducer
