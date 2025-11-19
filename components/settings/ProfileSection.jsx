import React from 'react'
import { Paper, Box, Typography, Grid } from '@mui/material'
import { PersonRounded, EmailRounded } from '@mui/icons-material'
import { FieldRenderer } from './FieldRenderer'

/**
 * Profile Section - Personal Information
 * Displays username and email fields
 *
 * @param {Object} props
 * @param {boolean} props.isDark - Dark mode flag
 * @param {Object} props.translations - Translation object
 * @param {Object} props.editMode - Edit mode state object
 * @param {Object} props.formData - Form data object
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.handleChange - Change handler
 * @param {Function} props.handleSave - Save handler
 * @param {Function} props.handleCancel - Cancel handler
 * @param {Function} props.toggleEditMode - Toggle edit mode handler
 */
export const ProfileSection = ({
	isDark,
	translations,
	editMode,
	formData,
	loading,
	handleChange,
	handleSave,
	handleCancel,
	toggleEditMode,
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
					border: '2px solid rgba(139, 92, 246, 0.2)',
					boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(139, 92, 246, 0.05) inset',
					transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)',
						pointerEvents: 'none',
						opacity: 0,
						transition: 'opacity 0.4s ease',
					},
					'&:hover': {
						transform: 'translateY(-4px)',
						boxShadow: '0 12px 48px rgba(139, 92, 246, 0.25), 0 0 0 1px rgba(139, 92, 246, 0.3) inset',
						borderColor: 'rgba(139, 92, 246, 0.4)',
						'&::before': {
							opacity: 1,
						},
					},
				}}>
				<Box
					sx={{
						px: 3,
						py: 2.5,
						background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(124, 58, 237, 0.85) 100%)',
						borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
						position: 'relative',
						'&::after': {
							content: '""',
							position: 'absolute',
							bottom: -1,
							left: '50%',
							transform: 'translateX(-50%)',
							width: '60%',
							height: 2,
							background: 'linear-gradient(90deg, transparent 0%, #8b5cf6 50%, transparent 100%)',
							boxShadow: '0 0 10px rgba(139, 92, 246, 0.6)',
						},
					}}>
					<Typography
						variant='h6'
						sx={{
							fontWeight: 700,
							background: 'linear-gradient(135deg, #fff 0%, #a78bfa 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							fontSize: '1rem',
							textTransform: 'uppercase',
							letterSpacing: '0.1em',
							textAlign: 'center',
							textShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
						}}>
						{translations.personalInfo}
					</Typography>
				</Box>

				<FieldRenderer
					field='username'
					label={translations.username}
					icon={<PersonRounded fontSize='small' />}
					type='text'
					isEditing={editMode.username}
					value={formData.username}
					isDark={isDark}
					loading={loading}
					translations={translations}
					handleChange={handleChange}
					handleSave={handleSave}
					handleCancel={handleCancel}
					toggleEditMode={toggleEditMode}
				/>

				<FieldRenderer
					field='email'
					label={translations.email}
					icon={<EmailRounded fontSize='small' />}
					type='email'
					isEditing={editMode.email}
					value={formData.email}
					isDark={isDark}
					loading={loading}
					translations={translations}
					handleChange={handleChange}
					handleSave={handleSave}
					handleCancel={handleCancel}
					toggleEditMode={toggleEditMode}
					isEmailField={true}
				/>
			</Paper>
		</Grid>
	)
}

export default ProfileSection
