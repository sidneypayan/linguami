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
		img: userMaterial.materials.img,
		level: userMaterial.materials.level,
		section: userMaterial.materials.section,
	}))

	return newUserMaterials
}
