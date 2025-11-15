'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useUserContext } from '@/context/user'
import { getAllUserWords } from '@/features/words/wordsSlice'
import { validateWordPair } from '@/utils/validation'
import { supabase } from '@/lib/supabase'
import toast from '@/utils/toast'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname, useParams } from 'next/navigation'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Box,
	Typography,
	IconButton,
	CircularProgress,
	useTheme,
} from '@mui/material'
import { Close, Add } from '@mui/icons-material'

const AddWordModal = ({ open, onClose }) => {
	const t = useTranslations('words')
	const dispatch = useDispatch()
	const router = useRouter()
	const pathname = usePathname()
	const params = useParams()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const { user, userLearningLanguage } = useUserContext()
	const locale = params.locale

	const [learningLangWord, setLearningLangWord] = useState('')
	const [browserLangWord, setBrowserLangWord] = useState('')
	const [contextSentence, setContextSentence] = useState('')
	const [errors, setErrors] = useState({})
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Déterminer les noms de langues à afficher
	const getLearningLanguageName = () => {
		return userLearningLanguage === 'ru' ? t('language_ru') : t('language_fr')
	}

	const getBrowserLanguageName = () => {
		if (locale === 'fr') return t('language_fr')
		return t('language_ru')
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setErrors({})
		setIsSubmitting(true)

		try {
			// Validation côté client
			const validation = validateWordPair({
				learningLangWord,
				browserLangWord,
				contextSentence,
			})

			if (!validation.isValid) {
				setErrors(validation.errors)
				setIsSubmitting(false)
				return
			}

			// Obtenir le token d'authentification
			const {
				data: { session },
			} = await supabase.auth.getSession()

			if (!session) {
				toast.error(t('session_expired'))
				setIsSubmitting(false)
				return
			}

			// Appeler l'API sécurisée
			const response = await fetch('/api/words/add', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session.access_token}`,
				},
				body: JSON.stringify({
					learningLangWord: validation.sanitized.learningLangWord,
					browserLangWord: validation.sanitized.browserLangWord,
					contextSentence: validation.sanitized.contextSentence || null,
					materialId: null,
					userLearningLanguage,
					locale: locale, // Interface language for translation
				}),
			})

			const result = await response.json()

			if (!response.ok) {
				if (result.errors) {
					setErrors(result.errors)
				}
				const errorMsg = result.details
					? `${result.error}: ${result.details}`
					: result.error || t('word_add_error')
				toast.error(errorMsg)
				setIsSubmitting(false)
				return
			}

			// Succès
			toast.success(result.message || t('word_add_success'))

			// Recharger la liste des mots
			dispatch(getAllUserWords({ userId: user.id, userLearningLanguage }))

			// Réinitialiser le formulaire
			setLearningLangWord('')
			setBrowserLangWord('')
			setContextSentence('')
			setErrors({})
			onClose()
		} catch (error) {
			console.error('Erreur:', error)
			toast.error(t('server_error'))
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleClose = () => {
		setLearningLangWord('')
		setBrowserLangWord('')
		setContextSentence('')
		setErrors({})
		onClose()
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth='sm'
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 4,
					background: isDark
						? 'linear-gradient(145deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)'
						: 'linear-gradient(135deg, #fdfbfb 0%, #f7f7f7 100%)',
					boxShadow: isDark
						? '0 20px 60px rgba(139, 92, 246, 0.3)'
						: '0 20px 60px rgba(0,0,0,0.15)',
					border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : 'none',
				},
			}}>
			<DialogTitle sx={{ pb: 2, pt: 3, px: 4 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
						<Box
							sx={{
								width: 40,
								height: 40,
								borderRadius: 2,
								background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 4px 12px rgba(245, 87, 108, 0.3)',
							}}>
							<Add sx={{ color: 'white' }} />
						</Box>
						<Typography variant='h5' component='div' sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#333' }}>
							{t('addword')}
						</Typography>
					</Box>
					<IconButton
						onClick={handleClose}
						size='small'
						sx={{
							backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(0,0,0,0.04)',
							color: isDark ? '#cbd5e1' : 'inherit',
							'&:hover': {
								backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(0,0,0,0.08)',
							},
						}}>
						<Close />
					</IconButton>
				</Box>
			</DialogTitle>

			<form onSubmit={handleSubmit}>
				<DialogContent sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
						{/* Champ pour le mot dans la langue d'apprentissage */}
						<Box>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 1,
									mb: 1.5,
								}}>
								<Box
									sx={{
										width: 8,
										height: 24,
										borderRadius: 1,
										background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
									}}
								/>
								<Typography
									variant='subtitle1'
									sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#333' }}>
									{t('word_in_learning_language', { lang: getLearningLanguageName() })}
								</Typography>
							</Box>
							<TextField
								fullWidth
								value={learningLangWord}
								onChange={e => {
									setLearningLangWord(e.target.value)
									if (errors.learningLangWord) {
										setErrors({ ...errors, learningLangWord: null })
									}
								}}
								placeholder={`${t('example')}: ${userLearningLanguage === 'ru' ? 'привет' : 'bonjour'}`}
								variant='outlined'
								required
								autoFocus
								error={!!errors.learningLangWord}
								helperText={errors.learningLangWord}
								disabled={isSubmitting}
								inputProps={{ maxLength: 200 }}
								sx={{
									'& .MuiOutlinedInput-root': {
										borderRadius: 2,
										backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'white',
										color: isDark ? '#f1f5f9' : 'inherit',
										fontSize: '1.1rem',
										'& fieldset': {
											borderWidth: 2,
											borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : '#e0e0e0',
										},
										'&:hover fieldset': {
											borderColor: '#667eea',
										},
										'&.Mui-focused fieldset': {
											borderColor: '#667eea',
											borderWidth: 2,
										},
									},
									'& .MuiInputBase-input::placeholder': {
										color: isDark ? '#94a3b8' : 'inherit',
										opacity: 1,
									},
									'& .MuiFormHelperText-root': {
										color: isDark ? '#94a3b8' : 'inherit',
									},
								}}
							/>
						</Box>

						{/* Champ pour le mot dans la langue du navigateur */}
						<Box>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 1,
									mb: 1.5,
								}}>
								<Box
									sx={{
										width: 8,
										height: 24,
										borderRadius: 1,
										background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
									}}
								/>
								<Typography
									variant='subtitle1'
									sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#333' }}>
									{t('word_in_browser_language', { lang: getBrowserLanguageName() })}
								</Typography>
							</Box>
							<TextField
								fullWidth
								value={browserLangWord}
								onChange={e => {
									setBrowserLangWord(e.target.value)
									if (errors.browserLangWord) {
										setErrors({ ...errors, browserLangWord: null })
									}
								}}
								placeholder={`${t('example')}: ${locale === 'fr' ? 'bonjour' : 'привет'}`}
								variant='outlined'
								required
								error={!!errors.browserLangWord}
								helperText={errors.browserLangWord}
								disabled={isSubmitting}
								inputProps={{ maxLength: 200 }}
								sx={{
									'& .MuiOutlinedInput-root': {
										borderRadius: 2,
										backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'white',
										color: isDark ? '#f1f5f9' : 'inherit',
										fontSize: '1.1rem',
										'& fieldset': {
											borderWidth: 2,
											borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : '#e0e0e0',
										},
										'&:hover fieldset': {
											borderColor: '#f093fb',
										},
										'&.Mui-focused fieldset': {
											borderColor: '#f093fb',
											borderWidth: 2,
										},
									},
									'& .MuiInputBase-input::placeholder': {
										color: isDark ? '#94a3b8' : 'inherit',
										opacity: 1,
									},
									'& .MuiFormHelperText-root': {
										color: isDark ? '#94a3b8' : 'inherit',
									},
								}}
							/>
						</Box>

						{/* Champ optionnel pour la phrase de contexte */}
						<Box>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 1,
									mb: 1.5,
								}}>
								<Box
									sx={{
										width: 8,
										height: 24,
										borderRadius: 1,
										background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
									}}
								/>
								<Typography
									variant='subtitle1'
									sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#333' }}>
									{t('context_sentence_label')}
								</Typography>
								<Typography
									variant='caption'
									sx={{
										color: isDark ? '#94a3b8' : '#718096',
										fontStyle: 'italic',
										fontWeight: 500,
									}}>
									({t('optional')})
								</Typography>
							</Box>
							<TextField
								fullWidth
								multiline
								rows={2}
								value={contextSentence}
								onChange={e => {
									setContextSentence(e.target.value)
									if (errors.contextSentence) {
										setErrors({ ...errors, contextSentence: null })
									}
								}}
								placeholder={t('context_sentence_placeholder')}
								variant='outlined'
								error={!!errors.contextSentence}
								helperText={errors.contextSentence || t('context_sentence_helper')}
								disabled={isSubmitting}
								inputProps={{ maxLength: 500 }}
								sx={{
									'& .MuiOutlinedInput-root': {
										borderRadius: 2,
										backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'white',
										color: isDark ? '#f1f5f9' : 'inherit',
										fontSize: '1rem',
										'& fieldset': {
											borderWidth: 2,
											borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : '#e0e0e0',
										},
										'&:hover fieldset': {
											borderColor: '#10b981',
										},
										'&.Mui-focused fieldset': {
											borderColor: '#10b981',
											borderWidth: 2,
										},
									},
									'& .MuiInputBase-input::placeholder': {
										color: isDark ? '#94a3b8' : 'inherit',
										opacity: 1,
									},
									'& .MuiFormHelperText-root': {
										color: isDark ? '#94a3b8' : 'inherit',
									},
								}}
							/>
						</Box>

						{/* Message d'information */}
						<Box
							sx={{
								backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(102, 126, 234, 0.1)',
								borderRadius: 2,
								padding: 2,
								border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(102, 126, 234, 0.2)',
							}}>
							<Typography
								variant='body2'
								sx={{
									color: isDark ? '#a78bfa' : '#5a67d8',
									textAlign: 'center',
									lineHeight: 1.6,
								}}>
								✨ {t('manual_add_info')}
							</Typography>
						</Box>
					</Box>
				</DialogContent>

				<DialogActions sx={{ px: { xs: 2, sm: 3, md: 4 }, pb: 3, pt: 2, gap: 2 }}>
					<Button
						onClick={handleClose}
						variant='outlined'
						size='large'
						disabled={isSubmitting}
						sx={{
							flex: { xs: 1, sm: 0 },
							borderWidth: 2,
							borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : '#e0e0e0',
							color: isDark ? '#cbd5e1' : '#666',
							fontWeight: 600,
							textTransform: 'none',
							borderRadius: 2,
							minWidth: 120,
							'&:hover': {
								borderWidth: 2,
								borderColor: isDark ? 'rgba(139, 92, 246, 0.5)' : '#bbb',
								backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(0,0,0,0.02)',
							},
						}}>
						{t('cancel')}
					</Button>
					<Button
						type='submit'
						variant='contained'
						size='large'
						disabled={isSubmitting}
						sx={{
							flex: { xs: 1, sm: 0 },
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
							fontWeight: 700,
							textTransform: 'none',
							borderRadius: 2,
							minWidth: 140,
							fontSize: '1rem',
							transition: 'all 0.3s ease',
							'&:hover': {
								transform: 'translateY(-2px)',
								boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
								background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
							},
							'&.Mui-disabled': {
								background: '#ccc',
								color: 'white',
							},
						}}>
						{isSubmitting ? (
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<CircularProgress size={20} sx={{ color: 'white' }} />
								{t('add')}...
							</Box>
						) : (
							t('add')
						)}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	)
}

export default AddWordModal
