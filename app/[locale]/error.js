'use client'

import { Box, Button, Typography, Container } from '@mui/material'
import { ErrorOutline, Refresh } from '@mui/icons-material'
import { useTranslations } from 'next-intl'

export default function Error({ error, reset }) {
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
				<ErrorOutline
					sx={{
						fontSize: 120,
						color: 'error.main',
						opacity: 0.8,
					}}
				/>

				<Typography variant="h3" component="h1" fontWeight={600}>
					{t('genericError')}
				</Typography>

				<Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600 }}>
					{error?.message || t('errorMessage')}
				</Typography>

				<Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
					<Button
						variant="contained"
						size="large"
						startIcon={<Refresh />}
						onClick={reset}
						sx={{
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							px: 4,
							py: 1.5,
						}}
					>
						{t('tryAgain')}
					</Button>

					<Button
						variant="outlined"
						size="large"
						href="/"
						sx={{
							px: 4,
							py: 1.5,
							borderColor: 'primary.main',
							color: 'primary.main',
						}}
					>
						{t('backToHome')}
					</Button>
				</Box>
			</Box>
		</Container>
	)
}
