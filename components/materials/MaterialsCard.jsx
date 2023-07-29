import Link from 'next/link'
import Image from 'next/image'
import { Box, Typography } from '@mui/material'

const MaterialsCard = ({ material }) => {

	return (
		<Link href={`/materials/${material.section}`}>
			<Box>
				<Box
					maxWidth={230}
					height={180}
					sx={{ position: 'relative', cursor: 'pointer' }}>
					<Image
						style={{ borderRadius: '3px', objectFit: 'cover' }}
						src={`/img/${material.img}`}
						fill
						sizes={100}
						quality={100}
						alt={material.title}
						priority={true}
					// loading='eager'
					/>
				</Box>

				<Typography mt={0.5} variant='subtitle1' sx={{ fontWeight: '600' }}>
					{material.title}
				</Typography>
			</Box>
		</Link>
	)
}

export default MaterialsCard
