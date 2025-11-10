import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import loadNamespaces from 'next-translate/loadNamespaces'
import { sectionsForAdmin } from '@/utils/constants'
import { useState, useEffect } from 'react'
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
	Avatar,
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
} from '@mui/icons-material'
import useTranslation from 'next-translate/useTranslation'
import AdminNavbar from '@/components/admin/AdminNavbar'

const Admin = ({
	materialsCountByLang,
	booksCountByLang,
}) => {
	const { t } = useTranslation('admin')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const [selectedLang, setSelectedLang] = useState('fr')
	const [brokenVideos, setBrokenVideos] = useState([])
	const [loadingVideos, setLoadingVideos] = useState(false)
	const [showBrokenVideos, setShowBrokenVideos] = useState(false)
	const [editVideoDialog, setEditVideoDialog] = useState({ open: false, video: null })
	const [newVideoUrl, setNewVideoUrl] = useState('')
	const [savingVideo, setSavingVideo] = useState(false)

	const loadBrokenVideos = async () => {
		setLoadingVideos(true)
		try {
			const response = await fetch('/api/admin/check-videos')
			const data = await response.json()
			setBrokenVideos(data.brokenVideos || [])
			setShowBrokenVideos(true)
		} catch (error) {
			console.error('Error loading broken videos:', error)
		} finally {
			setLoadingVideos(false)
		}
	}

	const handleOpenEditDialog = (video) => {
		setEditVideoDialog({ open: true, video })
		setNewVideoUrl(video.video || '')
	}

	const handleCloseEditDialog = () => {
		setEditVideoDialog({ open: false, video: null })
		setNewVideoUrl('')
	}

	const handleSaveVideoUrl = async () => {
		if (!newVideoUrl.trim()) return

		setSavingVideo(true)
		try {
			const response = await fetch('/api/admin/update-video', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					materialId: editVideoDialog.video.id,
					videoUrl: newVideoUrl.trim(),
				}),
			})

			if (response.ok) {
				// Retirer la vidéo de la liste des vidéos cassées
				setBrokenVideos(prev => prev.filter(v => v.id !== editVideoDialog.video.id))
				handleCloseEditDialog()
			} else {
				console.error('Failed to update video')
				alert(t('errorUpdatingVideo'))
			}
		} catch (error) {
			console.error('Error updating video:', error)
			alert(t('errorUpdatingVideo'))
		} finally {
			setSavingVideo(false)
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

	// Calculate totals
	const totalAudioText = currentLangData?.audioTextCount || 0
	const totalVideo = currentLangData?.videoCount || 0
	const totalBooks = currentBooks?.count || 0
	const grandTotal = totalAudioText + totalVideo + totalBooks

	// Prepare table data - Détail par section avec catégories
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
		// Catégorie Texte & Audio
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

		// Catégorie Vidéos
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

		// Catégorie Livres
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
			{/* Admin Navbar */}
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
													href={video.video}
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
													{video.video}
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
											// Ligne de catégorie
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
											// Ligne normale
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
		</Box>
	)
}

export const getServerSideProps = async ({ req, res }) => {
	// Créer un client Supabase pour le serveur
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				get(name) {
					return req.cookies[name]
				},
				set(name, value, options) {
					const cookieOptions = []
					if (options?.maxAge) cookieOptions.push(`Max-Age=${options.maxAge}`)
					if (options?.path) cookieOptions.push(`Path=${options.path}`)
					if (options?.domain) cookieOptions.push(`Domain=${options.domain}`)
					if (options?.secure) cookieOptions.push('Secure')
					if (options?.httpOnly) cookieOptions.push('HttpOnly')
					if (options?.sameSite)
						cookieOptions.push(`SameSite=${options.sameSite}`)

					const cookieString = `${name}=${value}${
						cookieOptions.length ? '; ' + cookieOptions.join('; ') : ''
					}`
					res.setHeader('Set-Cookie', cookieString)
				},
				remove(name, options) {
					res.setHeader('Set-Cookie', `${name}=; Path=/; Max-Age=0`)
				},
			},
		}
	)

	// Récupérer l'utilisateur connecté
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (!user || authError) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}

	// Récupérer le profil utilisateur
	const { data: userProfile, error: userError } = await supabase
		.from('users_profile')
		.select('*')
		.eq('id', user.id)
		.single()

	if (userError || userProfile?.role !== 'admin') {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}

	const langs = ['fr', 'ru']

	// Définir les catégories de sections
	const audioTextSections = [
		'dialogues',
		'culture',
		'legends',
		'slices-of-life',
		'beautiful-places',
		'podcasts',
		'short-stories'
	]

	const videoSectionsFr = [
		'movie-trailers',
		'movie-clips',
		'cartoons',
		'various-materials',
		'rock',
		'pop',
		'folk',
		'variety',
		'kids'
	]

	const videoSectionsRu = [
		...videoSectionsFr,
		'eralash',
		'galileo'
	]

	// Fonction pour compter par catégorie
	const getCountByCategory = async (sections, lang) => {
		const { count, error } = await supabase
			.from('materials')
			.select('id', { count: 'exact', head: true })
			.in('section', sections)
			.eq('lang', lang)

		if (error) {
			console.error(`Erreur dans materials (${lang}) :`, error)
			return 0
		}

		return count || 0
	}

	// Fonction pour compter les livres par langue
	const getBooksCountByLang = async lang => {
		const { count, error } = await supabase
			.from('books')
			.select('id', { count: 'exact', head: true })
			.eq('lang', lang)

		if (error) {
			console.error(`Erreur dans books (${lang}) :`, error)
			return 0
		}

		return count || 0
	}

	// Fonction pour compter par section individuelle
	const getCountBySectionAndLang = async (section, lang) => {
		const { count, error } = await supabase
			.from('materials')
			.select('id', { count: 'exact', head: true })
			.eq('section', section)
			.eq('lang', lang)

		if (error) {
			console.error(`Erreur dans materials (${section}, ${lang}) :`, error)
			return 0
		}

		return count || 0
	}

	// Comptage des materials par catégorie et langue
	const materialsCountByLang = await Promise.all(
		langs.map(async lang => {
			const videoSections = lang === 'ru' ? videoSectionsRu : videoSectionsFr
			// Inclure book-chapters dans le tableau mais pas dans les totaux Text & Audio
			const allSections = [...audioTextSections, ...videoSections, 'book-chapters']

			// Compter les totaux par catégorie
			const audioTextCount = await getCountByCategory(audioTextSections, lang)
			const videoCount = await getCountByCategory(videoSections, lang)

			// Compter chaque section individuellement pour le tableau
			const sectionCounts = await Promise.all(
				allSections.map(async section => {
					const count = await getCountBySectionAndLang(section, lang)
					return { section, count }
				})
			)

			return {
				lang,
				audioTextCount,
				videoCount,
				sections: sectionCounts.filter(s => s.count > 0)
			}
		})
	)

	// Comptage des livres par langue
	const booksCountByLang = await Promise.all(
		langs.map(async lang => {
			const count = await getBooksCountByLang(lang)
			return { lang, count }
		})
	)

	return {
		props: {
			materialsCountByLang,
			booksCountByLang,
			...(await loadNamespaces({ ...{ req, res }, pathname: '/admin', loaderName: 'getServerSideProps' })),
		},
	}
}

export default Admin
