import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Star, Sparkles } from 'lucide-react'

/**
 * VocabularyBlock - Tresor de vocabulaire
 * Style gaming/fantasy avec cartes de collection
 */
const VocabularyBlock = ({ block }) => {
	const t = useTranslations('common')
	const { isDark } = useThemeMode()

	const { title, words, category } = block

	return (
		<div className={cn(
			'relative rounded-2xl border-2 overflow-hidden',
			isDark
				? 'bg-gradient-to-br from-emerald-950/50 via-slate-900 to-green-950/30 border-emerald-500/30'
				: 'bg-gradient-to-br from-emerald-50 via-white to-green-50 border-emerald-200'
		)}>
			{/* Effet de brillance */}
			<div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />

			{/* Header */}
			<div className={cn(
				'relative p-4 sm:p-5 border-b',
				isDark ? 'border-emerald-500/20' : 'border-emerald-200'
			)}>
				<div className="flex items-center gap-4">
					<div className={cn(
						'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg',
						'bg-gradient-to-br from-emerald-400 to-green-500'
					)}>
						<Star className="w-6 h-6 text-white" />
					</div>

					<div className="flex-1">
						<h3 className={cn(
							'text-lg sm:text-xl font-bold',
							isDark ? 'text-emerald-300' : 'text-emerald-700'
						)}>
							{title}
						</h3>
						{category && (
							<Badge variant="outline" className={cn(
								'mt-1',
								isDark
									? 'border-emerald-500/30 text-emerald-400'
									: 'border-emerald-300 text-emerald-700'
							)}>
								{t('methode_category')} : {category}
							</Badge>
						)}
					</div>

					<Badge className={cn(
						'font-bold',
						'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0'
					)}>
						<Sparkles className="w-3 h-3 mr-1" />
						{words?.length || 0} {t('methode_words')}
					</Badge>
				</div>
			</div>

			{/* Liste des mots */}
			<div className="relative p-4 sm:p-5">
				<div className="grid gap-3 sm:grid-cols-2">
					{words?.map((item, index) => (
						<div
							key={index}
							className={cn(
								'p-4 rounded-xl border transition-all duration-200',
								isDark
									? 'bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800'
									: 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md'
							)}
						>
							{/* Mot et traduction */}
							<div className="flex items-start gap-2 mb-2">
								<div className={cn(
									'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold',
									'bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-sm'
								)}>
									{index + 1}
								</div>
								<div className="flex-1 min-w-0">
									<p className={cn(
										'font-bold text-lg',
										isDark ? 'text-emerald-300' : 'text-emerald-700'
									)}>
										{item.word}
									</p>
									<p className={cn(
										'font-medium',
										isDark ? 'text-slate-300' : 'text-slate-600'
									)}>
										→ {item.translation}
									</p>
								</div>
							</div>

							{/* Prononciation */}
							{item.pronunciation && (
								<p className={cn(
									'text-sm font-mono mb-2 pl-10',
									isDark ? 'text-slate-500' : 'text-slate-400'
								)}>
									[{item.pronunciation}]
								</p>
							)}

							{/* Exemple */}
							{item.example && (
								<div className={cn(
									'mt-3 pt-3 border-t pl-10',
									isDark ? 'border-slate-700' : 'border-slate-100'
								)}>
									<p className={cn(
										'text-sm italic',
										isDark ? 'text-slate-400' : 'text-slate-500'
									)}>
										{item.example}
									</p>
									{item.exampleTranslation && (
										<p className={cn(
											'text-xs mt-1',
											isDark ? 'text-slate-500' : 'text-slate-400'
										)}>
											{item.exampleTranslation}
										</p>
									)}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default VocabularyBlock
