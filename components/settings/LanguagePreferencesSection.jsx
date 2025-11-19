import React from 'react'
import { Paper, Box, Typography, Grid } from '@mui/material'
import { LanguageRounded } from '@mui/icons-material'
import { FieldRenderer } from './FieldRenderer'

/**
 * Language Preferences Section
 * Displays language level selection
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
export const LanguagePreferencesSection = ({
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
					border: '2px solid rgba(6, 182, 212, 0.2)',
					boxShadow: '0 8px 32px rgba(6, 182, 212, 0.15), 0 0 0 1px rgba(6, 182, 212, 0.05) inset',
					transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)',
						pointerEvents: 'none',
						opacity: 0,
						transition: 'opacity 0.4s ease',
					},
					'&:hover': {
						transform: 'translateY(-4px)',
						boxShadow: '0 12px 48px rgba(6, 182, 212, 0.25), 0 0 0 1px rgba(6, 182, 212, 0.3) inset',
						borderColor: 'rgba(6, 182, 212, 0.4)',
						'&::before': {
							opacity: 1,
						},
					},
				}}>
				<Box
					sx={{
						px: 3,
						py: 2.5,
						background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(8, 145, 178, 0.85) 100%)',
						borderBottom: '1px solid rgba(6, 182, 212, 0.3)',
						position: 'relative',
						'&::after': {
							content: '""',
							position: 'absolute',
							bottom: -1,
							left: '50%',
							transform: 'translateX(-50%)',
							width: '60%',
							height: 2,
							background: 'linear-gradient(90deg, transparent 0%, #06b6d4 50%, transparent 100%)',
							boxShadow: '0 0 10px rgba(6, 182, 212, 0.6)',
						},
					}}>
					<Typography
						variant='h6'
						sx={{
							fontWeight: 700,
							background: 'linear-gradient(135deg, #fff 0%, #67e8f9 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							fontSize: '1rem',
							textTransform: 'uppercase',
							letterSpacing: '0.1em',
							textAlign: 'center',
							textShadow: '0 0 20px rgba(6, 182, 212, 0.5)',
						}}>
						{translations.languagePreferences}
					</Typography>
				</Box>

				<FieldRenderer
					field='languageLevel'
					label={translations.languageLevel}
					icon={<LanguageRounded fontSize='small' />}
					type='select'
					options={[
						{ value: 'beginner', label: translations.beginner },
						{ value: 'intermediate', label: translations.intermediate },
						{ value: 'advanced', label: translations.advanced },
					]}
					isEditing={editMode.languageLevel}
					value={formData.languageLevel}
					isDark={isDark}
					loading={loading}
					translations={translations}
					handleChange={handleChange}
					handleSave={handleSave}
					handleCancel={handleCancel}
					toggleEditMode={toggleEditMode}
				/>
			</Paper>
		</Grid>
	)
}

export default LanguagePreferencesSection
