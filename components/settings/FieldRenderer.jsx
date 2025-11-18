import React from 'react'
import {
	Box,
	Typography,
	TextField,
	FormControl,
	Select,
	MenuItem,
	IconButton,
} from '@mui/material'
import { EditRounded, CheckRounded, CloseRounded } from '@mui/icons-material'

/**
 * Reusable field renderer for Settings sections
 * Handles both display and edit modes with consistent styling
 *
 * @param {Object} props
 * @param {string} props.field - Field name in formData
 * @param {string} props.label - Field label to display
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.type - Input type (text, email, etc.)
 * @param {Array} props.options - Select options [{value, label}] or null for TextField
 * @param {boolean} props.isEditing - Whether field is in edit mode
 * @param {any} props.value - Current field value
 * @param {boolean} props.isDark - Dark mode flag
 * @param {boolean} props.loading - Loading state
 * @param {Object} props.translations - Translation object
 * @param {Function} props.handleChange - Change handler (field) => (event) => void
 * @param {Function} props.handleSave - Save handler (field) => void
 * @param {Function} props.handleCancel - Cancel handler (field) => void
 * @param {Function} props.toggleEditMode - Toggle edit mode (field) => void
 * @param {boolean} props.isEmailField - Whether this is the email field (non-editable)
 */
