'use client'

import { Box, Button, Typography, Container } from '@mui/material'
import { Block, Home } from '@mui/icons-material'
import { useTranslations } from 'next-intl'

export default function UnauthorizedView() {
	const t = useTranslations('common')

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
				<Block
					sx={{
						fontSize: 120,
						color: 'error.main',
						opacity: 0.8,
					}}
				/>

				<Typography variant="h3" component="h1" fontWeight={600}>
					{t('accessDenied')}
				</Typography>

				<Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600 }}>
					{t('accessDeniedMessage')}
				</Typography>

				<Button
					variant="contained"
					size="large"
					startIcon={<Home />}
					href="/"
					sx={{
						mt: 2,
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						px: 4,
						py: 1.5,
					}}
				>
					{t('backToHome')}
				</Button>
			</Box>
		</Container>
	)
}
