/**
 * Loading state component for flashcards
 */

import { IconButton } from '@mui/material'
import { CloseRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import styles from '@/styles/FlashCards.module.css'

export function LoadingState({ onClose, isDark }) {
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
			<div className={styles.wordsContainer}>
				<p className={styles.statsText}>{t('loading')}</p>
			</div>
		</div>
	)
}
