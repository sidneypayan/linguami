/**
 * Word card component
 * Displays a single saved word with source + translation
 */

import { Box, Card, IconButton, Typography, Chip, useTheme } from '@mui/material'
import { DeleteRounded } from '@mui/icons-material'
import { getWordDisplay } from '@/utils/wordMapping'

export function WordCard({ word, onDelete, userLearningLanguage, locale }) {
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const { sourceWord, translation } = getWordDisplay(word, userLearningLanguage, locale)

	return (
		<Card
			sx={{
				p: { xs: 2, sm: 2.5 },
				borderRadius: 4,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: { xs: 1.5, sm: 2 },
				background: isDark
					? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
					: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
				border: '1px solid rgba(139, 92, 246, 0.2)',
				boxShadow: '0 4px 20px rgba(139, 92, 246, 0.15)',
				transition: 'opacity 0.2s ease',
				'&:hover': {
					'& .delete-btn': {
						opacity: 1,
					},
				},
			}}>
			{/* Word content */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					flexWrap: 'wrap',
					gap: { xs: 1, sm: 1.5 },
					flex: 1,
					minWidth: 0,
				}}>
				{/* Source word chip */}
				<Chip
					label={sourceWord || '—'}
					sx={{
						fontWeight: 700,
						fontSize: { xs: '0.875rem', sm: '0.9375rem' },
						background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
						color: '#8b5cf6',
						border: '1px solid rgba(139, 92, 246, 0.3)',
						px: { xs: 1.25, sm: 1.5 },
						backdropFilter: 'blur(10px)',
						height: 'auto',
						'& .MuiChip-label': {
							whiteSpace: 'nowrap',
							padding: '8px 0',
						},
					}}
				/>

				{/* Arrow and translation */}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: { xs: 1, sm: 1.5 },
					}}>
					<Typography
						sx={{
							fontSize: { xs: '0.8125rem', sm: '0.9375rem' },
							color: isDark ? '#94a3b8' : '#718096',
							fontWeight: 500,
							flexShrink: 0,
						}}>
						→
					</Typography>
					<Typography
						sx={{
							fontSize: { xs: '0.875rem', sm: '0.9375rem' },
							color: isDark ? '#f1f5f9' : '#4a5568',
							fontWeight: 500,
							whiteSpace: 'nowrap',
						}}>
						{translation || '—'}
					</Typography>
				</Box>
			</Box>

			{/* Delete button */}
			<IconButton
				className="delete-btn"
				onClick={() => onDelete(word.id)}
				sx={{
					opacity: { xs: 1, md: 0 },
					transition: 'all 0.3s ease',
					color: '#ef4444',
					'&:hover': {
						background: 'rgba(239, 68, 68, 0.1)',
						transform: 'scale(1.1)',
					},
				}}>
				<DeleteRounded />
			</IconButton>
		</Card>
	)
}
