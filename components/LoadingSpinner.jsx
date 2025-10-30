import { Box, CircularProgress, Typography } from '@mui/material'

const LoadingSpinner = ({ message = '' }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '60vh',
				gap: 3,
			}}>
			<Box
				sx={{
					position: 'relative',
					display: 'inline-flex',
				}}>
				{/* Cercle extérieur */}
				<CircularProgress
					size={80}
					thickness={3}
					sx={{
						color: '#667eea',
						position: 'absolute',
						animationDuration: '1.5s',
					}}
				/>
				{/* Cercle intérieur */}
				<CircularProgress
					size={80}
					thickness={3}
					variant="determinate"
					value={100}
					sx={{
						color: 'rgba(102, 126, 234, 0.1)',
					}}
				/>
				{/* Icône centrale animée */}
				<Box
					sx={{
						top: 0,
						left: 0,
						bottom: 0,
						right: 0,
						position: 'absolute',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						animation: 'pulse 2s ease-in-out infinite',
						'@keyframes pulse': {
							'0%, 100%': {
								transform: 'scale(1)',
								opacity: 1,
							},
							'50%': {
								transform: 'scale(1.1)',
								opacity: 0.8,
							},
						},
					}}>
					<Typography
						sx={{
							fontSize: '2rem',
						}}>
						📚
					</Typography>
				</Box>
			</Box>

			{message && (
				<Typography
					variant="h6"
					sx={{
						color: '#667eea',
						fontWeight: 600,
						textAlign: 'center',
						animation: 'fadeIn 0.5s ease-in',
						'@keyframes fadeIn': {
							from: {
								opacity: 0,
								transform: 'translateY(10px)',
							},
							to: {
								opacity: 1,
								transform: 'translateY(0)',
							},
						},
					}}>
					{message}
				</Typography>
			)}

			{/* Dots animés */}
			<Box
				sx={{
					display: 'flex',
					gap: 1,
				}}>
				{[0, 1, 2].map((index) => (
					<Box
						key={index}
						sx={{
							width: 10,
							height: 10,
							borderRadius: '50%',
							backgroundColor: '#667eea',
							animation: 'bounce 1.4s ease-in-out infinite',
							animationDelay: `${index * 0.16}s`,
							'@keyframes bounce': {
								'0%, 80%, 100%': {
									transform: 'scale(0.8)',
									opacity: 0.5,
								},
								'40%': {
									transform: 'scale(1.2)',
									opacity: 1,
								},
							},
						}}
					/>
				))}
			</Box>
		</Box>
	)
}

export default LoadingSpinner
