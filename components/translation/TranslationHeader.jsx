/**
 * Translation popup header component
 * Displays title and close button
 */

import { Languages, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

export function TranslationHeader({ onClose }) {
	const t = useTranslations('words')

	return (
		<div
			className={cn(
				'bg-gradient-to-r from-violet-500 to-purple-600',
				'p-4 flex items-center justify-between'
			)}
		>
			<div className="flex items-center gap-2">
				<Languages className="w-5 h-5 text-white" />
				<span className="text-white font-bold">
					{t('translation')}
				</span>
			</div>
			<button
				onClick={onClose}
				className={cn(
					'p-1.5 rounded-lg text-white',
					'hover:bg-white/20 transition-colors'
				)}
			>
				<X className="w-5 h-5" />
			</button>
		</div>
	)
}
