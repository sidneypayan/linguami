import EditLessonPageClient from './pageClient'

export const metadata = {
	title: 'Edit Lesson - Admin | Linguami',
	description: 'Edit standalone grammar lesson'
}

export default function EditLessonPage({ params }) {
	const { id } = params

	return <EditLessonPageClient lessonId={parseInt(id)} />
}
