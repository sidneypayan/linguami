import { supabase } from '../../lib/supabase'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { mergeUserMaterial } from '../../utils/helpers'

const initialState = {
	materials: [],
	materials_loading: true,
	materials_error: null,
	books: [],
	books_loading: true,
	books_error: null,
	first_chapter: null,
	first_chapter_loading: true,
	first_chapter_error: null,
	filtered_materials: [],
	user_materials: [],
	user_materials_loading: false,
	user_materials_error: null,
	user_materials_status: [],
	user_materials_status_loading: false,
	user_materials_status_error: null,
	user_material_status: [],
	user_material_status_loading: false,
	user_material_status_error: null,
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

export const getBooks = createAsyncThunk(
	'materials/getBooks',
	async (param, thunkAPI) => {
		const { userLearningLanguage: lang } = param

		try {
			let { data: books, error } = await supabase
				.from('books')
				.select('*')
				.eq('lang', lang)
				.order('id', { ascending: false })
			return books
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

export const getMaterials = createAsyncThunk(
	'materials/getMaterials',
	async (param, thunkAPI) => {
		const { userLearningLanguage: lang, section } = param

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
	'materials/getUserMaterials',
	async (lang, thunkAPI) => {
		const { data: userMaterials, error } = await supabase
			.from('user_materials')
			.select('*, materials!inner(title, image, level, section)')
			.eq('user_id', supabase.auth.user().id)
			.eq('materials.lang', lang)

		if (error) {
			return thunkAPI.rejectWithValue(error)
		}

		return mergeUserMaterial(userMaterials)
	}
)

export const getUserMaterialsStatus = createAsyncThunk(
	'materials/getUserMaterialsStatus',
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

export const getUserMaterialStatus = createAsyncThunk(
	'materials/getUserMaterialStatus',
	async (param, thunkAPI) => {
		const { data: userMaterialStatus, error } = await supabase
			.from('user_materials')
			.select('is_being_studied, is_studied')
			.match({ user_id: supabase.auth.user().id, material_id: param })

		if (error) {
			return thunkAPI.rejectWithValue(error)
		}

		if (userMaterialStatus[0]) return userMaterialStatus[0]

		return { is_being_studied: false, is_studied: false }
	}
)

export const addBeingStudiedMaterial = createAsyncThunk(
	'materials/addBeingStudiedMaterial',
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

export const removeBeingStudiedMaterial = createAsyncThunk(
	'materials/removeBeingStudiedMaterial',
	async (param, thunkAPI) => {
		const { data: material, error } = await supabase
			.from('user_materials')
			.delete()
			.match({ user_id: supabase.auth.user().id, material_id: param })
	}
)

export const addMaterialToStudied = createAsyncThunk(
	'materials/addMaterialToStudied',
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

export const getFirstChapterOfBook = createAsyncThunk(
	'materials/getFirstChapterOfBook',
	async (param, thunkAPI) => {
		const { userLearningLanguage: lang, bookId } = param

		try {
			const { data: chapters, error } = await supabase
				.from('materials')
				.select('*')
				.eq('lang', lang)
				.eq('book_id', bookId)
				.order('chapter_number', { ascending: true }) // ou 'id' si pas de champ d'ordre
				.limit(1)

			if (error) throw error
			return chapters[0] // le premier chapitre
		} catch (error) {
			return thunkAPI.rejectWithValue(error)
		}
	}
)

export const getBookChapters = createAsyncThunk(
	'materials/getBookChapters',
	async (bookId, thunkAPI) => {
		try {
			let { data: chapters, error } = await supabase
				.from('materials')
				.select('id, title')
				.eq('section', 'book-chapters')
				.eq('book_id', bookId)
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
		cleanUserMaterialStatus: state => {
			state.user_materials_status = []
		},
	},
	extraReducers: builder => {
		builder
			.addCase(getMaterials.pending, state => {
				state.materials_loading = true
				state.materials_error = null
			})
			.addCase(getMaterials.fulfilled, (state, { payload }) => {
				state.materials_loading = false
				state.materials = payload
				state.filtered_materials = payload
				state.totalMaterials = state.filtered_materials.length
				state.numOfPages = Math.ceil(
					state.totalMaterials / state.materialsPerPage
				)
			})
			.addCase(getMaterials.rejected, (state, { payload }) => {
				state.materials_loading = false
				state.materials_error = payload
			})
			.addCase(getBooks.pending, state => {
				state.books_loading = true
				state.books_error = null
			})
			.addCase(getBooks.fulfilled, (state, { payload }) => {
				state.books_loading = false
				state.books = payload
				state.filtered_materials = payload
				state.totalMaterials = state.filtered_materials.length
				state.numOfPages = Math.ceil(
					state.totalMaterials / state.materialsPerPage
				)
			})
			.addCase(getBooks.rejected, (state, { payload }) => {
				state.books_loading = false
				state.books_error = payload
			})
			.addCase(getUserMaterials.pending, state => {
				state.user_materials_loading = true
				state.user_materials_error = null
			})
			.addCase(getUserMaterials.fulfilled, (state, { payload }) => {
				state.user_materials = payload
				state.user_materials_loading = false
			})
			.addCase(getUserMaterials.rejected, (state, { payload }) => {
				state.user_materials_loading = false
				state.user_materials_error = payload
			})
			.addCase(getUserMaterialsStatus.pending, state => {
				state.user_materials_status_loading = true
				state.user_materials_status_error = null
			})
			.addCase(getUserMaterialsStatus.fulfilled, (state, { payload }) => {
				state.user_materials_status = payload
				state.user_materials_status_loading = false
			})
			.addCase(getUserMaterialsStatus.rejected, (state, { payload }) => {
				state.user_materials_status_loading = false
				state.user_materials_status_error = payload
			})
			.addCase(getUserMaterialStatus.pending, state => {
				state.user_material_status_loading = true
				state.user_material_status_error = null
			})
			.addCase(getUserMaterialStatus.fulfilled, (state, { payload }) => {
				state.user_material_status = payload
				state.user_material_status_loading = false
			})
			.addCase(getUserMaterialStatus.rejected, (state, { payload }) => {
				state.user_material_status_loading = false
				state.user_material_status_error = payload
			})
			.addCase(addBeingStudiedMaterial.fulfilled, () => {
				toast.success("Matériel ajouté à vos matériels en cours d'étude")
			})
			.addCase(removeBeingStudiedMaterial.fulfilled, () => {
				toast.success("Matériel retiré de vos matériels en cours d'étude")
			})
			.addCase(addMaterialToStudied.fulfilled, () => {
				toast.success(
					'Bravo, un pas de plus vers la maîtrise de la langue russe !'
				)
			})
			.addCase(getBookChapters.pending, state => {
				state.chapters_loading = true
				state.chapters_error = null
			})
			.addCase(getBookChapters.fulfilled, (state, { payload }) => {
				state.chapters_loading = false
				state.chapters = payload
			})
			.addCase(getBookChapters.rejected, (state, { payload }) => {
				state.chapters_loading = false
				state.chapters_error = payload
			})
			.addCase(getFirstChapterOfBook.pending, state => {
				state.first_chapter_loading = true
				state.first_chapter_error = null
			})
			.addCase(getFirstChapterOfBook.fulfilled, (state, { payload }) => {
				state.first_chapter_loading = false
				state.first_chapter = payload
			})
			.addCase(getFirstChapterOfBook.rejected, (state, { payload }) => {
				state.first_chapter_loading = false
				state.first_chapter_error = payload
			})
	},
})

export default materialsSlice.reducer

export const {
	filterMaterials,
	showAllMaterials,
	searchMaterial,
	changePage,
	cleanUserMaterialStatus,
} = materialsSlice.actions
