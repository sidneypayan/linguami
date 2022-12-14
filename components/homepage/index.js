import Image from 'next/image'
import Hero from './Hero'
import Link from 'next/link'
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
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
import useTranslation from 'next-translate/useTranslation'

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
	const { t, lang } = useTranslation()

	const multimedia = [
		{
			img: '/img/video.png',
			title: t('home:video'),
			subtitle: t('home:videosubtitle'),
		},
		{
			img: '/img/audio.png',
			title: t('home:audio'),
			subtitle: t('home:audiosubtitle'),
		},
		{
			img: '/img/text.png',
			title: t('home:text'),
			subtitle: t('home:textsubtitle'),
		},
		{
			img: '/img/dictionary.png',
			title: t('home:dictonary'),
			subtitle: t('home:dictionarysubtitle'),
		},
		{
			img: '/img/flashcards.png',
			title: t('home:flashcards'),
			subtitle: t('home:flashcardssubtitle'),
		},
	]

	return (
		<>
			<Hero />
			<Container width={1440} sx={{ marginTop: '5rem' }}>
				<Typography variant='h3' align='center'>
					{t('home:multimedia')}
				</Typography>
				<div className='hr-custom'></div>
				<Grid
					container
					justifyContent='space-between'
					alignItems='center'
					m='4rem auto'>
					{multimedia.map((icon, index) => (
						<StyledGridItem key={index} item xs={6} sm={4} lg={2}>
							<Image
								layout='fixed'
								src={icon.img}
								alt='video'
								width={75}
								height={75}
							/>
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
							{t('home:translator')}
						</Typography>
						<Typography variant='subtitle' color='primaryGrey' align='center'>
							{t('home:translatorsubtitle')}
						</Typography>
						<Link href='/register'>
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
								{t('home:register')}
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
							{t('home:native')}
						</Typography>
						<Typography variant='subtitle' color='primaryGrey' align='center'>
							Prenez des cours ?? distance avec un professeur dipl??m?? et
							b??n??fissiez d&apos;un apprentissage personnalis??.
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
								{t('home:start')}
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

				{/* ACCORDION */}

				<Typography variant='h4' align='center' mt='8rem'>
					FAQ
				</Typography>
				<div className='hr-custom'></div>
				<div className='wrapper-small'>
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls='panel1a-content'
							id='panel1a-header'>
							<Typography variant='h6' color='primaryGrey'>
								{t('home:faqtranslation')}
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<StyledStack>
								<Typography
									variant='body1'
									maxWidth='350px'
									textAlign='left'
									mt={5}>
									{t('home:faqtranslationsubtitle')}
								</Typography>
								<Divider orientation='vertical'></Divider>
								<Box
									sx={{ borderRadius: '3px' }}
									margin='0'
									component='img'
									maxHeight='250px'
									alt='comment traduire'
									src='/img/translation.gif'
								/>
							</StyledStack>
						</AccordionDetails>
					</Accordion>
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls='panel1a-content'
							id='panel1a-header'>
							<Typography variant='h6' color='primaryGrey'>
								{t('home:faqaddword')}
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<StyledStack>
								<Typography maxWidth='350px' textAlign='left' mt={5}>
									{t('home:faqaddwordsubtitle')}
								</Typography>
								<Box
									sx={{ borderRadius: '3px' }}
									margin='0'
									component='img'
									maxHeight='250px'
									alt='comment traduire'
									src='/img/add_translation.gif'
								/>
							</StyledStack>
						</AccordionDetails>
					</Accordion>
				</div>
			</Container>
		</>
	)
}

export default Homepage
