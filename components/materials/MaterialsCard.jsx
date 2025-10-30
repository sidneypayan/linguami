import Link from 'next/link'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'
import { Box, Typography } from '@mui/material'

const MaterialsCard = ({ material }) => {
	const { t } = useTranslation('materials')

	return (
		<Link href={`/materials/${material.section}`}>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					transition: 'all 0.2s ease',
					'&:active': {
						transform: 'scale(0.97)',
					},
				}}>
				<Box
					sx={{
						position: 'relative',
						cursor: 'pointer',
						width: '100%',
						height: { xs: 160, sm: 180 },
						borderRadius: '8px',
						overflow: 'hidden',
						boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
						transition: 'all 0.3s ease',
						'&:hover': {
							transform: 'translateY(-4px)',
							boxShadow: '0 8px 16px rgba(102, 126, 234, 0.2)',
						},
					}}>
					<Image
						style={{ borderRadius: '8px', objectFit: 'cover' }}
						src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/${material.img}`}
						sizes={100}
						quality={100}
						alt={material.title}
						priority={true}
						fill
					/>
				</Box>

				<Typography
					mt={1}
					variant='subtitle1'
					sx={{
						fontWeight: 700,
						fontSize: { xs: '0.95rem', sm: '1rem' },
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
					}}>
					{t(material.section)}
				</Typography>
			</Box>
		</Link>
	)
}

export default MaterialsCard
