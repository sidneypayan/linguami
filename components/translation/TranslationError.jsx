/**
 * Translation error display component
 * Shows different error states (translation limit, general errors)
 */

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

export function TranslationError({ error, word, isTranslationLimitError }) {
	const t = useTranslations('words')
	const { isDark } = useThemeMode()

	if (isTranslationLimitError) {
		return (
			<div className="p-6 text-center">
				<h6 className="font-semibold text-lg mb-4 text-rose-500">
					{t('translation_limit_title')}
				</h6>
				<p className={cn(
					'mb-6 text-sm',
					isDark ? 'text-slate-300' : 'text-slate-600'
				)}>
					{t('translation_limit_message')}
				</p>
				<Link href="/signup">
					<button
						className={cn(
							'w-full py-3 px-4 rounded-xl',
							'bg-gradient-to-r from-violet-500 to-purple-600',
							'text-white font-semibold',
							'transition-all duration-200',
							'hover:from-violet-600 hover:to-purple-700'
						)}
					>
						{t('noaccount')}
					</button>
				</Link>
			</div>
		)
	}

	return (
		<div className="p-6">
			<h6 className={cn(
				'font-semibold text-lg mb-4',
				isDark ? 'text-slate-100' : 'text-slate-800'
			)}>
				{word}
			</h6>
			<p className="text-sm text-red-500">
				{error}
			</p>
		</div>
	)
}
