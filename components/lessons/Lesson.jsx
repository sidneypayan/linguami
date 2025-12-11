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
							case 'quickSummary':
								return (
									<div
										key={index}
										className="mb-8 p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
										<h4 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
											<span className="text-2xl">⚡</span>
											{block.title || 'En un coup d\'œil'}
										</h4>
										<div className="grid gap-3">
											{block.keyForms?.map((form, i) => (
												<div key={i} className="flex items-center gap-3 text-slate-700">
													<span className="font-bold text-indigo-600 min-w-[80px]">{form.form}</span>
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
										<h3 className="text-xl font-bold text-slate-800 mb-4">{block.title || 'Conjugaison'}</h3>
										<div className="overflow-x-auto">
											<table className="w-full border-collapse">
												<thead>
													<tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
														<th className="p-3 text-left">Pronom</th>
														<th className="p-3 text-left">Forme</th>
														<th className="p-3 text-left">Prononciation</th>
														<th className="p-3 text-left">Traduction</th>
													</tr>
												</thead>
												<tbody>
													{block.rows?.map((row, i) => (
														<tr key={i} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
															<td className="p-3 font-semibold text-indigo-600">{row.pronoun}</td>
															<td className="p-3 font-bold text-slate-800">{row.form}</td>
															<td className="p-3 text-slate-600 italic">{row.pronunciation}</td>
															<td className="p-3 text-slate-600">{row.translation}</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
										{block.rows?.some(r => r.mnemonic) && (
											<div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded">
												<p className="text-sm font-semibold text-amber-800 mb-2">💡 Mnémotechniques</p>
												{block.rows
													.filter(r => r.mnemonic)
													.map((row, i) => (
														<p key={i} className="text-sm text-slate-600 mb-1">
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
										<h3 className="text-xl font-bold text-slate-800 mb-4">{block.title || 'Utilisations'}</h3>
										{block.items?.map((item, i) => (
											<div key={i} className="mb-6 p-5 rounded-xl border-2 border-slate-200 bg-white hover:border-indigo-300 transition-colors">
												<h4 className="font-bold text-indigo-600 mb-3">{item.usage}</h4>
												<div className="space-y-2 mb-3">
													{item.examples?.map((ex, j) => (
														<p key={j} className="text-slate-600 pl-4 border-l-2 border-indigo-200">
															{ex}
														</p>
													))}
												</div>
												{item.commonMistake && (
													<div className="mt-3 p-3 bg-red-50 border-l-4 border-red-400 rounded">
														<p className="text-sm font-semibold text-red-800 mb-1">⚠️ Erreur fréquente</p>
														<p className="text-sm text-slate-600">
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
										<h3 className="text-xl font-bold text-slate-800 mb-4">{block.title || 'Erreurs courantes'}</h3>
										<div className="space-y-3">
											{block.rows?.map((row, i) => (
												<div key={i} className="p-4 rounded-lg border-2 border-red-200 bg-red-50">
													<div className="flex items-start gap-3 mb-2">
														<span className="text-2xl">❌</span>
														<span className="flex-1 text-slate-700 line-through">{row.wrong}</span>
													</div>
													<div className="flex items-start gap-3 mb-2">
														<span className="text-2xl">✅</span>
														<span className="flex-1 font-semibold text-green-700">{row.correct}</span>
													</div>
													<p className="text-sm text-slate-600 pl-10">{row.explanation}</p>
												</div>
											))}
										</div>
									</div>
								)
							case 'miniDialogue':
								return (
									<div key={index} className="mb-8 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
										<h4 className="text-lg font-bold text-blue-800 mb-4">{block.title || 'Exemple en contexte'}</h4>
										<div className="space-y-3">
											{block.lines?.map((line, i) => (
												<div key={i} className="flex gap-3">
													<span className="font-bold text-indigo-600 min-w-[80px]">{line.speaker}</span>
													<span className="text-slate-700">{line.text}</span>
												</div>
											))}
										</div>
										{block.translation && (
											<p className="mt-4 pt-4 border-t border-blue-300 text-sm text-slate-600 italic">
												{block.translation}
											</p>
										)}
									</div>
								)
							case 'relatedTopics':
								return (
									<div key={index} className="mb-8 p-5 rounded-xl bg-slate-50 border-2 border-slate-200">
										<h4 className="text-lg font-bold text-slate-800 mb-3">🔗 Sujets connexes</h4>
										<ul className="space-y-2">
											{block.links?.map((link, i) => (
												<li key={i}>
													<a
														href={link.url}
														className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium">
														→ {link.title}
													</a>
												</li>
											))}
										</ul>
									</div>
								)
							case 'practiceLinks':
								return (
									<div key={index} className="mb-8 p-5 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
										<h4 className="text-lg font-bold text-purple-800 mb-3">🎯 Entraînez-vous</h4>
										<p className="text-slate-600 mb-3">{block.description}</p>
										<ul className="space-y-2">
											{block.links?.map((link, i) => (
												<li key={i}>
													<a
														href={link.url}
														className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors font-medium">
														<span>{link.title}</span>
														<span>→</span>
													</a>
												</li>
											))}
										</ul>
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
