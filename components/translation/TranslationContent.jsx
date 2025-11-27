/**
 * Translation content component
 * Displays word info and list of translations
 */

import { Star } from 'lucide-react'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

export function TranslationContent({ translation, onTranslationClick, disabled = false }) {
	const { isDark } = useThemeMode()

	return (
		<>
			{/* Word info */}
			{(translation.displayInf || translation.inf) && (
				<div className="p-4 bg-violet-500/8">
					<div className="flex items-center gap-2 flex-wrap">
						{translation.form && (
							<span
								className={cn(
									'px-2.5 py-1 rounded-full text-xs font-semibold',
									'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
								)}
							>
								{translation.form}
							</span>
						)}
						<span className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>
							→
						</span>
						<span className={cn('font-bold', isDark ? 'text-slate-100' : 'text-slate-800')}>
							{translation.displayInf || translation.inf}
						</span>
					</div>
				</div>
			)}

			<div className={cn('h-px', isDark ? 'bg-slate-700' : 'bg-slate-200')} />

			{/* Translations list */}
			<div className="flex-1 overflow-auto overflow-x-hidden max-h-[250px]">
				<ul className="py-0">
					{translation.definitions?.map((definition, index) => {
						// Support both old format (string) and new format ({ text, count })
						const translationText = typeof definition === 'string' ? definition : definition.text
						const popularityCount = typeof definition === 'object' ? definition.count : 0
						const isPopular = popularityCount >= 3 // Show badge if chosen by 3+ users

						return (
							<li key={index}>
								<button
									onClick={disabled ? undefined : (e) => {
										e.preventDefault()
										e.target.textContent = translationText // Override textContent to exclude badge
										onTranslationClick(e)
									}}
									disabled={disabled}
									className={cn(
										'w-full py-3 px-4 text-left',
										'border-l-[3px] border-transparent',
										'transition-all duration-200',
										disabled
											? 'opacity-50 cursor-not-allowed'
											: 'hover:bg-violet-500/8 hover:border-l-violet-500 hover:pl-5 cursor-pointer'
									)}
								>
									<div className="flex items-center gap-2 w-full">
										<span className={cn(
											'font-medium flex-1',
											isDark ? 'text-slate-100' : 'text-slate-800'
										)}>
											{translationText}
										</span>
										{isPopular && (
											<span
												className={cn(
													'flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.7rem] font-semibold',
													'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
												)}
											>
												<Star className="w-3 h-3" />
												{popularityCount}
											</span>
										)}
									</div>
								</button>
							</li>
						)
					})}
				</ul>
			</div>

			<div className={cn('h-px', isDark ? 'bg-slate-700' : 'bg-slate-200')} />
		</>
	)
}
