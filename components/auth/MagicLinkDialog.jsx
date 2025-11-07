import { useState } from 'react'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Box,
	Typography,
	useTheme,
} from '@mui/material'
import { EmailRounded, SendRounded } from '@mui/icons-material'
import useTranslation from 'next-translate/useTranslation'

const MagicLinkDialog = ({ open, onClose, onSend }) => {
	const { t } = useTranslation('register')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const [email, setEmail] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!email) return

		setLoading(true)
		const success = await onSend(email)
		setLoading(false)

		if (success) {
			setEmail('')
			onClose()
		}
	}

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="xs"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 3,
					background: isDark
						? 'linear-gradient(145deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)'
						: 'rgba(255, 255, 255, 0.98)',
					backdropFilter: 'blur(20px)',
					border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : 'none',
				},
			}}>
			<Box component="form" onSubmit={handleSubmit}>
				<DialogTitle
					sx={{
						textAlign: 'center',
						pt: 3,
						pb: 1,
					}}>
					<Box
						sx={{
							width: 64,
							height: 64,
							borderRadius: 3,
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							margin: '0 auto 16px',
							boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
						}}>
						<EmailRounded sx={{ fontSize: '2rem', color: 'white' }} />
					</Box>
					<Typography
						variant="h5"
						sx={{
							fontWeight: 700,
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
						}}>
						{t('magicLinkTitle') || 'Connexion par email'}
					</Typography>
				</DialogTitle>

				<DialogContent sx={{ pt: 2, pb: 3 }}>
					<Typography
						variant="body2"
						align="center"
						sx={{
							color: isDark ? '#94a3b8' : '#718096',
							mb: 3,
							fontSize: '0.9375rem',
						}}>
						{t('magicLinkDescription') || 'Entrez votre email et recevez un lien de connexion instantané'}
					</Typography>

					<TextField
						fullWidth
						type="email"
						label={t('email')}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						autoFocus
						InputProps={{
							startAdornment: (
								<Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
									<EmailRounded sx={{ color: isDark ? '#94a3b8' : '#718096' }} />
								</Box>
							),
						}}
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: 2.5,
								backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'transparent',
								'& fieldset': {
									borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(102, 126, 234, 0.2)',
									borderWidth: '2px',
								},
								'&:hover fieldset': {
									borderColor: 'rgba(102, 126, 234, 0.4)',
								},
								'&.Mui-focused fieldset': {
									borderColor: '#667eea',
								},
							},
							'& .MuiInputLabel-root': {
								color: isDark ? '#94a3b8' : '#718096',
								'&.Mui-focused': {
									color: '#667eea',
								},
							},
						}}
					/>
				</DialogContent>

				<DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
					<Button
						onClick={onClose}
						disabled={loading}
						sx={{
							textTransform: 'none',
							color: isDark ? '#94a3b8' : '#718096',
							fontWeight: 600,
							'&:hover': {
								background: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(102, 126, 234, 0.1)',
							},
						}}>
						{t('cancel') || 'Annuler'}
					</Button>
					<Button
						type="submit"
						variant="contained"
						disabled={loading || !email}
						startIcon={<SendRounded />}
						sx={{
							textTransform: 'none',
							fontWeight: 700,
							borderRadius: 2,
							px: 3,
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
							'&:hover': {
								background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
								boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
							},
							'&:disabled': {
								background: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(102, 126, 234, 0.2)',
								color: isDark ? '#64748b' : '#94a3b8',
							},
						}}>
						{loading ? (t('sending') || 'Envoi...') : (t('send') || 'Envoyer')}
					</Button>
				</DialogActions>
			</Box>
		</Dialog>
	)
}

export default MagicLinkDialog
