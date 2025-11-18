/**
 * Empty state component for words list
 * Shows when user has no saved words in current material
 */

import { Box, Card, Typography, useTheme } from '@mui/material'
import { BookmarkAddRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'

export function EmptyWordsState({ isGuest }) {
	const t = useTranslations('words')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	// Different translations for guests vs logged-in users
	const titleKey = isGuest ? 'guest_no_words_yet_title' : 'no_words_yet_title'
	const descriptionKey = isGuest ? 'guest_no_words_yet_description' : 'no_words_yet_description'
	const tipKey = isGuest ? 'guest_no_words_yet_tip' : 'no_words_yet_tip'

	return (
		<Card
			sx={{
				p: { xs: 3, sm: 4, md: 5 },
				borderRadius: 4,
				boxShadow: '0 8px 40px rgba(139, 92, 246, 0.2)',
				border: '1px solid rgba(139, 92, 246, 0.2)',
				background: isDark
					? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
					: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
				mt: { xs: 2, md: 3 },
			}}>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 3,
				}}>
				{/* Icon */}
				<Box
					sx={{
						width: 80,
						height: 80,
						borderRadius: 4,
						background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
						border: '2px solid rgba(255, 255, 255, 0.5)',
					}}>
					<BookmarkAddRounded sx={{ fontSize: '2.5rem', color: 'white' }} />
				</Box>

				{/* Title */}
				<Typography
					variant="h4"
					align="center"
					sx={{
						fontWeight: 800,
						fontSize: { xs: '1.5rem', sm: '1.75rem' },
						background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 60%, #06b6d4 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
					}}>
					{t(titleKey)}
				</Typography>

				{/* Description */}
				<Typography
					variant="body1"
					align="center"
					sx={{
						color: isDark ? '#cbd5e1' : '#718096',
						fontSize: { xs: '1rem', sm: '1.0625rem' },
						lineHeight: 1.7,
						maxWidth: '500px',
					}}>
					{t(descriptionKey)}
				</Typography>

				{/* Tip box */}
				<Box
					sx={{
						width: '100%',
						maxWidth: '400px',
						p: 3,
						borderRadius: 3,
						background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.08) 100%)',
						border: '1px solid rgba(139, 92, 246, 0.2)',
						backdropFilter: 'blur(10px)',
					}}>
					<Typography
						sx={{
							fontSize: { xs: '0.875rem', sm: '0.9375rem' },
							color: isDark ? '#cbd5e1' : '#4a5568',
							fontWeight: 600,
							textAlign: 'center',
							lineHeight: 1.6,
						}}>
						{isGuest ? t(tipKey) : `💡 ${t(tipKey)}`}
					</Typography>
				</Box>
			</Box>
		</Card>
	)
}
