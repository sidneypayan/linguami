/**
 * Custom translation form component
 * Allows users to enter their own translation
 */

import { useState } from 'react'
import { Box, Stack, Typography, TextField, Button, useTheme } from '@mui/material'
import { Add } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { sanitizeInput, validateTranslation } from '@/utils/wordMapping'

const MAX_TRANSLATION_LENGTH = 100

export function CustomTranslationForm({ onSubmit }) {
	const t = useTranslations('words')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	const [personalTranslation, setPersonalTranslation] = useState('')
	const [translationError, setTranslationError] = useState('')

	const handleTranslationChange = (e) => {
		const sanitized = sanitizeInput(e.target.value)
		setPersonalTranslation(sanitized)

		if (sanitized) {
			const validation = validateTranslation(sanitized, MAX_TRANSLATION_LENGTH)
			setTranslationError(validation.isValid ? '' : validation.error)
		} else {
			setTranslationError('')
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		// Final validation before submit
		if (!personalTranslation) {
			setTranslationError('La traduction ne peut pas être vide')
			return
		}

		const validation = validateTranslation(personalTranslation, MAX_TRANSLATION_LENGTH)
		if (!validation.isValid) {
			setTranslationError(validation.error)
			return
		}

		// Call parent submit handler with sanitized translation
		onSubmit(personalTranslation)

		// Reset form
		setPersonalTranslation('')
		setTranslationError('')
	}

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			sx={{
				p: 2,
				backgroundColor: isDark ? 'rgba(30, 41, 59, 0.5)' : 'white',
			}}>
			<Typography
				variant="caption"
				sx={{
					display: 'block',
					mb: 1,
					color: isDark ? '#cbd5e1' : '#666',
					fontWeight: 600,
				}}>
				{t('custom_translation')}
			</Typography>
			<Stack direction="column" spacing={1}>
				<Stack direction="row" spacing={1}>
					<TextField
						fullWidth
						size="small"
						placeholder="votre traduction"
						value={personalTranslation}
						onChange={handleTranslationChange}
						error={!!translationError}
						helperText={translationError}
						inputProps={{
							maxLength: MAX_TRANSLATION_LENGTH,
							autoComplete: 'off',
							spellCheck: 'true',
						}}
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: 2,
								'& fieldset': {
									borderColor: translationError ? '#f44336' : '#e0e0e0',
								},
								'&:hover fieldset': {
									borderColor: translationError ? '#f44336' : '#667eea',
								},
								'&.Mui-focused fieldset': {
									borderColor: translationError ? '#f44336' : '#667eea',
									borderWidth: 2,
								},
							},
							'& .MuiFormHelperText-root': {
								fontSize: '0.7rem',
								mt: 0.5,
							},
						}}
					/>
					<Button
						type="submit"
						disabled={!personalTranslation || !!translationError}
						variant="contained"
						sx={{
							minWidth: 'auto',
							px: 2,
							alignSelf: 'flex-start',
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							color: 'white',
							fontWeight: 600,
							'&:hover': {
								background: 'linear-gradient(135deg, #5568d3 0%, #63408b 100%)',
							},
						}}
						startIcon={<Add />}>
						{t('add')}
					</Button>
				</Stack>
				{personalTranslation && (
					<Typography
						variant="caption"
						sx={{
							color: '#999',
							fontSize: '0.7rem',
							textAlign: 'right',
						}}>
						{personalTranslation.length}/{MAX_TRANSLATION_LENGTH}
					</Typography>
				)}
			</Stack>
		</Box>
	)
}
