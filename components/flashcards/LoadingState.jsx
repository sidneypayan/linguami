/**
 * Loading state component for flashcards
 */

import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import styles from '@/styles/FlashCards.module.css'

export function LoadingState({ onClose, isDark }) {
	const t = useTranslations('words')

	return (
		<div className={isDark ? styles.containerDark : styles.container}>
			<button
				onClick={onClose}
				className={cn(
					"absolute top-4 right-4 z-50 p-2 rounded-lg transition-all duration-200",
					isDark
						? "text-violet-400 hover:bg-violet-500/20"
						: "text-violet-600 hover:bg-violet-500/10",
					"hover:rotate-90 hover:scale-110"
				)}
			>
				<X className="w-8 h-8" />
			</button>
			<div className={styles.wordsContainer}>
				<p className={styles.statsText}>{t('loading')}</p>
			</div>
		</div>
	)
}
