import { useState, useEffect, useRef } from 'react'
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
import { Close, Save, CloudUpload, Image as ImageIcon, AudioFile, Delete } from '@mui/icons-material'
import useTranslation from 'next-translate/useTranslation'
import { supabase } from '../../lib/supabase'

const EditMaterialModal = ({ open, onClose, material, onSuccess }) => {
	const { t } = useTranslation('admin')
	const [formData, setFormData] = useState({})
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState('')
	const [uploading, setUploading] = useState({ audio: false, image: false })
	const [uploadedFiles, setUploadedFiles] = useState({ audio: null, image: null })
	const audioInputRef = useRef(null)
	const imageInputRef = useRef(null)

	useEffect(() => {
		if (material) {
			setFormData({
				lang: material.lang || '',
				section: material.section || '',
				book_id: material.book_id || '',
				chapter_number: material.chapter_number || '',
				level: material.level || '',
				title: material.title || '',
				image: material.image || '',
				audio: material.audio || '',
				video: material.video || '',
				body: material.body?.replace(/<br\s*\/?>/gi, '\n') || '',
				body_accents: material.body_accents?.replace(/<br\s*\/?>/gi, '\n') || '',
			})
		}
	}, [material])

	const handleChange = (field, value) => {
		setFormData(prev => ({
			...prev,
			[field]: value,
		}))
	}

	const handleFileUpload = async (type) => {
		const inputRef = type === 'audio' ? audioInputRef : imageInputRef
		const file = inputRef.current?.files[0]
		if (!file) return

		setUploading(prev => ({ ...prev, [type]: true }))
		setError('')

		try {
			// Générer un nom de fichier unique
			const timestamp = Date.now()
			const fileExt = file.name.split('.').pop()
			const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`
			const filePath = `${type}/${fileName}`

			// Upload vers Supabase Storage
			const { error: uploadError } = await supabase.storage
				.from('linguami')
				.upload(filePath, file, {
					cacheControl: '3600',
					upsert: false
				})

			if (uploadError) throw uploadError

			// Stocker le nom du fichier (pas l'URL complète)
			setUploadedFiles(prev => ({ ...prev, [type]: fileName }))
			handleChange(type, fileName)

		} catch (err) {
			console.error(`Erreur upload ${type}:`, err)
			setError(err.message || `Erreur lors de l'upload du fichier ${type}`)
		} finally {
			setUploading(prev => ({ ...prev, [type]: false }))
		}
	}

	const handleRemoveUpload = (type) => {
		setUploadedFiles(prev => ({ ...prev, [type]: null }))
		handleChange(type, '')
		// Reset l'input file
		const inputRef = type === 'audio' ? audioInputRef : imageInputRef
		if (inputRef.current) {
			inputRef.current.value = ''
		}
	}

	const handleSave = async () => {
		setSaving(true)
		setError('')

		try {
			// Préparer les données pour la sauvegarde
			const dataToUpdate = {
				lang: formData.lang,
				section: formData.section,
				level: formData.level,
				title: formData.title,
				image: formData.image || null,
				audio: formData.audio || null,
				video: formData.video || null,
				body: formData.body?.replace(/(\r\n|\n|\r)/gm, '<br>') || '',
				body_accents: formData.body_accents?.replace(/(\r\n|\n|\r)/gm, '<br>') || '',
			}

			// Ajouter les champs spécifiques pour book-chapters
			if (formData.section === 'book-chapters') {
				dataToUpdate.book_id = formData.book_id ? parseInt(formData.book_id) : null
				dataToUpdate.chapter_number = formData.chapter_number ? parseInt(formData.chapter_number) : null
			} else {
				dataToUpdate.book_id = null
				dataToUpdate.chapter_number = null
			}

			// Mettre à jour dans Supabase
			const { error: updateError } = await supabase
				.from('materials')
				.update(dataToUpdate)
				.eq('id', material.id)

			if (updateError) throw updateError

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
			maxWidth="md"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 3,
				},
			}}>
			<DialogTitle
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					pb: 2,
					bgcolor: '#F8FAFC',
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

			<DialogContent sx={{ pt: 4, pb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
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
								value={formData.lang || ''}
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
								<MenuItem value="débutant">{t('beginner')}</MenuItem>
								<MenuItem value="intermédiaire">{t('intermediate')}</MenuItem>
								<MenuItem value="avancé">{t('advanced')}</MenuItem>
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
							<Box sx={{ mb: 2 }}>
								<Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#475569' }}>
									Image
								</Typography>
								<Divider sx={{ mb: 2 }} />
							</Box>

							{/* Option 1: Upload de fichier */}
							<Box sx={{ mb: 2 }}>
								<input
									ref={imageInputRef}
									type="file"
									accept="image/*"
									style={{ display: 'none' }}
									onChange={() => handleFileUpload('image')}
								/>
								<Button
									variant="outlined"
									startIcon={uploading.image ? <CircularProgress size={16} /> : <CloudUpload />}
									onClick={() => imageInputRef.current?.click()}
									disabled={uploading.image || !!formData.image}
									fullWidth
									sx={{
										py: 1.5,
										borderRadius: 2,
										textTransform: 'none',
										borderStyle: 'dashed',
										borderWidth: 2,
										color: '#667eea',
										borderColor: '#667eea',
										'&:hover': {
											borderColor: '#5568d3',
											bgcolor: 'rgba(102, 126, 234, 0.05)',
										},
									}}>
									{uploading.image ? 'Upload en cours...' : 'Upload une image'}
								</Button>
							</Box>

							{/* OU divider */}
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
								<Divider sx={{ flex: 1 }} />
								<Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
									OU
								</Typography>
								<Divider sx={{ flex: 1 }} />
							</Box>

							{/* Option 2: Saisie manuelle du nom de fichier */}
							<TextField
								fullWidth
								label="Nom du fichier image"
								value={formData.image || ''}
								onChange={(e) => handleChange('image', e.target.value)}
								placeholder="exemple: mon-image.jpg"
								disabled={uploading.image}
								InputProps={{
									startAdornment: uploadedFiles.image && (
										<Chip
											label="Uploadé"
											size="small"
											color="success"
											sx={{ mr: 1 }}
											onDelete={() => handleRemoveUpload('image')}
											deleteIcon={<Delete />}
										/>
									),
								}}
								sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
								helperText="Saisir uniquement le nom du fichier (ex: image.jpg), pas l'URL complète"
							/>
						</Grid>
					)}

					{/* Audio */}
					{needsAudio && (
						<Grid item xs={12}>
							<Box sx={{ mb: 2 }}>
								<Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#475569' }}>
									Audio
								</Typography>
								<Divider sx={{ mb: 2 }} />
							</Box>

							{/* Option 1: Upload de fichier */}
							<Box sx={{ mb: 2 }}>
								<input
									ref={audioInputRef}
									type="file"
									accept="audio/*"
									style={{ display: 'none' }}
									onChange={() => handleFileUpload('audio')}
								/>
								<Button
									variant="outlined"
									startIcon={uploading.audio ? <CircularProgress size={16} /> : <CloudUpload />}
									onClick={() => audioInputRef.current?.click()}
									disabled={uploading.audio || !!formData.audio}
									fullWidth
									sx={{
										py: 1.5,
										borderRadius: 2,
										textTransform: 'none',
										borderStyle: 'dashed',
										borderWidth: 2,
										color: '#667eea',
										borderColor: '#667eea',
										'&:hover': {
											borderColor: '#5568d3',
											bgcolor: 'rgba(102, 126, 234, 0.05)',
										},
									}}>
									{uploading.audio ? 'Upload en cours...' : 'Upload un fichier audio'}
								</Button>
							</Box>

							{/* OU divider */}
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
								<Divider sx={{ flex: 1 }} />
								<Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
									OU
								</Typography>
								<Divider sx={{ flex: 1 }} />
							</Box>

							{/* Option 2: Saisie manuelle du nom de fichier */}
							<TextField
								fullWidth
								label="Nom du fichier audio"
								value={formData.audio || ''}
								onChange={(e) => handleChange('audio', e.target.value)}
								placeholder="exemple: mon-audio.mp3"
								disabled={uploading.audio}
								InputProps={{
									startAdornment: uploadedFiles.audio && (
										<Chip
											label="Uploadé"
											size="small"
											color="success"
											sx={{ mr: 1 }}
											onDelete={() => handleRemoveUpload('audio')}
											deleteIcon={<Delete />}
										/>
									),
								}}
								sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
								helperText="Saisir uniquement le nom du fichier (ex: audio.mp3), pas l'URL complète"
							/>
						</Grid>
					)}

					{/* Vidéo */}
					{needsVideo && (
						<Grid item xs={12}>
							<TextField
								fullWidth
								label={t('videoUrl')}
								value={formData.video || ''}
								onChange={(e) => handleChange('video', e.target.value)}
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
							rows={6}
							label={t('textWithoutAccents')}
							value={formData.body || ''}
							onChange={(e) => handleChange('body', e.target.value)}
							placeholder={t('textWithoutAccentsPlaceholder')}
							sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
						/>
					</Grid>

					{/* Texte avec accents */}
					<Grid item xs={12}>
						<TextField
							fullWidth
							multiline
							rows={6}
							label={t('textWithAccents')}
							value={formData.body_accents || ''}
							onChange={(e) => handleChange('body_accents', e.target.value)}
							placeholder={t('textWithAccentsPlaceholder')}
							sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
						/>
					</Grid>
				</Grid>
			</DialogContent>

			<DialogActions sx={{ p: 3, pt: 2, bgcolor: '#F8FAFC', borderTop: '1px solid', borderColor: 'divider' }}>
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
