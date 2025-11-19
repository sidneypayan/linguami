import React from 'react'
import { Paper, Box, Typography, Grid, FormControlLabel, Switch } from '@mui/material'

/**
 * Notifications Section
 * Displays notification preferences with toggles
 *
 * @param {Object} props
 * @param {boolean} props.isDark - Dark mode flag
 * @param {Object} props.translations - Translation object
 * @param {Object} props.formData - Form data object
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.handleToggle - Toggle handler (field) => (event) => void
 */
export const NotificationsSection = ({
	isDark,
	translations,
	formData,
	loading,
	handleToggle,
}) => {
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
					border: '2px solid rgba(251, 146, 60, 0.2)',
					boxShadow: '0 8px 32px rgba(251, 146, 60, 0.15), 0 0 0 1px rgba(251, 146, 60, 0.05) inset',
					transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'radial-gradient(circle at 50% 0%, rgba(251, 146, 60, 0.08) 0%, transparent 50%)',
						pointerEvents: 'none',
						opacity: 0,
						transition: 'opacity 0.4s ease',
					},
					'&:hover': {
						transform: 'translateY(-4px)',
						boxShadow: '0 12px 48px rgba(251, 146, 60, 0.25), 0 0 0 1px rgba(251, 146, 60, 0.3) inset',
						borderColor: 'rgba(251, 146, 60, 0.4)',
						'&::before': {
							opacity: 1,
						},
					},
				}}>
				<Box
					sx={{
						px: 3,
						py: 2.5,
						background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.85) 0%, rgba(194, 65, 12, 0.85) 100%)',
						borderBottom: '1px solid rgba(251, 146, 60, 0.3)',
						position: 'relative',
						'&::after': {
							content: '""',
							position: 'absolute',
							bottom: -1,
							left: '50%',
							transform: 'translateX(-50%)',
							width: '60%',
							height: 2,
							background: 'linear-gradient(90deg, transparent 0%, #fb923c 50%, transparent 100%)',
							boxShadow: '0 0 10px rgba(251, 146, 60, 0.6)',
						},
					}}>
					<Typography
						variant='h6'
						sx={{
							fontWeight: 700,
							background: 'linear-gradient(135deg, #fff 0%, #fdba74 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							fontSize: '1rem',
							textTransform: 'uppercase',
							letterSpacing: '0.1em',
							textAlign: 'center',
							textShadow: '0 0 20px rgba(251, 146, 60, 0.5)',
						}}>
						{translations.notifications}
					</Typography>
				</Box>

				<Box sx={{ p: 3 }}>
					<FormControlLabel
						control={
							<Switch
								checked={formData.emailReminders}
								onChange={handleToggle('emailReminders')}
								disabled={loading}
								sx={{
									'& .MuiSwitch-switchBase.Mui-checked': {
										color: '#fb923c',
									},
									'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
										backgroundColor: '#fb923c',
									},
								}}
							/>
						}
						label={
							<Box>
								<Typography variant='body2' sx={{ fontWeight: 600 }}>
									{translations.emailReminders}
								</Typography>
								<Typography variant='caption' sx={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>
									{translations.emailRemindersDesc}
								</Typography>
							</Box>
						}
						sx={{ mb: 2 }}
					/>

					<FormControlLabel
						control={
							<Switch
								checked={formData.streakReminders}
								onChange={handleToggle('streakReminders')}
								disabled={loading}
								sx={{
									'& .MuiSwitch-switchBase.Mui-checked': {
										color: '#fb923c',
									},
									'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
										backgroundColor: '#fb923c',
									},
								}}
							/>
						}
						label={
							<Box>
								<Typography variant='body2' sx={{ fontWeight: 600 }}>
									{translations.streakReminders}
								</Typography>
								<Typography variant='caption' sx={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>
									{translations.streakRemindersDesc}
								</Typography>
							</Box>
						}
						sx={{ mb: 2 }}
					/>

					<FormControlLabel
						control={
							<Switch
								checked={formData.newContentNotifications}
								onChange={handleToggle('newContentNotifications')}
								disabled={loading}
								sx={{
									'& .MuiSwitch-switchBase.Mui-checked': {
										color: '#fb923c',
									},
									'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
										backgroundColor: '#fb923c',
									},
								}}
							/>
						}
						label={
							<Box>
								<Typography variant='body2' sx={{ fontWeight: 600 }}>
									{translations.newContentNotifications}
								</Typography>
								<Typography variant='caption' sx={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>
									{translations.newContentNotificationsDesc}
								</Typography>
							</Box>
						}
					/>
				</Box>
			</Paper>
		</Grid>
	)
}

export default NotificationsSection
