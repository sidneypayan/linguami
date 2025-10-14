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
						src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/${material.img}`}
						sizes={100}
						quality={100}
						alt={material.title}
						priority={true}
						fill
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
