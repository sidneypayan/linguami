'use client'

import { useRouter } from 'next/navigation'
import { Box, Typography, Button, Container } from '@mui/material'
import { Home } from '@mui/icons-material'

export default function NotFound() {
	const router = useRouter()

	return (
		<Container maxWidth="md">
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '100vh',
					textAlign: 'center',
					gap: 3,
				}}>
				<Typography
					variant="h1"
					sx={{
						fontSize: { xs: '4rem', md: '6rem' },
						fontWeight: 700,
						background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
						backgroundClip: 'text',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
					}}>
					404
				</Typography>

				<Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
					Page non trouvée
				</Typography>

				<Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
					La page que vous recherchez n'existe pas ou a été déplacée.
				</Typography>

				<Button
					variant="contained"
					startIcon={<Home />}
					onClick={() => router.push('/')}
					sx={{
						background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
						px: 4,
						py: 1.5,
					}}>
					Retour à l'accueil
				</Button>
			</Box>
		</Container>
	)
}
