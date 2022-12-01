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
					'linear-gradient(to bottom, #432874, #432875, #432876, #432877, #432878, #44287a, #45297d, #46297f, #482984, #4a2a89, #4d2a8e, #4f2a93)',
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
					{/* <Link href='/materials'>
						<Button
							variant='contained'
							size='large'
							sx={{
								display: 'block',
								margin: '0 auto',
								marginTop: '2rem',
								bgcolor: '#4a148c',
							}}>
							{t('home:start')}
						</Button>
					</Link> */}
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
						d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z'
						className={styles.shapeFill}></path>
				</svg>
			</div>
		</Box>
	)
}

export default Hero
