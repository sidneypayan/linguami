/**
 * Translation popup header component
 * Displays title and close button
 */

import { Box, Typography, IconButton } from '@mui/material'
import { Translate, Close } from '@mui/icons-material'
import { useTranslations } from 'next-intl'

export function TranslationHeader({ onClose }) {
	const t = useTranslations('words')

	return (
		<Box
			sx={{
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				p: 2,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			}}>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
				<Translate sx={{ color: 'white' }} />
				<Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700 }}>
					{t('translation')}
				</Typography>
			</Box>
			<IconButton
				size="small"
				onClick={onClose}
				sx={{
					color: 'white',
					'&:hover': {
						backgroundColor: 'rgba(255, 255, 255, 0.2)',
					},
				}}>
				<Close />
			</IconButton>
		</Box>
	)
}
