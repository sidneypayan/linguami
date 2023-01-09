import { supabase } from '../../lib/supabase'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
	materials: [],
	materials_loading: true,
	materials_error: false,
	filtered_materials: [],
	user_materials: [],
	user_materials_loading: false,
	user_materials_error: false,
	user_materials_status: [],
	user_materials_loading_status: false,
	user_materials_error_status: false,
	level: 'all',
	search: '',
	totalMaterials: 0,
	numOfPages: 1,
	page: 1,
	materialsPerPage: 10,
	sliceStart: 0,
	sliceEnd: 10,
	chapters: [],
	chapters_loading: false,
	chapters_error: false,
}

export const getMaterials = createAsyncThunk(
	'materials/getMaterials',
	async (param, thunkAPI) => {
		const { newLang: lang, section } = param

		try {
			let { data: materials, error } = await supabase
				.from('materials')
				.select('*')
				.eq('lang', lang)
				.eq('section', section)
				.order('id', { ascending: false })
			return materials
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

export const getUserMaterials = createAsyncThunk(
	'userMaterials/getUserMaterials',
	async (_, thunkAPI) => {
		const { data: userMaterials, error } = await supabase
			.from('materials')
			.select(
				'id, title, img, level, section, user_materials!inner(material_id, is_being_studied, is_studied)'
			)
			.eq('user_materials.user_id', supabase.auth.user().id)

		if (error) {
			return thunkAPI.rejectWithValue(error)
		}

		return userMaterials
	}
)

export const getUserMaterialsStatus = createAsyncThunk(
	'userMaterials/getUserMaterialsStatus',
	async (_, thunkAPI) => {
		const { data: userMaterialsStatus, error } = await supabase
			.from('user_materials')
			.select('material_id, is_being_studied, is_studied')
			.eq('user_id', supabase.auth.user().id)

		if (error) {
			return thunkAPI.rejectWithValue(error)
		}

		return userMaterialsStatus
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

export const addMaterialToStudied = createAsyncThunk(
	'userMaterials/addMaterialToStudied',
	async (id, thunkAPI) => {
		const { data: doMaterialExists, error } = await supabase
			.from('user_materials')
			.select('material_id')
			.match({ user_id: supabase.auth.user().id, material_id: id })

		if (doMaterialExists.length < 1) {
			const { data: material, error } = await supabase
				.from('user_materials')
				.insert([
					{
						user_id: supabase.auth.user().id,
						material_id: id,
						is_being_studied: false,
						is_studied: true,
					},
				])
		} else {
			const { error } = await supabase
				.from('user_materials')
				.update({ is_being_studied: false, is_studied: true })
				.match({ user_id: supabase.auth.user().id, material_id: id })
		}
	}
)

export const getBookChapters = createAsyncThunk(
	'materials/getBookChapters',
	async (bookName, thunkAPI) => {
		try {
			let { data: chapters, error } = await supabase
				.from('materials')
				.select('*')
				.eq('section', 'book-chapter')
				.eq('book_name', bookName)
				.order('id')
			if (error) console.log(error)
			return chapters
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

const resetPagination = state => {
	state.totalMaterials = state.filtered_materials.length
	state.numOfPages = Math.ceil(state.totalMaterials / state.materialsPerPage)

	state.sliceStart = 0
	state.sliceEnd = 10
	state.page = 1
}

const materialsSlice = createSlice({
	name: 'materials',
	initialState,
	reducers: {
		filterMaterials: (state, { payload }) => {
			const { section, level } = payload
			state.level = level

			state.filtered_materials = state.materials.filter(
				item => item.section === section && item.level === level
			)
			resetPagination(state)
		},
		showAllMaterials: state => {
			state.filtered_materials = state.materials
			resetPagination(state)
		},
		searchMaterial: (state, { payload }) => {
			state.filtered_materials = state.materials.filter(item =>
				item.title.toLowerCase().includes(payload.toLowerCase())
			)

			resetPagination(state)
		},
		changePage: (state, { payload }) => {
			state.page = payload
			state.sliceEnd = state.page * 10
			state.sliceStart = state.sliceEnd - 10
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
			state.totalMaterials = state.filtered_materials.length
			state.numOfPages = Math.ceil(
				state.totalMaterials / state.materialsPerPage
			)
		},
		[getMaterials.rejected]: (state, { payload }) => {
			state.materials_loading = false
			state.materials_error = payload
		},
		[getUserMaterials.pending]: state => {
			state.user_materials_loading = true
		},
		[getUserMaterials.fulfilled]: (state, { payload }) => {
			state.user_materials = payload
			state.user_materials_loading = false
		},
		[getUserMaterials.rejected]: (state, { payload }) => {
			state.user_materials_loading = false
			state.user_materials_error = payload
		},
		[getUserMaterialsStatus.pending]: state => {
			state.user_materials_status_loading = true
		},
		[getUserMaterialsStatus.fulfilled]: (state, { payload }) => {
			state.user_materials_status = payload
			state.user_materials_status_loading = false
		},
		[getUserMaterialsStatus.rejected]: (state, { payload }) => {
			state.user_materials_status_loading = false
			state.user_materials_status_error = payload
		},
		[addMaterialToStudied.fulfilled]: () => {
			toast.success(
				'Félicitations, un pas de plus vers la maîtrise de la langue russe !'
			)
		},

		[getBookChapters.pending]: state => {
			state.chapters_loading = true
		},
		[getBookChapters.fulfilled]: (state, { payload }) => {
			state.chapters_loading = false
			state.chapters = payload
		},
		[getBookChapters.rejected]: (state, { payload }) => {
			state.chapters_loading = false
			state.chapters_error = payload
		},
	},
})

export default materialsSlice.reducer

export const { filterMaterials, showAllMaterials, searchMaterial, changePage } =
	materialsSlice.actions
