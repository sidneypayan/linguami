import { Button, Box, useTheme, Typography } from '@mui/material'
import Image from 'next/image'
import { EmailRounded } from '@mui/icons-material'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { getUIImageUrl } from '@/utils/mediaUrls'
import VkIdButton from './VkIdButton'
import { useUserContext } from '@/context/user'

const OAuthButtons = ({ onGoogleClick, onAppleClick, onFacebookClick, onMagicLinkClick }) => {
	const { t } = useTranslation('register')
	const router = useRouter()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const { isUserAdmin } = useUserContext()
	const showVkId = router.locale === 'ru' && isUserAdmin
	const showFacebook = isUserAdmin

	const buttonStyles = {
		py: { xs: 1.75, sm: 1.75 },
		borderRadius: 2.5,
		border: '2px solid',
		borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(102, 126, 234, 0.2)',
		color: isDark ? '#cbd5e1' : '#4a5568',
		textTransform: 'none',
		fontWeight: 600,
		fontSize: '0.95rem',
		transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
		position: 'relative',
		overflow: 'hidden',
		background: isDark
			? 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)'
			: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)',
		'&::before': {
			content: '""',
			position: 'absolute',
			top: 0,
			left: '-100%',
			width: '100%',
			height: '100%',
			background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.15), transparent)',
			transition: 'left 0.6s ease',
		},
		'&:hover': {
			borderColor: '#667eea',
			background: isDark
				? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)'
				: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
			transform: 'translateY(-2px)',
			boxShadow: isDark
				? '0 8px 24px rgba(139, 92, 246, 0.35)'
				: '0 8px 24px rgba(102, 126, 234, 0.25)',
			'&::before': {
				left: '100%',
			},
		},
		'&:active': {
			transform: 'translateY(0)',
		},
	}

	const providers = [
		{
			id: 'google',
			onClick: onGoogleClick,
			labelLong: t('signInWithGoogle'),
			labelShort: t('google'),
			icon: (
				<Image
					src={getUIImageUrl('google.webp')}
					alt="Google"
					width={24}
					height={24}
				/>
			),
		},
		{
			id: 'facebook',
			onClick: onFacebookClick,
			labelLong: t('signInWithFacebook'),
			labelShort: t('facebook'),
			icon: (
				<Image
					src={getUIImageUrl('facebook.webp')}
					alt="Facebook"
					width={24}
					height={24}
				/>
			),
		},
		{
			id: 'email',
			onClick: onMagicLinkClick,
			labelLong: t('signInWithEmail'),
			labelShort: t('magicLink'),
			icon: <EmailRounded sx={{ fontSize: '1.5rem' }} />,
		},
	]

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
			}}>
			{/* VK ID button (only for Russian interface) */}
			{showVkId && (
				<VkIdButton />
			)}

			{/* Other OAuth providers */}
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
					gap: 2,
				}}>
				{providers
					.filter(provider => provider.id !== 'facebook' || showFacebook)
					.map((provider) => (
						<Button
							key={provider.id}
							variant="outlined"
							fullWidth
							onClick={provider.onClick}
							sx={buttonStyles}
							aria-label={provider.labelLong}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}>
								{provider.icon}
								<Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
									{provider.labelShort}
								</Typography>
							</Box>
						</Button>
					))}
			</Box>
		</Box>
	)
}

export default OAuthButtons
