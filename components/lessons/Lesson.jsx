'use client'

import { useTranslations, useLocale } from 'next-intl'
import { CheckCircle, BookOpen, Sparkles, Trophy } from 'lucide-react'
import { useLessonStatus, useMarkLessonAsStudied } from '@/lib/lessons-client'
import { useUserContext } from '@/context/user'
import { useThemeMode } from '@/context/ThemeContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import toast from '@/utils/toast'
import { getToastMessage } from '@/utils/toastMessages'
import { cn } from '@/lib/utils'

const Lesson = ({ lesson }) => {
	const t = useTranslations('lessons')
	const locale = useLocale()
	const { isUserLoggedIn } = useUserContext()
	const { isDark } = useThemeMode()

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
									<div key={index} className="mt-6 mb-4">
										<div className={cn(
											"flex items-center gap-2.5 px-3 py-2",
											"border-l-4 rounded-r-lg",
											isDark
												? "border-cyan-500 bg-cyan-950/30"
												: "border-cyan-500 bg-cyan-50/70"
										)}>
											<svg className={cn(
												"w-4 h-4 flex-shrink-0",
												isDark ? "text-cyan-400" : "text-cyan-600"
											)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
											</svg>
											<h2 className={cn(
												"text-base sm:text-lg font-semibold",
												isDark ? "text-cyan-300" : "text-cyan-700"
											)}>
												{block.text}
											</h2>
										</div>
									</div>
								)
							case 'title':
								return (
									<div key={index} className="mt-10 mb-5">
										<div className={cn(
											"flex items-center gap-3 px-4 py-3 rounded-xl",
											isDark
												? "bg-gradient-to-r from-indigo-950/80 to-purple-950/60 border border-indigo-500/30"
												: "bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200"
										)}>
											<div className={cn(
												"flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
												"bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg",
												isDark ? "shadow-indigo-500/25" : "shadow-indigo-500/30"
											)}>
												<svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
												</svg>
											</div>
											<h3 className={cn(
												"text-lg sm:text-xl font-bold",
												isDark
													? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300"
													: "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
											)}>
												{block.text}
											</h3>
										</div>
									</div>
								)
							case 'paragraph':
								return (
									<p
										key={index}
										className={cn(
											"mt-4 mb-6 text-base sm:text-[1.0625rem] leading-relaxed",
											isDark ? "text-slate-300" : "text-slate-600"
										)}
										dangerouslySetInnerHTML={{ __html: block.text }}
									/>
								)
							case 'list':
								return (
									<ul
										key={index}
										className={cn(
											"mt-4 mb-6 pl-6 sm:pl-8 list-disc",
											isDark ? "marker:text-indigo-400" : "marker:text-indigo-500"
										)}>
										{block.items.map((item, itemIndex) => (
											<li
												key={itemIndex}
												className={cn(
													"mb-3 text-base sm:text-[1.0625rem] leading-relaxed",
													isDark ? "text-slate-300" : "text-slate-600"
												)}>
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
											'relative mt-4 mb-6 p-4 sm:p-6 rounded-none sm:rounded-xl overflow-hidden',
											'-mx-5 sm:mx-0',
											'before:absolute before:left-0 before:top-0 before:w-1 before:h-full before:bg-gradient-to-b before:from-indigo-500 before:to-purple-600',
											isDark
												? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-y sm:border-2 border-indigo-500/20'
												: 'bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-y sm:border-2 border-indigo-500/15'
										)}>
										{block.items.map((example, exampleIndex) => (
											<p
												key={exampleIndex}
												className={cn(
													'italic text-sm sm:text-base leading-relaxed pl-4',
													isDark ? 'text-slate-300' : 'text-slate-600',
													exampleIndex < block.items.length - 1 && 'mb-4'
												)}
												dangerouslySetInnerHTML={{ __html: example }}
											/>
										))}
									</div>
								)
							case 'quickSummary':
								return (
									<div
										key={index}
										className={cn(
											"mb-8 p-4 sm:p-6 rounded-none sm:rounded-xl border-y sm:border-2",
											"-mx-5 sm:mx-0",
											isDark
												? "bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30"
												: "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200"
										)}>
										<h4 className={cn(
											"text-lg font-bold mb-4 flex items-center gap-2",
											isDark ? "text-emerald-400" : "text-emerald-800"
										)}>
											<span className="text-2xl">⚡</span>
											{block.title || 'En un coup d\'œil'}
										</h4>
										<div className="grid gap-3">
											{block.keyForms?.map((form, i) => (
												<div key={i} className={cn(
													"flex items-center gap-3",
													isDark ? "text-slate-300" : "text-slate-700"
												)}>
													<span className={cn(
														"font-bold min-w-[80px]",
														isDark ? "text-indigo-400" : "text-indigo-600"
													)}>{form.form}</span>
													<span className="text-slate-400">→</span>
													<span>{form.translation}</span>
												</div>
											))}
										</div>
									</div>
								)
							case 'conjugationTable':
								return (
									<div key={index} className="mb-8">
										<h3 className={cn(
											"text-xl font-bold mb-4",
											isDark ? "text-slate-100" : "text-slate-800"
										)}>{block.title || 'Conjugaison'}</h3>
										<div className="overflow-x-auto -mx-5 sm:mx-0">
											<table className="w-full border-collapse">
												<thead>
													<tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
														<th className="p-3 text-left">{t('table_pronoun')}</th>
														<th className="p-3 text-left">{t('table_form')}</th>
														<th className="p-3 text-left">{t('table_translation')}</th>
													</tr>
												</thead>
												<tbody>
													{block.rows?.map((row, i) => (
														<tr key={i} className={cn(
															i % 2 === 0
																? (isDark ? 'bg-slate-700/50' : 'bg-slate-50')
																: (isDark ? 'bg-slate-800/50' : 'bg-white')
														)}>
															<td className={cn("p-3 font-semibold", isDark ? "text-indigo-400" : "text-indigo-600")}>{row.pronoun}</td>
															<td className={cn("p-3 font-bold", isDark ? "text-slate-100" : "text-slate-800")}>{row.form}</td>
															<td className={cn("p-3", isDark ? "text-slate-300" : "text-slate-600")}>{row.translation}</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
										{block.rows?.some(r => r.mnemonic) && (
											<div className={cn(
												"mt-4 p-4 border-l-4 border-amber-400 rounded-none sm:rounded",
												"-mx-5 sm:mx-0",
												isDark ? "bg-amber-500/10" : "bg-amber-50"
											)}>
												<p className={cn(
													"text-sm font-semibold mb-2",
													isDark ? "text-amber-400" : "text-amber-800"
												)}>💡 {t('mnemonics')}</p>
												{block.rows
													.filter(r => r.mnemonic)
													.map((row, i) => (
														<p key={i} className={cn(
															"text-sm mb-1",
															isDark ? "text-slate-300" : "text-slate-600"
														)}>
															<strong>{row.pronoun} {row.form}</strong> : {row.mnemonic}
														</p>
													))}
											</div>
										)}
									</div>
								)
							case 'usageList':
								return (
									<div key={index} className="mb-8">
										<h3 className={cn(
											"text-xl font-bold mb-4",
											isDark ? "text-slate-100" : "text-slate-800"
										)}>{block.title || 'Utilisations'}</h3>
										{block.items?.map((item, i) => (
											<div key={i} className={cn(
												"mb-2 p-4 sm:p-5 rounded-none sm:rounded-xl border-y sm:border-2 transition-colors",
												"-mx-5 sm:mx-0",
												isDark
													? "border-slate-700 bg-slate-800/50 hover:border-indigo-500/50"
													: "border-slate-200 bg-white hover:border-indigo-300"
											)}>
												<div className="flex items-center gap-2 mb-3">
													<div className={cn(
														"w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold",
														"bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md",
														isDark ? "shadow-indigo-500/20" : "shadow-indigo-500/30"
													)}>
														{i + 1}
													</div>
													<h4 className={cn(
														"font-bold text-base sm:text-lg",
														isDark
															? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300"
															: "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
													)}>{item.usage}</h4>
												</div>
												<div>
													{item.examples?.map((ex, j) => (
														<p key={j} className={cn(
															"pl-4 border-l-2 !mb-0",
															j > 0 && "mt-1",
															isDark ? "text-slate-300 border-indigo-500/50" : "text-slate-600 border-indigo-200"
														)}>
															{ex}
														</p>
													))}
												</div>
												{item.commonMistake && (
													<div className={cn(
														"mt-3 p-3 border-l-4 border-red-400 rounded-none sm:rounded",
														isDark ? "bg-red-500/10" : "bg-red-50"
													)}>
														<p className={cn(
															"text-sm font-semibold mb-1",
															isDark ? "text-red-400" : "text-red-800"
														)}>⚠️ Erreur fréquente</p>
														<p className={cn(
															"text-sm",
															isDark ? "text-slate-300" : "text-slate-600"
														)}>
															<span className="line-through text-red-600">{item.commonMistake.wrong}</span>
															{' → '}
															<span className="text-green-600 font-semibold">{item.commonMistake.correct}</span>
														</p>
													</div>
												)}
											</div>
										))}
									</div>
								)
							case 'mistakesTable':
								return (
									<div key={index} className="mb-8">
										<h3 className={cn(
											"text-xl font-bold mb-4",
											isDark ? "text-slate-100" : "text-slate-800"
										)}>{block.title || 'Erreurs courantes'}</h3>
										<div className="space-y-2">
											{block.rows?.map((row, i) => (
												<div key={i} className={cn(
													"py-3 px-4 rounded-none sm:rounded-lg border-y sm:border",
													"-mx-5 sm:mx-0",
													isDark ? "border-slate-700 bg-slate-800/30" : "border-slate-200 bg-slate-50"
												)}>
													<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
														<span className={cn(
															"line-through text-red-500",
															isDark && "text-red-400"
														)}>{row.wrong}</span>
														<span className={cn(
															isDark ? "text-slate-500" : "text-slate-400"
														)}>→</span>
														<span className={cn(
															"font-semibold",
															isDark ? "text-green-400" : "text-green-600"
														)}>{row.correct}</span>
													</div>
													{row.explanation && (
														<p className={cn(
															"text-sm mt-1",
															isDark ? "text-slate-400" : "text-slate-500"
														)}>{row.explanation}</p>
													)}
												</div>
											))}
										</div>
									</div>
								)
							case 'miniDialogue':
								return (
									<div key={index} className={cn(
										"mb-8 p-4 sm:p-6 rounded-none sm:rounded-xl border-y sm:border-2",
										"-mx-5 sm:mx-0",
										isDark
											? "bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/30"
											: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
									)}>
										<h4 className={cn(
											"text-lg font-bold mb-4",
											isDark ? "text-blue-400" : "text-blue-800"
										)}>{block.title || 'Exemple en contexte'}</h4>
										<div className="space-y-3">
											{block.lines?.map((line, i) => (
												<div key={i} className="flex gap-3">
													<span className={cn(
														"font-bold min-w-[80px]",
														isDark ? "text-indigo-400" : "text-indigo-600"
													)}>{line.speaker}</span>
													<span className={cn(isDark ? "text-slate-300" : "text-slate-700")}>{line.text}</span>
												</div>
											))}
										</div>
										{block.translation && (
											<p className={cn(
												"mt-4 pt-4 border-t text-sm italic",
												isDark ? "border-blue-500/30 text-slate-400" : "border-blue-300 text-slate-600"
											)}>
												{block.translation}
											</p>
										)}
									</div>
								)
							case 'relatedTopics':
								// Liens vers la méthode désactivés
								return null
							case 'practiceLinks':
								// Liens vers la méthode désactivés
								return null
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
