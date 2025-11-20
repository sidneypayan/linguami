import { Box, CircularProgress, Container } from '@mui/material'

export default function Loading() {
	return (
		<Container>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '70vh',
				}}
			>
				<CircularProgress
					size={60}
					thickness={4}
					sx={{
						color: 'primary.main',
					}}
				/>
			</Box>
		</Container>
	)
}
