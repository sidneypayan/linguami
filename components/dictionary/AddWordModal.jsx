import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useUserContext } from '../../context/user'
import { getAllUserWords } from '../../features/words/wordsSlice'
import { validateWordPair } from '../../utils/validation'
import { supabase } from '../../lib/supabase'
import { toast } from 'react-toastify'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
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
} from '@mui/material'
import { Close, Add } from '@mui/icons-material'

const AddWordModal = ({ open, onClose }) => {
	const { t } = useTranslation('words')
	const dispatch = useDispatch()
	const router = useRouter()
	const { user, userLearningLanguage } = useUserContext()
	const lang = router.locale

	const [learningLangWord, setLearningLangWord] = useState('')
	const [browserLangWord, setBrowserLangWord] = useState('')
	const [errors, setErrors] = useState({})
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Déterminer les noms de langues à afficher
	const getLearningLanguageName = () => {
		return userLearningLanguage === 'ru' ? 'Russe' : 'Français'
	}

	const getBrowserLanguageName = () => {
		return lang === 'fr' ? 'Français' : lang === 'ru' ? 'Russe' : 'Anglais'
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
				toast.error('Session expirée. Veuillez vous reconnecter.')
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
					materialId: null,
				}),
			})

			const result = await response.json()

			if (!response.ok) {
				if (result.errors) {
					setErrors(result.errors)
				}
				const errorMsg = result.details
					? `${result.error}: ${result.details}`
					: result.error || "Erreur lors de l'ajout du mot"
				toast.error(errorMsg)
				setIsSubmitting(false)
				return
			}

			// Succès
			toast.success(result.message || 'Mot ajouté avec succès')

			// Recharger la liste des mots
			dispatch(getAllUserWords(user.id))

			// Réinitialiser le formulaire
			setLearningLangWord('')
			setBrowserLangWord('')
			setErrors({})
			onClose()
		} catch (error) {
			console.error('Erreur:', error)
			toast.error('Erreur lors de la connexion au serveur')
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleClose = () => {
		setLearningLangWord('')
		setBrowserLangWord('')
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
					background: 'linear-gradient(135deg, #fdfbfb 0%, #f7f7f7 100%)',
					boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
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
						<Typography variant='h5' component='div' sx={{ fontWeight: 700, color: '#333' }}>
							{t('addword')}
						</Typography>
					</Box>
					<IconButton
						onClick={handleClose}
						size='small'
						sx={{
							backgroundColor: 'rgba(0,0,0,0.04)',
							'&:hover': {
								backgroundColor: 'rgba(0,0,0,0.08)',
							},
						}}>
						<Close />
					</IconButton>
				</Box>
			</DialogTitle>

			<form onSubmit={handleSubmit}>
				<DialogContent sx={{ px: 4, py: 3 }}>
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
									sx={{ fontWeight: 700, color: '#333' }}>
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
										backgroundColor: 'white',
										fontSize: '1.1rem',
										'& fieldset': {
											borderWidth: 2,
											borderColor: '#e0e0e0',
										},
										'&:hover fieldset': {
											borderColor: '#667eea',
										},
										'&.Mui-focused fieldset': {
											borderColor: '#667eea',
											borderWidth: 2,
										},
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
									sx={{ fontWeight: 700, color: '#333' }}>
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
								placeholder={`${t('example')}: ${lang === 'fr' ? 'bonjour' : 'hello'}`}
								variant='outlined'
								required
								error={!!errors.browserLangWord}
								helperText={errors.browserLangWord}
								disabled={isSubmitting}
								inputProps={{ maxLength: 200 }}
								sx={{
									'& .MuiOutlinedInput-root': {
										borderRadius: 2,
										backgroundColor: 'white',
										fontSize: '1.1rem',
										'& fieldset': {
											borderWidth: 2,
											borderColor: '#e0e0e0',
										},
										'&:hover fieldset': {
											borderColor: '#f093fb',
										},
										'&.Mui-focused fieldset': {
											borderColor: '#f093fb',
											borderWidth: 2,
										},
									},
								}}
							/>
						</Box>

						{/* Message d'information */}
						<Box
							sx={{
								backgroundColor: 'rgba(102, 126, 234, 0.1)',
								borderRadius: 2,
								padding: 2,
								border: '1px solid rgba(102, 126, 234, 0.2)',
							}}>
							<Typography
								variant='body2'
								sx={{
									color: '#5a67d8',
									textAlign: 'center',
									lineHeight: 1.6,
								}}>
								✨ {t('manual_add_info')}
							</Typography>
						</Box>
					</Box>
				</DialogContent>

				<DialogActions sx={{ px: 4, pb: 3, pt: 2, gap: 2 }}>
					<Button
						onClick={handleClose}
						variant='outlined'
						size='large'
						disabled={isSubmitting}
						sx={{
							flex: { xs: 1, sm: 0 },
							borderWidth: 2,
							borderColor: '#e0e0e0',
							color: '#666',
							fontWeight: 600,
							textTransform: 'none',
							borderRadius: 2,
							minWidth: 120,
							'&:hover': {
								borderWidth: 2,
								borderColor: '#bbb',
								backgroundColor: 'rgba(0,0,0,0.02)',
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
