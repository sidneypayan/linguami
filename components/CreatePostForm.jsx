import {
	Box,
	Typography,
	Card,
	CardContent,
	Stack,
	Chip,
	Alert,
} from '@mui/material'
import { FormRow, FormRowSelect } from '../components'
import { lang } from '../utils/constants'
import {
	Article,
	Image as ImageIcon,
	TextFields,
	Info,
} from '@mui/icons-material'
import useTranslation from 'next-translate/useTranslation'

const CreatePostForm = ({ formData, handleChange }) => {
	const { t } = useTranslation('admin')
	return (
		<Stack spacing={4}>
			{/* Header */}
			<Box>
				<Typography
					variant='h6'
					sx={{ fontWeight: 700, color: '#1E293B', mb: 1 }}>
					{t('createArticle')}
				</Typography>
				<Typography variant='body2' sx={{ color: '#64748B' }}>
					{t('createArticleDesc')}
				</Typography>
			</Box>

			{/* Basic Info Card */}
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
						gap: 1,
					}}>
					<Article sx={{ color: '#667eea', fontSize: 20 }} />
					<Typography
						variant='subtitle2'
						sx={{ fontWeight: 700, color: '#475569' }}>
						{t('basicInfo')}
					</Typography>
				</Box>
				<CardContent sx={{ p: 3 }}>
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
							gap: 3,
						}}>
						<FormRowSelect
							label={t('language')}
							value={formData.lang ?? ''}
							handleChange={handleChange}
							name='lang'
							list={lang}
						/>
						<FormRow
							label={t('articleTitle')}
							value={formData.title ?? ''}
							handleChange={handleChange}
							name='title'
							placeholder={t('articleTitlePlaceholder')}
						/>
					</Box>
				</CardContent>
			</Card>

			{/* Description Card */}
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
						gap: 1,
					}}>
					<Info sx={{ color: '#667eea', fontSize: 20 }} />
					<Typography
						variant='subtitle2'
						sx={{ fontWeight: 700, color: '#475569' }}>
						{t('description')}
					</Typography>
				</Box>
				<CardContent sx={{ p: 3 }}>
					<FormRow
						label={t('shortDescription')}
						value={formData.description ?? ''}
						handleChange={handleChange}
						name='description'
						multiline={true}
						rows={3}
						placeholder={t('shortDescriptionPlaceholder')}
					/>
					<Alert
						severity='info'
						icon={<Info />}
						sx={{
							mt: 2,
							borderRadius: 2,
							bgcolor: '#EFF6FF',
							border: '1px solid #BFDBFE',
							'& .MuiAlert-icon': { color: '#3B82F6' },
						}}>
						<Typography variant='caption' sx={{ color: '#1E40AF' }}>
							{t('descriptionInfo')}
						</Typography>
					</Alert>
				</CardContent>
			</Card>

			{/* Image Card */}
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
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<ImageIcon sx={{ color: '#667eea', fontSize: 20 }} />
						<Typography
							variant='subtitle2'
							sx={{ fontWeight: 700, color: '#475569' }}>
							{t('coverImage')}
						</Typography>
					</Box>
					<Chip
						label={t('optional')}
						size='small'
						sx={{
							bgcolor: '#F1F5F9',
							color: '#475569',
							fontWeight: 600,
							fontSize: '0.7rem',
						}}
					/>
				</Box>
				<CardContent sx={{ p: 3 }}>
					<FormRow
						label={t('imageUrl')}
						value={formData.img ?? ''}
						handleChange={handleChange}
						name='img'
						placeholder={t('imageUrlPlaceholder')}
					/>
				</CardContent>
			</Card>

			{/* Content Card */}
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
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<TextFields sx={{ color: '#667eea', fontSize: 20 }} />
						<Typography
							variant='subtitle2'
							sx={{ fontWeight: 700, color: '#475569' }}>
							{t('articleContent')}
						</Typography>
					</Box>
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
						label={t('articleBody')}
						value={formData.body ?? ''}
						handleChange={handleChange}
						name='body'
						multiline={true}
						rows={25}
						placeholder={t('articleBodyPlaceholder')}
					/>
					<Box
						sx={{
							mt: 2,
							p: 2,
							bgcolor: 'background.paper',
							borderRadius: 2,
							border: '1px solid #E2E8F0',
						}}>
						<Typography
							variant='caption'
							sx={{ color: '#64748B', fontWeight: 600 }}>
							{t('writingTips')}
						</Typography>
						<Box component='ul' sx={{ mt: 1, pl: 2, m: 0 }}>
							<Typography
								component='li'
								variant='caption'
								sx={{ color: '#64748B', mb: 0.5 }}>
								{t('tip1')}
							</Typography>
							<Typography
								component='li'
								variant='caption'
								sx={{ color: '#64748B', mb: 0.5 }}>
								{t('tip2')}
							</Typography>
							<Typography
								component='li'
								variant='caption'
								sx={{ color: '#64748B' }}>
								{t('tip3')}
							</Typography>
						</Box>
					</Box>
				</CardContent>
			</Card>

			{/* Character Count */}
			<Box sx={{ textAlign: 'center' }}>
				<Typography variant='caption' sx={{ color: '#94A3B8' }}>
					{formData.body?.length || 0} {t('characters')}
				</Typography>
			</Box>
		</Stack>
	)
}

export default CreatePostForm