export const FieldRenderer = ({
	field,
	label,
	icon,
	type = 'text',
	options = null,
	isEditing,
	value,
	isDark,
	loading,
	translations,
	handleChange,
	handleSave,
	handleCancel,
	toggleEditMode,
	isEmailField = false,
}) => {
	// Déterminer les couleurs selon le type de champ - Dark Fantasy Theme
	const isLanguageField = field === 'languageLevel'
	const iconBgColor = isLanguageField ? 'rgba(6, 182, 212, 0.2)' : 'rgba(139, 92, 246, 0.2)'
	const iconColor = isLanguageField ? '#06b6d4' : '#8b5cf6'
	const hoverBgColor = isLanguageField ? 'rgba(6, 182, 212, 0.15)' : 'rgba(139, 92, 246, 0.15)'

	// Traduire les valeurs affichées pour le niveau de langue
	const getDisplayValue = () => {
		if (!value) return '-'
		if (field === 'languageLevel') {
			return translations[value] // Traduit beginner/intermediate/advanced
		}
		return value
	}

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				py: 2.5,
				px: 3,
				borderBottom: `1px solid ${
					isLanguageField
						? isDark
							? 'rgba(6, 182, 212, 0.25)'
							: 'rgba(6, 182, 212, 0.15)'
						: isDark
						? 'rgba(139, 92, 246, 0.25)'
						: 'rgba(139, 92, 246, 0.15)'
				}`,
				'&:last-child': {
					borderBottom: 'none',
				},
				transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				position: 'relative',
				'&:hover': {
					bgcolor: isLanguageField
						? isDark
							? 'rgba(6, 182, 212, 0.15)'
							: 'rgba(6, 182, 212, 0.1)'
						: isDark
						? 'rgba(139, 92, 246, 0.15)'
						: 'rgba(139, 92, 246, 0.1)',
					'&::before': {
						opacity: 1,
					},
				},
				'&::before': {
					content: '""',
					position: 'absolute',
					left: 0,
					top: 0,
					bottom: 0,
					width: 3,
					background: isLanguageField
						? 'linear-gradient(180deg, #06b6d4 0%, #0891b2 100%)'
						: 'linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%)',
					opacity: 0,
					transition: 'opacity 0.3s ease',
					boxShadow: isLanguageField
						? '0 0 10px rgba(6, 182, 212, 0.5)'
						: '0 0 10px rgba(139, 92, 246, 0.5)',
				},
			}}>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: 44,
					height: 44,
					borderRadius: '50%',
					background: isLanguageField
						? 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(8, 145, 178, 0.25) 100%)'
						: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(124, 58, 237, 0.25) 100%)',
					border: `2px solid ${isLanguageField ? 'rgba(6, 182, 212, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`,
					color: iconColor,
					mr: 2,
					boxShadow: isLanguageField
						? '0 4px 12px rgba(6, 182, 212, 0.2)'
						: '0 4px 12px rgba(139, 92, 246, 0.2)',
					transition: 'all 0.3s ease',
					'&:hover': {
						transform: 'scale(1.1) rotate(5deg)',
						boxShadow: isLanguageField
							? '0 6px 20px rgba(6, 182, 212, 0.4)'
							: '0 6px 20px rgba(139, 92, 246, 0.4)',
					},
				}}>
				{icon}
			</Box>

			<Box sx={{ flex: 1, minWidth: 0 }}>
				<Typography
					variant='body2'
					sx={{
						color: isLanguageField
							? isDark
								? '#67e8f9'
								: '#0891b2'
							: isDark
							? '#c4b5fd'
							: '#7c3aed',
						fontSize: '0.7rem',
						fontWeight: 600,
						mb: 0.5,
						textTransform: 'uppercase',
						letterSpacing: '0.08em',
					}}>
					{label}
				</Typography>

				{isEditing ? (
					options ? (
						<FormControl fullWidth size='small'>
							<Select
								value={value}
								onChange={handleChange(field)}
								sx={{
									fontSize: '0.95rem',
									color: isDark ? '#f1f5f9' : '#2d3748',
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: iconColor,
									},
									'&:hover .MuiOutlinedInput-notchedOutline': {
										borderColor: iconColor,
									},
									'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
										borderColor: iconColor,
										borderWidth: '2px',
										boxShadow: `0 0 10px ${isLanguageField ? 'rgba(6, 182, 212, 0.4)' : 'rgba(139, 92, 246, 0.4)'}`,
									},
									'& .MuiSvgIcon-root': {
										color: iconColor,
									},
								}}>
								{options.map(option => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					) : (
						<TextField
							fullWidth
							size='small'
							type={type}
							value={value}
							onChange={handleChange(field)}
							sx={{
								'& .MuiOutlinedInput-root': {
									fontSize: '0.95rem',
									color: isDark ? '#f1f5f9' : '#2d3748',
									'& fieldset': {
										borderColor: iconColor,
									},
									'&:hover fieldset': {
										borderColor: iconColor,
									},
									'&.Mui-focused fieldset': {
										borderColor: iconColor,
										borderWidth: '2px',
										boxShadow: `0 0 10px ${isLanguageField ? 'rgba(6, 182, 212, 0.4)' : 'rgba(139, 92, 246, 0.4)'}`,
									},
								},
							}}
						/>
					)
				) : (
					<>
						<Typography
							sx={{
								fontSize: '0.95rem',
								fontWeight: 600,
								color: isDark ? '#f1f5f9' : '#2d3748',
							}}>
							{getDisplayValue()}
						</Typography>
						{isEmailField && (
							<Typography
								variant='caption'
								sx={{
									color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
									fontSize: '0.7rem',
									fontStyle: 'italic',
									mt: 0.5,
								}}>
								{translations.emailNotEditable}
							</Typography>
						)}
					</>
				)}
			</Box>

			<Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
				{isEditing ? (
					<>
						<IconButton
							size='small'
							onClick={() => handleSave(field)}
							disabled={loading}
							sx={{
								color: 'white',
								background: isLanguageField
									? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
									: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
								border: `1px solid ${iconColor}`,
								boxShadow: isLanguageField
									? '0 4px 12px rgba(6, 182, 212, 0.3)'
									: '0 4px 12px rgba(139, 92, 246, 0.3)',
								'&:hover': {
									transform: 'scale(1.1)',
									boxShadow: isLanguageField
										? '0 6px 16px rgba(6, 182, 212, 0.5)'
										: '0 6px 16px rgba(139, 92, 246, 0.5)',
								},
							}}>
							<CheckRounded fontSize='small' />
						</IconButton>
						<IconButton
							size='small'
							onClick={() => handleCancel(field)}
							disabled={loading}
							sx={{
								color: 'white',
								background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
								border: '1px solid #ef4444',
								boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
								'&:hover': {
									transform: 'scale(1.1)',
									boxShadow: '0 6px 16px rgba(239, 68, 68, 0.5)',
								},
							}}>
							<CloseRounded fontSize='small' />
						</IconButton>
					</>
				) : (
					!isEmailField && (
						<IconButton
							size='small'
							onClick={() => toggleEditMode(field)}
							sx={{
								color: 'white',
								background: isLanguageField
									? 'linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(8, 145, 178, 0.3) 100%)'
									: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(124, 58, 237, 0.3) 100%)',
								border: `1px solid ${iconColor}`,
								boxShadow: isLanguageField
									? '0 4px 12px rgba(6, 182, 212, 0.2)'
									: '0 4px 12px rgba(139, 92, 246, 0.2)',
								'&:hover': {
									background: isLanguageField
										? 'linear-gradient(135deg, rgba(6, 182, 212, 0.5) 0%, rgba(8, 145, 178, 0.5) 100%)'
										: 'linear-gradient(135deg, rgba(139, 92, 246, 0.5) 0%, rgba(124, 58, 237, 0.5) 100%)',
									transform: 'scale(1.1) rotate(15deg)',
									boxShadow: isLanguageField
										? '0 6px 16px rgba(6, 182, 212, 0.4)'
										: '0 6px 16px rgba(139, 92, 246, 0.4)',
								},
							}}>
							<EditRounded fontSize='small' />
						</IconButton>
					)
				)}
			</Box>
		</Box>
	)
}

export default FieldRenderer
