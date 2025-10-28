import useTranslation from 'next-translate/useTranslation'
import { Box, Button, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'

const Hero = () => {
	const { t, lang } = useTranslation('home')

	return (
		<Box
			sx={{
				position: 'relative',
				padding: {
					xs: '6rem 0 4rem 0',
					md: '8rem 0 6rem 0',
				},
				backgroundImage:
					'linear-gradient(to bottom, #432874, #432875, #432876, #432877, #432878, #44287a, #45297d, #46297f, #482984, #4a2a89, #4d2a8e, #4f2a93)',
			}}>
			<Stack
				direction='row'
				width={1440}
				maxWidth='100%'
				sx={{
					padding: '2rem',
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
				<Box maxWidth={825}>
					<Typography color='#fff' variant='h2' component='h1' mb={4}>
						<span style={{ fontWeight: '400' }}>{t('hero')}</span> <br />
						{t('title')}
					</Typography>
					<Typography mb={4} variant='h5' color='#fff'>
						{t('subtitle')}
					</Typography>

					<Link href={`/materials`}>
						<Button
							align='center'
							size='large'
							sx={{
								backgroundColor: 'clrPrimary4',
								display: 'block',
								margin: '0 auto',
								width: '150px',
							}}
							variant='contained'>
							{t('start')}
						</Button>
					</Link>
				</Box>

				<Box
					sx={{
						display: {
							xs: 'none',
							md: 'block',
						},
						position: 'relative',
						width: 250,
						height: 250,
					}}>
					<Image
						src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/wizard.png`}
						alt='Linguami wizard mascot'
						fill
						style={{ objectFit: 'contain' }}
						priority
					/>
				</Box>
			</Stack>

			<div className='wave'>
				<svg
					data-name='Layer 1'
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 1200 120'
					preserveAspectRatio='none'>
					<path
						d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z'
						className='shape-fill'></path>
				</svg>
			</div>
		</Box>
	)
}

export default Hero
