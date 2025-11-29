'use client'

import { useTranslations } from 'next-intl'
import { CheckCircle } from 'lucide-react'
import { useLessonStatus, useMarkLessonAsStudied } from '@/lib/lessons-client'
import { useUserContext } from '@/context/user'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import toast from '@/utils/toast'
import { getToastMessage } from '@/utils/toastMessages'
import { cn } from '@/lib/utils'

const Lesson = ({ lesson }) => {
	const t = useTranslations('lessons')
	const { isUserLoggedIn } = useUserContext()

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
			<div className="hidden md:block mx-auto bg-white rounded-2xl sticky top-40 flex-1 p-8 max-w-2xl">
				<h2 className="text-2xl font-bold mb-2 text-slate-800">{t('title')}</h2>
				<p className="text-slate-500">{t('subtitle')}</p>
			</div>
		)
	}

	return (
		<div className="w-full max-w-2xl mx-auto mt-8 md:mt-0 mb-16 md:mb-8 px-4 md:px-0">
			<Card className="p-6 sm:p-8 md:p-10 rounded-2xl shadow-[0_8px_32px_rgba(102,126,234,0.12)] border border-indigo-500/10 bg-white">
				<CardContent className="p-0">
					{lesson.blocks.map((block, index) => {
						switch (block.type) {
							case 'mainTitle':
								return (
									<h1
										key={index}
										className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
										{block.text}
									</h1>
								)
							case 'subtitle':
								return (
									<h2
										key={index}
										className="text-center text-lg sm:text-xl font-medium text-slate-500 mb-10 md:mb-16">
										{block.text}
									</h2>
								)
							case 'title':
								return (
									<h3
										key={index}
										className="relative mt-10 mb-4 text-xl sm:text-2xl font-bold text-slate-800 pl-4 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-4/5 before:rounded-full before:bg-gradient-to-b before:from-indigo-500 before:to-purple-600">
										{block.text}
									</h3>
								)
							case 'paragraph':
								return (
									<p
										key={index}
										className="mt-4 mb-6 text-slate-600 text-base sm:text-[1.0625rem] leading-relaxed"
										dangerouslySetInnerHTML={{ __html: block.text }}
									/>
								)
							case 'list':
								return (
									<ul
										key={index}
										className="mt-4 mb-6 pl-6 sm:pl-8 list-disc marker:text-indigo-500">
										{block.items.map((item, itemIndex) => (
											<li
												key={itemIndex}
												className="mb-3 text-slate-600 text-base sm:text-[1.0625rem] leading-relaxed">
												<span dangerouslySetInnerHTML={{ __html: item }} />
											</li>
										))}
									</ul>
								)
							case 'examples':
								return (
									<div
										key={index}
										className={cn(
											'relative mt-4 mb-6 p-5 sm:p-6 rounded-xl overflow-hidden',
											'bg-gradient-to-br from-indigo-500/5 to-purple-500/5',
											'border-2 border-indigo-500/15',
											'shadow-[0_4px_12px_rgba(102,126,234,0.08)]',
											'before:absolute before:left-0 before:top-0 before:w-1 before:h-full before:bg-gradient-to-b before:from-indigo-500 before:to-purple-600'
										)}>
										{block.items.map((example, exampleIndex) => (
											<p
												key={exampleIndex}
												className={cn(
													'italic text-slate-600 text-sm sm:text-base leading-relaxed pl-4',
													exampleIndex < block.items.length - 1 && 'mb-4'
												)}
												dangerouslySetInnerHTML={{ __html: example }}
											/>
										))}
									</div>
								)
							default:
								return null
						}
					})}
				</CardContent>
			</Card>

			{!isLessonStudied && (
				<div className="mt-10 flex justify-center">
					<Button
						size="lg"
						onClick={handleMarkAsStudied}
						disabled={isMarking}
						className={cn(
							'bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold',
							'text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-5 rounded-xl',
							'shadow-[0_8px_24px_rgba(16,185,129,0.3)]',
							'transition-all duration-300',
							'hover:from-green-600 hover:to-emerald-700',
							'hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(16,185,129,0.4)]',
							'active:-translate-y-0.5'
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
