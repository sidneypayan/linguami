/**
 * Guest limit message component
 * Shows appropriate message for guests based on dictionary limit
 */

import { Box, Typography, Button, useTheme } from '@mui/material'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

export function GuestLimitMessage({ hasReachedLimit }) {
	const t = useTranslations('words')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	return (
		<Box sx={{ p: 2, backgroundColor: 'rgba(102, 126, 234, 0.05)' }}>
			{hasReachedLimit ? (
				<>
					<Typography variant="caption" sx={{ display: 'block', mb: 1.5, color: '#f5576c', fontWeight: 600 }}>
						⚠️ {t('dictionary_limit_title')} : supprimez des mots pour en ajouter de nouveaux
					</Typography>
					<Link href="/signup">
						<Button
							variant="contained"
							fullWidth
							size="small"
							sx={{
								background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
								color: 'white',
								fontWeight: 600,
								textTransform: 'none',
								'&:hover': {
									background: 'linear-gradient(135deg, #d978e0 0%, #d9445a 100%)',
								},
							}}>
							{t('noaccount')}
						</Button>
					</Link>
				</>
			) : (
				<Typography variant="caption" sx={{ display: 'block', color: isDark ? '#cbd5e1' : '#666', fontWeight: 600, textAlign: 'center' }}>
					{t('click_translation_to_add')}
				</Typography>
			)}
		</Box>
	)
}
