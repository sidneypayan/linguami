import useTranslation from 'next-translate/useTranslation'
import { Box, Container, Typography, Paper } from '@mui/material'

const Lesson = ({ lesson }) => {
	const { t } = useTranslation('lessons')
	if (!lesson || !lesson.blocks || lesson.blocks.length === 0) {
		return (
			<Box
				sx={{ m: 'auto', backgroundColor: 'clrCardBg', borderRadius: 5 }}
				maxWidth='50%'
				flex={1}
				p={4}>
				{/* Contenu principal */}

				<Typography variant='h4' gutterBottom>
					{t('title')}
				</Typography>
				<Typography variant='body1' color='text.secondary'>
					{t('subtitle')}
				</Typography>
			</Box>
		)
	}

	return (
		<Container maxWidth='md'>
			{lesson.blocks.map((block, index) => {
				switch (block.type) {
					case 'mainTitle':
						return (
							<Typography
								key={index}
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
								align='center'
								variant='h5'
								component='h2'
								sx={{ mt: 2, mb: 10 }}>
								{block.text}
							</Typography>
						)
					case 'title':
						return (
							<Typography variant='h6' sx={{ mb: 2 }}>
								{block.text}
							</Typography>
						)
					case 'paragraph':
						return (
							<Typography
								sx={{ mb: 2 }}
								dangerouslySetInnerHTML={{ __html: block.text }}
							/>
						)
					case 'list':
						return (
							<ul>
								{block.items.map((item, index) => (
									<li key={index}>
										<Typography
											component='span'
											dangerouslySetInnerHTML={{ __html: item }}
										/>
									</li>
								))}
							</ul>
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
								}}>
								{block.items.map((example, index) => (
									<Typography
										key={index}
										variant='body2'
										sx={{ fontStyle: 'italic' }}>
										{example}
									</Typography>
								))}
							</Box>
						)

					default:
						return null
				}
			})}
		</Container>
	)
}

export default Lesson
