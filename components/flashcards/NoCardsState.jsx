/**
 * No cards state component - shown when no cards are due or no words in dictionary
 */

import { useState } from 'react'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import styles from '@/styles/FlashCards.module.css'

export function NoCardsState({ hasWords, onClose, onStartPractice, isDark }) {
	const t = useTranslations('words')
	const [showPracticeOptions, setShowPracticeOptions] = useState(false)
	const [practiceCount, setPracticeCount] = useState(20)

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
				{!hasWords ? (
					// No words in dictionary at all
					<>
						<p className={styles.statsText}>{t('no_words_in_dictionary')}</p>
						<p>{t('add_words_to_review')}</p>
						<button onClick={onClose} className={styles.closeBtn}>
							{t('close_btn')}
						</button>
					</>
				) : (
					// Has words but no cards due
					<>
						<p className={styles.statsText}>{t('no_cards_due')}</p>

						{!showPracticeOptions ? (
							<div className={styles.buttonsGroup}>
								<button
									onClick={() => setShowPracticeOptions(true)}
									className={styles.practiceBtn}>
									{t('practice_anyway')}
								</button>
								<button onClick={onClose} className={styles.closeBtn}>
									{t('close_btn')}
								</button>
							</div>
						) : (
							<>
								<p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
									{t('choose_cards_count')}
								</p>
								<div className={styles.limitOptions} style={{ marginBottom: '1.5rem' }}>
									{[10, 20, 30, 50].map(count => (
										<button
											key={count}
											className={`${styles.limitOption} ${practiceCount === count ? styles.limitOptionActive : ''}`}
											onClick={() => setPracticeCount(count)}>
											{count}
										</button>
									))}
								</div>
								<div className={styles.buttonsGroup}>
									<button
										onClick={() => onStartPractice(practiceCount)}
										className={styles.practiceBtn}>
										{t('start_practice')}
									</button>
									<button
										onClick={() => setShowPracticeOptions(false)}
										className={styles.closeBtn}>
										{t('close_btn')}
									</button>
								</div>
							</>
						)}
					</>
				)}
			</div>
		</div>
	)
}
