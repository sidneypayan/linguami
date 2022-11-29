import Image from 'next/image'
import Link from 'next/link'
import styles from '../../styles/Hero.module.css'
import useTranslation from 'next-translate/useTranslation'
import { Box, Button, Container, Stack, Typography } from '@mui/material'

const Hero = () => {
	const { t, lang } = useTranslation()

	return (
		<Box
			sx={{
				position: 'relative',
				padding: '5rem 0',
				backgroundImage:
					'linear-gradient(to bottom, #4a148c, #531690, #5d1895, #661a99, #6f1c9d, #761ea0, #7c1fa3, #8321a6, #8922a9, #9024ab, #9625ae, #9c27b0)',
			}}>
			<Stack
				direction='row'
				width={1440}
				maxWidth='100%'
				p='5rem'
				sx={{
					margin: '0 auto',
					justifyContent: {
						xs: 'center',
						lg: 'space-between',
					},
					textAlign: {
						xs: 'center',
						lg: 'left',
					},
				}}>
				<Box maxWidth={800}>
					<Typography color='#fff' variant='h2' mb={4}>
						<span style={{ fontWeight: '400' }}>Linguami,</span> <br />
						{t('home:title')}
					</Typography>
					<Typography variant='h5' color='#fff'>
						{t('home:subtitle')}
						{/* <br />
						<span className={styles.subtitleLargeScreen}>
							Découvrez une culture et rejoignez une communauté basée sur
							l&apos;entraide et l&apos;amitié entre les peuples.
						</span> */}
					</Typography>
					<Link href='/materials'>
						<Button
							variant='contained'
							size='large'
							sx={{
								display: 'block',
								margin: '0 auto',
								marginTop: '2rem',
								bgcolor: 'primaryPurple',
							}}>
							{t('home:start')}
						</Button>
					</Link>
				</Box>

				<Box
					component='img'
					src='/img/bear.png'
					alt='bear'
					width={200}
					height={250}
					sx={{
						transform: 'scaleX(-1)',
						display: {
							xs: 'none',
							lg: 'block',
						},
					}}
				/>
			</Stack>
			<div className={styles.wave}>
				<svg
					data-name='Layer 1'
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 1200 120'
					preserveAspectRatio='none'>
					<path
						d='M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z'
						className={styles.shapeFill}></path>
				</svg>
			</div>
		</Box>
	)
}

export default Hero
