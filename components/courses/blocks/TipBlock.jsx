import { Box, Paper, Typography, useTheme } from '@mui/material'
import { Lightbulb } from '@mui/icons-material'

const TipBlock = ({ block }) => {
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	const { title, content, color = 'info' } = block

	const colorMap = {
		info: { bg: '#0ea5e9', light: 'rgba(14, 165, 233, 0.1)' },
		success: { bg: '#10b981', light: 'rgba(16, 185, 129, 0.1)' },
		warning: { bg: '#f59e0b', light: 'rgba(245, 158, 11, 0.1)' },
	}

	const colors = colorMap[color] || colorMap.info

	return (
		<Paper
			elevation={0}
			sx={{
				p: { xs: 2, sm: 2.5 },
				mb: 3,
				borderRadius: 2,
				border: `2px solid ${colors.bg}`,
				background: isDark ? colors.light : colors.light,
			}}>
			<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
				<Lightbulb sx={{ fontSize: 24, color: colors.bg, mt: 0.25 }} />
				<Box>
					<Typography
						variant="subtitle1"
						sx={{
							fontWeight: 700,
							mb: 0.5,
							color: colors.bg,
						}}>
						{title}
					</Typography>
					<Typography
						sx={{
							lineHeight: 1.7,
							color: isDark ? '#cbd5e1' : '#475569',
							fontSize: '0.95rem',
						}}
						dangerouslySetInnerHTML={{ __html: content }}
					/>
				</Box>
			</Box>
		</Paper>
	)
}

export default TipBlock
