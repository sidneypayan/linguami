import { useState, useEffect } from 'react'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Box,
	Typography,
	IconButton,
	Grid,
	Alert,
	CircularProgress,
	ListSubheader,
	Divider,
} from '@mui/material'
import { Close, Save, CloudUpload } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { useUpdateMaterial } from '@/lib/admin-client'

/**
 * Modal optimisé pour l'édition de materials
 * ✅ Utilise React Query + Server Actions
 * ✅ Optimisation d'images côté serveur (Sharp)
 * ✅ Validation Zod côté serveur
 * ✅ Sécurisé (admin vérifié côté serveur)
 */
const EditMaterialModal = ({ open, onClose, material, onSuccess }) => {
	const t = useTranslations('admin')

	// React Query mutation
	const updateMaterialMutation = useUpdateMaterial()

	// Form state
	const [formData, setFormData] = useState({})
	const [files, setFiles] = useState([]) // Fichiers à uploader

	// Charger les données du material quand le modal s'ouvre
	useEffect(() => {
		if (material) {
			setFormData({
				lang: material.lang || '',
				section: material.section || '',
				book_id: material.book_id || '',
				chapter_number: material.chapter_number || '',
				level: material.level || '',
				title: material.title || '',
				image_filename: material.image_filename || '',
				audio_filename: material.audio_filename || '',
				video_url: material.video_url || '',
				// Convertir <br> en \n pour l'édition
				content: material.content?.replace(/<br\s*\/?>/gi, '\n') || '',
				content_accented: material.content_accented?.replace(/<br\s*\/?>/gi, '\n') || '',
			})
			// Réinitialiser les fichiers
			setFiles([])
		}
	}, [material, open])

	const handleChange = (field, value) => {
		setFormData(prev => ({
			...prev,
			[field]: value,
		}))
	}

	// Gestion des uploads de fichiers
	const handleFileUpload = (e, fileType) => {
		const file = e.target.files?.[0]
		if (!file) return

		const fileName = file.name

		// Ajouter le fichier à la liste des fichiers à uploader
		setFiles(prev => {
			// Supprimer l'ancien fichier du même type s'il existe
			const filtered = prev.filter(f => f.fileType !== fileType)
			return [...filtered, { file, fileName, fileType }]
		})

		// Mettre à jour le nom dans formData (sera remplacé par le nom optimisé côté serveur)
		const fieldName = fileType === 'image' ? 'image_filename' : 'audio_filename'
		setFormData(prev => ({
			...prev,
			[fieldName]: fileName,
		}))
	}

	const handleSave = async () => {
		// Préparer les données
		const materialData = {
			lang: formData.lang,
			section: formData.section,
			level: formData.level,
			title: formData.title,
			content: formData.content || '',
			content_accented: formData.content_accented || '',
			video_url: formData.video_url || '',
		}

		// Ajouter les champs spécifiques pour book-chapters
		if (formData.section === 'book-chapters') {
			materialData.book_id = formData.book_id ? parseInt(formData.book_id) : null
			materialData.chapter_number = formData.chapter_number ? parseInt(formData.chapter_number) : null
		} else {
			materialData.book_id = null
			materialData.chapter_number = null
		}

		// Si pas de nouveaux fichiers mais des noms de fichiers dans le form, les garder
		if (!files.find(f => f.fileType === 'image') && formData.image_filename) {
			materialData.image_filename = formData.image_filename
		}
		if (!files.find(f => f.fileType === 'audio') && formData.audio_filename) {
			materialData.audio_filename = formData.audio_filename
		}

		// Appeler la mutation
		updateMaterialMutation.mutate(
			{
				materialId: material.id,
				materialData,
				files,
			},
			{
				onSuccess: () => {
					if (onSuccess) {
						onSuccess()
					}
					onClose()
				},
			}
		)
	}

	// Déterminer quels champs afficher selon la section
	const isBookChapter = formData.section === 'book-chapters'
	const needsImage = !isBookChapter
	const needsAudio = formData.section && [
		'dialogues',
		'culture',
		'legends',
		'slices-of-life',
		'beautiful-places',
		'podcasts',
		'short-stories',
	].includes(formData.section)
	const needsVideo = formData.section && [
		'movie-trailers',
		'movie-clips',
		'cartoons',
		'various-materials',
		'rock',
		'pop',
		'folk',
		'variety',
		'kids',
		'eralash',
		'galileo',
	].includes(formData.section)

	const isLoading = updateMaterialMutation.isPending

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="lg"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 3,
					maxHeight: '90vh',
					m: 2,
				},
			}}>
			<DialogTitle
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					pb: 2,
					bgcolor: 'background.paper',
					borderBottom: '1px solid',
					borderColor: 'divider',
				}}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<Box
						sx={{
							width: 48,
							height: 48,
							borderRadius: 2,
							bgcolor: '#667eea',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: 'white',
						}}>
						<Save />
					</Box>
					<Box>
						<Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B' }}>
							{t('editContent')}
						</Typography>
						<Typography variant="body2" sx={{ color: '#64748B' }}>
							{material?.title}
						</Typography>
					</Box>
				</Box>
				<IconButton onClick={onClose} size="small" disabled={isLoading}>
					<Close />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={{ pt: 6, pb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
				{updateMaterialMutation.isError && (
					<Alert severity="error" sx={{ mb: 3 }}>
						{updateMaterialMutation.error?.message || 'An error occurred'}
					</Alert>
				)}

				<Grid container spacing={3}>
					{/* Langue */}
					<Grid item xs={12} sm={4}>
						<FormControl fullWidth>
							<InputLabel>{t('language')}</InputLabel>
							<Select
								value={formData.lang || ''}
								label={t('language')}
								onChange={(e) => handleChange('lang', e.target.value)}
								disabled={isLoading}
								sx={{ borderRadius: 2 }}>
								<MenuItem value="fr">Français</MenuItem>
								<MenuItem value="ru">Русский</MenuItem>
								<MenuItem value="en">English</MenuItem>
							</Select>
						</FormControl>
					</Grid>

					{/* Niveau */}
					<Grid item xs={12} sm={4}>
						<FormControl fullWidth>
							<InputLabel>{t('level')}</InputLabel>
							<Select
								value={formData.level || ''}
								label={t('level')}
								onChange={(e) => handleChange('level', e.target.value)}
								disabled={isLoading}
								sx={{ borderRadius: 2 }}>
								<MenuItem value="beginner">{t('beginner')}</MenuItem>
								<MenuItem value="intermediate">{t('intermediate')}</MenuItem>
								<MenuItem value="advanced">{t('advanced')}</MenuItem>
							</Select>
						</FormControl>
					</Grid>

					{/* Section */}
					<Grid item xs={12} sm={4}>
						<FormControl fullWidth>
							<InputLabel>{t('section')}</InputLabel>
							<Select
								value={formData.section || ''}
								label={t('section')}
								onChange={(e) => handleChange('section', e.target.value)}
								disabled={isLoading}
								sx={{ borderRadius: 2 }}>
								<ListSubheader sx={{ fontWeight: 700, color: '#667eea', bgcolor: '#F5F3FF' }}>
									📝 {t('textAndAudio')}
								</ListSubheader>
								<MenuItem value="dialogues">Dialogues</MenuItem>
								<MenuItem value="culture">Culture</MenuItem>
								<MenuItem value="legends">Légendes</MenuItem>
								<MenuItem value="slices-of-life">Tranches de vie</MenuItem>
								<MenuItem value="beautiful-places">Beaux endroits</MenuItem>
								<MenuItem value="podcasts">Podcasts</MenuItem>
								<MenuItem value="short-stories">Nouvelles</MenuItem>
								<MenuItem value="book-chapters">Chapitres de livre</MenuItem>

								<ListSubheader sx={{ fontWeight: 700, color: '#667eea', bgcolor: '#F5F3FF', mt: 1 }}>
									🎬 Vidéos
								</ListSubheader>
								<MenuItem value="movie-trailers">Bandes-annonces</MenuItem>
								<MenuItem value="movie-clips">Extraits de films</MenuItem>
								<MenuItem value="cartoons">Dessins animés</MenuItem>
								<MenuItem value="eralash">Eralash</MenuItem>
								<MenuItem value="galileo">Galileo</MenuItem>
								<MenuItem value="various-materials">Divers</MenuItem>

								<ListSubheader sx={{ fontWeight: 700, color: '#667eea', bgcolor: '#F5F3FF', mt: 1 }}>
									🎵 Musique
								</ListSubheader>
								<MenuItem value="rock">Rock</MenuItem>
								<MenuItem value="pop">Pop</MenuItem>
								<MenuItem value="folk">Folk</MenuItem>
								<MenuItem value="variety">Variété</MenuItem>
								<MenuItem value="kids">Enfants</MenuItem>
							</Select>
						</FormControl>
					</Grid>

					{/* Titre */}
					<Grid item xs={12}>
						<TextField
							fullWidth
							label={t('title')}
							value={formData.title || ''}
							onChange={(e) => handleChange('title', e.target.value)}
							placeholder={t('materialTitlePlaceholder')}
							disabled={isLoading}
							sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
						/>
					</Grid>

					{/* Champs spécifiques pour book-chapters */}
					{isBookChapter && (
						<>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									type="number"
									label={t('bookId')}
									value={formData.book_id || ''}
									onChange={(e) => handleChange('book_id', e.target.value)}
									disabled={isLoading}
									sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									type="number"
									label={t('chapterNumber')}
									value={formData.chapter_number || ''}
									onChange={(e) => handleChange('chapter_number', e.target.value)}
									disabled={isLoading}
									sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
								/>
							</Grid>
						</>
					)}

					{/* Image */}
					{needsImage && (
						<Grid item xs={12}>
							<Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#475569' }}>
								{t('image')}
							</Typography>

							{/* Option 1: Upload de fichier */}
							<Button
								component='label'
								variant='outlined'
								startIcon={<CloudUpload />}
								fullWidth
								disabled={isLoading}
								sx={{
									py: 2,
									borderColor: '#667eea',
									color: '#667eea',
									fontWeight: 600,
									borderStyle: 'dashed',
									borderWidth: 2,
									textTransform: 'none',
									borderRadius: 2,
									'&:hover': {
										borderColor: '#5568d3',
										bgcolor: 'rgba(102, 126, 234, 0.05)',
									},
								}}>
								{t('uploadImage')}
								<input
									onChange={(e) => handleFileUpload(e, 'image')}
									hidden
									type='file'
									accept='image/*'
									disabled={isLoading}
								/>
							</Button>

							{/* OU divider */}
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
								<Divider sx={{ flex: 1 }} />
								<Typography variant='body2' sx={{ color: '#94a3b8', fontWeight: 600 }}>
									{t('or')}
								</Typography>
								<Divider sx={{ flex: 1 }} />
							</Box>

							{/* Option 2: Saisie manuelle du nom de fichier */}
							<TextField
								fullWidth
								label="Nom du fichier image"
								value={formData.image_filename || ''}
								onChange={(e) => handleChange('image_filename', e.target.value)}
								placeholder="exemple: mon-image.webp"
								disabled={isLoading}
								sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
								helperText={t('fileNameOnlyHelper')}
							/>

							{formData.image_filename && (
								<Alert severity='success' sx={{ mt: 2, borderRadius: 2 }}>
									<Typography variant='caption' sx={{ fontWeight: 600 }}>
										✓ {formData.image_filename}
									</Typography>
								</Alert>
							)}
						</Grid>
					)}

					{/* Audio */}
					{needsAudio && (
						<Grid item xs={12}>
							<Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#475569' }}>
								{t('audio')}
							</Typography>

							{/* Option 1: Upload de fichier */}
							<Button
								component='label'
								variant='outlined'
								startIcon={<CloudUpload />}
								fullWidth
								disabled={isLoading}
								sx={{
									py: 2,
									borderColor: '#667eea',
									color: '#667eea',
									fontWeight: 600,
									borderStyle: 'dashed',
									borderWidth: 2,
									textTransform: 'none',
									borderRadius: 2,
									'&:hover': {
										borderColor: '#5568d3',
										bgcolor: 'rgba(102, 126, 234, 0.05)',
									},
								}}>
								{t('uploadAudio')}
								<input
									onChange={(e) => handleFileUpload(e, 'audio')}
									hidden
									type='file'
									accept='audio/*'
									disabled={isLoading}
								/>
							</Button>

							{/* OU divider */}
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
								<Divider sx={{ flex: 1 }} />
								<Typography variant='body2' sx={{ color: '#94a3b8', fontWeight: 600 }}>
									{t('or')}
								</Typography>
								<Divider sx={{ flex: 1 }} />
							</Box>

							{/* Option 2: Saisie manuelle du nom de fichier */}
							<TextField
								fullWidth
								label="Nom du fichier audio"
								value={formData.audio_filename || ''}
								onChange={(e) => handleChange('audio_filename', e.target.value)}
								placeholder="exemple: mon-audio.mp3"
								disabled={isLoading}
								sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
								helperText={t('fileNameOnlyHelper')}
							/>

							{formData.audio_filename && (
								<Alert severity='success' sx={{ mt: 2, borderRadius: 2 }}>
									<Typography variant='caption' sx={{ fontWeight: 600 }}>
										✓ {formData.audio_filename}
									</Typography>
								</Alert>
							)}
						</Grid>
					)}

					{/* Vidéo */}
					{needsVideo && (
						<Grid item xs={12}>
							<TextField
								fullWidth
								label={t('videoUrl')}
								value={formData.video_url || ''}
								onChange={(e) => handleChange('video_url', e.target.value)}
								placeholder="https://www.youtube.com/watch?v=..."
								disabled={isLoading}
								sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
							/>
						</Grid>
					)}

					{/* Texte sans accents */}
					<Grid item xs={12}>
						<TextField
							fullWidth
							multiline
							minRows={12}
							maxRows={25}
							label={t('textWithoutAccents')}
							value={formData.content || ''}
							onChange={(e) => handleChange('content', e.target.value)}
							placeholder={t('textWithoutAccentsPlaceholder')}
							disabled={isLoading}
							sx={{
								'& .MuiOutlinedInput-root': {
									borderRadius: 2,
								},
								'& .MuiInputBase-inputMultiline': {
									minHeight: '30vh',
									maxHeight: '50vh',
								}
							}}
						/>
					</Grid>

					{/* Texte avec accents - uniquement pour le russe */}
					{formData.lang === 'ru' && (
						<Grid item xs={12}>
							<TextField
								fullWidth
								multiline
								minRows={12}
								maxRows={25}
								label={t('textWithAccents')}
								value={formData.content_accented || ''}
								onChange={(e) => handleChange('content_accented', e.target.value)}
								placeholder={t('textWithAccentsPlaceholder')}
								disabled={isLoading}
								sx={{
									'& .MuiOutlinedInput-root': {
										borderRadius: 2,
									},
									'& .MuiInputBase-inputMultiline': {
										minHeight: '30vh',
										maxHeight: '50vh',
									}
								}}
							/>
						</Grid>
					)}
				</Grid>
			</DialogContent>

			<DialogActions sx={{ p: 3, pt: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
				<Button
					onClick={onClose}
					disabled={isLoading}
					sx={{
						textTransform: 'none',
						fontWeight: 600,
						color: '#64748B',
						px: 3,
					}}>
					{t('cancel')}
				</Button>
				<Button
					onClick={handleSave}
					disabled={isLoading}
					variant="contained"
					startIcon={isLoading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <Save />}
					sx={{
						bgcolor: '#667eea',
						color: 'white',
						px: 3,
						py: 1.2,
						borderRadius: 2,
						textTransform: 'none',
						fontWeight: 600,
						boxShadow: 'none',
						'&:hover': {
							bgcolor: '#5568d3',
							boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
						},
						'&:disabled': {
							bgcolor: '#CBD5E1',
							color: 'white',
						},
					}}>
					{isLoading ? t('saving') : t('save')}
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default EditMaterialModal
