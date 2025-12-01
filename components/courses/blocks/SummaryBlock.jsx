import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Trophy, Sparkles } from 'lucide-react'

/**
 * SummaryBlock - Coffre aux tresors des phrases cles
 * Style gaming/fantasy avec effet de recompense
 */
const SummaryBlock = ({ block }) => {
	const { isDark } = useThemeMode()

	const { title, keyPhrases } = block

	return (
		<div className={cn(
			'relative rounded-lg sm:rounded-2xl border sm:border-2 overflow-hidden',
			isDark
				? 'bg-gradient-to-br from-green-950/50 via-slate-900 to-emerald-950/30 border-green-500/30'
				: 'bg-gradient-to-br from-green-50 via-white to-emerald-50 border-green-200'
		)}>
			{/* Effets de brillance */}
			<div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />
			<div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />

			{/* Phrases cles */}
			<div className="relative p-4 sm:p-5">
				<div className="space-y-3">
					{keyPhrases?.map((phrase, index) => (
						<div
							key={index}
							className={cn(
								'p-4 rounded-xl border-l-4 transition-all duration-200',
								isDark
									? 'bg-slate-800/50 border-green-500 hover:bg-slate-800'
									: 'bg-white border-green-400 hover:shadow-md shadow-sm'
							)}
						>
							<div className="flex items-start gap-3">
								{/* Indicateur de succes */}
								<div className={cn(
									'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
									'bg-gradient-to-br from-green-400 to-emerald-500 shadow-sm'
								)}>
									<CheckCircle className="w-4 h-4 text-white" />
								</div>

								<div className="flex-1 min-w-0">
									{/* Phrase en langue cible */}
									<p className={cn(
										'font-bold text-lg mb-1',
										isDark ? 'text-white' : 'text-slate-900'
									)}>
										{phrase.fr}
									</p>

									{/* Traduction */}
									<p className={cn(
										'font-medium',
										isDark ? 'text-green-400' : 'text-green-600'
									)}>
										{phrase.ru}
									</p>

									{/* Contexte */}
									{phrase.context && (
										<p className={cn(
											'text-sm sm:text-base italic mt-2',
											isDark ? 'text-slate-500' : 'text-slate-400'
										)}>
											{phrase.context}
										</p>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default SummaryBlock
