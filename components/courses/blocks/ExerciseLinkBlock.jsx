import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { Trophy, ChevronRight, Dumbbell } from 'lucide-react'

/**
 * ExerciseLinkBlock - Affiche un lien vers un exercice externe (drag-and-drop, MCQ, etc.)
 */
const ExerciseLinkBlock = ({ block }) => {
	const locale = useLocale()
	const { isDark } = useThemeMode()

	const exerciseIds = block.exerciseIds || []
	const title = block.title || 'Exercice'
	const description = block.description || ''

	// Si plusieurs exercices, on prend le premier (on pourrait aussi afficher plusieurs liens)
	const firstExerciseId = exerciseIds[0]

	if (!firstExerciseId) {
		return null
	}

	return (
		<div className="mb-6">
			<Link
				href={`/${locale}/materials/exercises/${firstExerciseId}`}
				className={cn(
					'group relative block overflow-hidden rounded-2xl border-2 transition-all duration-300',
					'hover:scale-[1.02] hover:shadow-xl',
					isDark
						? 'bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 border-orange-500/30 hover:border-orange-400/50'
						: 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 border-orange-300 hover:border-orange-400'
				)}
			>
				{/* Glow effect on hover */}
				<div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-400/10 to-orange-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

				<div className="relative p-6">
					<div className="flex items-start gap-4">
						{/* Icon avec animation */}
						<div className={cn(
							'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0',
							'bg-gradient-to-br from-orange-400 to-red-500 shadow-lg',
							'group-hover:scale-110 transition-transform duration-300'
						)}>
							<Trophy className="w-7 h-7 text-white" />
						</div>

						<div className="flex-1 min-w-0">
							{/* Title */}
							<div className="flex items-center gap-2 mb-2">
								<Dumbbell className={cn(
									'w-5 h-5 flex-shrink-0',
									isDark ? 'text-orange-400' : 'text-orange-600'
								)} />
								<h3 className={cn(
									'text-lg font-bold',
									isDark ? 'text-orange-300' : 'text-orange-700'
								)}>
									{title}
								</h3>
							</div>

							{/* Description */}
							{description && (
								<p className={cn(
									'text-sm mb-3',
									isDark ? 'text-slate-300' : 'text-slate-600'
								)}>
									{description}
								</p>
							)}

							{/* CTA Button */}
							<div className={cn(
								'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm',
								'bg-gradient-to-r from-orange-500 to-red-500 text-white',
								'group-hover:from-orange-600 group-hover:to-red-600',
								'transition-all duration-300',
								'shadow-md group-hover:shadow-lg'
							)}>
								<span>Commencer l&apos;exercice</span>
								<ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
							</div>
						</div>
					</div>

					{/* Multiple exercises indicator */}
					{exerciseIds.length > 1 && (
						<div className={cn(
							'mt-4 pt-4 border-t',
							isDark ? 'border-orange-500/20' : 'border-orange-200'
						)}>
							<p className={cn(
								'text-xs font-medium',
								isDark ? 'text-slate-400' : 'text-slate-500'
							)}>
								+ {exerciseIds.length - 1} autre{exerciseIds.length - 1 > 1 ? 's' : ''} exercice{exerciseIds.length - 1 > 1 ? 's' : ''}
							</p>
						</div>
					)}
				</div>
			</Link>
		</div>
	)
}

export default ExerciseLinkBlock
