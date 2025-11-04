import { createSelector } from '@reduxjs/toolkit'

// Sélecteur de base pour accéder au slice materials
const selectMaterialsState = state => state.materials

// Sélecteurs mémoïsés pour les données materials
export const selectMaterials = createSelector(
	[selectMaterialsState],
	materials => materials.materials
)

export const selectFilteredMaterials = createSelector(
	[selectMaterialsState],
	materials => materials.filtered_materials
)

export const selectMaterialsLoading = createSelector(
	[selectMaterialsState],
	materials => materials.materials_loading
)

export const selectMaterialsError = createSelector(
	[selectMaterialsState],
	materials => materials.materials_error
)

// Sélecteur pour les données paginées (calculé une seule fois par changement)
export const selectPaginatedMaterials = createSelector(
	[selectFilteredMaterials, selectMaterialsState],
	(filteredMaterials, materialsState) => {
		const { sliceStart, sliceEnd } = materialsState
		return filteredMaterials.slice(sliceStart, sliceEnd)
	}
)

// Sélecteur pour toutes les données materials nécessaires sur une page
export const selectMaterialsData = createSelector(
	[
		selectMaterials,
		selectFilteredMaterials,
		selectMaterialsLoading,
		selectMaterialsError,
		selectMaterialsState,
	],
	(materials, filteredMaterials, loading, error, materialsState) => ({
		materials,
		filtered_materials: filteredMaterials,
		materials_loading: loading,
		materials_error: error,
		level: materialsState.level,
		page: materialsState.page,
		totalMaterials: materialsState.totalMaterials,
		numOfPages: materialsState.numOfPages,
		sliceStart: materialsState.sliceStart,
		sliceEnd: materialsState.sliceEnd,
		materialsPerPage: materialsState.materialsPerPage,
	})
)

// Sélecteurs pour les livres
export const selectBooks = createSelector(
	[selectMaterialsState],
	materials => materials.books
)

export const selectBooksLoading = createSelector(
	[selectMaterialsState],
	materials => materials.books_loading
)

export const selectFirstChapter = createSelector(
	[selectMaterialsState],
	materials => materials.first_chapter
)

export const selectChapters = createSelector(
	[selectMaterialsState],
	materials => materials.chapters
)

// Sélecteurs pour les matériels utilisateur
export const selectUserMaterials = createSelector(
	[selectMaterialsState],
	materials => materials.user_materials
)

export const selectUserMaterialsLoading = createSelector(
	[selectMaterialsState],
	materials => materials.user_materials_loading
)

export const selectUserMaterialsStatus = createSelector(
	[selectMaterialsState],
	materials => materials.user_materials_status
)

export const selectUserMaterialStatus = createSelector(
	[selectMaterialsState],
	materials => materials.user_material_status
)

// Sélecteur pour vérifier si un matériel est dans les matériels de l'utilisateur
export const selectIsMaterialInUserMaterials = materialId =>
	createSelector([selectUserMaterialsStatus], userMaterialsStatus =>
		userMaterialsStatus.some(status => status.material_id === materialId)
	)
