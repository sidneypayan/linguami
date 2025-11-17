/**
 * No cards state component - shown when no cards are due or no words in dictionary
 */

import { useState } from 'react'
import { IconButton } from '@mui/material'
import { CloseRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import styles from '@/styles/FlashCards.module.css'

export function NoCardsState({ hasWords, onClose, onStartPractice, isDark }) {
	const t = useTranslations('words')
	const [showPracticeOptions, setShowPracticeOptions] = useState(false)
	const [practiceCount, setPracticeCount] = useState(20)

	const closeButtonStyle = {
		position: 'absolute',
		top: '1rem',
		right: '1rem',
		color: isDark ? '#a78bfa' : '#667eea',
		transition: 'all 0.2s ease',
		'&:hover': {
			background: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(102, 126, 234, 0.1)',
			transform: 'rotate(90deg) scale(1.1)',
		},
	}

	return (
		<div className={isDark ? styles.containerDark : styles.container}>
			<IconButton
				onClick={onClose}
				className={styles.closeIcon}
				sx={closeButtonStyle}>
				<CloseRounded sx={{ fontSize: '2rem' }} />
			</IconButton>

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
