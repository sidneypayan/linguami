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

			{/* Header */}
			<div className={cn(
				'relative p-4 sm:p-5 border-b',
				isDark ? 'border-cyan-500/20' : 'border-cyan-200'
			)}>
				<div className="flex items-center gap-3 sm:gap-4">
					<div className={cn(
						'w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg',
						'bg-gradient-to-br from-cyan-400 to-teal-500'
					)}>
						<Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
					</div>

					<h3 className={cn(
						'text-lg sm:text-xl font-bold',
						isDark ? 'text-cyan-300' : 'text-cyan-700'
					)}>
						{title}
					</h3>
				</div>
			</div>

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
						{comparison.fr && (
							<div className={cn(
								'p-4 rounded-xl border-l-4',
								isDark
									? 'bg-blue-500/10 border-blue-500'
									: 'bg-blue-50 border-blue-400'
							)}>
								<div className="flex items-center gap-2 mb-2">
									<span className="text-xl">🇫🇷</span>
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
									<span className="text-xl">🇷🇺</span>
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
					</div>
				)}
			</div>
		</div>
	)
}

export default CultureBlock
