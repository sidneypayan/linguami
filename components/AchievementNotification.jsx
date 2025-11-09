import { useState, useEffect } from 'react'
import { Box, Typography, Modal, Fade, Backdrop } from '@mui/material'
import { keyframes } from '@mui/system'
import {
	EmojiEventsRounded,
	LocalFireDepartmentRounded,
	StarRounded,
	TrendingUpRounded,
} from '@mui/icons-material'
import useTranslation from 'next-translate/useTranslation'

// Animations
const bounceIn = keyframes`
	0% {
		transform: scale(0.3) translateY(-100px);
		opacity: 0;
	}
	50% {
		transform: scale(1.05);
	}
	70% {
		transform: scale(0.9);
	}
	100% {
		transform: scale(1) translateY(0);
		opacity: 1;
	}
`

const shine = keyframes`
	0% {
		left: -100%;
	}
	100% {
		left: 100%;
	}
`

const float = keyframes`
	0%, 100% {
		transform: translateY(0px);
	}
	50% {
		transform: translateY(-10px);
	}
`

const pulse = keyframes`
	0%, 100% {
		transform: scale(1);
		opacity: 1;
	}
	50% {
		transform: scale(1.05);
		opacity: 0.8;
	}
`

const getAchievementConfig = (type, data, t) => {
	// Level up
	if (type === 'level_up') {
		return {
			icon: <TrendingUpRounded sx={{ fontSize: '4rem' }} />,
			color: '#8b5cf6',
			gradient: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
			title: t('achievement_level_up_title'),
			description: t('achievement_level_up_desc', { level: data.level }),
			emoji: '🎉',
		}
	}

	// Objectif quotidien
	if (type === 'daily_goal_achieved') {
		return {
			icon: <StarRounded sx={{ fontSize: '4rem' }} />,
			color: '#f59e0b',
			gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
			title: t('achievement_daily_goal_title'),
			description: t('achievement_daily_goal_desc', { gold: data.goldEarned }),
			emoji: '⭐',
		}
	}

	// Objectif hebdomadaire
	if (type === 'weekly_goal_achieved') {
		return {
			icon: <EmojiEventsRounded sx={{ fontSize: '4rem' }} />,
			color: '#06b6d4',
			gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
			title: t('achievement_weekly_goal_title'),
			description: t('achievement_weekly_goal_desc', { gold: data.goldEarned }),
			emoji: '🏆',
		}
	}

	// Objectif mensuel
	if (type === 'monthly_goal_achieved') {
		return {
			icon: <EmojiEventsRounded sx={{ fontSize: '4rem' }} />,
			color: '#ec4899',
			gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
			title: t('achievement_monthly_goal_title'),
			description: t('achievement_monthly_goal_desc', { gold: data.goldEarned }),
			emoji: '👑',
		}
	}

	// Streak milestones
	if (type.includes('streak')) {
		const days = data.streak
		return {
			icon: <LocalFireDepartmentRounded sx={{ fontSize: '4rem' }} />,
			color: '#ef4444',
			gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
			title: t('achievement_streak_title'),
			description: t('achievement_streak_desc', { days }),
			emoji: '🔥',
		}
	}

	// Default
	return {
		icon: <StarRounded sx={{ fontSize: '4rem' }} />,
		color: '#8b5cf6',
		gradient: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
		title: t('achievement_title'),
		description: t('achievement_desc'),
		emoji: '✨',
	}
}

