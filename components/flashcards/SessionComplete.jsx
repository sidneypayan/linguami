/**
 * Session complete component - shown when all cards are reviewed
 */

import { X, PartyPopper } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import styles from '@/styles/FlashCards.module.css'

export function SessionComplete({ reviewedCount, sessionDuration, onClose, isDark }) {
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

			<h3 className={styles.flashcardsTitle}>
				<PartyPopper className="w-10 h-10 mb-2 text-violet-600" />
				<br />
				{t('session_congrats')}
			</h3>

			<div className={styles.wordsContainer}>
				<div className={styles.statsContainer}>
					<p className={styles.statsText}>
						{t('session_complete')}
					</p>
					{reviewedCount > 0 && (
						<div className={styles.sessionStats}>
							<p>
								<strong>{reviewedCount}</strong>{' '}
								{reviewedCount > 1 ? t('cards_reviewed_plural') : t('cards_reviewed')}
							</p>
							{sessionDuration > 0 && (
								<p>
									<strong>{sessionDuration}</strong>{' '}
									{sessionDuration > 1 ? t('session_duration_plural') : t('session_duration')}
								</p>
							)}
						</div>
					)}
				</div>
				<button onClick={onClose} className={styles.closeBtn}>
					{t('close_btn')}
				</button>
			</div>
		</div>
	)
}
