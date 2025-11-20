'use client'

import { Box, Button, Typography, Container } from '@mui/material'
import { SearchOff } from '@mui/icons-material'
import Link from 'next/link'

export default function NotFound() {
	return (
		<Container maxWidth="md">
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '70vh',
					textAlign: 'center',
					gap: 3,
				}}
			>
				<SearchOff
					sx={{
						fontSize: 120,
						color: '#666',
						opacity: 0.6,
					}}
				/>

				<Typography variant="h1" fontWeight={700} sx={{ color: '#667eea' }}>
					404
				</Typography>

				<Typography variant="h3" component="h1" fontWeight={600}>
					Oups ! Page introuvable
				</Typography>

				<Typography variant="h6" sx={{ color: '#666', maxWidth: 600 }}>
					La page que vous recherchez est introuvable
				</Typography>

				<Button
					variant="contained"
					size="large"
					component={Link}
					href="/"
					sx={{
						mt: 2,
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						px: 4,
						py: 1.5,
						color: 'white',
					}}
				>
					← Retour à l&apos;accueil
				</Button>
			</Box>
		</Container>
	)
}
