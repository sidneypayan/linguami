import { Box, Paper, Typography, List, ListItem, ListItemIcon, ListItemText, useTheme } from '@mui/material'
import { Public, CheckCircle } from '@mui/icons-material'

const CultureBlock = ({ block }) => {
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	const { title, content, keyPoints, comparison } = block

	return (
		<Paper
			elevation={0}
			sx={{
				p: { xs: 2, sm: 3 },
				mb: 3,
				borderRadius: 3,
				border: '2px solid',
				borderColor: isDark ? 'rgba(6, 182, 212, 0.3)' : 'rgba(6, 182, 212, 0.3)',
				background: isDark
					? 'linear-gradient(135deg, rgba(8, 145, 178, 0.15) 0%, rgba(30, 41, 59, 0.8) 100%)'
					: 'linear-gradient(135deg, rgba(207, 250, 254, 0.5) 0%, rgba(255, 255, 255, 0.9) 100%)',
			}}>
			{/* Header */}
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
				<Public sx={{ fontSize: 32, color: '#06b6d4' }} />
				<Typography
					variant="h5"
					sx={{
						fontWeight: 700,
						color: isDark ? '#22d3ee' : '#0891b2',
					}}>
					{title}
				</Typography>
			</Box>

			{/* Content */}
			{content && (
				<Typography
					sx={{
						mb: 3,
						lineHeight: 1.8,
						color: isDark ? '#cbd5e1' : '#475569',
					}}
					dangerouslySetInnerHTML={{ __html: content }}
				/>
			)}

			{/* Key Points */}
			{keyPoints && keyPoints.length > 0 && (
				<List sx={{ mb: comparison ? 2 : 0 }}>
					{keyPoints.map((point, index) => (
						<ListItem key={index} sx={{ py: 0.5 }}>
							<ListItemIcon sx={{ minWidth: 36 }}>
								<CheckCircle sx={{ color: '#06b6d4', fontSize: 20 }} />
							</ListItemIcon>
							<ListItemText
								primary={point}
								sx={{
									'& .MuiListItemText-primary': {
										color: isDark ? '#cbd5e1' : '#475569',
									},
								}}
							/>
						</ListItem>
					))}
				</List>
			)}

			{/* Comparison */}
			{comparison && (
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
						gap: 2,
						mt: 2,
					}}>
					{comparison.fr && (
						<Box
							sx={{
								p: 2,
								borderRadius: 2,
								background: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
								borderLeft: '4px solid #3b82f6',
							}}>
							<Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: '#3b82f6' }}>
								🇫🇷 En France
							</Typography>
							<Typography sx={{ fontSize: '0.9rem', color: isDark ? '#cbd5e1' : '#475569' }}>
								{comparison.fr}
							</Typography>
						</Box>
					)}
					{comparison.ru && (
						<Box
							sx={{
								p: 2,
								borderRadius: 2,
								background: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
								borderLeft: '4px solid #ef4444',
							}}>
							<Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: '#ef4444' }}>
								🇷🇺 En Russie
							</Typography>
							<Typography sx={{ fontSize: '0.9rem', color: isDark ? '#cbd5e1' : '#475569' }}>
								{comparison.ru}
							</Typography>
						</Box>
					)}
				</Box>
			)}
		</Paper>
	)
}

export default CultureBlock
