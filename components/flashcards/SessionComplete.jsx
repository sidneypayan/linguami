/**
 * Session complete component - shown when all cards are reviewed
 */

import { IconButton } from '@mui/material'
import { CloseRounded, CelebrationRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import styles from '@/styles/FlashCards.module.css'

export function SessionComplete({ reviewedCount, sessionDuration, onClose, isDark }) {
	const t = useTranslations('words')

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

			<h3 className={styles.flashcardsTitle}>
				<CelebrationRounded sx={{ fontSize: '2.5rem', mb: 1, color: '#667eea' }} />
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
