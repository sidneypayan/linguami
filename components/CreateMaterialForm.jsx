import { Box, Button, Typography, TextField, MenuItem, Card, CardContent, Alert, Chip, Stack, ListSubheader } from '@mui/material'
import { FormRow, FormRowSelect } from '.'
import { lang, level, audioSections, videoSections } from '../utils/constants'
import {
	Image as ImageIcon,
	AudioFile,
	VideoLibrary,
	MenuBook,
	Settings,
	Description,
	AttachFile,
	CheckCircle,
} from '@mui/icons-material'
import useTranslation from 'next-translate/useTranslation'

const CreateMaterialForm = ({ formData, handleChange }) => {
	const { t } = useTranslation('admin')

	return (
		<Stack spacing={4}>
			{/* Configuration Section */}
			<Box>
			<Box sx={{ mb: 3 }}>
				<Typography variant='h6' sx={{ fontWeight: 700, color: '#1E293B', mb: 1 }}>
					{t('materialConfiguration')}
				</Typography>
				<Typography variant='body2' sx={{ color: '#64748B' }}>
					{t('materialConfigDesc')}
				</Typography>
			</Box>

			<Alert
				severity='info'
				sx={{
					mb: 3,
					borderRadius: 2,
					bgcolor: '#FEF3C7',
					border: '1px solid #FCD34D',
					'& .MuiAlert-icon': { color: '#F59E0B' },
				}}>
				<Typography variant='body2' sx={{ color: '#92400E', fontWeight: 600 }}>
					{t('allFieldsRequired')}
				</Typography>
			</Alert>

			<Stack spacing={3}>
				<Card
					elevation={0}
					sx={{
						border: '1px solid #E2E8F0',
						borderRadius: 2,
						overflow: 'hidden',
					}}>
					<Box
						sx={{
							bgcolor: '#F8FAFC',
							px: 3,
							py: 2,
							borderBottom: '1px solid #E2E8F0',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}>
						<Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#475569' }}>
							{t('languageSettings')}
						</Typography>
						<Chip
							label={t('required')}
							size='small'
							sx={{
								bgcolor: '#FEF3C7',
								color: '#92400E',
								fontWeight: 600,
								fontSize: '0.7rem',
							}}
						/>
					</Box>
					<CardContent sx={{ p: 3 }}>
						<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
							<FormRowSelect
								label={t('language')}
								value={formData.lang ?? ''}
								handleChange={handleChange}
								name='lang'
								list={lang}
							/>
							<FormRowSelect
								label={t('difficultyLevel')}
								value={formData.level ?? ''}
								handleChange={handleChange}
								name='level'
								list={level}
							/>
						</Box>
					</CardContent>
				</Card>

				<Card
					elevation={0}
					sx={{
						border: '1px solid #E2E8F0',
						borderRadius: 2,
						overflow: 'hidden',
					}}>
					<Box
						sx={{
							bgcolor: '#F8FAFC',
							px: 3,
							py: 2,
							borderBottom: '1px solid #E2E8F0',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}>
						<Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#475569' }}>
							{t('category')}
						</Typography>
						<Chip
							label={t('required')}
							size='small'
							sx={{
								bgcolor: '#FEF3C7',
								color: '#92400E',
								fontWeight: 600,
								fontSize: '0.7rem',
							}}
						/>
					</Box>
					<CardContent sx={{ p: 3 }}>
						<TextField
							select
							label={t('section')}
							value={formData.section ?? ''}
							onChange={handleChange}
							name='section'
							fullWidth
							sx={{ backgroundColor: 'white' }}>
							<ListSubheader sx={{ fontWeight: 700, color: '#667eea', bgcolor: '#F5F3FF' }}>
								📝 Text & Audio
							</ListSubheader>
							<MenuItem value='dialogues'>Dialogues</MenuItem>
							<MenuItem value='culture'>Culture</MenuItem>
							<MenuItem value='legends'>Legends</MenuItem>
							<MenuItem value='slices-of-life'>Slices of Life</MenuItem>
							<MenuItem value='beautiful-places'>Beautiful Places</MenuItem>
							<MenuItem value='podcasts'>Podcasts</MenuItem>
							<MenuItem value='short-stories'>Short Stories</MenuItem>
							<MenuItem value='book-chapters'>Book Chapters</MenuItem>

							<ListSubheader sx={{ fontWeight: 700, color: '#667eea', bgcolor: '#F5F3FF', mt: 1 }}>
								🎬 Video
							</ListSubheader>
							<MenuItem value='movie-trailers'>Movie Trailers</MenuItem>
							<MenuItem value='movie-clips'>Movie Clips</MenuItem>
							<MenuItem value='cartoons'>Cartoons</MenuItem>
							<MenuItem value='eralash'>Eralash</MenuItem>
							<MenuItem value='galileo'>Galileo</MenuItem>
							<MenuItem value='various-materials'>Various Materials</MenuItem>

							<ListSubheader sx={{ fontWeight: 700, color: '#667eea', bgcolor: '#F5F3FF', mt: 1 }}>
								🎵 Music
							</ListSubheader>
							<MenuItem value='rock'>Rock</MenuItem>
							<MenuItem value='pop'>Pop</MenuItem>
							<MenuItem value='folk'>Folk / Traditional</MenuItem>
							<MenuItem value='variety'>Variety</MenuItem>
							<MenuItem value='kids'>Kids</MenuItem>
						</TextField>
					</CardContent>
				</Card>
			</Stack>
			</Box>

			{/* Content Section - Afficher si langue, niveau et section sont sélectionnés */}
			{formData.lang && formData.level && formData.section && (
				<Box>
			<Box sx={{ mb: 3 }}>
				<Typography variant='h6' sx={{ fontWeight: 700, color: '#1E293B', mb: 1 }}>
					{t('materialContent')}
				</Typography>
				<Typography variant='body2' sx={{ color: '#64748B' }}>
					{t('materialContentDesc')}
				</Typography>
			</Box>

			<Alert
				severity='info'
				sx={{
					mb: 3,
					borderRadius: 2,
					bgcolor: '#FEF3C7',
					border: '1px solid #FCD34D',
					'& .MuiAlert-icon': { color: '#F59E0B' },
				}}>
				<Typography variant='body2' sx={{ color: '#92400E', fontWeight: 600 }}>
					{t('titleAndBodyRequired')}
				</Typography>
			</Alert>

			<Stack spacing={3}>
				<Card
					elevation={0}
					sx={{
						border: '1px solid #E2E8F0',
						borderRadius: 2,
						overflow: 'hidden',
					}}>
					<Box
						sx={{
							bgcolor: '#F8FAFC',
							px: 3,
							py: 2,
							borderBottom: '1px solid #E2E8F0',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}>
						<Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#475569' }}>
							{t('title')}
						</Typography>
						<Chip
							label={t('required')}
							size='small'
							sx={{
								bgcolor: '#FEF3C7',
								color: '#92400E',
								fontWeight: 600,
								fontSize: '0.7rem',
							}}
						/>
					</Box>
					<CardContent sx={{ p: 3 }}>
						<FormRow
							label={t('materialTitle')}
							value={formData.title ?? ''}
							handleChange={handleChange}
							name='title'
							placeholder={t('materialTitlePlaceholder')}
						/>
					</CardContent>
				</Card>

				<Card
					elevation={0}
					sx={{
						border: '1px solid #E2E8F0',
						borderRadius: 2,
						overflow: 'hidden',
					}}>
					<Box
						sx={{
							bgcolor: '#F8FAFC',
							px: 3,
							py: 2,
							borderBottom: '1px solid #E2E8F0',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}>
						<Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#475569' }}>
							{t('materialText')}
						</Typography>
						<Chip
							label={t('required')}
							size='small'
							sx={{
								bgcolor: '#FEF3C7',
								color: '#92400E',
								fontWeight: 600,
								fontSize: '0.7rem',
							}}
						/>
					</Box>
					<CardContent sx={{ p: 3 }}>
						<Box sx={{ display: 'grid', gridTemplateColumns: formData.lang === 'ru' ? { xs: '1fr', lg: 'repeat(2, 1fr)' } : '1fr', gap: 3 }}>
							<Box>
								<Typography variant='caption' sx={{ color: '#64748B', fontWeight: 600, mb: 1, display: 'block' }}>
									{formData.lang === 'ru' ? t('textWithoutAccents') : t('materialText')}
								</Typography>
								<FormRow
									label=''
									value={formData.body ?? ''}
									handleChange={handleChange}
									name='body'
									multiline={true}
									rows={20}
									placeholder={formData.lang === 'ru' ? t('textWithoutAccentsPlaceholder') : t('textWithAccentsPlaceholder')}
								/>
							</Box>
							{formData.lang === 'ru' && (
								<Box>
									<Typography variant='caption' sx={{ color: '#64748B', fontWeight: 600, mb: 1, display: 'block' }}>
										{t('textWithAccents')}
									</Typography>
									<FormRow
										label=''
										value={formData.body_accents ?? ''}
										handleChange={handleChange}
										name='body_accents'
										multiline={true}
										rows={20}
										placeholder={t('textWithAccentsPlaceholder')}
									/>
								</Box>
							)}
						</Box>
						{formData.lang === 'ru' && (
							<Alert
								severity='info'
								icon={<CheckCircle />}
								sx={{
									mt: 2,
									borderRadius: 2,
									bgcolor: '#EFF6FF',
									border: '1px solid #BFDBFE',
									'& .MuiAlert-icon': { color: '#3B82F6' },
								}}>
								<Typography variant='caption' sx={{ color: '#1E40AF' }}>
									{t('textVersionsInfo')}
								</Typography>
							</Alert>
						)}
					</CardContent>
				</Card>
			</Stack>
			</Box>
			)}

			{/* Media Section - Afficher si titre et body sont remplis */}
			{formData.section && formData.title && formData.body && (
				<Box>
			<Box sx={{ mb: 3 }}>
				<Typography variant='h6' sx={{ fontWeight: 700, color: '#1E293B', mb: 1 }}>
					{t('mediaFilesTitle')}
				</Typography>
				<Typography variant='body2' sx={{ color: '#64748B' }}>
					{t('mediaFilesDesc')}
				</Typography>
			</Box>

			{formData.section === 'book-chapters' && (
				<Alert
					severity='info'
					sx={{
						mb: 3,
						borderRadius: 2,
						bgcolor: '#FEF3C7',
						border: '1px solid #FCD34D',
						'& .MuiAlert-icon': { color: '#F59E0B' },
					}}>
					<Typography variant='body2' sx={{ color: '#92400E', fontWeight: 600 }}>
						{t('bookFieldsRequired')}
					</Typography>
				</Alert>
			)}

			{audioSections.includes(formData.section) && (
				<Alert
					severity='warning'
					sx={{
						mb: 3,
						borderRadius: 2,
						bgcolor: '#FEF3C7',
						border: '1px solid #FCD34D',
						'& .MuiAlert-icon': { color: '#F59E0B' },
					}}>
					<Typography variant='body2' sx={{ color: '#92400E', fontWeight: 600 }}>
						{t('imageAndAudioRequired')}
					</Typography>
				</Alert>
			)}

			{videoSections.includes(formData.section) && (
				<Alert
					severity='warning'
					sx={{
						mb: 3,
						borderRadius: 2,
						bgcolor: '#FEF3C7',
						border: '1px solid #FCD34D',
						'& .MuiAlert-icon': { color: '#F59E0B' },
					}}>
					<Typography variant='body2' sx={{ color: '#92400E', fontWeight: 600 }}>
						{t('imageAndVideoRequired')}
					</Typography>
				</Alert>
			)}

			<Stack spacing={3}>
				<Card
					elevation={0}
					sx={{
						border: '1px solid #E2E8F0',
						borderRadius: 2,
						overflow: 'hidden',
					}}>
					<Box
						sx={{
							bgcolor: '#F8FAFC',
							px: 3,
							py: 2,
							borderBottom: '1px solid #E2E8F0',
						}}>
						<Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#475569' }}>
							{t('files')}
						</Typography>
					</Box>
					<CardContent sx={{ p: 3 }}>
						<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
							<Box>
								<Button
									component='label'
									variant='outlined'
									startIcon={<ImageIcon />}
									fullWidth
									sx={{
										py: 3,
										borderColor: formData.image ? '#10B981' : '#E2E8F0',
										color: formData.image ? '#10B981' : '#475569',
										fontWeight: 600,
										borderStyle: formData.image ? 'solid' : 'dashed',
										borderWidth: 2,
										bgcolor: formData.image ? '#ECFDF5' : 'transparent',
										'&:hover': {
											borderColor: formData.image ? '#059669' : '#667eea',
											bgcolor: formData.image ? '#D1FAE5' : '#F5F3FF',
											color: formData.image ? '#059669' : '#667eea',
										},
									}}>
									{formData.image ? `✓ ${formData.image}` : t('addImage')}
									<input
										onChange={handleChange}
										name='image'
										hidden
										type='file'
										accept='image/*'
									/>
								</Button>
								{formData.image && (
									<Typography variant='caption' sx={{ color: '#10B981', fontWeight: 600, mt: 1, display: 'block', textAlign: 'center' }}>
										{t('imageLoadedSuccess')}
									</Typography>
								)}
							</Box>
							{audioSections.includes(formData.section) && (
								<Box>
									<Button
										component='label'
										variant='outlined'
										startIcon={<AudioFile />}
										fullWidth
										sx={{
											py: 3,
											borderColor: formData.audio ? '#10B981' : '#E2E8F0',
											color: formData.audio ? '#10B981' : '#475569',
											fontWeight: 600,
											borderStyle: formData.audio ? 'solid' : 'dashed',
											borderWidth: 2,
											bgcolor: formData.audio ? '#ECFDF5' : 'transparent',
											'&:hover': {
												borderColor: formData.audio ? '#059669' : '#667eea',
												bgcolor: formData.audio ? '#D1FAE5' : '#F5F3FF',
												color: formData.audio ? '#059669' : '#667eea',
											},
										}}>
										{formData.audio ? `✓ ${formData.audio}` : t('addAudio')}
										<input
											onChange={handleChange}
											name='audio'
											hidden
											type='file'
											accept='audio/*'
										/>
									</Button>
									{formData.audio && (
										<Typography variant='caption' sx={{ color: '#10B981', fontWeight: 600, mt: 1, display: 'block', textAlign: 'center' }}>
											{t('audioLoadedSuccess')}
										</Typography>
									)}
								</Box>
							)}
						</Box>
					</CardContent>
				</Card>

				{videoSections.includes(formData.section) && (
					<Card
						elevation={0}
						sx={{
							border: '1px solid #E2E8F0',
							borderRadius: 2,
							overflow: 'hidden',
						}}>
						<Box
							sx={{
								bgcolor: '#F8FAFC',
								px: 3,
								py: 2,
								borderBottom: '1px solid #E2E8F0',
							}}>
							<Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#475569' }}>
								{t('videoUrl')}
							</Typography>
						</Box>
						<CardContent sx={{ p: 3 }}>
							<FormRow
								label={t('youtubeLink')}
								value={formData.video ?? ''}
								handleChange={handleChange}
								name='video'
								placeholder='https://www.youtube.com/watch?v=...'
							/>
						</CardContent>
					</Card>
				)}

				{formData.section === 'book-chapters' && (
					<Card
						elevation={0}
						sx={{
							border: '1px solid #E2E8F0',
							borderRadius: 2,
							overflow: 'hidden',
						}}>
						<Box
							sx={{
								bgcolor: '#F8FAFC',
								px: 3,
								py: 2,
								borderBottom: '1px solid #E2E8F0',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}>
							<Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#475569' }}>
								{t('bookReference')}
							</Typography>
							<Chip
								label={t('required')}
								size='small'
								sx={{
									bgcolor: '#FEF3C7',
									color: '#92400E',
									fontWeight: 600,
									fontSize: '0.7rem',
								}}
							/>
						</Box>
						<CardContent sx={{ p: 3 }}>
							<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
								<FormRow
									label={t('bookId')}
									value={formData.book_id ?? ''}
									handleChange={handleChange}
									name='book_id'
									type='number'
									placeholder='1'
								/>
								<FormRow
									label={t('chapterNumber')}
									value={formData.chapter_number ?? ''}
									handleChange={handleChange}
									name='chapter_number'
									type='number'
									placeholder='1'
								/>
							</Box>
						</CardContent>
					</Card>
				)}
			</Stack>
			</Box>
			)}
		</Stack>
	)
}

export default CreateMaterialForm
