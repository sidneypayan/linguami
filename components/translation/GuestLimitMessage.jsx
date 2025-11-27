/**
 * Guest limit message component
 * Shows appropriate message for guests based on dictionary limit
 */

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

export function GuestLimitMessage({ hasReachedLimit }) {
	const t = useTranslations('words')
	const { isDark } = useThemeMode()

	return (
		<div className="p-4 bg-violet-500/5">
			{hasReachedLimit ? (
				<>
					<p className="block mb-3 text-xs font-semibold text-rose-500">
						{t('dictionary_limit_title')} : supprimez des mots pour en ajouter de nouveaux
					</p>
					<Link href="/signup">
						<button
							className={cn(
								'w-full py-2 px-4 rounded-lg',
								'bg-gradient-to-r from-pink-500 to-rose-500',
								'text-white font-semibold text-sm',
								'transition-all duration-200',
								'hover:from-pink-600 hover:to-rose-600'
							)}
						>
							{t('noaccount')}
						</button>
					</Link>
				</>
			) : (
				<p className={cn(
					'text-xs font-semibold text-center',
					isDark ? 'text-slate-300' : 'text-slate-600'
				)}>
					{t('click_translation_to_add')}
				</p>
			)}
		</div>
	)
}
