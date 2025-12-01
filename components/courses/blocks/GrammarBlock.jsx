import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Volume2 } from 'lucide-react'

/**
 * GrammarBlock - Grimoire de grammaire
 * Style gaming/fantasy avec effet de livre magique
 */
const GrammarBlock = ({ block }) => {
	const t = useTranslations('common')
	const { isDark } = useThemeMode()
	const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null)
	const audioRefs = useRef({})

	const { title, explanation, examples, table } = block

	const handlePlayExample = (index, audioUrl) => {
		if (!audioUrl) return

		if (currentPlayingIndex !== null && audioRefs.current[currentPlayingIndex]) {
			audioRefs.current[currentPlayingIndex].pause()
		}

		setCurrentPlayingIndex(index)

		if (!audioRefs.current[index]) {
			audioRefs.current[index] = new Audio(audioUrl)
			audioRefs.current[index].addEventListener('ended', () => {
				setCurrentPlayingIndex(null)
			})
		}

		audioRefs.current[index].play()
	}

	useEffect(() => {
		return () => {
			Object.values(audioRefs.current).forEach((audio) => {
				if (audio) audio.pause()
			})
		}
	}, [])

	return (
		<div className={cn(
			'relative rounded-xl sm:rounded-2xl border sm:border-2 overflow-hidden',
			isDark
				? 'bg-gradient-to-br from-violet-950/50 via-slate-900 to-purple-950/30 border-violet-500/30'
				: 'bg-gradient-to-br from-violet-50 via-white to-purple-50 border-violet-200'
		)}>
			{/* Effet de brillance */}
			<div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />
			<div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />

			<div className="relative p-4 sm:p-5 space-y-5 sm:space-y-6">
				{/* Explication */}
				{explanation && (
					<div
						className={cn(
							'prose prose-sm max-w-none',
							isDark
								? 'prose-invert text-slate-300'
								: 'text-slate-600'
						)}
						dangerouslySetInnerHTML={{ __html: explanation }}
					/>
				)}

				{/* Exemples */}
				{examples && examples.length > 0 && (
					<div>
						<h4 className={cn(
							'font-bold text-base sm:text-lg mb-3 sm:mb-4',
							isDark ? 'text-violet-300' : 'text-violet-700'
						)}>
							{t('methode_examples')}
						</h4>

						<div className="space-y-3">
							{examples.map((ex, index) => (
								<div
									key={index}
									className={cn(
										'p-3 sm:p-4 rounded-lg sm:rounded-xl border-l-4',
										currentPlayingIndex === index
											? isDark
												? 'bg-violet-500/20 border-violet-400'
												: 'bg-violet-100 border-violet-500'
											: isDark
												? 'bg-slate-800/50 border-violet-500/50'
												: 'bg-white border-violet-300 shadow-sm'
									)}
								>
									<div className="flex items-start gap-3">
										{ex.audioUrl && (
											<button
												onClick={() => handlePlayExample(index, ex.audioUrl)}
												className={cn(
													'p-2 rounded-lg transition-colors flex-shrink-0',
													isDark
														? 'bg-violet-500/20 hover:bg-violet-500/30 text-violet-400'
														: 'bg-violet-100 hover:bg-violet-200 text-violet-600'
												)}
											>
												<Volume2 className="w-4 h-4" />
											</button>
										)}

										<div className="flex-1 min-w-0">
											<p className={cn(
												'font-semibold mb-1',
												isDark ? 'text-white' : 'text-slate-900'
											)}>
												{ex.sentence}
											</p>
											<p className={cn(
												'text-sm sm:text-base italic',
												isDark ? 'text-slate-400' : 'text-slate-500'
											)}>
												{ex.translation}
											</p>
											{ex.note && (
												<Badge className={cn(
													'mt-2 text-xs sm:text-sm py-1.5 px-2.5',
													'bg-violet-500/20 text-violet-400 border-violet-500/30'
												)}>
													→ {ex.note}
												</Badge>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Tableau */}
				{table && (
					<div>
						{table.title && (
							<h4 className={cn(
								'font-bold text-base sm:text-lg mb-3 sm:mb-4',
								isDark ? 'text-violet-300' : 'text-violet-700'
							)}>
								{table.title}
							</h4>
						)}

						<div className={cn(
							'rounded-lg sm:rounded-xl overflow-hidden border',
							isDark ? 'border-violet-500/30' : 'border-violet-200'
						)}>
							<table className="w-full">
								{table.headers && (
									<thead>
										<tr className={cn(
											isDark
												? 'bg-violet-500/20'
												: 'bg-violet-100'
										)}>
											{table.headers.map((header, index) => (
												<th
													key={index}
													className={cn(
														'px-3 sm:px-4 py-2 sm:py-3 text-left font-bold text-sm',
														isDark ? 'text-violet-300' : 'text-violet-700'
													)}
												>
													{header}
												</th>
											))}
										</tr>
									</thead>
								)}
								<tbody>
									{table.rows?.map((row, rowIndex) => (
										<tr
											key={rowIndex}
											className={cn(
												'transition-colors',
												currentPlayingIndex === `table-${rowIndex}`
													? isDark
														? 'bg-violet-500/15'
														: 'bg-violet-50'
													: isDark
														? 'hover:bg-slate-800/50'
														: 'hover:bg-slate-50',
												rowIndex !== table.rows.length - 1 && (
													isDark
														? 'border-b border-slate-800'
														: 'border-b border-slate-100'
												)
											)}
										>
											{row.map((cell, cellIndex) => {
												const cellAudio = table.rowsAudio?.[rowIndex]?.[cellIndex]

												return (
													<td
														key={cellIndex}
														className={cn(
															'px-3 sm:px-4 py-2 sm:py-3 text-sm',
															isDark ? 'text-slate-300' : 'text-slate-700'
														)}
													>
														{cellAudio ? (
															<div className="flex items-center gap-2">
																<button
																	onClick={() => handlePlayExample(`table-${rowIndex}-${cellIndex}`, cellAudio)}
																	className={cn(
																		'p-1 sm:p-1.5 rounded-lg transition-colors',
																		isDark
																			? 'bg-violet-500/20 hover:bg-violet-500/30 text-violet-400'
																			: 'bg-violet-100 hover:bg-violet-200 text-violet-600'
																	)}
																>
																	<Volume2 className="w-3 h-3" />
																</button>
																<span>{cell}</span>
															</div>
														) : (
															cell
														)}
													</td>
												)
											})}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default GrammarBlock
