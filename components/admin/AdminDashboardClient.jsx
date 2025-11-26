'use client'

import React from 'react'
import { Link } from '@/i18n/navigation'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import {
	Box,
	Container,
	Typography,
	Tabs,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Chip,
	Stack,
	IconButton,
	Tooltip,
	alpha,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	CircularProgress,
	useTheme,
} from '@mui/material'
import {
	Add,
	Visibility,
	TrendingUp,
	LibraryBooks,
	MenuBook,
	VideoLibrary,
	Warning,
	Refresh,
	SwapHoriz,
	Close,
	Search,
	OpenInNew,
	AudioFile,
	Image as ImageIcon,
} from '@mui/icons-material'
import AdminNavbar from '@/components/admin/AdminNavbar'
import { logger } from '@/utils/logger'
import { checkBrokenVideos, updateMaterialVideo, checkBrokenAudios, updateMaterialAudio, checkBrokenImages, updateMaterialImage } from '@/app/actions/admin'

const AdminDashboardClient = ({ initialMaterialsData, initialBooksData }) => {
	const t = useTranslations('admin')
	const locale = useLocale()
	const theme = useTheme()

	const [selectedLang, setSelectedLang] = useState('fr')
	const [brokenVideos, setBrokenVideos] = useState([])
	const [loadingVideos, setLoadingVideos] = useState(false)
	const [showBrokenVideos, setShowBrokenVideos] = useState(false)
	const [editVideoDialog, setEditVideoDialog] = useState({ open: false, video: null })
	const [newVideoUrl, setNewVideoUrl] = useState('')
	const [savingVideo, setSavingVideo] = useState(false)

	// Audio states
	const [brokenAudios, setBrokenAudios] = useState([])
	const [loadingAudios, setLoadingAudios] = useState(false)
	const [showBrokenAudios, setShowBrokenAudios] = useState(false)
	const [editAudioDialog, setEditAudioDialog] = useState({ open: false, audio: null })
	const [newAudioFilename, setNewAudioFilename] = useState('')
	const [savingAudio, setSavingAudio] = useState(false)

	// Image states
	const [brokenImages, setBrokenImages] = useState([])
	const [loadingImages, setLoadingImages] = useState(false)
	const [showBrokenImages, setShowBrokenImages] = useState(false)
	const [editImageDialog, setEditImageDialog] = useState({ open: false, image: null })
	const [newImageFilename, setNewImageFilename] = useState('')
	const [savingImage, setSavingImage] = useState(false)

	// Use initial data from server
	const materialsCountByLang = initialMaterialsData
	const booksCountByLang = initialBooksData

	const loadBrokenVideos = async () => {
		setLoadingVideos(true)
		try {
			const result = await checkBrokenVideos()
			setBrokenVideos(result.brokenVideos || [])
			setShowBrokenVideos(true)
		} catch (error) {
			logger.error('Error loading broken videos:', error)
		} finally {
			setLoadingVideos(false)
		}
	}

	const handleOpenEditDialog = (video) => {
		setEditVideoDialog({ open: true, video })
		setNewVideoUrl(video.video_url || '')
	}

	const handleCloseEditDialog = () => {
		setEditVideoDialog({ open: false, video: null })
		setNewVideoUrl('')
	}

	const handleSaveVideoUrl = async () => {
		if (!newVideoUrl.trim()) return

		setSavingVideo(true)
		try {
			const result = await updateMaterialVideo(
				editVideoDialog.video.id,
				newVideoUrl.trim()
			)

			if (result.success) {
				setBrokenVideos(prev => prev.filter(v => v.id !== editVideoDialog.video.id))
				handleCloseEditDialog()
			} else {
				logger.error('Failed to update video')
				alert(t('errorUpdatingVideo'))
			}
		} catch (error) {
			logger.error('Error updating video:', error)
			alert(t('errorUpdatingVideo'))
		} finally {
			setSavingVideo(false)
		}
	}

	// Audio functions
	const loadBrokenAudios = async () => {
		setLoadingAudios(true)
		try {
			const result = await checkBrokenAudios()
			setBrokenAudios(result.brokenAudios || [])
			setShowBrokenAudios(true)
		} catch (error) {
			logger.error('Error loading broken audios:', error)
		} finally {
			setLoadingAudios(false)
		}
	}

	const handleOpenEditAudioDialog = (audio) => {
		setEditAudioDialog({ open: true, audio })
		setNewAudioFilename(audio.audio_filename || '')
	}

	const handleCloseEditAudioDialog = () => {
		setEditAudioDialog({ open: false, audio: null })
		setNewAudioFilename('')
	}

	const handleSaveAudioFilename = async () => {
		setSavingAudio(true)
		try {
			const result = await updateMaterialAudio(
				editAudioDialog.audio.id,
				newAudioFilename.trim()
			)

			if (result.success) {
				setBrokenAudios(prev => prev.filter(a => a.id !== editAudioDialog.audio.id))
				handleCloseEditAudioDialog()
			} else {
				logger.error('Failed to update audio')
				alert(t('errorUpdatingAudio'))
			}
		} catch (error) {
			logger.error('Error updating audio:', error)
			alert(t('errorUpdatingAudio'))
		} finally {
			setSavingAudio(false)
		}
	}

	const handleRemoveAudio = async () => {
		setSavingAudio(true)
		try {
			const result = await updateMaterialAudio(
				editAudioDialog.audio.id,
				'' // Empty string to remove audio
			)

			if (result.success) {
				setBrokenAudios(prev => prev.filter(a => a.id !== editAudioDialog.audio.id))
				handleCloseEditAudioDialog()
			} else {
				logger.error('Failed to remove audio')
				alert(t('errorUpdatingAudio'))
			}
		} catch (error) {
			logger.error('Error removing audio:', error)
			alert(t('errorUpdatingAudio'))
		} finally {
			setSavingAudio(false)
		}
	}

	// Image functions
	const loadBrokenImages = async () => {
		setLoadingImages(true)
		try {
			const result = await checkBrokenImages()
			setBrokenImages(result.brokenImages || [])
			setShowBrokenImages(true)
		} catch (error) {
			logger.error('Error loading broken images:', error)
		} finally {
			setLoadingImages(false)
		}
	}

	const handleOpenEditImageDialog = (image) => {
		setEditImageDialog({ open: true, image })
		setNewImageFilename(image.image_filename || '')
	}

	const handleCloseEditImageDialog = () => {
		setEditImageDialog({ open: false, image: null })
		setNewImageFilename('')
	}

	const handleSaveImageFilename = async () => {
		setSavingImage(true)
		try {
			const result = await updateMaterialImage(
				editImageDialog.image.id,
				newImageFilename.trim()
			)

			if (result.success) {
				setBrokenImages(prev => prev.filter(i => i.id !== editImageDialog.image.id))
				handleCloseEditImageDialog()
			} else {
				logger.error('Failed to update image')
				alert(t('errorUpdatingImage'))
			}
		} catch (error) {
			logger.error('Error updating image:', error)
			alert(t('errorUpdatingImage'))
		} finally {
			setSavingImage(false)
		}
	}

	const handleRemoveImage = async () => {
		setSavingImage(true)
		try {
			const result = await updateMaterialImage(
				editImageDialog.image.id,
				'' // Empty string to remove image
			)

			if (result.success) {
				setBrokenImages(prev => prev.filter(i => i.id !== editImageDialog.image.id))
				handleCloseEditImageDialog()
			} else {
				logger.error('Failed to remove image')
				alert(t('errorUpdatingImage'))
			}
		} catch (error) {
			logger.error('Error removing image:', error)
			alert(t('errorUpdatingImage'))
		} finally {
			setSavingImage(false)
		}
	}

	const getLanguageInfo = (lang) => {
		const info = {
			fr: { name: 'Français', color: '#3B82F6', flag: '🇫🇷' },
			ru: { name: 'Русский', color: '#EF4444', flag: '🇷🇺' },
			en: { name: 'English', color: '#10B981', flag: '🇬🇧' },
		}
		return info[lang] || info.fr
	}

	const currentLangData = materialsCountByLang.find(m => m.lang === selectedLang)
	const currentBooks = booksCountByLang.find(b => b.lang === selectedLang)

	const totalAudioText = currentLangData?.audioTextCount || 0
	const totalVideo = currentLangData?.videoCount || 0
	const totalBooks = currentBooks?.count || 0
	const grandTotal = totalAudioText + totalVideo + totalBooks

	const audioTextSectionsArray = [
		'dialogues',
		'culture',
		'legends',
		'slices-of-life',
		'beautiful-places',
		'podcasts',
		'short-stories'
	]

	const videoSectionsArray = selectedLang === 'ru'
		? ['movie-trailers', 'movie-clips', 'cartoons', 'various-materials', 'rock', 'pop', 'folk', 'variety', 'kids', 'eralash', 'galileo']
		: ['movie-trailers', 'movie-clips', 'cartoons', 'various-materials', 'rock', 'pop', 'folk', 'variety', 'kids']

	const audioTextData = currentLangData?.sections?.filter(s => audioTextSectionsArray.includes(s.section)) || []
	const videoData = currentLangData?.sections?.filter(s => videoSectionsArray.includes(s.section)) || []
	const bookChaptersData = currentLangData?.sections?.find(s => s.section === 'book-chapters')

	const tableData = [
		...(audioTextData.length > 0 ? [{
			type: 'category',
			section: t('textAndAudio'),
			isCategory: true,
		}] : []),
		...audioTextData.map(({ section, count }) => ({
			type: 'material',
			section,
			count,
			icon: <LibraryBooks />,
			indent: false,
		})),

		...(videoData.length > 0 ? [{
			type: 'category',
			section: t('videos'),
			isCategory: true,
		}] : []),
		...videoData.map(({ section, count }) => ({
			type: 'material',
			section,
			count,
			icon: <VideoLibrary />,
			indent: false,
		})),

		...(totalBooks > 0 || bookChaptersData ? [{
			type: 'category',
			section: t('books'),
			isCategory: true,
		}] : []),
		...(totalBooks > 0 ? [{
			type: 'books',
			section: t('books'),
			count: totalBooks,
			icon: <MenuBook />,
			indent: false,
		}] : []),
		...(bookChaptersData ? [{
			type: 'bookChapters',
			section: 'book-chapters',
			count: bookChaptersData.count,
			icon: <MenuBook />,
			indent: true,
		}] : [])
	]

	return (
		<Box
			sx={{
				minHeight: '100vh',
				bgcolor: 'background.paper',
			}}>
			<AdminNavbar activePage="dashboard" />

			<Container maxWidth="xl" sx={{ py: 4 }}>
				{/* Stats Cards */}
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: {
							xs: '1fr',
							sm: 'repeat(2, 1fr)',
							md: 'repeat(4, 1fr)',
						},
						gap: 3,
						mb: 4,
					}}>
					<Paper
						elevation={0}
						sx={{
							p: 3,
							borderRadius: 3,
							border: '1px solid',
							borderColor: 'divider',
							background: 'white',
						}}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
							<Box
								sx={{
									width: 48,
									height: 48,
									borderRadius: 2,
									bgcolor: alpha('#667eea', 0.1),
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#667eea',
								}}>
								<TrendingUp />
							</Box>
							<Box>
								<Typography variant='h4' sx={{ fontWeight: 700, color: '#1E293B' }}>
									{grandTotal}
								</Typography>
							</Box>
						</Box>
						<Typography variant='body2' sx={{ color: '#64748B', fontWeight: 500 }}>
							{t('totalContent')}
						</Typography>
					</Paper>

					<Paper
						elevation={0}
						sx={{
							p: 3,
							borderRadius: 3,
							border: '1px solid',
							borderColor: 'divider',
							background: 'white',
						}}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
							<Box
								sx={{
									width: 48,
									height: 48,
									borderRadius: 2,
									bgcolor: alpha('#3B82F6', 0.1),
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#3B82F6',
								}}>
								<LibraryBooks />
							</Box>
							<Box>
								<Typography variant='h4' sx={{ fontWeight: 700, color: '#1E293B' }}>
									{totalAudioText}
								</Typography>
							</Box>
						</Box>
						<Typography variant='body2' sx={{ color: '#64748B', fontWeight: 500 }}>
							{t('textAndAudio')}
						</Typography>
					</Paper>

					<Paper
						elevation={0}
						sx={{
							p: 3,
							borderRadius: 3,
							border: '1px solid',
							borderColor: 'divider',
							background: 'white',
						}}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
							<Box
								sx={{
									width: 48,
									height: 48,
									borderRadius: 2,
									bgcolor: alpha('#10B981', 0.1),
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#10B981',
								}}>
								<VideoLibrary />
							</Box>
							<Box>
								<Typography variant='h4' sx={{ fontWeight: 700, color: '#1E293B' }}>
									{totalVideo}
								</Typography>
							</Box>
						</Box>
						<Typography variant='body2' sx={{ color: '#64748B', fontWeight: 500 }}>
							{t('videos')}
						</Typography>
					</Paper>

					<Paper
						elevation={0}
						sx={{
							p: 3,
							borderRadius: 3,
							border: '1px solid',
							borderColor: 'divider',
							background: 'white',
						}}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
							<Box
								sx={{
									width: 48,
									height: 48,
									borderRadius: 2,
									bgcolor: alpha('#F59E0B', 0.1),
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#F59E0B',
								}}>
								<MenuBook />
							</Box>
							<Box>
								<Typography variant='h4' sx={{ fontWeight: 700, color: '#1E293B' }}>
									{totalBooks}
								</Typography>
							</Box>
						</Box>
						<Typography variant='body2' sx={{ color: '#64748B', fontWeight: 500 }}>
							{t('books')}
						</Typography>
					</Paper>
				</Box>

				{/* Broken Videos Section */}
				<Paper
					elevation={0}
					sx={{
						borderRadius: 3,
						border: '1px solid',
						borderColor: brokenVideos.length > 0 ? '#FCD34D' : 'divider',
						overflow: 'hidden',
						mb: 4,
						bgcolor: brokenVideos.length > 0 ? '#FEF3C7' : 'white',
					}}>
					<Box
						sx={{
							p: 3,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
							<Box
								sx={{
									width: 48,
									height: 48,
									borderRadius: 2,
									bgcolor: alpha('#EF4444', 0.1),
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#EF4444',
								}}>
								{brokenVideos.length > 0 ? <Warning /> : <VideoLibrary />}
							</Box>
							<Box>
								<Typography variant='h6' sx={{ fontWeight: 700, color: '#1E293B' }}>
									{t('brokenVideosTitle')}
								</Typography>
								<Typography variant='body2' sx={{ color: '#64748B' }}>
									{showBrokenVideos
										? brokenVideos.length > 0
											? t('brokenVideosFound', { count: brokenVideos.length })
											: t('noBrokenVideos')
										: t('brokenVideosDesc')}
								</Typography>
							</Box>
						</Box>
						<Button
							variant='contained'
							startIcon={loadingVideos ? <Refresh sx={{ animation: 'spin 1s linear infinite' }} /> : <Refresh />}
							onClick={loadBrokenVideos}
							disabled={loadingVideos}
							sx={{
								bgcolor: '#EF4444',
								color: 'white',
								px: 3,
								py: 1.2,
								borderRadius: 2,
								textTransform: 'none',
								fontWeight: 600,
								boxShadow: 'none',
								'&:hover': {
									bgcolor: '#DC2626',
									boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
								},
								'&:disabled': {
									bgcolor: '#FCA5A5',
									color: 'white',
								},
								'@keyframes spin': {
									'0%': { transform: 'rotate(0deg)' },
									'100%': { transform: 'rotate(360deg)' },
								},
							}}>
							{loadingVideos ? t('checking') : t('checkVideos')}
						</Button>
					</Box>

					{showBrokenVideos && brokenVideos.length > 0 && (
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow
										sx={{
											bgcolor: alpha('#EF4444', 0.08),
											borderBottom: '2px solid',
											borderColor: '#EF4444',
											'& th': {
												fontWeight: 700,
												color: '#EF4444',
												fontSize: '0.75rem',
												textTransform: 'uppercase',
												letterSpacing: '1px',
												py: 2.5,
												px: 3,
											},
										}}>
										<TableCell>{t('title')}</TableCell>
										<TableCell>{t('section')}</TableCell>
										<TableCell>{t('language')}</TableCell>
										<TableCell>{t('videoUrl')}</TableCell>
										<TableCell align='right'>{t('actions')}</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{brokenVideos.map((video) => (
										<TableRow
											key={video.id}
											sx={{
												'&:hover': {
													bgcolor: '#FEF3C7',
												},
												'& td': {
													py: 2.5,
													borderBottom: '1px solid',
													borderColor: 'divider',
												},
											}}>
											<TableCell>
												<Typography
													sx={{
														fontWeight: 600,
														color: '#1E293B',
													}}>
													{video.title}
												</Typography>
											</TableCell>
											<TableCell>
												<Typography
													sx={{
														textTransform: 'capitalize',
														color: '#64748B',
													}}>
													{video.section}
												</Typography>
											</TableCell>
											<TableCell>
												<Chip
													label={getLanguageInfo(video.lang).flag + ' ' + getLanguageInfo(video.lang).name}
													size='small'
													sx={{
														bgcolor: alpha(getLanguageInfo(video.lang).color, 0.1),
														color: getLanguageInfo(video.lang).color,
														fontWeight: 600,
													}}
												/>
											</TableCell>
											<TableCell>
												<Typography
													component='a'
													href={video.video_url}
													target='_blank'
													rel='noopener noreferrer'
													sx={{
														color: '#667eea',
														textDecoration: 'none',
														fontSize: '0.875rem',
														'&:hover': {
															textDecoration: 'underline',
														},
														display: 'block',
														maxWidth: 300,
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														whiteSpace: 'nowrap',
													}}>
													{video.video_url}
												</Typography>
											</TableCell>
											<TableCell align='right'>
												<Tooltip title={t('replaceLink')}>
													<IconButton
														size='small'
														onClick={() => handleOpenEditDialog(video)}
														sx={{
															color: '#F59E0B',
															'&:hover': {
																bgcolor: alpha('#F59E0B', 0.1),
																color: '#F59E0B',
															},
														}}>
														<SwapHoriz fontSize='small' />
													</IconButton>
												</Tooltip>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</Paper>

				{/* Broken Audios Section */}
				<Paper
					elevation={0}
					sx={{
						borderRadius: 3,
						border: '1px solid',
						borderColor: brokenAudios.length > 0 ? '#FCD34D' : 'divider',
						overflow: 'hidden',
						mb: 4,
						bgcolor: brokenAudios.length > 0 ? '#FEF3C7' : 'white',
					}}>
					<Box
						sx={{
							p: 3,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
							<Box
								sx={{
									width: 48,
									height: 48,
									borderRadius: 2,
									bgcolor: alpha('#F59E0B', 0.1),
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#F59E0B',
								}}>
								{brokenAudios.length > 0 ? <Warning /> : <AudioFile />}
							</Box>
							<Box>
								<Typography variant='h6' sx={{ fontWeight: 700, color: '#1E293B' }}>
									{t('brokenAudiosTitle')}
								</Typography>
								<Typography variant='body2' sx={{ color: '#64748B' }}>
									{showBrokenAudios
										? brokenAudios.length > 0
											? t('brokenAudiosFound', { count: brokenAudios.length })
											: t('noBrokenAudios')
										: t('brokenAudiosDesc')}
								</Typography>
							</Box>
						</Box>
						<Button
							variant='contained'
							startIcon={loadingAudios ? <Refresh sx={{ animation: 'spin 1s linear infinite' }} /> : <Refresh />}
							onClick={loadBrokenAudios}
							disabled={loadingAudios}
							sx={{
								bgcolor: '#F59E0B',
								color: 'white',
								px: 3,
								py: 1.2,
								borderRadius: 2,
								textTransform: 'none',
								fontWeight: 600,
								boxShadow: 'none',
								'&:hover': {
									bgcolor: '#D97706',
									boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
								},
								'&:disabled': {
									bgcolor: '#FCD34D',
									color: 'white',
								},
								'@keyframes spin': {
									'0%': { transform: 'rotate(0deg)' },
									'100%': { transform: 'rotate(360deg)' },
								},
							}}>
							{loadingAudios ? t('checking') : t('checkAudios')}
						</Button>
					</Box>

					{showBrokenAudios && brokenAudios.length > 0 && (
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow
										sx={{
											bgcolor: alpha('#F59E0B', 0.08),
											borderBottom: '2px solid',
											borderColor: '#F59E0B',
											'& th': {
												fontWeight: 700,
												color: '#F59E0B',
												fontSize: '0.75rem',
												textTransform: 'uppercase',
												letterSpacing: '1px',
												py: 2.5,
												px: 3,
											},
										}}>
										<TableCell>{t('title')}</TableCell>
										<TableCell>{t('section')}</TableCell>
										<TableCell>{t('language')}</TableCell>
										<TableCell>{t('audioFileName')}</TableCell>
										<TableCell align='right'>{t('actions')}</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{brokenAudios.map((audio) => (
										<TableRow
											key={audio.id}
											sx={{
												'&:hover': {
													bgcolor: '#FEF3C7',
												},
												'& td': {
													py: 2.5,
													borderBottom: '1px solid',
													borderColor: 'divider',
												},
											}}>
											<TableCell>
												<Typography
													sx={{
														fontWeight: 600,
														color: '#1E293B',
													}}>
													{audio.title}
												</Typography>
											</TableCell>
											<TableCell>
												<Typography
													sx={{
														textTransform: 'capitalize',
														color: '#64748B',
													}}>
													{audio.section}
												</Typography>
											</TableCell>
											<TableCell>
												<Chip
													label={getLanguageInfo(audio.lang).flag + ' ' + getLanguageInfo(audio.lang).name}
													size='small'
													sx={{
														bgcolor: alpha(getLanguageInfo(audio.lang).color, 0.1),
														color: getLanguageInfo(audio.lang).color,
														fontWeight: 600,
													}}
												/>
											</TableCell>
											<TableCell>
												<Typography
													sx={{
														color: '#EF4444',
														fontSize: '0.875rem',
														display: 'block',
														maxWidth: 300,
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														whiteSpace: 'nowrap',
													}}>
													{audio.audio_filename}
												</Typography>
											</TableCell>
											<TableCell align='right'>
												<Tooltip title={t('replaceAudioLink')}>
													<IconButton
														size='small'
														onClick={() => handleOpenEditAudioDialog(audio)}
														sx={{
															color: '#F59E0B',
															'&:hover': {
																bgcolor: alpha('#F59E0B', 0.1),
																color: '#F59E0B',
															},
														}}>
														<SwapHoriz fontSize='small' />
													</IconButton>
												</Tooltip>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</Paper>


				{/* Broken Images Section */}
				<Paper
					elevation={0}
					sx={{
						borderRadius: 3,
						border: '1px solid',
						borderColor: brokenImages.length > 0 ? '#FCD34D' : 'divider',
						overflow: 'hidden',
						mb: 4,
						bgcolor: brokenImages.length > 0 ? '#FEF3C7' : 'white',
					}}>
					<Box
						sx={{
							p: 3,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
							<Box
								sx={{
									width: 48,
									height: 48,
									borderRadius: 2,
									bgcolor: alpha('#8B5CF6', 0.1),
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#8B5CF6',
								}}>
								{brokenImages.length > 0 ? <Warning /> : <ImageIcon />}
							</Box>
							<Box>
								<Typography variant='h6' sx={{ fontWeight: 700, color: '#1E293B' }}>
									{t('brokenImagesTitle')}
								</Typography>
								<Typography variant='body2' sx={{ color: '#64748B' }}>
									{showBrokenImages
										? brokenImages.length > 0
											? t('brokenImagesFound', { count: brokenImages.length })
											: t('noBrokenImages')
										: t('brokenImagesDesc')}
								</Typography>
							</Box>
						</Box>
						<Button
							variant='contained'
							startIcon={loadingImages ? <Refresh sx={{ animation: 'spin 1s linear infinite' }} /> : <Refresh />}
							onClick={loadBrokenImages}
							disabled={loadingImages}
							sx={{
								bgcolor: '#8B5CF6',
								color: 'white',
								px: 3,
								py: 1.2,
								borderRadius: 2,
								textTransform: 'none',
								fontWeight: 600,
								boxShadow: 'none',
								'&:hover': {
									bgcolor: '#7C3AED',
									boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
								},
								'&:disabled': {
									bgcolor: '#C4B5FD',
									color: 'white',
								},
								'@keyframes spin': {
									'0%': { transform: 'rotate(0deg)' },
									'100%': { transform: 'rotate(360deg)' },
								},
							}}>
							{loadingImages ? t('checking') : t('checkImages')}
						</Button>
					</Box>

					{showBrokenImages && brokenImages.length > 0 && (
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow
										sx={{
											bgcolor: alpha('#8B5CF6', 0.08),
											borderBottom: '2px solid',
											borderColor: '#8B5CF6',
											'& th': {
												fontWeight: 700,
												color: '#8B5CF6',
												fontSize: '0.75rem',
												textTransform: 'uppercase',
												letterSpacing: '1px',
												py: 2.5,
												px: 3,
											},
										}}>
										<TableCell>{t('title')}</TableCell>
										<TableCell>{t('section')}</TableCell>
										<TableCell>{t('language')}</TableCell>
										<TableCell>{t('imageFileName')}</TableCell>
										<TableCell align='right'>{t('actions')}</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{brokenImages.map((image) => (
										<TableRow
											key={image.id}
											sx={{
												'&:hover': {
													bgcolor: '#FEF3C7',
												},
												'& td': {
													py: 2.5,
													borderBottom: '1px solid',
													borderColor: 'divider',
												},
											}}>
											<TableCell>
												<Typography
													sx={{
														fontWeight: 600,
														color: '#1E293B',
													}}>
													{image.title}
												</Typography>
											</TableCell>
											<TableCell>
												<Typography
													sx={{
														textTransform: 'capitalize',
														color: '#64748B',
													}}>
													{image.section}
												</Typography>
											</TableCell>
											<TableCell>
												<Chip
													label={getLanguageInfo(image.lang).flag + ' ' + getLanguageInfo(image.lang).name}
													size='small'
													sx={{
														bgcolor: alpha(getLanguageInfo(image.lang).color, 0.1),
														color: getLanguageInfo(image.lang).color,
														fontWeight: 600,
													}}
												/>
											</TableCell>
											<TableCell>
												<Typography
													sx={{
														color: '#EF4444',
														fontSize: '0.875rem',
														display: 'block',
														maxWidth: 300,
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														whiteSpace: 'nowrap',
													}}>
													{image.image_filename}
												</Typography>
											</TableCell>
											<TableCell align='right'>
												<Tooltip title={t('replaceImageLink')}>
													<IconButton
														size='small'
														onClick={() => handleOpenEditImageDialog(image)}
														sx={{
															color: '#8B5CF6',
															'&:hover': {
																bgcolor: alpha('#8B5CF6', 0.1),
																color: '#8B5CF6',
															},
														}}>
														<SwapHoriz fontSize='small' />
													</IconButton>
												</Tooltip>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</Paper>

				{/* Language Tabs */}
				<Paper
					elevation={0}
					sx={{
						borderRadius: 3,
						border: '1px solid',
						borderColor: 'divider',
						overflow: 'hidden',
					}}>
					<Box
						sx={{
							borderBottom: '1px solid',
							borderColor: 'divider',
							px: 3,
							py: 2,
							bgcolor: 'white',
						}}>
						<Tabs
							value={selectedLang}
							onChange={(e, newValue) => setSelectedLang(newValue)}
							sx={{
								'& .MuiTab-root': {
									textTransform: 'none',
									fontWeight: 600,
									fontSize: '1rem',
									minHeight: 48,
									px: 3,
									color: '#64748B',
									'&.Mui-selected': {
										color: '#667eea',
									},
								},
								'& .MuiTabs-indicator': {
									backgroundColor: '#667eea',
									height: 3,
									borderRadius: '3px 3px 0 0',
								},
							}}>
							{materialsCountByLang.map(({ lang }) => {
								const langInfo = getLanguageInfo(lang)
								return (
									<Tab
										key={lang}
										value={lang}
										label={
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
												<span style={{ fontSize: '1.2rem' }}>{langInfo.flag}</span>
												<span>{langInfo.name}</span>
											</Box>
										}
									/>
								)
							})}
						</Tabs>
					</Box>

					{/* Content Table */}
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow
									sx={{
										bgcolor: alpha(getLanguageInfo(selectedLang).color, 0.08),
										borderBottom: '2px solid',
										borderColor: getLanguageInfo(selectedLang).color,
										'& th': {
											fontWeight: 700,
											color: getLanguageInfo(selectedLang).color,
											fontSize: '0.75rem',
											textTransform: 'uppercase',
											letterSpacing: '1px',
											py: 2.5,
											px: 3,
										},
									}}>
									<TableCell>{t('type')}</TableCell>
									<TableCell>{t('section')}</TableCell>
									<TableCell align='center'>{t('content')}</TableCell>
									<TableCell align='right'>{t('actions')}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{tableData.length === 0 ? (
									<TableRow>
										<TableCell colSpan={4} align='center' sx={{ py: 8 }}>
											<Typography variant='body1' color='text.secondary'>
												{t('noContentAvailable')}
											</Typography>
										</TableCell>
									</TableRow>
								) : (
									tableData.map((item, index) => (
										item.isCategory ? (
											<TableRow
												key={`${item.type}-${item.section}-${index}`}
												sx={{
													bgcolor: 'white',
													'& td': {
														pt: index === 0 ? 2 : 4,
														pb: 1.5,
														borderBottom: 'none',
													},
												}}>
												<TableCell colSpan={4}>
													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															gap: 2,
															px: 1,
														}}>
														<Box
															sx={{
																width: 4,
																height: 24,
																borderRadius: 2,
																bgcolor: getLanguageInfo(selectedLang).color,
															}}
														/>
														<Typography
															sx={{
																fontWeight: 700,
																color: '#1E293B',
																fontSize: '1rem',
																letterSpacing: '0.3px',
															}}>
															{item.section}
														</Typography>
													</Box>
												</TableCell>
											</TableRow>
										) : (
											<TableRow
												key={`${item.type}-${item.section}-${index}`}
												sx={{
													transition: 'background-color 0.2s ease',
													'&:hover': {
														bgcolor: alpha(getLanguageInfo(selectedLang).color, 0.03),
													},
													'& td': {
														py: 2.5,
														px: 3,
														borderBottom: '1px solid',
														borderColor: '#F1F5F9',
													},
												}}>
												<TableCell>
													<Box sx={{
														display: 'flex',
														alignItems: 'center',
														gap: 1.5,
														pl: item.indent ? 6 : 0,
													}}>
														<Box
															sx={{
																width: 40,
																height: 40,
																borderRadius: 2,
																bgcolor: alpha(getLanguageInfo(selectedLang).color, 0.1),
																display: 'flex',
																alignItems: 'center',
																justifyContent: 'center',
																color: getLanguageInfo(selectedLang).color,
																opacity: item.indent ? 0.7 : 1,
															}}>
															{item.icon}
														</Box>
													</Box>
												</TableCell>
												<TableCell>
													<Typography
														sx={{
															fontWeight: item.indent ? 500 : 600,
															color: item.indent ? '#64748B' : '#1E293B',
															textTransform: 'capitalize',
															fontSize: item.indent ? '0.875rem' : '1rem',
														}}>
														{item.section}
													</Typography>
												</TableCell>
												<TableCell align='center'>
													<Chip
														label={item.count}
														sx={{
															bgcolor: alpha(getLanguageInfo(selectedLang).color, 0.1),
															color: getLanguageInfo(selectedLang).color,
															fontWeight: 700,
															fontSize: '0.875rem',
															minWidth: 48,
														}}
													/>
												</TableCell>
												<TableCell align='right'>
													{item.type === 'material' || item.type === 'books' ? (
														<Stack direction='row' spacing={1} justifyContent='flex-end'>
															<Tooltip title={t('view')}>
																<IconButton
																	size='small'
																	component={Link}
																	href={
																		item.type === 'material'
																			? `/materials/${item.section}?lang=${selectedLang}`
																			: `/materials/books?lang=${selectedLang}`
																	}
																	sx={{
																		color: '#64748B',
																		'&:hover': {
																			bgcolor: alpha('#667eea', 0.1),
																			color: '#667eea',
																		},
																	}}>
																	<Visibility fontSize='small' />
																</IconButton>
															</Tooltip>
														</Stack>
													) : (
														<Typography variant='caption' sx={{ color: '#94A3B8', fontStyle: 'italic' }}>
															—
														</Typography>
													)}
												</TableCell>
											</TableRow>
										)
									))
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>
			</Container>

			{/* Dialog pour remplacer le lien vidéo */}
			<Dialog
				open={editVideoDialog.open}
				onClose={handleCloseEditDialog}
				maxWidth='md'
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
					}}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						<Box
							sx={{
								width: 48,
								height: 48,
								borderRadius: 2,
								bgcolor: alpha('#F59E0B', 0.1),
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: '#F59E0B',
							}}>
							<SwapHoriz />
						</Box>
						<Box>
							<Typography variant='h6' sx={{ fontWeight: 700, color: '#1E293B' }}>
								{t('replaceVideoLink')}
							</Typography>
							<Typography variant='body2' sx={{ color: '#64748B' }}>
								{editVideoDialog.video?.title}
							</Typography>
						</Box>
					</Box>
					<IconButton onClick={handleCloseEditDialog} size='small'>
						<Close />
					</IconButton>
				</DialogTitle>

				<DialogContent sx={{ pt: 0 }}>
					<Box sx={{ mb: 2 }}>
						<Typography variant='caption' sx={{ color: '#64748B', fontWeight: 600, display: 'block', mb: 1 }}>
							{t('currentLink')}
						</Typography>
						<Typography
							component='a'
							href={editVideoDialog.video?.video}
							target='_blank'
							rel='noopener noreferrer'
							sx={{
								color: '#EF4444',
								textDecoration: 'line-through',
								fontSize: '0.875rem',
								display: 'block',
								wordBreak: 'break-all',
								'&:hover': {
									textDecoration: 'line-through underline',
								},
							}}>
							{editVideoDialog.video?.video}
						</Typography>
					</Box>

					<Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
						<Button
							variant='outlined'
							startIcon={<Search />}
							fullWidth
							onClick={() => {
								const searchQuery = encodeURIComponent(editVideoDialog.video?.title || '')
								window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank')
							}}
							sx={{
								py: 1.5,
								borderRadius: 2,
								textTransform: 'none',
								fontWeight: 600,
								borderColor: '#E2E8F0',
								color: '#475569',
								'&:hover': {
									borderColor: '#667eea',
									bgcolor: alpha('#667eea', 0.05),
									color: '#667eea',
								},
							}}>
							{t('searchOnYouTube')}
						</Button>

						<Button
							variant='outlined'
							startIcon={<OpenInNew />}
							fullWidth
							component={Link}
							href={`/materials/${editVideoDialog.video?.section}/${editVideoDialog.video?.id}`}
							target='_blank'
							sx={{
								py: 1.5,
								borderRadius: 2,
								textTransform: 'none',
								fontWeight: 600,
								borderColor: '#E2E8F0',
								color: '#475569',
								'&:hover': {
									borderColor: '#10B981',
									bgcolor: alpha('#10B981', 0.05),
									color: '#10B981',
								},
							}}>
							{t('viewMaterial')}
						</Button>
					</Box>

					<TextField
						autoFocus
						fullWidth
						label={t('newVideoLink')}
						value={newVideoUrl}
						onChange={(e) => setNewVideoUrl(e.target.value)}
						placeholder='https://www.youtube.com/watch?v=...'
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: 2,
							},
						}}
						helperText={t('videoLinkHelp')}
					/>
				</DialogContent>

				<DialogActions sx={{ p: 3, pt: 0 }}>
					<Button
						onClick={handleCloseEditDialog}
						sx={{
							textTransform: 'none',
							fontWeight: 600,
							color: '#64748B',
						}}>
						{t('cancel')}
					</Button>
					<Button
						onClick={handleSaveVideoUrl}
						disabled={savingVideo || !newVideoUrl.trim()}
						variant='contained'
						sx={{
							bgcolor: '#667eea',
							color: 'white',
							px: 3,
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
						{savingVideo ? (
							<>
								<CircularProgress size={16} sx={{ color: 'white', mr: 1 }} />
								{t('saving')}
							</>
						) : (
							t('save')
						)}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Dialog pour modifier/supprimer le fichier audio */}
			<Dialog
				open={editAudioDialog.open}
				onClose={handleCloseEditAudioDialog}
				maxWidth='md'
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
					}}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						<Box
							sx={{
								width: 48,
								height: 48,
								borderRadius: 2,
								bgcolor: alpha('#F59E0B', 0.1),
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: '#F59E0B',
							}}>
							<AudioFile />
						</Box>
						<Box>
							<Typography variant='h6' sx={{ fontWeight: 700, color: '#1E293B' }}>
								{t('replaceAudioLink')}
							</Typography>
							<Typography variant='body2' sx={{ color: '#64748B' }}>
								{editAudioDialog.audio?.title}
							</Typography>
						</Box>
					</Box>
					<IconButton onClick={handleCloseEditAudioDialog} size='small'>
						<Close />
					</IconButton>
				</DialogTitle>

				<DialogContent sx={{ pt: 0 }}>
					<Box sx={{ mb: 2 }}>
						<Typography variant='caption' sx={{ color: '#64748B', fontWeight: 600, display: 'block', mb: 1 }}>
							{t('currentAudioFile')}
						</Typography>
						<Typography
							sx={{
								color: '#EF4444',
								textDecoration: 'line-through',
								fontSize: '0.875rem',
								display: 'block',
								wordBreak: 'break-all',
							}}>
							{editAudioDialog.audio?.audio_filename}
						</Typography>
					</Box>

					<Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
						<Button
							variant='outlined'
							startIcon={<OpenInNew />}
							fullWidth
							component={Link}
							href={`/materials/${editAudioDialog.audio?.section}/${editAudioDialog.audio?.id}`}
							target='_blank'
							sx={{
								py: 1.5,
								borderRadius: 2,
								textTransform: 'none',
								fontWeight: 600,
								borderColor: '#E2E8F0',
								color: '#475569',
								'&:hover': {
									borderColor: '#10B981',
									bgcolor: alpha('#10B981', 0.05),
									color: '#10B981',
								},
							}}>
							{t('viewMaterial')}
						</Button>
					</Box>

					<TextField
						autoFocus
						fullWidth
						label={t('newAudioFile')}
						value={newAudioFilename}
						onChange={(e) => setNewAudioFilename(e.target.value)}
						placeholder='mon-audio.mp3'
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: 2,
							},
						}}
						helperText={t('audioFileHelp')}
					/>
				</DialogContent>

				<DialogActions sx={{ p: 3, pt: 0, justifyContent: 'space-between' }}>
					<Button
						onClick={handleRemoveAudio}
						disabled={savingAudio}
						sx={{
							textTransform: 'none',
							fontWeight: 600,
							color: '#EF4444',
							'&:hover': {
								bgcolor: alpha('#EF4444', 0.1),
							},
						}}>
						{t('removeAudio')}
					</Button>
					<Box sx={{ display: 'flex', gap: 1 }}>
						<Button
							onClick={handleCloseEditAudioDialog}
							sx={{
								textTransform: 'none',
								fontWeight: 600,
								color: '#64748B',
							}}>
							{t('cancel')}
						</Button>
						<Button
							onClick={handleSaveAudioFilename}
							disabled={savingAudio || !newAudioFilename.trim()}
							variant='contained'
							sx={{
								bgcolor: '#F59E0B',
								color: 'white',
								px: 3,
								borderRadius: 2,
								textTransform: 'none',
								fontWeight: 600,
								boxShadow: 'none',
								'&:hover': {
									bgcolor: '#D97706',
									boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
								},
								'&:disabled': {
									bgcolor: '#CBD5E1',
									color: 'white',
								},
							}}>
							{savingAudio ? (
								<>
									<CircularProgress size={16} sx={{ color: 'white', mr: 1 }} />
									{t('saving')}
								</>
							) : (
								t('save')
							)}
						</Button>
					</Box>
				</DialogActions>
			</Dialog>

			{/* Dialog pour modifier/supprimer le fichier image */}
			<Dialog
				open={editImageDialog.open}
				onClose={handleCloseEditImageDialog}
				maxWidth='md'
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
					}}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						<Box
							sx={{
								width: 48,
								height: 48,
								borderRadius: 2,
								bgcolor: alpha('#8B5CF6', 0.1),
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: '#8B5CF6',
							}}>
							<ImageIcon />
						</Box>
						<Box>
							<Typography variant='h6' sx={{ fontWeight: 700, color: '#1E293B' }}>
								{t('replaceImageLink')}
							</Typography>
							<Typography variant='body2' sx={{ color: '#64748B' }}>
								{editImageDialog.image?.title}
							</Typography>
						</Box>
					</Box>
					<IconButton onClick={handleCloseEditImageDialog} size='small'>
						<Close />
					</IconButton>
				</DialogTitle>

				<DialogContent sx={{ pt: 0 }}>
					<Box sx={{ mb: 2 }}>
						<Typography variant='caption' sx={{ color: '#64748B', fontWeight: 600, display: 'block', mb: 1 }}>
							{t('currentImageFile')}
						</Typography>
						<Typography
							sx={{
								color: '#EF4444',
								textDecoration: 'line-through',
								fontSize: '0.875rem',
								display: 'block',
								wordBreak: 'break-all',
							}}>
							{editImageDialog.image?.image_filename}
						</Typography>
					</Box>

					<Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
						<Button
							variant='outlined'
							startIcon={<OpenInNew />}
							fullWidth
							component={Link}
							href={`/materials/${editImageDialog.image?.section}/${editImageDialog.image?.id}`}
							target='_blank'
							sx={{
								py: 1.5,
								borderRadius: 2,
								textTransform: 'none',
								fontWeight: 600,
								borderColor: '#E2E8F0',
								color: '#475569',
								'&:hover': {
									borderColor: '#10B981',
									bgcolor: alpha('#10B981', 0.05),
									color: '#10B981',
								},
							}}>
							{t('viewMaterial')}
						</Button>
					</Box>

					<TextField
						autoFocus
						fullWidth
						label={t('newImageFile')}
						value={newImageFilename}
						onChange={(e) => setNewImageFilename(e.target.value)}
						placeholder='mon-image.jpg'
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: 2,
							},
						}}
						helperText={t('imageFileHelp')}
					/>
				</DialogContent>

				<DialogActions sx={{ p: 3, pt: 0, justifyContent: 'space-between' }}>
					<Button
						onClick={handleRemoveImage}
						disabled={savingImage}
						sx={{
							textTransform: 'none',
							fontWeight: 600,
							color: '#EF4444',
							'&:hover': {
								bgcolor: alpha('#EF4444', 0.1),
							},
						}}>
						{t('removeImage')}
					</Button>
					<Box sx={{ display: 'flex', gap: 1 }}>
						<Button
							onClick={handleCloseEditImageDialog}
							sx={{
								textTransform: 'none',
								fontWeight: 600,
								color: '#64748B',
							}}>
							{t('cancel')}
						</Button>
						<Button
							onClick={handleSaveImageFilename}
							disabled={savingImage || !newImageFilename.trim()}
							variant='contained'
							sx={{
								bgcolor: '#8B5CF6',
								color: 'white',
								px: 3,
								borderRadius: 2,
								textTransform: 'none',
								fontWeight: 600,
								boxShadow: 'none',
								'&:hover': {
									bgcolor: '#7C3AED',
									boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
								},
								'&:disabled': {
									bgcolor: '#CBD5E1',
									color: 'white',
								},
							}}>
							{savingImage ? (
								<>
									<CircularProgress size={16} sx={{ color: 'white', mr: 1 }} />
									{t('saving')}
								</>
							) : (
								t('save')
							)}
						</Button>
					</Box>
				</DialogActions>
			</Dialog>
		</Box>
	)
}

export default React.memo(AdminDashboardClient)

