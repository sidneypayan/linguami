'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { List } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useThemeMode } from '@/context/ThemeContext'
import LessonsMenu from '@/components/lessons/LessonsMenu'
import Lesson from '@/components/lessons/Lesson'

const LessonsPageClient = ({ initialLessons }) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const slug = searchParams.get('slug')
	const locale = useLocale()
	const { isDark } = useThemeMode()

	const t = useTranslations('lessons')

	const [lessonsInfos, setLessonsInfos] = useState([])
	const [selectedLesson, setSelectedLesson] = useState(null)
	const [showMenu, setShowMenu] = useState(true)

	// Use initialLessons from server
	const lessons = initialLessons

	// Process lessons data
	useEffect(() => {
		if (lessons.length > 0) {
			const gatherLessonsInfos = lessons.map((lesson) => ({
				titleFr: lesson.title_fr,
				titleRu: lesson.title_ru,
				titleEn: lesson.title_en,
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
			// Hide menu on mobile/tablet when a lesson is selected
			setShowMenu(false)
		} else {
			setShowMenu(true)
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

			<div className={cn(
				"flex flex-col xl:flex-row gap-0 xl:gap-10 w-full max-w-[1500px] mx-auto px-0 xl:px-8 mb-24 md:mb-32 items-start",
				// No top margin on mobile/tablet when lesson is shown (sticky menu button sits under navbar)
				!showMenu ? 'mt-0 xl:mt-28' : 'mt-20 md:mt-28'
			)}>
				{/* Menu - fullscreen on mobile/tablet, sidebar on desktop */}
				<div className={cn(
					'w-full xl:w-[380px] xl:min-w-[380px]',
					// On mobile/tablet: show/hide based on state
					showMenu ? 'block' : 'hidden xl:block'
				)}>
					<LessonsMenu
						lessonSlug={slug}
						lessonsInfos={lessonsInfos}
						onSelectLesson={(slug) => {
							router.push(`/${locale}/lessons?slug=${slug}`)
						}}
					/>
				</div>

				{/* Lesson content - with back button on mobile/tablet */}
				<div className={cn(
					'w-full flex-1',
					// On mobile/tablet: show/hide based on state (inverse of menu)
					!showMenu ? 'block' : 'hidden xl:block'
				)}>
					{/* OPTION 2: Barre discrète avec titre de leçon */}
					{selectedLesson && (
						<div className={cn(
							'xl:hidden sticky top-[60px] md:top-[72px] z-40 px-4 py-3',
							'flex items-center gap-3',
							isDark ? 'bg-slate-900/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm',
							'border-b',
							isDark ? 'border-slate-700/50' : 'border-slate-200'
						)}>
							<button
								onClick={() => {
									setShowMenu(true)
									router.push(`/${locale}/lessons`)
								}}
								className={cn(
									'p-2 rounded-lg transition-all',
									isDark
										? 'text-violet-400 hover:bg-slate-800'
										: 'text-violet-600 hover:bg-violet-50'
								)}
								aria-label={t('show_menu')}
							>
								<List className="w-5 h-5" />
							</button>
							<span className={cn(
								'font-semibold truncate',
								isDark ? 'text-slate-200' : 'text-slate-700'
							)}>
								{locale === 'fr'
									? selectedLesson.title_fr
									: locale === 'en'
										? (selectedLesson.title_en || selectedLesson.title_fr)
										: selectedLesson.title_ru}
							</span>
						</div>
					)}
					<Lesson lesson={selectedLesson} />
				</div>
			</div>
		</>
	)
}

export default LessonsPageClient
