/**
 * Session configuration modal - allows user to configure flashcard session
 * before starting: choose number of cards or time duration
 */

import { useState } from 'react'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	ToggleButton,
	ToggleButtonGroup,
	Box,
	Typography,
	useTheme,
} from '@mui/material'
import {
	StyleRounded,
	TimerRounded,
	FlashOnRounded,
	CloseRounded,
} from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { SESSION_MODE } from '@/context/flashcards'

const CARDS_OPTIONS = [10, 20, 30, 50, 100]
const TIME_OPTIONS = [3, 5, 10, 15, 20] // in minutes

export function SessionConfigModal({ open, onClose, onStart, totalWords = 0 }) {
	const t = useTranslations('words')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	const [mode, setMode] = useState(SESSION_MODE.CARDS)
	const [cardsLimit, setCardsLimit] = useState(20)
	const [timeLimit, setTimeLimit] = useState(5)

	const handleModeChange = (event, newMode) => {
		if (newMode !== null) {
			setMode(newMode)
		}
	}

	const handleStart = () => {
		onStart({
			mode,
			cardsLimit: mode === SESSION_MODE.CARDS ? cardsLimit : 9999,
			timeLimit: mode === SESSION_MODE.TIME ? timeLimit : null,
		})
		onClose()
	}

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 4,
					background: isDark
						? 'linear-gradient(145deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)'
						: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
					border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.2)',
					boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.25)',
				},
			}}
		>
			<DialogTitle
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					pb: 1,
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
					<FlashOnRounded sx={{ color: '#8b5cf6', fontSize: '1.75rem' }} />
					<Typography
						variant="h5"
						sx={{
							fontWeight: 700,
							background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
						}}
					>
						{t('session_config_title')}
					</Typography>
				</Box>
				<Button
					onClick={onClose}
					sx={{ minWidth: 'auto', p: 1, color: isDark ? '#94a3b8' : '#64748b' }}
				>
					<CloseRounded />
				</Button>
			</DialogTitle>

			<DialogContent sx={{ pt: 2 }}>
				<Typography
					variant="subtitle2"
					sx={{
						mb: 1.5,
						color: isDark ? '#94a3b8' : '#64748b',
						fontWeight: 600,
					}}
				>
					{t('session_mode_label')}
				</Typography>

				<ToggleButtonGroup
					value={mode}
					exclusive
					onChange={handleModeChange}
					fullWidth
					sx={{
						mb: 3,
						'& .MuiToggleButton-root': {
							py: 1.5,
							border: '1px solid rgba(139, 92, 246, 0.2)',
							fontWeight: 600,
							textTransform: 'none',
							gap: 1,
							'&.Mui-selected': {
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 182, 212, 0.8) 100%)',
								color: 'white',
								borderColor: 'rgba(139, 92, 246, 0.6)',
								'&:hover': {
									background: 'linear-gradient(135deg, rgba(139, 92, 246, 1) 0%, rgba(6, 182, 212, 0.9) 100%)',
								},
							},
						},
					}}
				>
					<ToggleButton value={SESSION_MODE.CARDS}>
						<StyleRounded />
						{t('session_mode_cards')}
					</ToggleButton>
					<ToggleButton value={SESSION_MODE.TIME}>
						<TimerRounded />
						{t('session_mode_time')}
					</ToggleButton>
				</ToggleButtonGroup>

				{mode === SESSION_MODE.CARDS && (
					<Box>
						<Typography
							variant="subtitle2"
							sx={{
								mb: 1.5,
								color: isDark ? '#94a3b8' : '#64748b',
								fontWeight: 600,
							}}
						>
							{t('session_cards_count')}
						</Typography>

						<ToggleButtonGroup
							value={cardsLimit}
							exclusive
							onChange={(e, val) => val !== null && setCardsLimit(val)}
							fullWidth
							sx={{
								flexWrap: 'wrap',
								gap: 1,
								'& .MuiToggleButton-root': {
									flex: '1 1 auto',
									minWidth: '60px',
									py: 1.5,
									border: '1px solid rgba(139, 92, 246, 0.2)',
									borderRadius: '12px !important',
									fontWeight: 700,
									fontSize: '1rem',
									'&.Mui-selected': {
										background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 182, 212, 0.8) 100%)',
										color: 'white',
										borderColor: 'rgba(139, 92, 246, 0.6)',
									},
								},
							}}
						>
							{CARDS_OPTIONS.map((count) => (
								<ToggleButton key={count} value={count} disabled={count > totalWords}>
									{count}
								</ToggleButton>
							))}
						</ToggleButtonGroup>

						{totalWords > 0 && (
							<Typography
								variant="caption"
								sx={{
									display: 'block',
									mt: 1.5,
									color: isDark ? '#64748b' : '#94a3b8',
									textAlign: 'center',
								}}
							>
								{t('session_available_words', { count: totalWords })}
							</Typography>
						)}
					</Box>
				)}

				{mode === SESSION_MODE.TIME && (
					<Box>
						<Typography
							variant="subtitle2"
							sx={{
								mb: 1.5,
								color: isDark ? '#94a3b8' : '#64748b',
								fontWeight: 600,
							}}
						>
							{t('session_time_duration')}
						</Typography>

						<ToggleButtonGroup
							value={timeLimit}
							exclusive
							onChange={(e, val) => val !== null && setTimeLimit(val)}
							fullWidth
							sx={{
								flexWrap: 'wrap',
								gap: 1,
								'& .MuiToggleButton-root': {
									flex: '1 1 auto',
									minWidth: '70px',
									py: 1.5,
									border: '1px solid rgba(139, 92, 246, 0.2)',
									borderRadius: '12px !important',
									fontWeight: 700,
									fontSize: '1rem',
									'&.Mui-selected': {
										background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 182, 212, 0.8) 100%)',
										color: 'white',
										borderColor: 'rgba(139, 92, 246, 0.6)',
									},
								},
							}}
						>
							{TIME_OPTIONS.map((minutes) => (
								<ToggleButton key={minutes} value={minutes}>
									{minutes} min
								</ToggleButton>
							))}
						</ToggleButtonGroup>

						<Typography
							variant="caption"
							sx={{
								display: 'block',
								mt: 1.5,
								color: isDark ? '#64748b' : '#94a3b8',
								textAlign: 'center',
							}}
						>
							{t('session_time_hint')}
						</Typography>
					</Box>
				)}
			</DialogContent>

			<DialogActions sx={{ p: 3, pt: 2 }}>
				<Button
					onClick={onClose}
					sx={{
						color: isDark ? '#94a3b8' : '#64748b',
						fontWeight: 600,
						textTransform: 'none',
					}}
				>
					{t('session_cancel')}
				</Button>
				<Button
					variant="contained"
					onClick={handleStart}
					disabled={mode === SESSION_MODE.CARDS && totalWords === 0}
					startIcon={<FlashOnRounded />}
					sx={{
						px: 3,
						py: 1,
						borderRadius: 2,
						background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
						fontWeight: 700,
						textTransform: 'none',
						boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
						'&:hover': {
							background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
							boxShadow: '0 6px 20px rgba(139, 92, 246, 0.5)',
						},
						'&:disabled': {
							background: isDark ? 'rgba(100, 116, 139, 0.3)' : 'rgba(148, 163, 184, 0.3)',
							color: isDark ? '#64748b' : '#94a3b8',
						},
					}}
				>
					{t('session_start')}
				</Button>
			</DialogActions>
		</Dialog>
	)
}
