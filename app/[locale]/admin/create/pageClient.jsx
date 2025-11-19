'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import {
	Box,
	Container,
	Typography,
	Button,
	Paper,
	Alert,
	Fade,
	IconButton,
	Chip,
	LinearProgress,
} from '@mui/material'
import { CreatePostForm, CreateMaterialForm } from '@/components'
import { useCreateMaterial } from '@/lib/admin-client'
import { materialData, postData } from '@/utils/constants'
import {
	ArrowBack,
	CheckCircle,
	Article,
	LibraryBooks,
	Save,
} from '@mui/icons-material'
import AdminNavbar from '@/components/admin/AdminNavbar'
import { useUserContext } from '@/context/user'
import { optimizeImage } from '@/utils/imageOptimizer'
import { logger } from '@/utils/logger'

const CreateMaterial = () => {
	const t = useTranslations('admin')
	const locale = useLocale()
	const [formData, setFormData] = useState(materialData)
	const [files, setFiles] = useState([])
	const [contentType, setContentType] = useState('materials')

	const router = useRouter()
	const { isUserAdmin, isBootstrapping } = useUserContext()
	const createMaterialMutation = useCreateMaterial()

	// Redirect if not admin
	useEffect(() => {
		if (!isBootstrapping && !isUserAdmin) {
			router.push(`/${locale}`)
		}
	}, [isUserAdmin, isBootstrapping, router, locale])

	const toggleContent = (type) => {
		setContentType(type)
		setFormData(type === 'materials' ? materialData : postData)
		createMaterialMutation.reset() // Clear any previous errors
	}

	const handleChange = async e => {
		let { name, value } = e.target

		// Si c'est un upload de fichier (image_filename ou audio_filename)
		if ((name === 'image_filename' || name === 'audio_filename') && e.target.files) {
			const file = e.target.files[0]
			if (!file) return

			// Garder le fileType comme 'image' ou 'audio' pour la logique d'upload
			const fileType = name === 'image_filename' ? 'image' : 'audio'

			// Optimiser l'image côté client avant upload
			if (fileType === 'image') {
				try {
					const optimized = await optimizeImage(file)
					value = optimized.main.fileName

					setFiles(prev => {
						return [...prev, {
							file: optimized.main.file,
							fileName: optimized.main.fileName,
							fileType
						}]
					})

					logger.info(`Image optimized: ${file.name} (${(file.size / 1024).toFixed(0)}KB) → ${optimized.main.fileName} (${(optimized.main.size / 1024).toFixed(0)}KB)`)
				} catch (error) {
					logger.error('Image optimization failed, using original file:', error)
					// Fallback : utiliser le fichier original
					value = file.name
					setFiles(prev => {
						return [...prev, { file, fileName: value, fileType }]
					})
				}
			} else {
				// Audio : pas d'optimisation, utiliser le fichier original
				value = file.name
				setFiles(prev => {
					return [...prev, { file, fileName: value, fileType }]
				})
			}
		}

		// Pour tous les cas (upload ou saisie manuelle), mettre à jour formData
		setFormData(prev => {
			return { ...prev, [name]: value }
		})
	}

	const submitContent = async e => {
		e.preventDefault()

		if (contentType !== 'materials') {
			// TODO: Handle posts creation when migrating posts
			return
		}

		// Prepare material data
		const materialData = {
			lang: formData.lang,
			section: formData.section,
			level: formData.level,
			title: formData.title,
			content: formData.content || '',
			content_accented: formData.content_accented || '',
			video_url: formData.video_url || '',
		}

		// Add book-specific fields if needed
		if (formData.section === 'book-chapters') {
			materialData.book_id = formData.book_id ? parseInt(formData.book_id) : null
			materialData.chapter_number = formData.chapter_number ? parseInt(formData.chapter_number) : null
		}

		// Submit with mutation
		createMaterialMutation.mutate(
			{ materialData, files },
			{
				onSuccess: () => {
					router.back()
				}
			}
		)
	}


	// Validate all required fields for publishing
	const canPublish = () => {
		if (contentType === 'posts') {
			return !!(
				formData.lang &&
				formData.title &&
				formData.title.trim() &&
				formData.body &&
				formData.body.trim()
			)
		} else {
			// Materials - vérifier tous les champs obligatoires
			const hasLang = !!formData.lang
			const hasLevel = !!formData.level
			const hasSection = !!formData.section
			const hasTitle = !!(formData.title && typeof formData.title === 'string' && formData.title.trim())
			const hasContent = !!(formData.content && typeof formData.content === 'string' && formData.content.trim())

			let basicValid = hasLang && hasLevel && hasSection && hasTitle && hasContent

			// Si book-chapters, vérifier book_id et chapter_number
			if (formData.section === 'book-chapters') {
				// Pour les champs numériques, vérifier qu'ils existent et ne sont pas vides
				const bookIdStr = String(formData.book_id || '').trim()
				const chapterStr = String(formData.chapter_number || '').trim()
				const hasBookId = bookIdStr !== '' && bookIdStr !== '0'
				const hasChapter = chapterStr !== '' && chapterStr !== '0'

				return basicValid && hasBookId && hasChapter
			}

			// Pour les autres sections, au moins un média est requis
			const hasMedia = !!(formData.image_filename || formData.audio_filename || formData.video_url)
			return basicValid && hasMedia
		}
	}

	// Calculate form completion based on actual required fields
	const calculateProgress = () => {
		if (contentType === 'posts') {
			const requiredFields = ['lang', 'title', 'body']
			const filled = requiredFields.filter(field => formData[field] && formData[field].trim()).length
			return (filled / requiredFields.length) * 100
		} else {
			// Materials - base required fields
			let requiredFieldsCount = 5 // lang, level, section, title, content
			let filledCount = 0

			// Vérifier les champs de base
			if (formData.lang) filledCount++
			if (formData.level) filledCount++
			if (formData.section) filledCount++
			if (formData.title && formData.title.trim()) filledCount++
			if (formData.content && formData.content.trim()) filledCount++

			// Si book-chapters, ajouter book_id et chapter_number
			if (formData.section === 'book-chapters') {
				requiredFieldsCount += 2
				const bookIdStr = String(formData.book_id || '').trim()
				const chapterStr = String(formData.chapter_number || '').trim()
				if (bookIdStr !== '' && bookIdStr !== '0') filledCount++
				if (chapterStr !== '' && chapterStr !== '0') filledCount++
			} else {
				// Pour les autres sections, ajouter le média requis
				requiredFieldsCount += 1
				const hasMedia = !!(formData.image_filename || formData.audio_filename || formData.video_url)
				if (hasMedia) filledCount++
			}

			return (filledCount / requiredFieldsCount) * 100
		}
	}

	const progress = calculateProgress()
	const publishable = canPublish()

	// Show nothing while bootstrapping or not admin
	if (isBootstrapping || !isUserAdmin) {
		return null
	}

	return (
		<Box
			sx={{
				minHeight: '100vh',
				bgcolor: '#FAFBFC',
			}}>
			{/* Admin Navbar */}
			<AdminNavbar activePage="create" />

			{/* Header */}
			<Box
				sx={{
					bgcolor: 'white',
					borderBottom: '1px solid',
					borderColor: 'divider',
					position: 'sticky',
					top: 0,
					zIndex: 1100,
					boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
				}}>
				<Container maxWidth="lg">
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							py: 2,
							gap: 2,
							flexWrap: 'wrap',
						}}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
							<IconButton
								onClick={() => router.back()}
								sx={{
									bgcolor: 'background.paper',
									'&:hover': {
										bgcolor: '#E2E8F0',
									},
								}}>
								<ArrowBack />
							</IconButton>
							<Box>
								<Typography
									variant='h5'
									sx={{
										fontWeight: 700,
										color: '#1E293B',
										letterSpacing: '-0.5px',
									}}>
									{t('createContent')}
								</Typography>
								<Typography variant='body2' sx={{ color: '#64748B' }}>
									{contentType === 'materials' ? t('materialContent') : t('blogArticle')}
								</Typography>
							</Box>
						</Box>

						<Box sx={{ display: 'flex', gap: 1 }}>
							<Chip
								icon={<LibraryBooks fontSize='small' />}
								label={t('material')}
								onClick={() => toggleContent('materials')}
								variant={contentType === 'materials' ? 'filled' : 'outlined'}
								sx={{
									bgcolor: contentType === 'materials' ? '#667eea' : 'transparent',
									color: contentType === 'materials' ? 'white' : '#667eea',
									borderColor: '#667eea',
									fontWeight: 600,
									'&:hover': {
										bgcolor: contentType === 'materials' ? '#5568d3' : 'rgba(102, 126, 234, 0.1)',
									},
								}}
							/>
							<Chip
								icon={<Article fontSize='small' />}
								label={t('article')}
								onClick={() => toggleContent('posts')}
								variant={contentType === 'posts' ? 'filled' : 'outlined'}
								sx={{
									bgcolor: contentType === 'posts' ? '#667eea' : 'transparent',
									color: contentType === 'posts' ? 'white' : '#667eea',
									borderColor: '#667eea',
									fontWeight: 600,
									'&:hover': {
										bgcolor: contentType === 'posts' ? '#5568d3' : 'rgba(102, 126, 234, 0.1)',
									},
								}}
							/>
						</Box>
					</Box>

					{/* Progress Bar */}
					<Box sx={{ pb: 2 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
							<Typography variant='caption' sx={{ color: '#64748B', fontWeight: 600 }}>
								{t('progression')}
							</Typography>
							<Typography variant='caption' sx={{ color: '#667eea', fontWeight: 700 }}>
								{Math.round(progress)}%
							</Typography>
						</Box>
						<LinearProgress
							variant='determinate'
							value={progress}
							sx={{
								height: 6,
								borderRadius: 3,
								bgcolor: '#E2E8F0',
								'& .MuiLinearProgress-bar': {
									bgcolor: '#667eea',
									borderRadius: 3,
								},
							}}
						/>
					</Box>
				</Container>
			</Box>

			<Container maxWidth="lg" sx={{ py: 4 }}>
				{/* Error Alert */}
				{createMaterialMutation.error && (
					<Fade in>
						<Alert
							severity='error'
							sx={{
								mb: 3,
								borderRadius: 2,
								border: '1px solid',
								borderColor: 'error.light',
							}}>
							{createMaterialMutation.error.message}
						</Alert>
					</Fade>
				)}

				{/* Main Form */}
				<Paper
					elevation={0}
					sx={{
						borderRadius: 3,
						overflow: 'hidden',
						border: '1px solid',
						borderColor: 'divider',
					}}>
					<Box sx={{ p: { xs: 3, md: 4 } }}>
						<form onSubmit={submitContent}>
							{contentType === 'posts' ? (
								<CreatePostForm formData={formData} handleChange={handleChange} />
							) : (
								<CreateMaterialForm
									formData={formData}
									handleChange={handleChange}
								/>
							)}

							{/* Form Actions */}
							<Box
								sx={{
									mt: 4,
									pt: 3,
									borderTop: '1px solid',
									borderColor: 'divider',
									display: 'flex',
									justifyContent: 'flex-end',
									gap: 2,
								}}>
								<Button
									type='submit'
									variant='contained'
									disabled={createMaterialMutation.isPending || !publishable}
									startIcon={<CheckCircle />}
									sx={{
										bgcolor: '#10B981',
										color: 'white',
										px: 4,
										py: 1.5,
										borderRadius: 2,
										textTransform: 'none',
										fontWeight: 600,
										boxShadow: 'none',
										'&:hover': {
											bgcolor: '#059669',
											boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
										},
										'&:disabled': {
											bgcolor: '#94A3B8',
											color: 'white',
										},
									}}>
									{createMaterialMutation.isPending ? t('saving') : t('publish')}
								</Button>
							</Box>
						</form>
					</Box>
				</Paper>

				{/* Help Text */}
				<Box sx={{ mt: 3, textAlign: 'center' }}>
					<Typography variant='caption' sx={{ color: '#94A3B8' }}>
						{!publishable
							? t('formProgress')
							: t('formReady')
						}
					</Typography>
				</Box>
			</Container>
		</Box>
	)
}

export default CreateMaterial
