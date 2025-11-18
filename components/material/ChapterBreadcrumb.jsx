'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useBookChapters } from '@/lib/materials-client'
import {
	Box,
	Breadcrumbs,
	Typography,
	Button,
	Menu,
	MenuItem,
	Chip,
	useTheme,
} from '@mui/material'
import {
	HomeRounded,
	MenuBookRounded,
	KeyboardArrowDownRounded,
	CheckCircleRounded,
	RadioButtonUncheckedRounded,
	Schedule,
} from '@mui/icons-material'
import { Link } from '@/i18n/navigation'

/**
 * ChapterBreadcrumb component - Navigation breadcrumb for book chapters
 * Shows: Home > Book Title > Current Chapter (with dropdown to all chapters)
 *
 * @param {Object} book - Book object with id and title
 * @param {Object} currentChapter - Current chapter object
 * @param {Array} userMaterialsStatus - User's material completion status
 */
const ChapterBreadcrumb = ({ book, currentChapter, userMaterialsStatus = [] }) => {
	const t = useTranslations('materials')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const router = useRouter()
	const [anchorEl, setAnchorEl] = useState(null)
	const open = Boolean(anchorEl)

	// Fetch all chapters for this book
	const { data: chapters = [] } = useBookChapters(book?.id)

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const handleChapterSelect = (chapterId) => {
		router.push(`/materials/book-chapters/${chapterId}`)
		handleClose()
	}

	// Get completion status for a chapter
	const getChapterStatus = (chapterId) => {
		return userMaterialsStatus.find(um => um.material_id === chapterId)
	}

	// Find current chapter index
	const currentIndex = chapters.findIndex(ch => ch.id === currentChapter?.id)

	return (
		<Box
			sx={{
				pt: { xs: '4rem', md: '6.5rem' },
				pb: 3,
				px: { xs: 2, sm: 3, md: 4 },
				borderBottom: `2px solid ${isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
				background: isDark
					? 'linear-gradient(135deg, rgba(20, 20, 35, 0.95) 0%, rgba(30, 25, 50, 0.9) 100%)'
					: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 245, 255, 0.95) 100%)',
				backdropFilter: 'blur(20px)',
				boxShadow: isDark
					? '0 4px 20px rgba(139, 92, 246, 0.1)'
					: '0 4px 20px rgba(139, 92, 246, 0.05)',
			}}
		>
			<Breadcrumbs
				separator="›"
				sx={{
					'& .MuiBreadcrumbs-separator': {
						color: isDark ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.4)',
						fontWeight: 700,
						fontSize: '1.5rem',
						mx: 1,
					},
				}}
			>
				{/* Home */}
				<Link href="/materials" style={{ textDecoration: 'none' }}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1,
							color: isDark ? 'rgba(139, 92, 246, 0.8)' : 'rgba(139, 92, 246, 0.7)',
							transition: 'all 0.2s ease',
							px: 1.5,
							py: 0.75,
							borderRadius: 2,
							'&:hover': {
								color: '#8b5cf6',
								transform: 'translateY(-2px)',
								bgcolor: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
							},
						}}
					>
						<HomeRounded sx={{ fontSize: '1.5rem' }} />
						<Typography
							sx={{
								fontSize: '1rem',
								fontWeight: 700,
								display: { xs: 'none', sm: 'block' },
							}}
						>
							{t('allMaterials')}
						</Typography>
					</Box>
				</Link>

				{/* Book Title */}
				<Link href="/materials/books" style={{ textDecoration: 'none' }}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1,
							color: isDark ? 'rgba(139, 92, 246, 0.9)' : 'rgba(139, 92, 246, 0.8)',
							transition: 'all 0.2s ease',
							px: 1.5,
							py: 0.75,
							borderRadius: 2,
							'&:hover': {
								color: '#8b5cf6',
								transform: 'translateY(-2px)',
								bgcolor: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
							},
						}}
					>
						<MenuBookRounded sx={{ fontSize: '1.5rem' }} />
						<Typography
							sx={{
								fontSize: '1rem',
								fontWeight: 700,
								maxWidth: { xs: '150px', sm: '300px', md: '400px' },
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
						>
							{book?.title || t('books')}
						</Typography>
					</Box>
				</Link>

				{/* Current Chapter with Dropdown */}
				<Box>
					<Button
						onClick={handleClick}
						endIcon={<KeyboardArrowDownRounded sx={{ fontSize: '1.8rem' }} />}
						sx={{
							color: isDark ? '#c4b5fd' : '#8b5cf6',
							fontWeight: 700,
							fontSize: '1rem',
							textTransform: 'none',
							px: 2.5,
							py: 1,
							minHeight: '44px',
							borderRadius: 3,
							background: isDark
								? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)'
								: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
							border: `2px solid ${isDark ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.3)'}`,
							boxShadow: isDark
								? '0 4px 12px rgba(139, 92, 246, 0.2)'
								: '0 4px 12px rgba(139, 92, 246, 0.15)',
							transition: 'all 0.3s ease',
							'&:hover': {
								background: isDark
									? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)'
									: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
								transform: 'translateY(-2px)',
								boxShadow: isDark
									? '0 6px 20px rgba(139, 92, 246, 0.3)'
									: '0 6px 20px rgba(139, 92, 246, 0.2)',
								borderColor: '#8b5cf6',
							},
						}}
					>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 1.5,
								maxWidth: { xs: '150px', sm: '300px', md: '400px' },
							}}
						>
							<Chip
								label={`${currentIndex + 1}/${chapters.length}`}
								size="small"
								sx={{
									height: 24,
									fontSize: '0.8rem',
									fontWeight: 800,
									bgcolor: isDark ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.3)',
									color: isDark ? '#ffffff' : '#7c3aed',
									border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(124, 58, 237, 0.3)'}`,
								}}
							/>
							<Typography
								sx={{
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
									fontWeight: 700,
								}}
							>
								{currentChapter?.title}
							</Typography>
						</Box>
					</Button>

					{/* Dropdown Menu */}
					<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						PaperProps={{
							sx: {
								maxHeight: 500,
								width: { xs: '90vw', sm: 450 },
								mt: 1,
								borderRadius: 3,
								boxShadow: isDark
									? '0 8px 32px rgba(139, 92, 246, 0.3)'
									: '0 8px 32px rgba(139, 92, 246, 0.15)',
								border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'}`,
								bgcolor: isDark ? 'rgba(20, 20, 35, 0.98)' : 'rgba(255, 255, 255, 0.98)',
								backdropFilter: 'blur(10px)',
								py: 1,
							},
						}}
					>
						{chapters.map((chapter, index) => {
							const status = getChapterStatus(chapter.id)
							const isCurrentChapter = chapter.id === currentChapter?.id
							const isCompleted = status?.is_studied
							const isBeingStudied = status?.is_being_studied

							return (
								<MenuItem
									key={chapter.id}
									onClick={() => handleChapterSelect(chapter.id)}
									sx={{
										py: 2,
										px: 2.5,
										mb: 0.5,
										mx: 1,
										borderRadius: 2,
										bgcolor: isCurrentChapter
											? isDark
												? 'rgba(139, 92, 246, 0.2)'
												: 'rgba(139, 92, 246, 0.12)'
											: 'transparent',
										borderLeft: isCurrentChapter
											? '4px solid #8b5cf6'
											: '4px solid transparent',
										transition: 'all 0.2s ease',
										'&:hover': {
											bgcolor: isDark
												? 'rgba(139, 92, 246, 0.25)'
												: 'rgba(139, 92, 246, 0.15)',
											transform: 'translateX(4px)',
											borderLeftColor: '#8b5cf6',
										},
									}}
								>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											gap: 2,
											width: '100%',
										}}
									>
										{/* Chapter number */}
										<Box
											sx={{
												minWidth: 40,
												height: 40,
												borderRadius: '50%',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												bgcolor: isCurrentChapter
													? '#8b5cf6'
													: isDark
													? 'rgba(139, 92, 246, 0.3)'
													: 'rgba(139, 92, 246, 0.15)',
												color: isCurrentChapter ? 'white' : '#8b5cf6',
												fontWeight: 800,
												fontSize: '1rem',
												boxShadow: isCurrentChapter
													? '0 4px 12px rgba(139, 92, 246, 0.4)'
													: '0 2px 8px rgba(139, 92, 246, 0.2)',
												transition: 'all 0.2s ease',
											}}
										>
											{index + 1}
										</Box>

										{/* Chapter title */}
										<Typography
											sx={{
												flex: 1,
												fontWeight: isCurrentChapter ? 700 : 600,
												fontSize: '1rem',
												lineHeight: 1.4,
												color: isCurrentChapter
													? '#8b5cf6'
													: isDark
													? '#e5e7eb'
													: '#374151',
											}}
										>
											{chapter.title}
										</Typography>

										{/* Completion status */}
										{isCompleted && (
											<CheckCircleRounded
												sx={{
													fontSize: '1.5rem',
													color: '#10b981',
													filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))',
												}}
											/>
										)}
										{!isCompleted && isBeingStudied && (
											<Schedule
												sx={{
													fontSize: '1.5rem',
													color: '#a855f7',
													filter: 'drop-shadow(0 2px 4px rgba(168, 85, 247, 0.3))',
												}}
											/>
										)}
										{!isCompleted && !isBeingStudied && !isCurrentChapter && (
											<RadioButtonUncheckedRounded
												sx={{
													fontSize: '1.5rem',
													color: isDark ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.3)',
												}}
											/>
										)}
									</Box>
								</MenuItem>
							)
						})}
					</Menu>
				</Box>
			</Breadcrumbs>
		</Box>
	)
}

export default ChapterBreadcrumb
