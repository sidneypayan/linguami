/**
 * Translation content component
 * Displays word info and list of translations
 */

import { Box, Stack, Typography, Chip, Divider, List, ListItem, ListItemButton, useTheme } from '@mui/material'

export function TranslationContent({ translation, onTranslationClick, disabled = false }) {
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	return (
		<>
			{/* Word info */}
			{(translation.displayInf || translation.inf) && (
				<Box sx={{ p: 2, backgroundColor: 'rgba(102, 126, 234, 0.08)' }}>
					<Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
						{translation.form && (
							<Chip
								label={translation.form}
								size="small"
								sx={{
									fontWeight: 600,
									background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
									color: 'white',
								}}
							/>
						)}
						<Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#666' }}>
							→
						</Typography>
						<Typography variant="subtitle1" sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : 'inherit' }}>
							{translation.displayInf || translation.inf}
						</Typography>
					</Stack>
				</Box>
			)}

			<Divider />

			{/* Translations list */}
			<Box sx={{ flex: 1, overflow: 'auto', overflowX: 'hidden', maxHeight: '250px' }}>
				<List sx={{ py: 0 }}>
					{translation.definitions?.map((definition, index) => {
						// Support both old format (string) and new format ({ text, count })
						const translationText = typeof definition === 'string' ? definition : definition.text
						const popularityCount = typeof definition === 'object' ? definition.count : 0
						const isPopular = popularityCount >= 3 // Show badge if chosen by 3+ users

						return (
							<ListItem key={index} disablePadding>
								<ListItemButton
									onClick={disabled ? undefined : (e) => {
										e.preventDefault()
										e.target.textContent = translationText // Override textContent to exclude badge
										onTranslationClick(e)
									}}
									disabled={disabled}
									sx={{
										py: 1.5,
										px: 2,
										pl: 1.5,
										transition: 'all 0.2s ease',
										borderLeft: '3px solid transparent',
										opacity: disabled ? 0.5 : 1,
										cursor: disabled ? 'not-allowed' : 'pointer',
										'&:hover': disabled
											? {}
											: {
													backgroundColor: 'rgba(102, 126, 234, 0.08)',
													borderLeftColor: '#667eea',
													pl: 2.5,
											  },
									}}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
										<Typography variant="body2" sx={{ fontWeight: 500, color: isDark ? '#f1f5f9' : 'inherit', flex: 1 }}>
											{translationText}
										</Typography>
										{isPopular && (
											<Chip
												label={`⭐ ${popularityCount}`}
												size="small"
												sx={{
													height: '20px',
													fontSize: '0.7rem',
													fontWeight: 600,
													background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
													color: 'white',
													'& .MuiChip-label': {
														px: 1,
													},
												}}
											/>
										)}
									</Box>
								</ListItemButton>
							</ListItem>
						)
					})}
				</List>
			</Box>

			<Divider />
		</>
	)
}
