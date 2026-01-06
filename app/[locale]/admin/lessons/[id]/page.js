import EditLessonPageClient from './pageClient'

export const metadata = {
	title: 'Edit Lesson - Admin | Linguami',
	description: 'Edit standalone grammar lesson'
}

export default async function EditLessonPage({ params }) {
	const { id } = await params

	return <EditLessonPageClient lessonId={parseInt(id)} />
}
