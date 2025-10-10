import materialsSlice from '../features/materials/materialsSlice'

export const sortPostsByDate = (a, b) => {
	return new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
}

export const mergeUserMaterial = userMaterials => {
	const newUserMaterials = userMaterials.map(userMaterial => ({
		is_being_studied: userMaterial.is_being_studied,
		is_studied: userMaterial.is_studied,
		id: userMaterial.material_id,
		title: userMaterial.materials.title,
		image: userMaterial.materials.image,
		level: userMaterial.materials.level,
		section: userMaterial.materials.section,
	}))

	return newUserMaterials
}

export const getMessage = (code, lang = 'fr') => {
	const messages = {
		success_add_translation: {
			fr: 'Traduction ajoutée avec succès.',
			ru: 'Перевод успешно добавлен.',
		},
		duplicate_translation: {
			fr: 'Cette traduction est déjà enregistrée.',
			ru: 'Этот перевод уже существует.',
		},
		unexpected_error: {
			fr: 'Une erreur inattendue est survenue.',
			ru: 'An unexpected error occurred.',
		},
	}

	return messages[code]?.[lang] || messages[code]?.['en'] || 'Unknown error'
}
