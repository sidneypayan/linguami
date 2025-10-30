import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import LessonsMenu from '../../components/lessons/LessonsMenu'
import Lesson from '../../components/lessons/Lesson'
import Head from 'next/head'
import { Stack } from '@mui/material'
import {
	getLessons,
	getUserLessonStatus,
} from '../../features/lessons/lessonsSlice'

const Lessons = () => {
	const router = useRouter()
	const { slug } = router.query
	const lang = router.locale

	const { t } = useTranslation('lessons')
	const dispatch = useDispatch()
	const { lessons } = useSelector(store => store.lessons)

	const [lessonsInfos, setLessonsInfos] = useState([])

	const [selectedLesson, setSelectedLesson] = useState(null)

	// 1. Récupération des données
	useEffect(() => {
		dispatch(getLessons({ lang }))
	}, [dispatch, lang])

	// 2. Traitement des données
	useEffect(() => {
		if (lessons.length > 0) {
			const gatherLessonsInfos = lessons.map(lesson => ({
				titleFr: lesson.title_fr,
				titleRu: lesson.title_ru,
				lessonLevel: lesson.level,
				slug: lesson.slug,
				id: lesson.id,
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

	useEffect(() => {
		if (selectedLesson) {
			dispatch(getUserLessonStatus(selectedLesson.id))
		}
	}, [dispatch, selectedLesson])

	return (
		<>
			<Head>
				<title>{`${t('pagetitle')} | Linguami`}</title>
				<meta name='description' content={t('description')} />
			</Head>
			<Stack
				direction={{ xs: 'column', md: 'row' }}
				spacing={{ xs: 0, md: 4 }}
				sx={{
					width: {
						xs: '100%',
						lg: '85%',
						xl: '80%',
					},
					margin: 'auto',
					px: { xs: 0, md: 2 },
					mt: {
						xs: '6rem',
						md: '8rem',
					},
					mb: {
						xs: '6rem',
						md: '8rem',
					},
					alignItems: 'flex-start',
				}}>
				<LessonsMenu
					lessonSlug={slug}
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
