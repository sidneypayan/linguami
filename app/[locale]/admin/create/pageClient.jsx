'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { supabase } from '@/lib/supabase'
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
import {
	createContent,
	updateContent,
	toggleContentType,
} from '@/features/content/contentSlice'
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

const CreateMaterial = () => {
	const t = useTranslations('admin')
	const locale = useLocale()
	const [formData, setFormData] = useState(materialData)
	const [files, setFiles] = useState([])

	const router = useRouter()
	const { isUserAdmin, isBootstrapping } = useUserContext()
	const dispatch = useDispatch()
	const {
		contentType,
		editingContent,
		isEditingContent,
		create_content_error,
		create_content_loading,
	} = useSelector(store => store.content)

	// Redirect if not admin
	useEffect(() => {
		if (!isBootstrapping && !isUserAdmin) {
			router.push(`/${locale}`)
		}
	}, [isUserAdmin, isBootstrapping, router, locale])

	const toggleContent = (type) => {
		dispatch(toggleContentType(type))
		setFormData(type === 'materials' ? materialData : postData)
	}

	useEffect(() => {
		if (!create_content_error)
			setFormData(contentType === 'materials' ? materialData : postData)
	}, [create_content_error, contentType])

	const handleChange = e => {
		let { name, value } = e.target

		// Si c'est un upload de fichier (image_filename ou audio_filename)
		if ((name === 'image_filename' || name === 'audio_filename') && e.target.files) {
			const file = e.target.files[0]
			if (!file) return

			value = file.name

			// Garder le fileType comme 'image' ou 'audio' pour la logique d'upload
			const fileType = name === 'image_filename' ? 'image' : 'audio'

			setFiles(prev => {
				return [...prev, { file, fileName: value, fileType }]
			})
		}

		// Pour tous les cas (upload ou saisie manuelle), mettre à jour formData
		setFormData(prev => {
			return { ...prev, [name]: value }
		})
	}

	const submitContent = async e => {
		e.preventDefault()

		// DEBUG: Vérifier la session utilisateur
		const { data: { user } } = await supabase.auth.getUser()
		console.log('🔍 DEBUG - User ID:', user?.id)
		console.log('🔍 DEBUG - User Email:', user?.email)

		try {
			let cleanedFormData = { ...formData }

			if (contentType !== 'posts') {
				cleanedFormData = {
					...formData,
					// Garder les sauts de ligne natifs (\n) - meilleure pratique
					content: formData.content || '',
					content_accented: formData.content_accented || '',
				}
			}

			if (!isEditingContent && contentType !== 'posts') {
				await dispatch(
					createContent({ content: cleanedFormData, contentType, files })
				).unwrap()
			} else if (!isEditingContent && contentType === 'posts') {
				await dispatch(
					createContent({ content: formData, contentType })
				).unwrap()
			} else if (isEditingContent) {
				await dispatch(
					updateContent({ content: cleanedFormData, contentType })
				).unwrap()
			}

			router.back()
		} catch (err) {
			console.error('Erreur lors de l\'envoi du contenu:', err)
		}
	}

	useEffect(() => {
		if (Object.keys(editingContent).length > 0) {
			const formattedContent = {
				...editingContent,
			}

			if (contentType !== 'posts' && editingContent.content) {
				// Conversion <br> → \n pour rétrocompatibilité (anciennes données)
				// Après la migration DB, cette conversion ne sera plus nécessaire
				formattedContent.content = editingContent.content.replace(/<br\s*\/?>/gi, '\n')
				formattedContent.content_accented =
					editingContent.content_accented?.replace(/<br\s*\/?>/gi, '\n') || ''
			}

			setFormData(formattedContent)
		}
	}, [editingContent, contentType])

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
									{isEditingContent ? t('editContent') : t('createContent')}
								</Typography>
								<Typography variant='body2' sx={{ color: '#64748B' }}>
									{contentType === 'materials' ? t('materialContent') : t('blogArticle')}
								</Typography>
							</Box>
						</Box>

						{!isEditingContent && (
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
						)}
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
				{create_content_error && (
					<Fade in>
						<Alert
							severity='error'
							sx={{
								mb: 3,
								borderRadius: 2,
								border: '1px solid',
								borderColor: 'error.light',
							}}>
							{create_content_error}
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
									disabled={create_content_loading || !publishable}
									startIcon={isEditingContent ? <Save /> : <CheckCircle />}
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
									{create_content_loading
										? t('saving')
										: isEditingContent
										? t('update')
										: t('publish')}
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
