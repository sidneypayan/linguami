import EditMaterialPageClient from './pageClient'

export const metadata = {
	title: 'Edit Material - Admin | Linguami',
	description: 'Edit learning material and exercises'
}

export default function EditMaterialPage({ params }) {
	const { id } = params

	return <EditMaterialPageClient materialId={parseInt(id)} />
}
