'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { CheckCircle, BookOpen, Sparkles, Trophy, Edit } from 'lucide-react'
import { useLessonStatus, useMarkLessonAsStudied } from '@/lib/lessons-client'
import { useUserContext } from '@/context/user'
import { useThemeMode } from '@/context/ThemeContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import toast from '@/utils/toast'
import { getToastMessage } from '@/utils/toastMessages'
import { cn } from '@/lib/utils'
import ExerciseInlineBlock from '@/components/courses/blocks/ExerciseInlineBlock'
import ExerciseSection from '@/components/exercises/ExerciseSection'
import AlphabetGridBlock from '@/components/courses/blocks/AlphabetGridBlock'
import MainTitleBlock from '@/components/lessons/blocks/MainTitleBlock'
import SubtitleBlock from '@/components/lessons/blocks/SubtitleBlock'
import TitleBlock from '@/components/lessons/blocks/TitleBlock'
import ParagraphBlock from '@/components/lessons/blocks/ParagraphBlock'
import ListBlock from '@/components/lessons/blocks/ListBlock'
import ExamplesBlock from '@/components/lessons/blocks/ExamplesBlock'
import QuickSummaryBlock from '@/components/lessons/blocks/QuickSummaryBlock'
import ImportantNoteBlock from '@/components/lessons/blocks/ImportantNoteBlock'
import ConjugationTableBlock from '@/components/lessons/blocks/ConjugationTableBlock'
import UsageListBlock from '@/components/lessons/blocks/UsageListBlock'
import MistakesTableBlock from '@/components/lessons/blocks/MistakesTableBlock'
import MiniDialogueBlock from '@/components/lessons/blocks/MiniDialogueBlock'

