import { Box, Paper, Typography, List, ListItem, useTheme } from '@mui/material'
import { CheckCircleOutline } from '@mui/icons-material'

const SummaryBlock = ({ block }) => {
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	const { title, keyPhrases } = block

	return (
		<Paper
			elevation={0}
			sx={{
				p: { xs: 2, sm: 3 },
				mb: 3,
				borderRadius: 3,
				border: '2px solid',
				borderColor: isDark ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.3)',
				background: isDark
					? 'linear-gradient(135deg, rgba(22, 163, 74, 0.2) 0%, rgba(30, 41, 59, 0.8) 100%)'
					: 'linear-gradient(135deg, rgba(220, 252, 231, 0.5) 0%, rgba(255, 255, 255, 0.9) 100%)',
			}}>
			{/* Header */}
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
				<CheckCircleOutline sx={{ fontSize: 32, color: '#22c55e' }} />
				<Typography
					variant="h5"
					sx={{
						fontWeight: 700,
						color: isDark ? '#4ade80' : '#16a34a',
					}}>
					{title}
				</Typography>
			</Box>

			{/* Key Phrases */}
			<List>
				{keyPhrases?.map((phrase, index) => (
					<ListItem
						key={index}
						sx={{
							flexDirection: 'column',
							alignItems: 'flex-start',
							py: 2,
							px: 2.5,
							mb: 1.5,
							borderRadius: 2,
							background: isDark
								? 'rgba(34, 197, 94, 0.1)'
								: 'rgba(220, 252, 231, 0.5)',
							borderLeft: '4px solid #22c55e',
						}}>
						{/* French */}
						<Typography
							sx={{
								fontWeight: 700,
								fontSize: '1.1rem',
								mb: 0.5,
								color: 'text.primary',
							}}>
							{phrase.fr}
						</Typography>

						{/* Russian */}
						<Typography
							sx={{
								fontWeight: 600,
								fontSize: '1rem',
								color: '#22c55e',
								mb: phrase.context ? 0.5 : 0,
							}}>
							{phrase.ru}
						</Typography>

						{/* Context */}
						{phrase.context && (
							<Typography
								sx={{
									fontSize: '0.85rem',
									color: isDark ? '#94a3b8' : '#64748b',
									fontStyle: 'italic',
								}}>
								{phrase.context}
							</Typography>
						)}
					</ListItem>
				))}
			</List>
		</Paper>
	)
}

export default SummaryBlock
