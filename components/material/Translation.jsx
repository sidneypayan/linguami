import useTranslation from 'next-translate/useTranslation'
import { useSelector, useDispatch } from 'react-redux'
import { useRef, useEffect, useState, useCallback } from 'react'
import {
	toggleTranslationContainer,
	cleanTranslation,
	addWordToDictionary,
} from '../../features/words/wordsSlice'
import Link from 'next/link'
import { useUserContext } from '../../context/user'
import { addGuestWord, getGuestWordsCount, GUEST_DICTIONARY_CONFIG } from '../../utils/guestDictionary'
import toast from '../../utils/toast'
import {
	Box,
	Paper,
	Typography,
	List,
	ListItem,
	ListItemButton,
	TextField,
	Button,
	Divider,
	Chip,
	Fade,
	IconButton,
	Stack,
	useTheme,
} from '@mui/material'
import { Add, Close, Translate } from '@mui/icons-material'
import { primaryButton, secondaryButton } from '../../utils/buttonStyles'

const Translation = ({ coordinates, materialId, userId }) => {
	const { t, lang } = useTranslation('words')

	const dispatch = useDispatch()
	const ref = useRef()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	const {
		translation,
		isTranslationOpen,
		translation_loading,
		translation_error,
		word_sentence,
	} = useSelector(store => store.words)

	const [personalTranslation, setPersonalTranslation] = useState('')
	const [translationError, setTranslationError] = useState('')
	const { isUserLoggedIn, userLearningLanguage } = useUserContext()
	const [guestWordsCount, setGuestWordsCount] = useState(0)

	const MAX_TRANSLATION_LENGTH = 100

	// Fonction pour recharger le compteur de mots
	const reloadGuestWordsCount = useCallback(() => {
		if (!isUserLoggedIn && typeof window !== 'undefined') {
			setGuestWordsCount(getGuestWordsCount())
		}
	}, [isUserLoggedIn])

	// Mettre à jour le compteur de mots pour invités
	useEffect(() => {
		reloadGuestWordsCount()
	}, [isUserLoggedIn, isTranslationOpen, reloadGuestWordsCount])

	// Écouter les événements d'ajout/suppression de mots
	useEffect(() => {
		if (!isUserLoggedIn && typeof window !== 'undefined') {
			window.addEventListener('guestWordAdded', reloadGuestWordsCount)
			window.addEventListener('guestWordDeleted', reloadGuestWordsCount)

			return () => {
				window.removeEventListener('guestWordAdded', reloadGuestWordsCount)
				window.removeEventListener('guestWordDeleted', reloadGuestWordsCount)
			}
		}
	}, [isUserLoggedIn, reloadGuestWordsCount])

	const sanitizeInput = (input) => {
		// Supprimer les caractères potentiellement dangereux
		return input
			.replace(/[<>]/g, '') // Empêcher les tags HTML
			.replace(/[{}]/g, '') // Empêcher les accolades
			.replace(/javascript:/gi, '') // Empêcher javascript:
			.replace(/on\w+=/gi, '') // Empêcher les event handlers
			.trim()
	}

	const validateTranslation = (value) => {
		if (value.length > MAX_TRANSLATION_LENGTH) {
			setTranslationError(`Maximum ${MAX_TRANSLATION_LENGTH} caractères`)
			return false
		}

		// Vérifier si ce n'est que des espaces
		if (value.trim().length === 0 && value.length > 0) {
			setTranslationError('La traduction ne peut pas être vide')
			return false
		}

		// Vérifier les caractères suspects répétés
		if (/(.)\1{10,}/.test(value)) {
			setTranslationError('Caractères répétés détectés')
			return false
		}

		setTranslationError('')
		return true
	}

	const handleTranslationChange = (e) => {
		const sanitized = sanitizeInput(e.target.value)
		setPersonalTranslation(sanitized)
		if (sanitized) {
			validateTranslation(sanitized)
		} else {
			setTranslationError('')
		}
	}

	// Calculer la position intelligemment pour éviter le débordement
	const getPosition = () => {
		// Vérifier si nous sommes côté client
		if (typeof window === 'undefined') {
			return {
				left: coordinates.x + 'px',
				top: coordinates.y + 'px',
			}
		}

		const viewportWidth = window.innerWidth
		const viewportHeight = window.innerHeight
		const padding = 20 // Marge de sécurité
		const isMobile = viewportWidth <= 600

		// Calculer la largeur du conteneur selon la taille d'écran
		const containerWidth =
			isMobile ? Math.min(viewportWidth - 40, 350) : 380
		const containerHeight = 500 // Hauteur maximale du conteneur (correspond au maxHeight du Paper)
		const offset = isMobile ? 25 : 2 // Plus d'espace sur mobile pour être sous le mot

		// Position de départ : très proche du mot cliqué
		let left = isMobile ? 20 : coordinates.x - 10 // Sur mobile, centrer horizontalement
		let top = coordinates.y + offset

		// Ajuster horizontalement
		// Si déborde à droite, positionner à gauche du point de clic
		if (left + containerWidth > viewportWidth - padding) {
			left = coordinates.x - containerWidth
			// Si déborde aussi à gauche, centrer autant que possible
			if (left < padding) {
				left = Math.max(padding, (viewportWidth - containerWidth) / 2)
			}
		}

		// S'assurer qu'on ne dépasse pas à gauche
		if (left < padding) {
			left = padding
		}

		// Ajuster verticalement
		// Si déborde en bas, positionner au-dessus du point de clic
		if (top + containerHeight > viewportHeight - padding) {
			top = coordinates.y - containerHeight - offset
			// Si déborde aussi en haut, ajuster pour être visible
			if (top < padding) {
				top = Math.max(padding, viewportHeight - containerHeight - padding)
			}
		}

		// S'assurer qu'on ne dépasse pas en haut
		if (top < padding) {
			top = padding
		}

		return {
			left: left + 'px',
			top: top + 'px',
		}
	}

	const position = getPosition()

	useEffect(() => {
		const checkIfClickedOutside = e => {
			if (isTranslationOpen && ref.current && !ref.current.contains(e.target)) {
				dispatch(toggleTranslationContainer(false))
				dispatch(cleanTranslation())
				// Dispatch event to resume video
				if (typeof window !== 'undefined') {
					window.dispatchEvent(new Event('translation-closed'))
				}
			}
		}
		document.addEventListener('mousedown', checkIfClickedOutside)

		return () => {
			document.removeEventListener('mousedown', checkIfClickedOutside)
		}
	}, [dispatch, isTranslationOpen])

	const addWord = e => {
		e.preventDefault()

		const translatedWord = personalTranslation
			? personalTranslation
			: e.target.textContent

		// Validation finale avant l'ajout
		if (personalTranslation && !validateTranslation(personalTranslation)) {
			return
		}

		// Sanitiser une dernière fois
		const sanitizedTranslation = sanitizeInput(translatedWord)

		if (!sanitizedTranslation || sanitizedTranslation.length === 0) {
			setTranslationError('La traduction ne peut pas être vide')
			return
		}

		const originalWord = translation.inf ? translation.inf : translation.word

		// Si l'utilisateur est connecté, utiliser Supabase
		if (isUserLoggedIn) {
			dispatch(
				addWordToDictionary({
					originalWord,
					translatedWord: sanitizedTranslation,
					userId,
					materialId,
					word_sentence,
					lang,
					userLearningLanguage,
					locale: lang,
				})
			)
		} else {
			// Si invité, utiliser localStorage
			const wordData = {
				word_ru: null,
				word_fr: null,
				word_en: null,
				word_sentence: word_sentence || '',
				material_id: materialId,
				word_lang: userLearningLanguage,
			}

			// La langue source (apprise) détermine où va originalWord
			if (userLearningLanguage === 'ru') {
				wordData.word_ru = originalWord
			} else if (userLearningLanguage === 'fr') {
				wordData.word_fr = originalWord
			} else if (userLearningLanguage === 'en') {
				wordData.word_en = originalWord
			}

			// La langue cible (de l'interface) détermine où va la traduction
			if (lang === 'ru') {
				wordData.word_ru = sanitizedTranslation
			} else if (lang === 'fr') {
				wordData.word_fr = sanitizedTranslation
			} else if (lang === 'en') {
				wordData.word_en = sanitizedTranslation
			}

			// Ajouter au dictionnaire invité
			const result = addGuestWord(wordData)

			if (result.success) {
				toast.success(t('word_added_success') || 'Mot ajouté au dictionnaire')
				setGuestWordsCount(result.wordsCount)

				// Émettre un événement pour notifier WordsContainer
				if (typeof window !== 'undefined') {
					window.dispatchEvent(new Event('guestWordAdded'))
				}
			} else if (result.error === 'limit_reached') {
				// Ne rien faire ici, on gère ça dans le render
				return
			} else if (result.error === 'duplicate') {
				toast.error(t('duplicate_translation') || 'Ce mot existe déjà dans votre dictionnaire')
			} else {
				toast.error(t('unexpected_error') || 'Erreur lors de l\'ajout du mot')
			}
		}

		dispatch(toggleTranslationContainer(false))
		setPersonalTranslation('')
		setTranslationError('')
		// Dispatch event to resume video
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new Event('translation-closed'))
		}
	}

	if (!isUserLoggedIn) {
		const hasDictionaryLimit = guestWordsCount >= GUEST_DICTIONARY_CONFIG.MAX_WORDS

		return (
			isTranslationOpen && (
				<Fade in={isTranslationOpen}>
					<Paper
						ref={ref}
						elevation={8}
						sx={{
							position: 'fixed',
							...position,
							width: { xs: 'calc(100vw - 40px)', sm: '380px' },
							maxWidth: '380px',
							maxHeight: '500px',
							borderRadius: 4,
							overflow: 'hidden',
							overflowX: 'hidden',
							background: isDark
								? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)'
								: 'linear-gradient(135deg, #fdfbfb 0%, #f7f7f7 100%)',
							boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
							zIndex: 1300,
							display: 'flex',
							flexDirection: 'column',
						}}>
						{/* Header */}
						<Box
							sx={{
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								p: 2,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<Translate sx={{ color: 'white' }} />
								<Typography variant='subtitle1' sx={{ color: 'white', fontWeight: 700 }}>
									{t('translation')}
								</Typography>
							</Box>
							<IconButton
								size='small'
								onClick={() => {
									dispatch(toggleTranslationContainer(false))
									dispatch(cleanTranslation())
									// Dispatch event to resume video
									if (typeof window !== 'undefined') {
										window.dispatchEvent(new Event('translation-closed'))
									}
								}}
								sx={{
									color: 'white',
									'&:hover': {
										backgroundColor: 'rgba(255, 255, 255, 0.2)',
									},
								}}>
								<Close />
							</IconButton>
						</Box>

						{translation_error && translation_error.includes('Limite de traductions atteinte') ? (
							/* Translation limit reached message */
							<Box sx={{ p: 3, textAlign: 'center' }}>
								<Typography variant='h6' sx={{ fontWeight: 600, mb: 2, color: '#f5576c' }}>
									{t('translation_limit_title')}
								</Typography>
								<Typography variant='body2' sx={{ mb: 3, color: isDark ? '#cbd5e1' : '#666' }}>
									{t('translation_limit_message')}
								</Typography>
								<Link href='/signup'>
									<Button
										variant='contained'
										fullWidth
										size='large'
										sx={primaryButton}>
										{t('noaccount')}
									</Button>
								</Link>
							</Box>
						) : translation_error ? (
							/* Error display */
							<Box sx={{ p: 3 }}>
								<Typography variant='h6' sx={{ fontWeight: 600, mb: 2 }}>
									{translation.word}
								</Typography>
								<Typography color='error' variant='body2'>
									{translation_error}
								</Typography>
							</Box>
						) : translation.word && translation.definitions ? (
							/* Translation display for guests */
							<>
								{/* Word info */}
								{translation.inf && (
									<Box sx={{ p: 2, backgroundColor: 'rgba(102, 126, 234, 0.08)' }}>
										<Stack direction='row' spacing={1} alignItems='center' flexWrap='wrap'>
											{translation.form && (
												<Chip
													label={translation.form}
													size='small'
													sx={{
														fontWeight: 600,
														background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
														color: 'white',
													}}
												/>
											)}
											<Typography variant='body2' sx={{ color: isDark ? '#94a3b8' : '#666' }}>
												→
											</Typography>
											<Typography variant='subtitle1' sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : 'inherit' }}>
												{translation.inf}
											</Typography>
										</Stack>
									</Box>
								)}

								<Divider />

								{/* Translations list - Clickable for guests (if dictionary not full) */}
								<Box sx={{ flex: 1, overflow: 'auto', overflowX: 'hidden', maxHeight: '250px' }}>
									<List sx={{ py: 0 }}>
										{translation.definitions.map((definition, index) => (
											<ListItem key={index} disablePadding>
												<ListItemButton
													onClick={hasDictionaryLimit ? undefined : addWord}
													disabled={hasDictionaryLimit}
													sx={{
														py: 1.5,
														px: 2,
														pl: 1.5,
														transition: 'all 0.2s ease',
														borderLeft: '3px solid transparent',
														opacity: hasDictionaryLimit ? 0.5 : 1,
														cursor: hasDictionaryLimit ? 'not-allowed' : 'pointer',
														'&:hover': hasDictionaryLimit ? {} : {
															backgroundColor: 'rgba(102, 126, 234, 0.08)',
															borderLeftColor: '#667eea',
															pl: 2.5,
														},
													}}>
													<Typography variant='body2' sx={{ fontWeight: 500, color: isDark ? '#f1f5f9' : 'inherit' }}>
														{definition}
													</Typography>
												</ListItemButton>
											</ListItem>
										))}
									</List>
								</Box>

								<Divider />

								{/* Info message for guests */}
								<Box sx={{ p: 2, backgroundColor: 'rgba(102, 126, 234, 0.05)' }}>
									{hasDictionaryLimit ? (
										<>
											<Typography variant='caption' sx={{ display: 'block', mb: 1.5, color: '#f5576c', fontWeight: 600 }}>
												⚠️ {t('dictionary_limit_title')} : supprimez des mots pour en ajouter de nouveaux
											</Typography>
											<Link href='/signup'>
												<Button
													variant='contained'
													fullWidth
													size='small'
													sx={secondaryButton}>
													{t('noaccount')}
												</Button>
											</Link>
										</>
									) : (
										<Typography variant='caption' sx={{ display: 'block', color: isDark ? '#cbd5e1' : '#666', fontWeight: 600, textAlign: 'center' }}>
											{t('click_translation_to_add')}
										</Typography>
									)}
								</Box>
							</>
						) : null}
					</Paper>
				</Fade>
			)
		)
	}

	return (
		isTranslationOpen &&
		!translation_loading && (
			<Fade in={isTranslationOpen}>
				<Paper
					ref={ref}
					elevation={8}
					sx={{
						position: 'fixed',
						...position,
						width: { xs: 'calc(100vw - 40px)', sm: '380px' },
						maxWidth: '380px',
						maxHeight: '500px',
						borderRadius: 4,
						overflow: 'hidden',
						overflowX: 'hidden',
						background: isDark
							? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)'
							: 'linear-gradient(135deg, #fdfbfb 0%, #f7f7f7 100%)',
						boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
						zIndex: 1300,
						display: 'flex',
						flexDirection: 'column',
					}}>
					{/* Header */}
					<Box
						sx={{
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							p: 2,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<Translate sx={{ color: 'white' }} />
							<Typography variant='subtitle1' sx={{ color: 'white', fontWeight: 700 }}>
								{t('translation')}
							</Typography>
						</Box>
						<IconButton
							size='small'
							onClick={() => {
								dispatch(toggleTranslationContainer(false))
								dispatch(cleanTranslation())
								// Dispatch event to resume video
								if (typeof window !== 'undefined') {
									window.dispatchEvent(new Event('translation-closed'))
								}
							}}
							sx={{
								color: 'white',
								'&:hover': {
									backgroundColor: 'rgba(255, 255, 255, 0.2)',
								},
							}}>
							<Close />
						</IconButton>
					</Box>

					{translation_error ? (
						<Box sx={{ p: 3 }}>
							<Typography variant='h6' sx={{ fontWeight: 600, mb: 2 }}>
								{translation.word}
							</Typography>
							<Typography color='error' variant='body2'>
								{translation_error}
							</Typography>
						</Box>
					) : (
						<>
							{/* Word info */}
							<Box sx={{ p: 2, backgroundColor: 'rgba(102, 126, 234, 0.08)' }}>
								<Stack direction='row' spacing={1} alignItems='center' flexWrap='wrap'>
									<Chip
										label={translation.form}
										size='small'
										sx={{
											fontWeight: 600,
											background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
											color: 'white',
										}}
									/>
									<Typography variant='body2' sx={{ color: isDark ? '#94a3b8' : '#666' }}>
										→
									</Typography>
									<Typography variant='subtitle1' sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : 'inherit' }}>
										{translation.inf}
									</Typography>
								</Stack>
							</Box>

							<Divider />

							{/* Translations list */}
							<Box sx={{ flex: 1, overflow: 'auto', overflowX: 'hidden', maxHeight: '250px' }}>
								<List sx={{ py: 0 }}>
									{translation.definitions?.map((definition, index) => (
										<ListItem key={index} disablePadding>
											<ListItemButton
												onClick={addWord}
												sx={{
													py: 1.5,
													px: 2,
													pl: 1.5,
													transition: 'all 0.2s ease',
													borderLeft: '3px solid transparent',
													'&:hover': {
														backgroundColor: 'rgba(102, 126, 234, 0.08)',
														borderLeftColor: '#667eea',
														pl: 2.5,
													},
												}}>
												<Typography variant='body2' sx={{ fontWeight: 500, color: isDark ? '#f1f5f9' : 'inherit' }}>
													{definition}
												</Typography>
											</ListItemButton>
										</ListItem>
									))}
								</List>
							</Box>

							<Divider />

							{/* Custom translation form */}
							<Box
								component='form'
								onSubmit={addWord}
								sx={{
									p: 2,
									backgroundColor: isDark ? 'rgba(30, 41, 59, 0.5)' : 'white',
								}}>
								<Typography
									variant='caption'
									sx={{
										display: 'block',
										mb: 1,
										color: isDark ? '#cbd5e1' : '#666',
										fontWeight: 600,
									}}>
									{t('custom_translation')}
								</Typography>
								<Stack direction='column' spacing={1}>
									<Stack direction='row' spacing={1}>
										<TextField
											fullWidth
											size='small'
											placeholder='votre traduction'
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
											type='submit'
											disabled={!personalTranslation || !!translationError}
											variant='contained'
											sx={{
												...secondaryButton,
												minWidth: 'auto',
												px: 2,
												alignSelf: 'flex-start',
											}}
											startIcon={<Add />}>
											{t('add')}
										</Button>
									</Stack>
									{personalTranslation && (
										<Typography
											variant='caption'
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
						</>
					)}
				</Paper>
			</Fade>
		)
	)
}

export default Translation
