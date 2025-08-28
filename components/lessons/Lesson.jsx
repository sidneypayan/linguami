import { Box, Container, Typography } from '@mui/material'

const Lesson = ({ lesson }) => {
	return (
		<Container>
			<Typography align='center' variant='h3' component='h1'>
				{/* {lesson.title_fr} */}
			</Typography>
			<Typography mt='1rem' align='center' variant='h5' component='h2'>
				{/* {lesson.title_ru} */}
			</Typography>
			{/* {lesson.content} */}
		</Container>
	)
}

export default Lesson
