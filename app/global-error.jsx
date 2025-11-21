'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import { Box, Button, Container, Typography } from '@mui/material'

export default function GlobalError({ error, reset }) {
	useEffect(() => {
		// Log the error to Sentry
		Sentry.captureException(error)
	}, [error])

	return (
		<html>
			<body>
				<Container maxWidth="sm" sx={{ py: 8 }}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 3,
							textAlign: 'center',
						}}
					>
						<Typography variant="h4" component="h1" gutterBottom>
							Oops! Something went wrong
						</Typography>
						<Typography variant="body1" color="text.secondary">
							We've been notified and are working on it.
						</Typography>
						<Button variant="contained" onClick={() => reset()}>
							Try again
						</Button>
					</Box>
				</Container>
			</body>
		</html>
	)
}
