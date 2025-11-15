'use client'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import LessonsMenu from '@/components/lessons/LessonsMenu'
import Lesson from '@/components/lessons/Lesson'
import SEO from '@/components/SEO'
import { Stack } from '@mui/material'
import {
	getLessons,
	getUserLessonStatus,
} from '@/features/lessons/lessonsSlice'

const Lessons = () => {
	const router = useRouter()
	const { slug } = router.query
	const lang = router.locale

	const t = useTranslations('lessons')
	const dispatch = useDispatch()
	const { lessons } = useSelector(store => store.lessons)

	const [lessonsInfos, setLessonsInfos] = useState([])

	const [selectedLesson, setSelectedLesson] = useState(null)

	// 1. Récupération des données
	useEffect(() => {
		dispatch(getLessons({ lang }))
	}, [dispatch, locale])

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

	// Mots-clés SEO par langue
	const keywordsByLang = {
		fr: 'leçons russe, cours russe, exercices russe, grammaire russe, apprendre russe en ligne, leçons interactives',
		ru: 'уроки французского, курсы французского, упражнения французский, грамматика французского, учить французский онлайн',
		en: 'russian lessons, french lessons, language courses, interactive lessons, learn russian online, learn french online'
	}

	// JSON-LD pour Course
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Course',
		name: `${t('pagetitle')} | Linguami`,
		description: t('description'),
		provider: {
			'@type': 'Organization',
			name: 'Linguami',
			url: 'https://www.linguami.com'
		},
		courseMode: 'online',
		inLanguage: locale === 'fr' ? ['ru-RU', 'fr-FR'] : locale === 'ru' ? ['fr-FR', 'ru-RU'] : ['ru-RU', 'fr-FR', 'en-US'],
		educationalLevel: 'Beginner to Advanced',
		url: `https://www.linguami.com${locale === 'fr' ? '' : `/${locale}`}/lessons`
	}

	return (
		<>
			<SEO
				title={`${t('pagetitle')} | Linguami`}
				description={t('description')}
				path='/lessons'
				keywords={keywordsByLang[locale]}
				jsonLd={jsonLd}
			/>
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
