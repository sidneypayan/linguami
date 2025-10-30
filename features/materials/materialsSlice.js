import { supabase } from '../../lib/supabase'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { mergeUserMaterial } from '../../utils/helpers'
import { getToastMessage } from '../../utils/toastMessages'

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
	userMaterialsNeedRefresh: false,
	// Critères de filtrage actifs
	activeFilters: {
		section: null,
		level: null,
		status: null,
		search: '',
		userMaterialsStatus: [],
	},
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
	async ({ lang, userId }, thunkAPI) => {
		const { data: userMaterials, error } = await supabase
			.from('user_materials')
			.select('*, materials!inner(title, image, level, section)')
			.eq('user_id', userId)
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
		const {
			data: { user },
		} = await supabase.auth.getUser()

		const { data: userMaterialsStatus, error } = await supabase
			.from('user_materials')
			.select('material_id, is_being_studied, is_studied')
			.eq('user_id', user.id)

		if (error) {
			return thunkAPI.rejectWithValue(error)
		}

		return userMaterialsStatus
	}
)

export const getUserMaterialStatus = createAsyncThunk(
	'materials/getUserMaterialStatus',
	async (param, thunkAPI) => {
		const {
			data: { user },
		} = await supabase.auth.getUser()

		const { data: userMaterialStatus, error } = await supabase
			.from('user_materials')
			.select('is_being_studied, is_studied')
			.match({ user_id: user.id, material_id: param })

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
		const {
			data: { user },
		} = await supabase.auth.getUser()

		const { data: material, error } = await supabase
			.from('user_materials')
			.insert([
				{
					user_id: user.id,
					material_id: param,
				},
			])
			.select()

		if (error) {
			return thunkAPI.rejectWithValue(error)
		}

		// Fetch the full material data to add to user_materials
		const { data: fullMaterial, error: fetchError } = await supabase
			.from('user_materials')
			.select('*, materials!inner(title, image, level, section)')
			.eq('user_id', user.id)
			.eq('material_id', param)
			.single()

		if (fetchError) {
			return thunkAPI.rejectWithValue(fetchError)
		}

		return {
			material_id: param,
			fullMaterial: mergeUserMaterial([fullMaterial])[0]
		}
	}
)

export const removeBeingStudiedMaterial = createAsyncThunk(
	'materials/removeBeingStudiedMaterial',
	async (param, thunkAPI) => {
		const {
			data: { user },
		} = await supabase.auth.getUser()

		const { data: material, error } = await supabase
			.from('user_materials')
			.delete()
			.match({ user_id: user.id, material_id: param })
			.select()

		if (error) {
			return thunkAPI.rejectWithValue(error)
		}

		return { material_id: param }
	}
)

