import { Box, Container, Typography } from '@mui/material'

const Lesson = ({ lesson }) => {
	if (!lesson || !lesson.blocks || lesson.blocks.length === 0) {
		return <p>Aucune donnée disponible pour cette leçon.</p>
	}

	console.log(lesson)
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
