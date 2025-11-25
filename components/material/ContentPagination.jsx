'use client'

import { Box, IconButton, Typography, useTheme } from '@mui/material'
import {
	ChevronLeft,
	ChevronRight,
	FirstPage,
	LastPage,
} from '@mui/icons-material'
import { useTranslations } from 'next-intl'

/**
 * Pagination controls for book chapter content
 */
const ContentPagination = ({
	currentPage,
	totalPages,
	onPrevPage,
	onNextPage,
	onGoToFirst,
	onGoToLast,
	hasPrevPage,
	hasNextPage,
}) => {
	const t = useTranslations('materials')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	if (totalPages <= 1) return null

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: { xs: 0.5, sm: 1 },
				py: 2,
				px: 2,
				borderRadius: 3,
				background: isDark
					? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)'
					: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
				border: isDark
					? '1px solid rgba(139, 92, 246, 0.3)'
					: '1px solid rgba(139, 92, 246, 0.2)',
				boxShadow: isDark
					? '0 4px 20px rgba(0, 0, 0, 0.3)'
					: '0 4px 20px rgba(139, 92, 246, 0.15)',
			}}>
			{/* First Page */}
			<IconButton
				onClick={onGoToFirst}
				disabled={!hasPrevPage}
				sx={{
					color: hasPrevPage ? '#8b5cf6' : 'text.disabled',
					transition: 'all 0.2s ease',
					'&:hover:not(:disabled)': {
						background: 'rgba(139, 92, 246, 0.1)',
						transform: 'scale(1.1)',
					},
					'&:disabled': {
						opacity: 0.3,
					},
				}}>
				<FirstPage />
			</IconButton>

			{/* Previous Page */}
			<IconButton
				onClick={onPrevPage}
				disabled={!hasPrevPage}
				sx={{
					color: hasPrevPage ? '#8b5cf6' : 'text.disabled',
					transition: 'all 0.2s ease',
					'&:hover:not(:disabled)': {
						background: 'rgba(139, 92, 246, 0.1)',
						transform: 'scale(1.1)',
					},
					'&:disabled': {
						opacity: 0.3,
					},
				}}>
				<ChevronLeft />
			</IconButton>

			{/* Page indicator */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 1,
					px: { xs: 1.5, sm: 3 },
					py: 0.75,
					borderRadius: 2,
					background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
					border: '1px solid rgba(139, 92, 246, 0.2)',
				}}>
				<Typography
					sx={{
						fontWeight: 700,
						fontSize: { xs: '0.9rem', sm: '1rem' },
						color: '#8b5cf6',
					}}>
					{currentPage}
				</Typography>
				<Typography
					sx={{
						color: isDark ? '#94a3b8' : '#64748b',
						fontSize: { xs: '0.85rem', sm: '0.95rem' },
					}}>
					/
				</Typography>
				<Typography
					sx={{
						fontWeight: 600,
						fontSize: { xs: '0.9rem', sm: '1rem' },
						color: isDark ? '#cbd5e1' : '#475569',
					}}>
					{totalPages}
				</Typography>
			</Box>

			{/* Next Page */}
			<IconButton
				onClick={onNextPage}
				disabled={!hasNextPage}
				sx={{
					color: hasNextPage ? '#8b5cf6' : 'text.disabled',
					transition: 'all 0.2s ease',
					'&:hover:not(:disabled)': {
						background: 'rgba(139, 92, 246, 0.1)',
						transform: 'scale(1.1)',
					},
					'&:disabled': {
						opacity: 0.3,
					},
				}}>
				<ChevronRight />
			</IconButton>

			{/* Last Page */}
			<IconButton
				onClick={onGoToLast}
				disabled={!hasNextPage}
				sx={{
					color: hasNextPage ? '#8b5cf6' : 'text.disabled',
					transition: 'all 0.2s ease',
					'&:hover:not(:disabled)': {
						background: 'rgba(139, 92, 246, 0.1)',
						transform: 'scale(1.1)',
					},
					'&:disabled': {
						opacity: 0.3,
					},
				}}>
				<LastPage />
			</IconButton>
		</Box>
	)
}

export default ContentPagination
