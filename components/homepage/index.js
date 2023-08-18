import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import Hero from './Hero'
import Link from 'next/link'
import {

	Box,
	Button,
	Container,
	Divider,
	Grid,
	styled,
	Typography,
} from '@mui/material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Stack } from '@mui/system'

const StyledStack = styled(Stack)(({ theme }) => ({
	justifyContent: 'space-between',
	gap: '2rem',
	[theme.breakpoints.up('md')]: {
		flexDirection: 'row',
	},
	[theme.breakpoints.down('md')]: {
		justifyContent: 'center',
		alignItems: 'center',
	},
}))
const StyledGridItem = styled(Grid)({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: '1rem',
	textAlign: 'center',
	marginBottom: '2rem',
})

const Homepage = () => {
	const { t, lang } = useTranslation('home')

	const multimedia = [
		{
			img: '/img/video.png',
			title: t('video'),
			subtitle: t('videosubtitle'),
		},
		{
			img: '/img/audio.png',
			title: t('audio'),
			subtitle: t('audiosubtitle'),
		},
		{
			img: '/img/text.png',
			title: t('text'),
			subtitle: t('textsubtitle'),
		},
		{
			img: '/img/dictionary.png',
			title: t('dictionary'),
			subtitle: t('dictionarysubtitle'),
		},
		{
			img: '/img/flashcards.png',
			title: t('flashcards'),
			subtitle: t('flashcardssubtitle'),
		},
	]

	return (
		<>
			<Hero />
			<Container width={1440} sx={{ margin: '5rem auto' }}>
				<Typography variant='h3' align='center'>
					{t('multimedia')}
				</Typography>
				<div className='hr-custom'></div>
				<Grid container justifyContent='space-between' m='4rem auto'>
					{multimedia.map((icon, index) => (
						<StyledGridItem key={index} item xs={6} sm={4} lg={2}>
							<Image src={icon.img} alt='video' width={75} height={75} />
							<Typography variant='h5'>{icon.title}</Typography>
							<Typography variant='subtitle' color='primaryGrey'>
								{icon.subtitle}
							</Typography>
						</StyledGridItem>
					))}
				</Grid>

				<Stack
					sx={{
						width: '1000px',
						maxWidth: '100%',
						flexDirection: 'row',
						justifyContent: 'space-between',
						boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
						padding: '4rem',
						borderRadius: '3px',
						gap: '1.5rem',
						margin: '0 auto',
						marginTop: '5rem',
					}}>
					<Box
						width='50%'
						minWidth={175}
						sx={{
							display: {
								xs: 'none',
								sm: 'block',
							},
						}}>
						<Box
							component='img'
							src='/img/translator.png'
							alt='translator'
							width={175}
							height={175}
						/>
					</Box>

					<Stack gap='1rem'>
						<Typography variant='h4' align='center'>
							{t('translator')}
						</Typography>
						<Typography variant='subtitle' color='primaryGrey' align='center'>
							{t('translatorsubtitle')}
						</Typography>
						<Link href='/signin'>
							<Button
								variant='contained'
								size='large'
								sx={{
									width: '200px',
									display: 'block',
									margin: '0 auto',
									bgcolor: 'clrBtn1',
									marginTop: '1rem',
								}}>
								{t('register')}
							</Button>
						</Link>
					</Stack>
				</Stack>

				<Stack
					sx={{
						width: '1000px',
						maxWidth: '100%',
						flexDirection: 'row',
						justifyContent: 'space-between',
						boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
						padding: '4rem',
						borderRadius: '3px',
						gap: '1.5rem',
						margin: '0 auto',
						marginTop: '5rem',
					}}>
					<Stack gap='1rem'>
						<Typography variant='h4' align='center'>
							{t('teacher')}
						</Typography>
						<Typography variant='subtitle' color='primaryGrey' align='center'>
							{t('teachersubtitle')}
						</Typography>
						<Link href='/teacher'>
							<Button
								variant='contained'
								size='large'
								sx={{
									width: '200px',
									display: 'block',
									margin: '0 auto',
									marginTop: '1rem',
									bgcolor: 'clrBtn1',
								}}>
								{t('start')}
							</Button>
						</Link>
					</Stack>
					<Box
						width='50%'
						minWidth={175}
						sx={{
							display: {
								xs: 'none',
								sm: 'block',
							},
						}}>
						<Box
							component='img'
							src='/img/teacher.png'
							alt='teacher'
							width={175}
							height={175}
						/>
					</Box>
				</Stack>
				<Typography variant='h3' align='center' mt='10rem'>
					Nos outils pour votre apprentissage
				</Typography>
				{/* <div style={{ margin: '8rem auto' }} className='hr-custom'></div> */}
				<div className='hr-custom'></div>



				<Stack sx={{
					width: '1000px',
					maxWidth: '100%',
					flexDirection: 'row',
					justifyContent: 'space-between',
					boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
					padding: '4rem',
					borderRadius: '3px',
					gap: '4rem',
					margin: '0 auto',

				}}>
					<Box>
						<Typography textAlign='center' variant='h5' mb={5} >
							{t('giftranslatortitle')}
						</Typography>
						<Typography textAlign='center'  >
							{t('giftranslatorsubtitle')}
						</Typography>
					</Box>
					<Box
						sx={{ borderRadius: '3px' }}
						margin='0 auto'
						component='img'
						maxHeight='250px'
						maxWidth='350px'
						alt='comment traduire'
						src='/img/add_translation.gif'
					/>
				</Stack>
				<Stack sx={{
					width: '1000px',
					maxWidth: '100%',
					flexDirection: 'row',
					justifyContent: 'space-between',
					boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
					padding: '4rem',
					borderRadius: '3px',
					gap: '4rem',
					margin: '0 auto',
					marginTop: '5rem',
				}}>

					<Box
						sx={{ borderRadius: '3px' }}
						margin='0 auto'
						component='img'
						maxHeight='250px'
						maxWidth='350px'
						alt='comment traduire'
						src='/img/add_translation.gif'
					/>
					<Box>
						<Typography textAlign='center' variant='h5' mb={5} >
							{t('flashcards')}
						</Typography>
						<Typography textAlign='center'  >
							{t('gifflashcardssubtitle')}
						</Typography>
					</Box>
				</Stack>
			</Container>
		</>
	)
}

export default Homepage
