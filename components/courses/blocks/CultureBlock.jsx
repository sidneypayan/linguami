import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { Globe, CheckCircle } from 'lucide-react'

/**
 * CultureBlock - Carte du monde culturel
 * Style gaming/fantasy avec comparaisons entre pays
 */
const CultureBlock = ({ block }) => {
	const { isDark } = useThemeMode()

	const { title, content, keyPoints, comparison } = block

	return (
		<div className={cn(
			'relative rounded-lg sm:rounded-2xl border sm:border-2 overflow-hidden',
			isDark
				? 'bg-gradient-to-br from-cyan-950/50 via-slate-900 to-teal-950/30 border-cyan-500/30'
				: 'bg-gradient-to-br from-cyan-50 via-white to-teal-50 border-cyan-200'
		)}>
			{/* Effet de brillance */}
			<div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />

			<div className="relative p-4 sm:p-5 space-y-5">
				{/* Contenu */}
				{content && (
					<div
						className={cn(
							'prose prose-sm max-w-none',
							isDark
								? 'prose-invert text-slate-300'
								: 'text-slate-600'
						)}
						dangerouslySetInnerHTML={{ __html: content }}
					/>
				)}

				{/* Points cles */}
				{keyPoints && keyPoints.length > 0 && (
					<div className="space-y-2">
						{keyPoints.map((point, index) => (
							<div
								key={index}
								className={cn(
									'flex items-start gap-3 p-3 rounded-xl',
									isDark
										? 'bg-slate-800/50'
										: 'bg-white shadow-sm'
								)}
							>
								<div className={cn(
									'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
									'bg-gradient-to-br from-cyan-400 to-teal-500'
								)}>
									<CheckCircle className="w-4 h-4 text-white" />
								</div>
								<p className={cn(
									'text-sm',
									isDark ? 'text-slate-300' : 'text-slate-600'
								)}>
									{point}
								</p>
							</div>
						))}
					</div>
				)}

				{/* Comparaison */}
				{comparison && (
					<div className="grid gap-4 sm:grid-cols-2">
						{/* Format formel/informel (Russie) */}
						{(comparison.formal || comparison.informal) && (
							<div className={cn(
								'p-4 rounded-xl border-l-4 sm:col-span-2',
								isDark
									? 'bg-slate-800/50 border-red-500'
									: 'bg-white border-red-400 shadow-sm'
							)}>
								<div className="flex items-center gap-2 mb-4">
									<svg className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600" viewBox="0 0 100 100">
										<clipPath id="flagClipRu">
											<circle cx="50" cy="50" r="50"/>
										</clipPath>
										<g clipPath="url(#flagClipRu)">
											<rect width="100" height="33.33" y="0" fill="#FFFFFF"/>
											<rect width="100" height="33.34" y="33.33" fill="#0039A6"/>
											<rect width="100" height="33.33" y="66.67" fill="#D52B1E"/>
										</g>
									</svg>
									<h4 className={cn(
										'font-bold',
										isDark ? 'text-white' : 'text-slate-800'
									)}>
										En Russie
									</h4>
								</div>
								<div className="grid gap-3 sm:grid-cols-2">
									{comparison.formal && (
										<div className={cn(
											'p-3 rounded-lg',
											isDark ? 'bg-blue-500/10' : 'bg-blue-50'
										)}>
											<h5 className={cn(
												'font-semibold text-sm mb-1',
												isDark ? 'text-blue-300' : 'text-blue-700'
											)}>
												Formel
											</h5>
											<p className={cn(
												'text-sm',
												isDark ? 'text-slate-300' : 'text-slate-600'
											)}>
												{comparison.formal}
											</p>
										</div>
									)}
									{comparison.informal && (
										<div className={cn(
											'p-3 rounded-lg',
											isDark ? 'bg-red-500/10' : 'bg-red-50'
										)}>
											<h5 className={cn(
												'font-semibold text-sm mb-1',
												isDark ? 'text-red-300' : 'text-red-700'
											)}>
												Informel
											</h5>
											<p className={cn(
												'text-sm',
												isDark ? 'text-slate-300' : 'text-slate-600'
											)}>
												{comparison.informal}
											</p>
										</div>
									)}
								</div>
							</div>
						)}

						{/* Format France/Russie (ancien) */}
						{comparison.fr && (
							<div className={cn(
								'p-4 rounded-xl border-l-4',
								isDark
									? 'bg-blue-500/10 border-blue-500'
									: 'bg-blue-50 border-blue-400'
							)}>
								<div className="flex items-center gap-2 mb-2">
									<svg className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600" viewBox="0 0 100 100">
										<clipPath id="flagClipFr">
											<circle cx="50" cy="50" r="50"/>
										</clipPath>
										<g clipPath="url(#flagClipFr)">
											<rect width="33.33" height="100" x="0" fill="#002395"/>
											<rect width="33.34" height="100" x="33.33" fill="#FFFFFF"/>
											<rect width="33.33" height="100" x="66.67" fill="#ED2939"/>
										</g>
									</svg>
									<h4 className={cn(
										'font-bold',
										isDark ? 'text-blue-300' : 'text-blue-700'
									)}>
										En France
									</h4>
								</div>
								<p className={cn(
									'text-sm',
									isDark ? 'text-slate-300' : 'text-slate-600'
								)}>
									{comparison.fr}
								</p>
							</div>
						)}

						{comparison.ru && (
							<div className={cn(
								'p-4 rounded-xl border-l-4',
								isDark
									? 'bg-red-500/10 border-red-500'
									: 'bg-red-50 border-red-400'
							)}>
								<div className="flex items-center gap-2 mb-2">
									<span className="text-2xl">🇷🇺</span>
									<h4 className={cn(
										'font-bold',
										isDark ? 'text-red-300' : 'text-red-700'
									)}>
										En Russie
									</h4>
								</div>
								<p className={cn(
									'text-sm',
									isDark ? 'text-slate-300' : 'text-slate-600'
								)}>
									{comparison.ru}
								</p>
							</div>
						)}

						{comparison.other && (
							<div className={cn(
								'p-4 rounded-xl border-l-4',
								isDark
									? 'bg-slate-500/10 border-slate-500'
									: 'bg-slate-50 border-slate-400'
							)}>
								<div className="flex items-center gap-2 mb-2">
									<span className="text-2xl">🌍</span>
									<h4 className={cn(
										'font-bold',
										isDark ? 'text-slate-300' : 'text-slate-700'
									)}>
										Ailleurs
									</h4>
								</div>
								<p className={cn(
									'text-sm',
									isDark ? 'text-slate-300' : 'text-slate-600'
								)}>
									{comparison.other}
								</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default CultureBlock
