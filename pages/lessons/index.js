import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import LessonsMenu from '../../components/lessons/LessonsMenu'
import Lesson from '../../components/lessons/Lesson'
import Head from 'next/head'
import { Stack } from '@mui/material'
import { getLessons } from '../../features/lessons/lessonsSlice'

const Lessons = () => {
	const router = useRouter()
	const { slug } = router.query
	const { t } = useTranslation('lessons')
	const dispatch = useDispatch()
	const { lessons } = useSelector(store => store.lessons)
	const [lessonsInfos, setLessonsInfos] = useState([])

	const [selectedLesson, setSelectedLesson] = useState(null)

	// 1. Récupération des données
	useEffect(() => {
		dispatch(getLessons())
	}, [dispatch])

	// 2. Traitement des données
	useEffect(() => {
		if (lessons.length > 0) {
			const gatherLessonsInfos = lessons.map(lesson => ({
				titleFr: lesson.title_fr,
				titleRu: lesson.title_ru,
				lessonLevel: lesson.level,
				slug: lesson.slug,
			}))
			setLessonsInfos(gatherLessonsInfos)
		}
	}, [lessons])

	useEffect(() => {
		if (slug && lessons.length > 0) {
			const lesson = lessons.find(l => l.slug === slug)
			setSelectedLesson(lesson)
		}
	}, [slug, lessons])

	return (
		<>
			<Head>
				<title>{`${t('pagetitle')} | Linguami`}</title>
				<meta name='description' content={t('description')} />
			</Head>
			<Stack direction='row' sx={{ margin: '10rem' }}>
				<LessonsMenu
					lessonsInfos={lessonsInfos}
					onSelectLesson={slug => {
						router.push({
							pathname: '/lessons',
							query: { slug },
						})
					}}
				/>

				<Lesson lesson={selectedLesson} />
			</Stack>
		</>
	)
}

export default Lessons
