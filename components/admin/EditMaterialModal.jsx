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
	Chip,
} from '@mui/material'
import { Close, Save, CloudUpload } from '@mui/icons-material'
import { useTranslations, useLocale } from 'next-intl'
import { supabase } from '@/lib/supabase'
import { optimizeImage } from '@/utils/imageOptimizer'

/**
 * Upload un fichier vers R2 via l'API route
 */
async function uploadToR2(path, file, contentType) {
	const formData = new FormData()
	formData.append('file', file)
	formData.append('path', path)
	formData.append('contentType', contentType)

	const response = await fetch('/api/upload-r2', {
		method: 'POST',
		body: formData,
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.error || 'Erreur upload R2')
	}

	return response.json()
}

const EditMaterialModal = ({ open, onClose, material, onSuccess }) => {
	const t = useTranslations('admin')
	const [formData, setFormData] = useState({})
	const [files, setFiles] = useState([]) // Fichiers à uploader
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		if (material) {
			setFormData({
				lang: material.locale || '',
				section: material.section || '',
				book_id: material.book_id || '',
				chapter_number: material.chapter_number || '',
				level: material.level || '',
				title: material.title || '',
				image_filename: material.image_filename || '',
				audio_filename: material.audio_filename || '',
				video_url: material.video_url || '',
				content: material.content?.replace(/<br\s*\/?>/gi, '\n') || '',
				content_accented: material.content_accented?.replace(/<br\s*\/?>/gi, '\n') || '',
			})
			// Réinitialiser les fichiers quand on ouvre le modal
			setFiles([])
		}
	}, [material])

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

		// Mettre à jour le nom dans formData
		const fieldName = fileType === 'image' ? 'image_filename' : 'audio_filename'
		setFormData(prev => ({
			...prev,
			[fieldName]: fileName,
		}))
	}

	const handleSave = async () => {
		setSaving(true)
		setError('')

		try {
			// Map pour stocker les fichiers optimisés
			const processedFilesMap = new Map()
			let finalFormData = { ...formData }

			// ÉTAPE 1: Optimiser les images si nécessaire
			if (files && files.length > 0) {
				for (const fileData of files) {
					if (fileData.fileType === 'image') {
						const optimized = await optimizeImage(fileData.file)

						// Stocker les fichiers optimisés pour l'upload
						processedFilesMap.set(fileData.fileName, { type: 'image', data: optimized })

						// Mettre à jour le nom du fichier dans formData
						finalFormData.image_filename = optimized.main.fileName
					}
				}
			}

			// ÉTAPE 2: Préparer les données pour la sauvegarde
			const dataToUpdate = {
				lang: finalFormData.locale,
				section: finalFormData.section,
				level: finalFormData.level,
				title: finalFormData.title,
				image_filename: finalFormData.image_filename || null,
				audio_filename: finalFormData.audio_filename || null,
				video_url: finalFormData.video_url || null,
				// Garder les sauts de ligne natifs (\n) - meilleure pratique
				content: finalFormData.content || '',
				content_accented: finalFormData.content_accented || '',
			}

			// Ajouter les champs spécifiques pour book-chapters
			if (finalFormData.section === 'book-chapters') {
				dataToUpdate.book_id = finalFormData.book_id ? parseInt(finalFormData.book_id) : null
				dataToUpdate.chapter_number = finalFormData.chapter_number ? parseInt(finalFormData.chapter_number) : null
			} else {
				dataToUpdate.book_id = null
				dataToUpdate.chapter_number = null
			}

			// ÉTAPE 3: Mettre à jour dans Supabase
			const { error: updateError } = await supabase
				.from('materials')
				.update(dataToUpdate)
				.eq('id', material.id)

			if (updateError) throw updateError

			// ÉTAPE 4: Uploader les fichiers vers R2 APRÈS la mise à jour réussie
			if (files && files.length > 0) {
				for (const fileData of files) {
					if (fileData.fileType === 'image' && processedFilesMap.has(fileData.fileName)) {
						const optimized = processedFilesMap.get(fileData.fileName).data

						// Upload de la version principale
						await uploadToR2(
							`image/materials/${optimized.main.fileName}`,
							optimized.main.file,
							'image/webp'
						)

						// Upload du thumbnail
						await uploadToR2(
							`image/materials/thumbnails/${optimized.thumbnail.fileName}`,
							optimized.thumbnail.file,
							'image/webp'
						)
					} else if (fileData.fileType === 'audio') {
						// Pour les fichiers audio, upload normal vers R2
						const contentType = fileData.file.type || 'audio/mpeg'
						const locale = finalFormData.locale || 'fr'
						const path = `audio/${locale}/${fileData.fileName}`

						await uploadToR2(path, fileData.file, contentType)
					}
				}
			}

			// Succès
			if (onSuccess) {
				onSuccess()
			}
			onClose()
		} catch (err) {
			console.error('Erreur lors de la sauvegarde:', err)
			setError(err.message || 'Une erreur est survenue')
		} finally {
			setSaving(false)
		}
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
				<IconButton onClick={onClose} size="small">
					<Close />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={{ pt: 6, pb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
				{error && (
					<Alert severity="error" sx={{ mb: 3 }}>
						{error}
					</Alert>
				)}

				<Grid container spacing={3}>
					{/* Langue */}
					<Grid item xs={12} sm={4}>
						<FormControl fullWidth>
							<InputLabel>{t('language')}</InputLabel>
							<Select
								value={formData.locale || ''}
								label={t('language')}
								onChange={(e) => handleChange('lang', e.target.value)}
								sx={{ borderRadius: 2 }}>
								<MenuItem value="fr">{t('french')}</MenuItem>
								<MenuItem value="ru">{t('russian')}</MenuItem>
								<MenuItem value="en">{t('english')}</MenuItem>
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
								sx={{ borderRadius: 2 }}>
								<ListSubheader sx={{ fontWeight: 700, color: '#667eea', bgcolor: '#F5F3FF' }}>
									📝 {t('textAndAudio')}
								</ListSubheader>
								<MenuItem value="dialogues">{t('sectionDialogues')}</MenuItem>
								<MenuItem value="culture">{t('sectionCulture')}</MenuItem>
								<MenuItem value="legends">{t('sectionLegends')}</MenuItem>
								<MenuItem value="slices-of-life">{t('sectionSlicesOfLife')}</MenuItem>
								<MenuItem value="beautiful-places">{t('sectionBeautifulPlaces')}</MenuItem>
								<MenuItem value="podcasts">{t('sectionPodcasts')}</MenuItem>
								<MenuItem value="short-stories">{t('sectionShortStories')}</MenuItem>
								<MenuItem value="book-chapters">{t('sectionBookChapters')}</MenuItem>

								<ListSubheader sx={{ fontWeight: 700, color: '#667eea', bgcolor: '#F5F3FF', mt: 1 }}>
									🎬 {t('videoCategory')}
								</ListSubheader>
								<MenuItem value="movie-trailers">{t('sectionMovieTrailers')}</MenuItem>
								<MenuItem value="movie-clips">{t('sectionMovieClips')}</MenuItem>
								<MenuItem value="cartoons">{t('sectionCartoons')}</MenuItem>
								<MenuItem value="eralash">{t('sectionEralash')}</MenuItem>
								<MenuItem value="galileo">{t('sectionGalileo')}</MenuItem>
								<MenuItem value="various-materials">{t('sectionVariousMaterials')}</MenuItem>

								<ListSubheader sx={{ fontWeight: 700, color: '#667eea', bgcolor: '#F5F3FF', mt: 1 }}>
									🎵 {t('musicCategory')}
								</ListSubheader>
								<MenuItem value="rock">{t('sectionRock')}</MenuItem>
								<MenuItem value="pop">{t('sectionPop')}</MenuItem>
								<MenuItem value="folk">{t('sectionFolk')}</MenuItem>
								<MenuItem value="variety">{t('sectionVariety')}</MenuItem>
								<MenuItem value="kids">{t('sectionKids')}</MenuItem>
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
								label={t('imageFileName')}
								value={formData.image_filename || ''}
								onChange={(e) => handleChange('image_filename', e.target.value)}
								placeholder="exemple: mon-image.webp"
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
								label={t('audioFileName')}
								value={formData.audio_filename || ''}
								onChange={(e) => handleChange('audio_filename', e.target.value)}
								placeholder="exemple: mon-audio.mp3"
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
								placeholder={t('videoUrlPlaceholder')}
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
					{formData.locale === 'ru' && (
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
					disabled={saving}
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
					disabled={saving}
					variant="contained"
					startIcon={saving ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <Save />}
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
					{saving ? t('saving') : t('save')}
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default EditMaterialModal
