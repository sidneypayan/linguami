import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogTitle,
	Box,
	Typography,
	Button,
	IconButton,
	Chip,
	useTheme,
} from '@mui/material'
import {
	Close,
	CheckCircle,
	EmojiEvents,
	AutoStories,
	Speed,
	Lock,
} from '@mui/icons-material'
import useTranslation from 'next-translate/useTranslation'

const UpsellModal = ({ open, onClose, levelName, isPremium = false, onPurchase }) => {
	const { t } = useTranslation('common')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	// Prix selon le statut premium
	const regularPrice = 20
	const premiumPrice = 15
	const price = isPremium ? premiumPrice : regularPrice

	const features = [
		{
			icon: <AutoStories sx={{ fontSize: 32 }} />,
			title: t('methode_interactive'),
			desc: t('upsell_feature_complete_access'),
		},
		{
			icon: <Speed sx={{ fontSize: 32 }} />,
			title: t('methode_flexible'),
			desc: t('upsell_feature_flexible_pace'),
		},
		{
			icon: <EmojiEvents sx={{ fontSize: 32 }} />,
			title: t('upsell_feature_xp_title'),
			desc: t('upsell_feature_xp_desc'),
		},
	]

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 4,
					background: isDark
						? 'linear-gradient(145deg, #1e1b4b 0%, #0f172a 100%)'
						: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
					border: '1px solid',
					borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
					boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
				},
			}}>
			{/* Close button */}
			<IconButton
				onClick={onClose}
				sx={{
					position: 'absolute',
					right: 16,
					top: 16,
					color: 'text.secondary',
					'&:hover': {
						background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
					},
				}}>
				<Close />
			</IconButton>

			<DialogTitle sx={{ pt: 4, pb: 2, textAlign: 'center' }}>
				<Box sx={{ mb: 2 }}>
					<EmojiEvents
						sx={{
							fontSize: 64,
							color: '#f59e0b',
							filter: 'drop-shadow(0 4px 12px rgba(245, 158, 11, 0.4))',
						}}
					/>
				</Box>
				<Typography
					variant="h4"
					sx={{
						fontWeight: 700,
						background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						mb: 1,
					}}>
					{t('upsell_congratulations')}
				</Typography>
				<Typography variant="body1" color="text.secondary">
					{t('upsell_first_lesson_complete')}
				</Typography>
			</DialogTitle>

			<DialogContent sx={{ px: 4, pb: 4 }}>
				{/* Message d'encouragement */}
				<Box
					sx={{
						textAlign: 'center',
						mb: 3,
						p: 3,
						borderRadius: 3,
						background: isDark
							? 'rgba(139, 92, 246, 0.1)'
							: 'rgba(139, 92, 246, 0.05)',
						border: '1px solid',
						borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
					}}>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
						{t('upsell_enjoyed_lesson')}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{t('upsell_unlock_message', { levelName })}
					</Typography>
				</Box>

				{/* Features */}
				<Box sx={{ mb: 3 }}>
					{features.map((feature, index) => (
						<Box
							key={index}
							sx={{
								display: 'flex',
								gap: 2,
								mb: 2,
								alignItems: 'flex-start',
							}}>
							<Box
								sx={{
									color: '#8b5cf6',
									flexShrink: 0,
								}}>
								{feature.icon}
							</Box>
							<Box>
								<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
									{feature.title}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{feature.desc}
								</Typography>
							</Box>
						</Box>
					))}
				</Box>

				{/* Prix */}
				<Box
					sx={{
						textAlign: 'center',
						p: 3,
						borderRadius: 3,
						background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
						mb: 3,
						position: 'relative',
						overflow: 'hidden',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background: 'radial-gradient(circle at top right, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
							pointerEvents: 'none',
						},
					}}>
					{isPremium && (
						<Chip
							label={t('methode_premium_discount')}
							size="small"
							sx={{
								mb: 1,
								background: 'rgba(255, 255, 255, 0.2)',
								color: 'white',
								fontWeight: 600,
							}}
						/>
					)}
					<Typography
						variant="h2"
						sx={{
							fontWeight: 800,
							color: 'white',
							mb: 0.5,
							fontSize: { xs: '3rem', sm: '3.5rem' },
							position: 'relative',
							zIndex: 1,
						}}>
						{price}€
					</Typography>
					{isPremium && (
						<Typography
							variant="body2"
							sx={{
								color: 'rgba(255, 255, 255, 0.8)',
								textDecoration: 'line-through',
								mb: 1,
							}}>
							{regularPrice}€
						</Typography>
					)}
					<Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
						{t('upsell_full_access', { levelName })}
					</Typography>
				</Box>

				{/* CTA Buttons */}
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<Button
						fullWidth
						variant="contained"
						size="large"
						onClick={onPurchase}
						sx={{
							background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
							color: 'white',
							fontWeight: 700,
							py: 1.75,
							fontSize: '1.1rem',
							borderRadius: 2.5,
							boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
							'&:hover': {
								background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
								transform: 'translateY(-2px)',
								boxShadow: '0 12px 32px rgba(16, 185, 129, 0.6)',
							},
						}}>
						{t('upsell_unlock_now')}
					</Button>

					<Button
						fullWidth
						variant="outlined"
						onClick={onClose}
						sx={{
							color: 'text.secondary',
							borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
							py: 1.25,
							'&:hover': {
								borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
								background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
							},
						}}>
						{t('upsell_maybe_later')}
					</Button>
				</Box>

				{/* Trust signals */}
				<Typography
					variant="caption"
					sx={{
						display: 'block',
						textAlign: 'center',
						color: 'text.secondary',
						mt: 2,
					}}>
					{t('upsell_trust_signals')}
				</Typography>
			</DialogContent>
		</Dialog>
	)
}

export default UpsellModal
