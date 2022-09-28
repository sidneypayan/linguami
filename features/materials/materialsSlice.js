import { supabase } from '../../lib/supabase'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
	materials: [],
	materials_loading: true,
	materials_error: false,
	filtered_materials: [],
	level: 'all',
	search: '',
	// single_material: {},
	// single_material_loading: false,
	// single_material_error: false,
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

// export const getMaterial = createAsyncThunk(
// 	'materials/getMaterial',
// 	async (param, thunkAPI) => {
// 		try {
// 			let { data: material, error } = await supabase
// 				.from('materials')
// 				.select('*')
// 				.eq('id', param)
// 				.single()
// 			if (error) console.log(error)
// 			return material
// 		} catch (error) {
// 			return thunkAPI.rejectWithValue(error)
// 		}
// 	}
// )

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
	state.totalMaterials = state.filtered_materials.length + 1
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
			state.totalMaterials = state.filtered_materials.length + 1
			state.numOfPages = Math.ceil(
				state.totalMaterials / state.materialsPerPage
			)
		},
		[getMaterials.rejected]: (state, { payload }) => {
			state.materials_loading = false
			state.materials_error = payload
		},
		// [getMaterial.pending]: state => {
		// 	state.single_material_loading = true
		// },
		// [getMaterial.fulfilled]: (state, { payload }) => {
		// 	state.single_material_loading = false
		// 	state.single_material = payload
		// },
		// [getMaterial.rejected]: (state, { payload }) => {
		// 	state.single_material_loading = false
		// 	state.single_material_error = payload
		// },
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
