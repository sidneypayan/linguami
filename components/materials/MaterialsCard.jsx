import styles from '../../styles/materials/Materials.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { Box, Typography } from '@mui/material'

const MaterialsCard = ({ material }) => {
	return (
		<Box>
			<Link href={`/materials/${material.param}`}>
				<Box
					width={230}
					height={180}
					sx={{ position: 'relative', cursor: 'pointer' }}>
					<Image
						style={{ borderRadius: '3px' }}
						src={`/img/${material.img}`}
						layout='fill'
						objectFit='cover'
						quality={100}
						alt={material.title}
						loading='eager'
					/>
				</Box>
			</Link>

			<Typography mt={0.5} variant='subtitle1' sx={{ fontWeight: '600' }}>
				{material.title}
			</Typography>
		</Box>
	)
}

export default MaterialsCard