const Lesson = ({ lesson }) => {
	const t = useTranslations('lessons')
	const locale = useLocale()
	const { isUserLoggedIn, isUserAdmin } = useUserContext()
	const { isDark } = useThemeMode()

	// Track if all exercises are attempted
	const [allExercisesAttempted, setAllExercisesAttempted] = useState(false)
	const [hasExercises, setHasExercises] = useState(false)

	// React Query: Get lesson status
	const { data: lessonStatus } = useLessonStatus(lesson?.id, isUserLoggedIn)
	const isLessonStudied = lessonStatus?.is_studied || false

	// React Query: Mark lesson as studied mutation
	const { mutate: markAsStudied, isPending: isMarking } = useMarkLessonAsStudied(isUserLoggedIn)

	const handleMarkAsStudied = () => {
		if (!lesson?.id) return

		markAsStudied(lesson.id, {
			onSuccess: () => {
				toast.success(getToastMessage('congratsProgress'))
			},
			onError: (error) => {
				toast.error(error.message || 'Failed to save progress')
			},
		})
	}

	if (!lesson || !lesson.blocks || lesson.blocks.length === 0) {
		return (
			<div className={cn(
				"hidden xl:flex flex-col items-center justify-center rounded-2xl sticky top-40 flex-1 p-10 text-center",
				"border-2 border-dashed",
				isDark
					? "bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-indigo-500/30"
					: "bg-gradient-to-br from-white to-indigo-50/50 border-indigo-300/50"
			)}>
				{/* Decorative icon */}
				<div className={cn(
					"w-20 h-20 rounded-2xl flex items-center justify-center mb-6",
					"bg-gradient-to-br from-indigo-500 to-purple-600",
					"shadow-lg shadow-indigo-500/30"
				)}>
					<BookOpen className="w-10 h-10 text-white" />
				</div>

				{/* Title with gradient */}
				<h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
					{t('title')}
				</h2>

				{/* Subtitle */}
				<p className={cn(
					"text-base mb-6 max-w-sm",
					isDark ? "text-slate-400" : "text-slate-500"
				)}>
					{t('subtitle')}
				</p>

				{/* Decorative badges */}
				<div className="flex items-center gap-3">
					<div className={cn(
						"flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold",
						isDark
							? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
							: "bg-emerald-100 text-emerald-700 border border-emerald-200"
					)}>
						<Sparkles className="w-3.5 h-3.5" />
						A1 → C2
					</div>
					<div className={cn(
						"flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold",
						isDark
							? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
							: "bg-amber-100 text-amber-700 border border-amber-200"
					)}>
						<Trophy className="w-3.5 h-3.5" />
						+XP
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="w-full flex-1 mt-4 lg:mt-0 mb-16 lg:mb-8 px-0 lg:px-0">
			<Card className={cn(
				"p-5 sm:p-8 lg:p-10 border-0 lg:border lg:rounded-2xl rounded-none",
				isDark
					? "bg-transparent lg:bg-slate-800/90 lg:border-slate-700/50"
					: "bg-transparent lg:bg-white lg:border-indigo-500/10 lg:shadow-[0_8px_32px_rgba(102,126,234,0.12)]"
			)}>
				{/* Admin Edit Button */}
				{isUserAdmin && lesson?.id && (
					<div className="flex justify-end mb-4">
						<Button
							variant="outline"
							size="sm"
							onClick={() => window.open(`/${locale}/admin/lessons/${lesson.id}`, '_blank')}
							className={cn(
								"gap-2",
								isDark
									? "border-slate-600 hover:bg-slate-700 text-slate-300"
									: "border-slate-300 hover:bg-slate-50 text-slate-700"
							)}
						>
							<Edit className="h-4 w-4" />
							{locale === 'fr' ? 'Éditer' : locale === 'ru' ? 'Редактировать' : 'Edit'}
						</Button>
					</div>
				)}

				<CardContent className="p-0">
					{lesson.blocks.map((block, index) => {
						switch (block.type) {
							case 'mainTitle':
								return <MainTitleBlock key={index} text={block.text} />
							case 'subtitle':
								return <SubtitleBlock key={index} text={block.text} isDark={isDark} />
							case 'title':
								return <TitleBlock key={index} text={block.text} isDark={isDark} />
							case 'paragraph':
								return <ParagraphBlock key={index} text={block.text} isDark={isDark} />
							case 'list':
								return <ListBlock key={index} items={block.items} isDark={isDark} />
							case 'examples':
								return <ExamplesBlock key={index} items={block.items} isDark={isDark} />
							case 'quickSummary':
								return <QuickSummaryBlock key={index} title={block.title} keyForms={block.keyForms} isDark={isDark} />
							case 'importantNote':
								return (
									<ImportantNoteBlock
										key={index}
										title={block.title}
										content={block.content}
										examples={block.examples}
										note={block.note}
										audioUrls={block.audioUrls}
										isDark={isDark}
									/>
								)
							case 'conjugationTable':
								return (
									<ConjugationTableBlock
										key={index}
										title={block.title}
										rows={block.rows}
										audioUrls={block.audioUrls}
										isDark={isDark}
									/>
								)
							case 'usageList':
								return (
									<UsageListBlock
										key={index}
										title={block.title}
										items={block.items}
										audioUrls={block.audioUrls}
										isDark={isDark}
									/>
								)
							case 'mistakesTable':
								return (
									<MistakesTableBlock
										key={index}
										title={block.title}
										rows={block.rows}
										audioUrls={block.audioUrls}
										isDark={isDark}
									/>
								)
							case 'miniDialogue':
								return (
									<MiniDialogueBlock
										key={index}
										title={block.title}
										lines={block.lines}
										translation={block.translation}
										audioUrls={block.audioUrls}
										isDark={isDark}
									/>
								)
							case 'relatedTopics':
								// Liens vers la méthode désactivés
								return null
							case 'practiceLinks':
								// Liens vers la méthode désactivés
								return null
							case 'exercise_inline':
								return <ExerciseInlineBlock key={index} block={block} />
							case 'alphabetGrid':
								return <AlphabetGridBlock key={index} block={block} />
							default:
								return null
						}
					})}
				</CardContent>
			</Card>

			{/* Exercises Section */}
			{lesson?.id && (
				<div className="mt-8">
					<ExerciseSection
						parentType="lesson"
						parentId={lesson.id}
						onExercisesStatusChange={(status) => {
							setHasExercises(status.hasExercises)
							setAllExercisesAttempted(status.allAttempted)
						}}
					/>
				</div>
			)}

			{!isLessonStudied && (!isUserLoggedIn || !hasExercises || allExercisesAttempted) && (
				<div className="mt-10 flex justify-center">
					<Button
						size="lg"
						onClick={handleMarkAsStudied}
						disabled={isMarking}
						className={cn(
							'bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold',
							'text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-5 rounded-xl',
							'transition-all duration-300',
							'hover:from-green-600 hover:to-emerald-700',
							'hover:-translate-y-1',
							'active:-translate-y-0.5',
							!isDark && 'shadow-[0_8px_24px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.4)]'
						)}>
						<CheckCircle className="h-5 w-5 mr-2" />
						{isMarking ? (t('saving') || 'Saving...') : t('lessonlearnt')}
					</Button>
				</div>
			)}
		</div>
	)
}

export default Lesson
