import useTranslation from 'next-translate/useTranslation'
import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Container, Typography, Divider } from '@mui/material'
import { getActivities } from '../../features/activities/activitiesSlice'

const H5PViewer = dynamic(() => import('../../components/H5PViewer'), {
	ssr: false,
})

const Lesson = ({ lesson }) => {
	const { t } = useTranslation('lessons')

	const dispatch = useDispatch()
	const { activities } = useSelector(store => store.activities)

	useEffect(() => {
		if (lesson) {
			dispatch(getActivities({ id: lesson.id, type: 'lessons' }))
		}
	}, [dispatch, lesson])

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

	const displayh5pActivities = () => {
		if (!activities || activities.length === 0) {
			return (
				<Typography
					variant='subtitle1'
					sx={{ fontWeight: '600', mt: 4 }}
					align='center'>
					{t('h5p')}
				</Typography>
			)
		}

		return (
			<>
				<Divider sx={{ mt: 10, mb: 8 }} />
				<Container>
					<Typography variant='h4' component='h3' align='center'>
						{t('exercices')}
					</Typography>
					{activities.map(activity => {
						const h5pJsonPath =
							process.env.NEXT_PUBLIC_SUPABASE_H5P +
							'lessons/' +
							activity.material_id +
							activity.h5p_url

						return <H5PViewer key={activity.id} h5pJsonPath={h5pJsonPath} />
					})}
				</Container>
			</>
		)
	}

	return (
		<Container maxWidth='md' sx={{ mt: { xs: '2rem', md: 0 } }}>
			{lesson.blocks.map((block, index) => {
				switch (block.type) {
					case 'mainTitle':
						return (
							<Typography
								key={index}
								gutterBottom
								align='center'
								variant='h3'
								component='h1'>
								{block.text}
							</Typography>
						)
					case 'subtitle':
						return (
							<Typography
								key={index}
								sx={{ mb: { xs: 5, md: 10 } }}
								align='center'
								variant='h5'
								component='h2'>
								{block.text}
							</Typography>
						)
					case 'title':
						return (
							<Typography key={index} variant='h6' sx={{ mt: 2, mb: 1 }}>
								{block.text}
							</Typography>
						)
					case 'paragraph':
						return (
							<Typography
								key={index}
								sx={{ mt: 2, mb: 2 }}
								dangerouslySetInnerHTML={{ __html: block.text }}
							/>
						)
					case 'list':
						return (
							<Box component='ul' sx={{ mt: 2, mb: 3, pl: 2 }} key={index}>
								{block.items.map((item, index) => (
									<li key={index}>
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
							<Box
								sx={{
									backgroundColor: '#f5f5f5',
									padding: 2,
									borderRadius: 1,
									mb: 2,
									mt: 2,
								}}
								key={index}>
								{block.items.map((example, index) => (
									<Typography
										key={index}
										variant='body2'
										sx={{ fontStyle: 'italic' }}
										dangerouslySetInnerHTML={{ __html: example }}></Typography>
								))}
							</Box>
						)

					default:
						return null
				}
			})}
			{displayh5pActivities()}
		</Container>
	)
}

export default Lesson
