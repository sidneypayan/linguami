import React from 'react'
import { Paper, Box, Typography, Grid } from '@mui/material'
import { CheckRounded } from '@mui/icons-material'
import { toast } from 'sonner'
import { logger } from '@/utils/logger'

/**
 * Goals & Motivation Section
 * Displays daily XP goal selector
 *
 * @param {Object} props
 * @param {boolean} props.isDark - Dark mode flag
 * @param {Object} props.translations - Translation object
 * @param {Object} props.formData - Form data object
 * @param {Function} props.setFormData - Set form data function
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.setLoading - Set loading function
 * @param {Function} props.updateUserProfile - Update user profile Server Action
 */
export const GoalsSection = ({
	isDark,
	translations,
	formData,
	setFormData,
	loading,
	setLoading,
	updateUserProfile,
}) => {
	const goals = [
		{ value: 50, emoji: '🌱', label: translations.goalRelaxed, time: translations.goal5to10min, color: '#10b981' },
		{ value: 100, emoji: '⭐', label: translations.goalRegular, time: translations.goal15to20min, color: '#f59e0b', recommended: true },
		{ value: 200, emoji: '🔥', label: translations.goalMotivated, time: translations.goal30min, color: '#f97316' },
		{ value: 300, emoji: '💪', label: translations.goalIntensive, time: translations.goal45minPlus, color: '#ef4444' },
		{ value: 0, emoji: '🎯', label: translations.goalNone, time: translations.goalAtMyPace, color: '#8b5cf6' },
	]

	const handleGoalClick = async (goalValue) => {
		setFormData({ ...formData, dailyXpGoal: goalValue })
		// Auto-save
		setLoading(true)
		try {
			await updateUserProfile({ daily_xp_goal: goalValue })
			toast.success(translations.updateSuccess)
		} catch (error) {
			logger.error('Error updating goal:', error)
			toast.error(error.message || translations.updateError)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Grid item xs={12} md={6}>
			<Paper
				elevation={0}
				sx={{
					borderRadius: 4,
					overflow: 'hidden',
					height: '100%',
					position: 'relative',
					background: isDark
						? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)'
						: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
					backdropFilter: 'blur(20px)',
					border: '2px solid rgba(245, 87, 108, 0.2)',
					boxShadow: '0 8px 32px rgba(245, 87, 108, 0.15), 0 0 0 1px rgba(245, 87, 108, 0.05) inset',
					transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'radial-gradient(circle at 50% 0%, rgba(245, 87, 108, 0.08) 0%, transparent 50%)',
						pointerEvents: 'none',
						opacity: 0,
						transition: 'opacity 0.4s ease',
					},
					'&:hover': {
						transform: 'translateY(-4px)',
						boxShadow: '0 12px 48px rgba(245, 87, 108, 0.25), 0 0 0 1px rgba(245, 87, 108, 0.3) inset',
						borderColor: 'rgba(245, 87, 108, 0.4)',
						'&::before': {
							opacity: 1,
						},
					},
				}}>
				<Box
					sx={{
						px: 3,
						py: 2.5,
						background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.85) 0%, rgba(190, 24, 93, 0.85) 100%)',
						borderBottom: '1px solid rgba(245, 87, 108, 0.3)',
						position: 'relative',
						'&::after': {
							content: '""',
							position: 'absolute',
							bottom: -1,
							left: '50%',
							transform: 'translateX(-50%)',
							width: '60%',
							height: 2,
							background: 'linear-gradient(90deg, transparent 0%, #f5576c 50%, transparent 100%)',
							boxShadow: '0 0 10px rgba(245, 87, 108, 0.6)',
						},
					}}>
					<Typography
						variant='h6'
						sx={{
							fontWeight: 700,
							background: 'linear-gradient(135deg, #fff 0%, #fda4af 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							fontSize: '1rem',
							textTransform: 'uppercase',
							letterSpacing: '0.1em',
							textAlign: 'center',
							textShadow: '0 0 20px rgba(245, 87, 108, 0.5)',
						}}>
						{translations.goalsAndMotivation}
					</Typography>
				</Box>

				<Box sx={{ p: 2.5 }}>
					<Typography
						variant='body2'
						sx={{
							color: isDark ? '#fda4af' : '#e11d48',
							fontSize: '0.75rem',
							fontWeight: 600,
							textTransform: 'uppercase',
							letterSpacing: '0.08em',
							mb: 2.5,
							textAlign: 'center',
						}}>
						{translations.dailyXpGoal}
					</Typography>

					{/* Goal Cards */}
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
						{goals.map(goal => {
							const isSelected = formData.dailyXpGoal === goal.value
							return (
								<Box
									key={goal.value}
									onClick={() => !loading && handleGoalClick(goal.value)}
									sx={{
										position: 'relative',
										cursor: loading ? 'not-allowed' : 'pointer',
										p: 1.75,
										borderRadius: 2.5,
										background: isSelected
											? `linear-gradient(135deg, ${goal.color}15 0%, ${goal.color}25 100%)`
											: isDark
											? 'linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%)'
											: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(248, 250, 252, 0.6) 100%)',
										border: isSelected ? `2.5px solid ${goal.color}` : `1.5px solid ${goal.color}40`,
										opacity: loading ? 0.6 : 1,
										transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
										boxShadow: isSelected
											? `0 4px 16px ${goal.color}40, 0 0 24px ${goal.color}20`
											: '0 2px 8px rgba(0, 0, 0, 0.1)',
										'&:hover': loading ? {} : {
											transform: 'translateX(4px)',
											boxShadow: `0 6px 24px ${goal.color}50, 0 0 32px ${goal.color}30`,
											borderColor: goal.color,
											background: `linear-gradient(135deg, ${goal.color}20 0%, ${goal.color}30 100%)`,
										},
										'&::before': isSelected ? {
											content: '""',
											position: 'absolute',
											left: 0,
											top: 0,
											bottom: 0,
											width: 4,
											background: `linear-gradient(180deg, ${goal.color} 0%, ${goal.color}dd 100%)`,
											borderRadius: '2.5px 0 0 2.5px',
											boxShadow: `0 0 12px ${goal.color}80`,
										} : {},
									}}>
									{/* Recommended Badge */}
									{goal.recommended && (
										<Box
											sx={{
												position: 'absolute',
												top: -8,
												right: 8,
												bgcolor: goal.color,
												color: 'white',
												px: 1.5,
												py: 0.3,
												borderRadius: 2,
												fontSize: '0.65rem',
												fontWeight: 700,
												textTransform: 'uppercase',
												letterSpacing: '0.05em',
												boxShadow: `0 4px 12px ${goal.color}60`,
											}}>
											{translations.recommended}
										</Box>
									)}

									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
										{/* Emoji Icon */}
										<Box
											sx={{
												fontSize: '2rem',
												lineHeight: 1,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												width: 50,
												height: 50,
												borderRadius: '50%',
												background: `linear-gradient(135deg, ${goal.color}20 0%, ${goal.color}30 100%)`,
												border: `2px solid ${goal.color}50`,
												flexShrink: 0,
												transition: 'transform 0.3s ease',
												transform: isSelected ? 'scale(1.1)' : 'scale(1)',
											}}>
											{goal.emoji}
										</Box>

										{/* Content */}
										<Box sx={{ flex: 1, minWidth: 0 }}>
											<Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
												<Typography
													sx={{
														fontWeight: 700,
														fontSize: '0.95rem',
														color: isSelected ? goal.color : isDark ? '#f1f5f9' : '#2d3748',
														transition: 'color 0.3s ease',
													}}>
													{goal.label}
												</Typography>
												{goal.value > 0 && (
													<Typography
														sx={{
															fontSize: '0.75rem',
															fontWeight: 600,
															color: goal.color,
															opacity: 0.8,
														}}>
														{goal.value} XP
													</Typography>
												)}
											</Box>
											<Typography
												variant='caption'
												sx={{
													color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
													fontSize: '0.7rem',
													display: 'block',
												}}>
												{goal.time}
											</Typography>
										</Box>

										{/* Check Icon */}
										{isSelected && (
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													width: 28,
													height: 28,
													borderRadius: '50%',
													background: goal.color,
													color: 'white',
													boxShadow: `0 4px 12px ${goal.color}60`,
													flexShrink: 0,
												}}>
												<CheckRounded sx={{ fontSize: 18 }} />
											</Box>
										)}
									</Box>
								</Box>
							)
						})}
					</Box>
				</Box>
			</Paper>
		</Grid>
	)
}

export default GoalsSection
