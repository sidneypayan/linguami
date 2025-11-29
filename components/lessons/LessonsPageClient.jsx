'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import LessonsMenu from '@/components/lessons/LessonsMenu'
import Lesson from '@/components/lessons/Lesson'

const LessonsPageClient = ({ initialLessons }) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const slug = searchParams.get('slug')
	const locale = useLocale()

	const t = useTranslations('lessons')

	const [lessonsInfos, setLessonsInfos] = useState([])
	const [selectedLesson, setSelectedLesson] = useState(null)

	// Use initialLessons from server
	const lessons = initialLessons

	// Process lessons data
	useEffect(() => {
		if (lessons.length > 0) {
			const gatherLessonsInfos = lessons.map((lesson) => ({
				titleFr: lesson.title_fr,
				titleRu: lesson.title_ru,
				lessonLevel: lesson.level,
				slug: lesson.slug,
				id: lesson.id,
			}))
			setLessonsInfos(gatherLessonsInfos)
		}
	}, [lessons])

	// Select lesson based on slug
	useEffect(() => {
		if (slug && lessons.length > 0) {
			const lesson = lessons.find((l) => l.slug === slug)
			setSelectedLesson(lesson)
		}
	}, [slug, lessons])

	// JSON-LD for Course
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Course',
		name: `${t('pagetitle')} | Linguami`,
		description: t('description'),
		provider: {
			'@type': 'Organization',
			name: 'Linguami',
			url: 'https://www.linguami.com',
		},
		courseMode: 'online',
		inLanguage:
			locale === 'fr'
				? ['ru-RU', 'fr-FR']
				: locale === 'ru'
					? ['fr-FR', 'ru-RU']
					: ['ru-RU', 'fr-FR', 'en-US'],
		educationalLevel: 'Beginner to Advanced',
		url: `https://www.linguami.com${locale === 'fr' ? '' : `/${locale}`}/lessons`,
	}

	return (
		<>
			{/* JSON-LD structured data */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>

			<div className="flex flex-col md:flex-row gap-0 md:gap-8 w-full lg:w-[85%] xl:w-[80%] mx-auto px-0 md:px-4 mt-24 md:mt-32 mb-24 md:mb-32 items-start">
				<LessonsMenu
					lessonSlug={slug}
					lessonsInfos={lessonsInfos}
					onSelectLesson={(slug) => {
						router.push(`/${locale}/lessons?slug=${slug}`)
					}}
				/>

				<Lesson lesson={selectedLesson} />
			</div>
		</>
	)
}

export default LessonsPageClient
