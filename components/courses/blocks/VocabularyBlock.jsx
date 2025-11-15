import { Box, Paper, Typography, List, ListItem, useTheme } from '@mui/material'
import { useTranslations, useLocale } from 'next-intl'
import { Book, VolumeUp } from '@mui/icons-material'

const VocabularyBlock = ({ block }) => {
	const t = useTranslations('common')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	const { title, words, category } = block

	return (
		<Paper
			elevation={0}
			sx={{
				p: { xs: 2, sm: 3 },
				mb: 3,
				borderRadius: 3,
				border: '2px solid',
				borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.3)',
				background: isDark
					? 'linear-gradient(135deg, rgba(5, 150, 105, 0.15) 0%, rgba(30, 41, 59, 0.8) 100%)'
					: 'linear-gradient(135deg, rgba(209, 250, 229, 0.5) 0%, rgba(255, 255, 255, 0.9) 100%)',
			}}>
			{/* Header */}
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
				<Book sx={{ fontSize: 32, color: '#10b981' }} />
				<Typography
					variant="h5"
					sx={{
						fontWeight: 700,
						color: isDark ? '#34d399' : '#059669',
					}}>
					{title}
				</Typography>
			</Box>

			{category && (
				<Typography
					sx={{
						mb: 2,
						fontSize: '0.875rem',
						color: isDark ? '#94a3b8' : '#64748b',
						fontStyle: 'italic',
					}}>
					{t('methode_category')} : {category}
				</Typography>
			)}

			{/* Word List */}
			<List>
				{words?.map((item, index) => (
					<ListItem
						key={index}
						sx={{
							flexDirection: 'column',
							alignItems: 'flex-start',
							py: 2,
							px: 2,
							mb: 1.5,
							borderRadius: 2,
							background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
							border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
						}}>
						{/* Word and Translation */}
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
							<Typography
								sx={{
									fontWeight: 700,
									fontSize: '1.1rem',
									color: '#10b981',
								}}>
								{item.word}
							</Typography>
							<Typography
								sx={{
									color: isDark ? '#cbd5e1' : '#475569',
									fontSize: '1rem',
								}}>
								→ {item.translation}
							</Typography>
						</Box>

						{/* Pronunciation */}
						{item.pronunciation && (
							<Typography
								sx={{
									fontSize: '0.85rem',
									color: isDark ? '#94a3b8' : '#64748b',
									fontFamily: 'monospace',
									mb: 0.5,
								}}>
								{item.pronunciation}
							</Typography>
						)}

						{/* Example */}
						{item.example && (
							<Box sx={{ mt: 1 }}>
								<Typography
									sx={{
										fontSize: '0.9rem',
										fontStyle: 'italic',
										color: isDark ? '#cbd5e1' : '#475569',
									}}>
									{item.example}
								</Typography>
								{item.exampleTranslation && (
									<Typography
										sx={{
											fontSize: '0.85rem',
											color: isDark ? '#94a3b8' : '#64748b',
											mt: 0.25,
										}}>
										{item.exampleTranslation}
									</Typography>
								)}
							</Box>
						)}
					</ListItem>
				))}
			</List>
		</Paper>
	)
}

export default VocabularyBlock