export const addMaterialToStudied = createAsyncThunk(
	'materials/addMaterialToStudied',
	async (id, thunkAPI) => {
		const {
			data: { user },
		} = await supabase.auth.getUser()
		const { data: doMaterialExists, error } = await supabase
			.from('user_materials')
			.select('material_id')
			.match({ user_id: user.id, material_id: id })

		let isNewMaterial = false

		if (doMaterialExists.length < 1) {
			const { data: material, error } = await supabase
				.from('user_materials')
				.insert([
					{
						user_id: user.id,
						material_id: id,
						is_being_studied: false,
						is_studied: true,
					},
				])
				.select()

			if (error) {
				return thunkAPI.rejectWithValue(error)
			}
			isNewMaterial = true
		} else {
			const { error } = await supabase
				.from('user_materials')
				.update({ is_being_studied: false, is_studied: true })
				.match({ user_id: user.id, material_id: id })
				.select()

			if (error) {
				return thunkAPI.rejectWithValue(error)
			}
		}

		// Si c'est un nouveau matériel, récupérer les données complètes
		let fullMaterial = null
		if (isNewMaterial) {
			const { data: materialData, error: fetchError } = await supabase
				.from('user_materials')
				.select('*, materials!inner(title, image, level, section)')
				.eq('user_id', user.id)
				.eq('material_id', id)
				.single()

			if (fetchError) {
				return thunkAPI.rejectWithValue(fetchError)
			}

			fullMaterial = mergeUserMaterial([materialData])[0]
		}

		return { material_id: id, fullMaterial, isNewMaterial }
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

// Fonction qui applique tous les filtres actifs en combinaison
const applyFilters = state => {
	const { section, level, status, search, userMaterialsStatus } = state.activeFilters

	console.log('📊 applyFilters called with activeFilters:', {
		section,
		level,
		status,
		search,
		userMaterialsStatusCount: userMaterialsStatus.length
	})

	// Choisir la bonne source de données selon la section
	// Note: state.materials et state.books contiennent déjà seulement les items de leur section respective
	// car ils sont filtrés lors de la récupération depuis la DB
	let sourceData = state.activeFilters.section === 'books' ? state.books : state.materials
	console.log('📊 Source data count:', sourceData.length)

	// Si aucun filtre n'est actif, on retourne toutes les données
	// Note: level === 'all' ou level === null signifie "pas de filtre de niveau"
	const hasActiveFilters = (level && level !== 'all') || status || search
	console.log('📊 Has active filters:', hasActiveFilters, '(level:', level, ', status:', status, ', search:', search, ')')

	if (!hasActiveFilters) {
		console.log('📊 No active filters, returning all source data')
		state.filtered_materials = sourceData
		state.totalMaterials = sourceData.length
		state.numOfPages = Math.ceil(sourceData.length / state.materialsPerPage)
		resetPagination(state)
		return
	}

	let filtered = [...sourceData]

	// On ne filtre PAS par section ici car sourceData contient déjà seulement les items de la section actuelle

	// Filtre par niveau
	if (level && level !== 'all') {
		filtered = filtered.filter(item => item.level === level)
		console.log('📊 After level filter:', filtered.length, 'items')
	}

	// Filtre par statut
	if (status) {
		if (status === 'not_studied') {
			// Pour les non étudiés, exclure ceux qui ont un statut
			const materialIdsWithAnyStatus = userMaterialsStatus
				.filter(userMaterial => userMaterial.is_being_studied || userMaterial.is_studied)
				.map(userMaterial => userMaterial.material_id)
			filtered = filtered.filter(item => !materialIdsWithAnyStatus.includes(item.id))
		} else {
			// Récupérer les IDs des matériaux avec le statut demandé
			const materialIdsWithStatus = userMaterialsStatus
				.filter(userMaterial => userMaterial[status])
				.map(userMaterial => userMaterial.material_id)
			filtered = filtered.filter(item => materialIdsWithStatus.includes(item.id))
		}
		console.log('📊 After status filter:', filtered.length, 'items')
	}

	// Filtre par recherche
	if (search) {
		console.log('📊 Applying search filter for:', search)
		console.log('📊 Sample titles before search:', filtered.slice(0, 3).map(item => item.title))
		filtered = filtered.filter(item =>
			item.title.toLowerCase().includes(search.toLowerCase())
		)
		console.log('📊 After search filter:', filtered.length, 'items')
		console.log('📊 Filtered titles:', filtered.map(item => item.title))
	}

	console.log('📊 Final filtered_materials count:', filtered.length)
	state.filtered_materials = filtered
	resetPagination(state)
}

const materialsSlice = createSlice({
	name: 'materials',
	initialState,
	reducers: {
		filterMaterials: (state, { payload }) => {
			const { section, level } = payload
			state.level = level
			state.activeFilters.section = section
			state.activeFilters.level = level
			applyFilters(state)
		},
		filterMaterialsByStatus: (state, { payload }) => {
			const { section, status, userMaterialsStatus } = payload
			state.activeFilters.section = section
			state.activeFilters.status = status
			state.activeFilters.userMaterialsStatus = userMaterialsStatus
			applyFilters(state)
		},
		showAllMaterials: state => {
			// Réinitialiser tous les filtres sauf la section
			const currentSection = state.activeFilters.section
			state.activeFilters = {
				section: currentSection,
				level: null,
				status: null,
				search: '',
				userMaterialsStatus: state.activeFilters.userMaterialsStatus,
			}
			state.level = 'all'
			applyFilters(state)
		},
		searchMaterial: (state, { payload }) => {
			console.log('🔍 searchMaterial reducer called with:', payload)
			console.log('🔍 Current activeFilters before search:', state.activeFilters)
			state.activeFilters.search = payload
			state.search = payload
			applyFilters(state)
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
			.addCase(getMaterials.pending, (state, { meta }) => {
				state.materials_loading = true
				state.materials_error = null
				// Définir la section immédiatement pour que les filtres fonctionnent
				if (meta?.arg?.section) {
					state.activeFilters.section = meta.arg.section
				}
			})
			.addCase(getMaterials.fulfilled, (state, { payload, meta }) => {
				state.materials_loading = false
				state.materials = payload
				// Conserver la section dans activeFilters pour que les recherches fonctionnent correctement
				if (meta?.arg?.section) {
					state.activeFilters.section = meta.arg.section
				}
				// Appliquer les filtres actifs (recherche, niveau, statut) aux nouvelles données
				applyFilters(state)
			})
			.addCase(getMaterials.rejected, (state, { payload }) => {
				state.materials_loading = false
				state.materials_error = payload
			})
			.addCase(getBooks.pending, state => {
				state.books_loading = true
				state.books_error = null
			})
			.addCase(getBooks.fulfilled, (state, { payload, meta }) => {
				state.books_loading = false
				state.books = payload
				// Pour books, la section est 'books'
				state.activeFilters.section = 'books'
				// Appliquer les filtres actifs aux nouvelles données
				applyFilters(state)
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
			// Mettre à jour les filtres actifs pour que les filtres de statut fonctionnent
				state.activeFilters.userMaterialsStatus = payload
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
			.addCase(addBeingStudiedMaterial.fulfilled, (state, { payload }) => {
				toast.success(getToastMessage('materialAddedToStudying'))
				// Mettre à jour user_materials_status
				state.user_materials_status.push({
					material_id: payload.material_id,
					is_being_studied: true,
					is_studied: false,
				})
				// Ajouter le matériel complet à user_materials
				if (payload.fullMaterial) {
					state.user_materials.push(payload.fullMaterial)
				}

				// Add XP for starting a material
				fetch('/api/xp/add', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						actionType: 'material_started',
						sourceId: payload.material_id.toString(),
						description: 'Started new material'
					})
				}).catch(err => console.error('Error adding XP:', err))
			})
			.addCase(removeBeingStudiedMaterial.fulfilled, (state, { payload }) => {
				toast.success(getToastMessage('materialRemovedFromStudying'))
				// Retirer de user_materials_status
				state.user_materials_status = state.user_materials_status.filter(
					m => m.material_id !== payload.material_id
				)
				// Retirer de user_materials
				state.user_materials = state.user_materials.filter(
					m => m.id !== payload.material_id
				)
			})
			.addCase(addMaterialToStudied.fulfilled, (state, { payload }) => {
				toast.success(getToastMessage('congratsProgress'))
				// Trouver et mettre à jour dans user_materials_status
				const statusIndex = state.user_materials_status.findIndex(
					m => m.material_id === payload.material_id
				)
				if (statusIndex !== -1) {
					state.user_materials_status[statusIndex].is_being_studied = false
					state.user_materials_status[statusIndex].is_studied = true
				} else {
					// Ajouter si n'existe pas
					state.user_materials_status.push({
						material_id: payload.material_id,
						is_being_studied: false,
						is_studied: true,
					})
				}
				// Mettre à jour dans user_materials
				const materialIndex = state.user_materials.findIndex(
					m => m.id === payload.material_id
				)
				if (materialIndex !== -1) {
					state.user_materials[materialIndex].is_being_studied = false
					state.user_materials[materialIndex].is_studied = true
				} else if (payload.fullMaterial) {
					// Ajouter le nouveau matériel
					state.user_materials.push(payload.fullMaterial)
				}

				// Add XP for completing a material
				fetch('/api/xp/add', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						actionType: 'material_completed',
						sourceId: payload.material_id.toString(),
						description: 'Completed material'
					})
				}).catch(err => console.error('Error adding XP:', err))
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
	filterMaterialsByStatus,
	showAllMaterials,
	searchMaterial,
	changePage,
	cleanUserMaterialStatus,
} = materialsSlice.actions
