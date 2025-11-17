import { useTranslations } from 'next-intl'
import { Box, Container, Typography, Button, Card } from '@mui/material'
import { CheckCircleRounded } from '@mui/icons-material'
import { useLessonStatus, useMarkLessonAsStudied } from '@/lib/lessons-client'
import { useUserContext } from '@/context/user'
import toast from '@/utils/toast'
import { getToastMessage } from '@/utils/toastMessages'

const Lesson = ({ lesson }) => {
	const t = useTranslations('lessons')
	const { isUserLoggedIn } = useUserContext()

	// React Query: Get lesson status
	const { data: lessonStatus } = useLessonStatus(lesson?.id, isUserLoggedIn)
	const isLessonStudied = lessonStatus?.is_studied || false

	// React Query: Mark lesson as studied mutation
	const { mutate: markAsStudied, isPending: isMarking } = useMarkLessonAsStudied(isUserLoggedIn)

	const handleMarkAsStudied = () => {
		if (!lesson?.id) return

		markAsStudied(lesson.id, {
			onSuccess: () => {
				toast.success(getToastMessage('congratsProgress'))
			},
			onError: (error) => {
				toast.error(error.message || 'Failed to save progress')
			},
		})
	}

	if (!lesson || !lesson.blocks || lesson.blocks.length === 0) {
		return (
			<Box
				sx={{
					display: { xs: 'none', md: 'block' },
					margin: '0 auto',
					backgroundColor: 'clrCardBg',
					borderRadius: 5,
					position: 'sticky',
					top: '160px',
				}}
				maxWidth='md'
				flex={1}
				p={4}>
				<Typography gutterBottom variant='h4'>
					{t('title')}
				</Typography>
				<Typography variant='body1' color='text.secondary'>
					{t('subtitle')}
				</Typography>
			</Box>
		)
	}

	return (
		<Container
			maxWidth='md'
			sx={{
				mt: { xs: '2rem', md: 0 },
				mb: { xs: 8, md: 4 },
			}}>
			<Card
				sx={{
					p: { xs: 3, sm: 4, md: 5 },
					borderRadius: 4,
					boxShadow: '0 8px 32px rgba(102, 126, 234, 0.12)',
					border: '1px solid rgba(102, 126, 234, 0.1)',
					background: 'white',
				}}>
				{lesson.blocks.map((block, index) => {
					switch (block.type) {
						case 'mainTitle':
							return (
								<Typography
									key={index}
									align='center'
									variant='h3'
									component='h1'
									sx={{
										fontWeight: 800,
										fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
										mb: 2,
										background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										backgroundClip: 'text',
									}}>
									{block.text}
								</Typography>
							)
						case 'subtitle':
							return (
								<Typography
									key={index}
									align='center'
									variant='h5'
									component='h2'
									sx={{
										mb: { xs: 5, md: 8 },
										color: '#718096',
										fontWeight: 500,
										fontSize: { xs: '1.125rem', sm: '1.25rem' },
									}}>
									{block.text}
								</Typography>
							)
						case 'title':
							return (
								<Typography
									key={index}
									variant='h5'
									sx={{
										mt: 5,
										mb: 2,
										fontWeight: 700,
										fontSize: { xs: '1.25rem', sm: '1.5rem' },
										color: '#2d3748',
										position: 'relative',
										pl: 2,
										'&::before': {
											content: '""',
											position: 'absolute',
											left: 0,
											top: '50%',
											transform: 'translateY(-50%)',
											width: 4,
											height: '80%',
											borderRadius: 2,
											background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
										},
									}}>
									{block.text}
								</Typography>
							)
						case 'paragraph':
							return (
								<Typography
									key={index}
									sx={{
										mt: 2,
										mb: 3,
										color: '#4a5568',
										fontSize: { xs: '1rem', sm: '1.0625rem' },
										lineHeight: 1.8,
									}}
									dangerouslySetInnerHTML={{ __html: block.text }}
								/>
							)
						case 'list':
							return (
								<Box
									component='ul'
									sx={{
										mt: 2,
										mb: 3,
										pl: { xs: 3, sm: 4 },
										'& li': {
											mb: 1.5,
											color: '#4a5568',
											fontSize: { xs: '1rem', sm: '1.0625rem' },
											lineHeight: 1.8,
											'&::marker': {
												color: '#667eea',
											},
										},
									}}
									key={index}>
									{block.items.map((item, itemIndex) => (
										<li key={itemIndex}>
											<Typography
												component='span'
												dangerouslySetInnerHTML={{ __html: item }}
											/>
										</li>
									))}
								</Box>
							)

						case 'examples':
							return (
								<Card
									sx={{
										background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
										p: { xs: 2.5, sm: 3 },
										borderRadius: 3,
										mb: 3,
										mt: 2,
										border: '2px solid rgba(102, 126, 234, 0.15)',
										boxShadow: '0 4px 12px rgba(102, 126, 234, 0.08)',
										position: 'relative',
										overflow: 'hidden',
										'&::before': {
											content: '""',
											position: 'absolute',
											top: 0,
											left: 0,
											width: 4,
											height: '100%',
											background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
										},
									}}
									key={index}>
									{block.items.map((example, exampleIndex) => (
										<Typography
											key={exampleIndex}
											variant='body1'
											sx={{
												fontStyle: 'italic',
												color: '#4a5568',
												fontSize: { xs: '0.9375rem', sm: '1rem' },
												lineHeight: 1.8,
												mb: exampleIndex < block.items.length - 1 ? 2 : 0,
												pl: 2,
											}}
											dangerouslySetInnerHTML={{ __html: example }}></Typography>
									))}
								</Card>
							)

						default:
							return null
					}
				})}
			</Card>

			{!isLessonStudied && (
				<Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
					<Button
						variant='contained'
						size='large'
						startIcon={<CheckCircleRounded />}
						onClick={handleMarkAsStudied}
						disabled={isMarking}
						sx={{
							background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
							color: 'white',
							fontWeight: 700,
							fontSize: { xs: '1rem', sm: '1.125rem' },
							padding: { xs: '14px 32px', sm: '16px 48px' },
							borderRadius: 3,
							textTransform: 'none',
							boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
							transition: 'all 0.3s ease',
							'&:hover': {
								background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
								transform: 'translateY(-3px)',
								boxShadow: '0 12px 32px rgba(16, 185, 129, 0.4)',
							},
							'&:active': {
								transform: 'translateY(-1px)',
							},
						}}>
						{isMarking ? t('saving') || 'Saving...' : t('lessonlearnt')}
					</Button>
				</Box>
			)}
		</Container>
	)
}

export default Lesson
