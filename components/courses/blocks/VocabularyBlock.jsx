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

	// Translate category if it's a known key
	const getTranslatedCategory = (cat) => {
		const categoryKey = `methode_cat_${cat}`
		const translated = t(categoryKey)
		// If translation key doesn't exist, it returns the key itself
		return translated === categoryKey ? cat : translated
	}

	return (
		<div className={cn(
			'relative rounded-lg sm:rounded-2xl border sm:border-2 overflow-hidden',
			isDark
				? 'bg-gradient-to-br from-emerald-950/50 via-slate-900 to-green-950/30 border-emerald-500/30'
				: 'bg-gradient-to-br from-emerald-50 via-white to-green-50 border-emerald-200'
		)}>
			{/* Effet de brillance */}
			<div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />

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
							<div className="mb-2">
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

							{/* Prononciation */}
							{item.pronunciation && (
								<p className={cn(
									'text-sm font-mono mb-2',
									isDark ? 'text-slate-500' : 'text-slate-400'
								)}>
									[{item.pronunciation}]
								</p>
							)}

							{/* Exemple */}
							{item.example && (
								<div className={cn(
									'mt-3 pt-3 border-t',
									isDark ? 'border-slate-700' : 'border-slate-100'
								)}>
									<p className={cn(
										'text-sm sm:text-base italic',
										isDark ? 'text-slate-400' : 'text-slate-500'
									)}>
										{item.example}
									</p>
									{item.exampleTranslation && (
										<p className={cn(
											'text-xs sm:text-sm mt-1',
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
