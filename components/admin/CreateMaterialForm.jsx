import { Box, Button, Typography, TextField, MenuItem, Card, CardContent, Alert, Chip, Stack, ListSubheader, Divider } from '@mui/material'
import { FormRow, FormRowSelect } from '../shared'
import { lang, level, audioSections, videoSections } from '@/utils/constants'
import {
	Image as ImageIcon,
	AudioFile,
	VideoLibrary,
	MenuBook,
	Settings,
	Description,
	AttachFile,
	CheckCircle,
	CloudUpload,
} from '@mui/icons-material'
import { useTranslations, useLocale } from 'next-intl'

const CreateMaterialForm = ({ formData, handleChange }) => {
	const t = useTranslations('admin')

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
							bgcolor: 'background.paper',
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
							bgcolor: 'background.paper',
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
							bgcolor: 'background.paper',
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
							bgcolor: 'background.paper',
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
									value={formData.content ?? ''}
									handleChange={handleChange}
									name='content'
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
										value={formData.content_accented ?? ''}
										handleChange={handleChange}
										name='content_accented'
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

			{/* Media Section - Afficher si titre et content sont remplis */}
			{formData.section && formData.title && formData.content && (
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
							bgcolor: 'background.paper',
							px: 3,
							py: 2,
							borderBottom: '1px solid #E2E8F0',
						}}>
						<Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#475569' }}>
							{t('files')}
						</Typography>
					</Box>
					<CardContent sx={{ p: 3 }}>
						<Stack spacing={4}>
							{/* Image - Upload ou saisie manuelle */}
							<Box>
								<Typography variant='subtitle2' sx={{ mb: 2, fontWeight: 600, color: '#475569' }}>
									{t('image')}
								</Typography>

								{/* Option 1: Upload de fichier */}
								<Button
									component='label'
									variant='outlined'
									startIcon={<CloudUpload />}
									fullWidth
									disabled={!!formData.image_filename}
									sx={{
										py: 2,
										borderColor: '#667eea',
										color: '#667eea',
										fontWeight: 600,
										borderStyle: 'dashed',
										borderWidth: 2,
										textTransform: 'none',
										'&:hover': {
											borderColor: '#5568d3',
											bgcolor: 'rgba(102, 126, 234, 0.05)',
										},
										'&:disabled': {
											borderColor: '#E2E8F0',
											color: '#94a3b8',
										},
									}}>
									{t('uploadImage')}
									<input
										onChange={handleChange}
										name='image_filename'
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
									value={typeof formData.image_filename === 'string' ? formData.image_filename : ''}
									onChange={(e) => handleChange({ target: { name: 'image_filename', value: e.target.value } })}
									placeholder="exemple: mon-image.jpg"
									helperText={t('fileNameOnlyHelper')}
									sx={{
										'& .MuiOutlinedInput-root': { borderRadius: 2 },
									}}
								/>

								{formData.image_filename && (
									<Alert severity='success' sx={{ mt: 2, borderRadius: 2 }}>
										<Typography variant='caption' sx={{ fontWeight: 600 }}>
											✓ {formData.image_filename}
										</Typography>
									</Alert>
								)}
							</Box>

							{/* Audio - Upload ou saisie manuelle */}
							{audioSections.includes(formData.section) && (
								<Box>
									<Typography variant='subtitle2' sx={{ mb: 2, fontWeight: 600, color: '#475569' }}>
										{t('audio')}
									</Typography>

									{/* Option 1: Upload de fichier */}
									<Button
										component='label'
										variant='outlined'
										startIcon={<CloudUpload />}
										fullWidth
										disabled={!!formData.audio_filename}
										sx={{
											py: 2,
											borderColor: '#667eea',
											color: '#667eea',
											fontWeight: 600,
											borderStyle: 'dashed',
											borderWidth: 2,
											textTransform: 'none',
											'&:hover': {
												borderColor: '#5568d3',
												bgcolor: 'rgba(102, 126, 234, 0.05)',
											},
											'&:disabled': {
												borderColor: '#E2E8F0',
												color: '#94a3b8',
											},
										}}>
										{t('uploadAudio')}
										<input
											onChange={handleChange}
											name='audio_filename'
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
										value={typeof formData.audio_filename === 'string' ? formData.audio_filename : ''}
										onChange={(e) => handleChange({ target: { name: 'audio_filename', value: e.target.value } })}
										placeholder="exemple: mon-audio.mp3"
										helperText={t('fileNameOnlyHelper')}
										sx={{
											'& .MuiOutlinedInput-root': { borderRadius: 2 },
										}}
									/>

									{formData.audio_filename && (
										<Alert severity='success' sx={{ mt: 2, borderRadius: 2 }}>
											<Typography variant='caption' sx={{ fontWeight: 600 }}>
												✓ {formData.audio_filename}
											</Typography>
										</Alert>
									)}
								</Box>
							)}
						</Stack>
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
								bgcolor: 'background.paper',
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
								value={formData.video_url ?? ''}
								handleChange={handleChange}
								name='video_url'
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
								bgcolor: 'background.paper',
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