const AchievementNotification = ({ achievement, open, onClose }) => {
	const { t } = useTranslation('common')
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		if (open) {
			setIsVisible(true)
			// Auto-close after 4 seconds
			const timer = setTimeout(() => {
				handleClose()
			}, 4000)
			return () => clearTimeout(timer)
		}
	}, [open])

	const handleClose = () => {
		setIsVisible(false)
		setTimeout(() => {
			onClose && onClose()
		}, 300) // Wait for fade out animation
	}

	if (!achievement) return null

	const config = getAchievementConfig(achievement.type, achievement, t)

	return (
		<Modal
			open={isVisible}
			onClose={handleClose}
			closeAfterTransition
			slots={{ backdrop: Backdrop }}
			slotProps={{
				backdrop: {
					sx: {
						backgroundColor: 'rgba(0, 0, 0, 0.8)',
						backdropFilter: 'blur(4px)',
					},
					timeout: 500,
				},
			}}>
			<Fade in={isVisible}>
				<Box
					onClick={handleClose}
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: { xs: '90%', sm: 400 },
						outline: 'none',
					}}>
					<Box
						sx={{
							position: 'relative',
							background: 'linear-gradient(145deg, #1e1b4b 0%, #0f172a 100%)',
							borderRadius: 4,
							p: 4,
							textAlign: 'center',
							overflow: 'hidden',
							border: '3px solid',
							borderColor: config.color,
							boxShadow: `0 0 40px ${config.color}80, 0 20px 60px rgba(0, 0, 0, 0.5)`,
							animation: `${bounceIn} 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
							'&::before': {
								content: '""',
								position: 'absolute',
								top: 0,
								left: '-100%',
								width: '100%',
								height: '100%',
								background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
								animation: `${shine} 2s infinite`,
							},
							'&::after': {
								content: '""',
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								background: `radial-gradient(circle at 50% 0%, ${config.color}30 0%, transparent 70%)`,
								pointerEvents: 'none',
							},
						}}>
						{/* Emoji background */}
						<Typography
							sx={{
								position: 'absolute',
								top: -20,
								right: -20,
								fontSize: '10rem',
								opacity: 0.1,
								animation: `${float} 3s ease-in-out infinite`,
							}}>
							{config.emoji}
						</Typography>

						{/* Icon */}
						<Box
							sx={{
								position: 'relative',
								display: 'inline-flex',
								alignItems: 'center',
								justifyContent: 'center',
								width: 120,
								height: 120,
								borderRadius: '50%',
								background: config.gradient,
								mb: 3,
								boxShadow: `0 8px 32px ${config.color}60`,
								animation: `${pulse} 2s ease-in-out infinite`,
								'&::before': {
									content: '""',
									position: 'absolute',
									inset: -8,
									borderRadius: '50%',
									background: config.gradient,
									opacity: 0.3,
									filter: 'blur(10px)',
								},
							}}>
							<Box sx={{ color: 'white', position: 'relative', zIndex: 1 }}>{config.icon}</Box>
						</Box>

						{/* Title */}
						<Typography
							variant="h4"
							sx={{
								fontWeight: 800,
								mb: 2,
								background: config.gradient,
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								textShadow: `0 0 30px ${config.color}50`,
								position: 'relative',
								zIndex: 1,
							}}>
							{config.title}
						</Typography>

						{/* Description */}
						<Typography
							variant="body1"
							sx={{
								color: '#cbd5e1',
								fontWeight: 600,
								fontSize: '1.1rem',
								position: 'relative',
								zIndex: 1,
							}}>
							{config.description}
						</Typography>

						{/* Tap to close hint */}
						<Typography
							variant="caption"
							sx={{
								display: 'block',
								mt: 3,
								color: '#64748b',
								fontSize: '0.75rem',
								position: 'relative',
								zIndex: 1,
							}}>
							{t('tap_to_close')}
						</Typography>

						{/* Particles effect */}
						{[...Array(6)].map((_, i) => (
							<Box
								key={i}
								sx={{
									position: 'absolute',
									width: 4,
									height: 4,
									borderRadius: '50%',
									background: config.color,
									opacity: 0.6,
									top: `${20 + i * 10}%`,
									left: `${10 + i * 15}%`,
									animation: `${float} ${2 + i * 0.3}s ease-in-out infinite`,
									animationDelay: `${i * 0.2}s`,
								}}
							/>
						))}
					</Box>
				</Box>
			</Fade>
		</Modal>
	)
}

export default AchievementNotification
