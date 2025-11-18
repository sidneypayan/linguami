/**
 * Translation error display component
 * Shows different error states (translation limit, general errors)
 */

import { Box, Typography, Button, useTheme } from '@mui/material'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

export function TranslationError({ error, word, isTranslationLimitError }) {
	const t = useTranslations('words')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	if (isTranslationLimitError) {
		return (
			<Box sx={{ p: 3, textAlign: 'center' }}>
				<Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#f5576c' }}>
					{t('translation_limit_title')}
				</Typography>
				<Typography variant="body2" sx={{ mb: 3, color: isDark ? '#cbd5e1' : '#666' }}>
					{t('translation_limit_message')}
				</Typography>
				<Link href="/signup">
					<Button
						variant="contained"
						fullWidth
						size="large"
						sx={{
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							color: 'white',
							fontWeight: 600,
							textTransform: 'none',
							py: 1.5,
							'&:hover': {
								background: 'linear-gradient(135deg, #5568d3 0%, #63408b 100%)',
							},
						}}>
						{t('noaccount')}
					</Button>
				</Link>
			</Box>
		)
	}

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
				{word}
			</Typography>
			<Typography color="error" variant="body2">
				{error}
			</Typography>
		</Box>
	)
}
