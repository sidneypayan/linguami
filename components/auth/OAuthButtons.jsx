import { Button, Stack } from '@mui/material'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'

const OAuthButtons = ({ onGoogleClick, onFacebookClick }) => {
	const { t } = useTranslation('register')

	const buttonStyles = {
		py: 1.75,
		borderRadius: 2.5,
		border: '2px solid',
		borderColor: 'rgba(102, 126, 234, 0.2)',
		color: '#4a5568',
		textTransform: 'none',
		fontWeight: 600,
		fontSize: '0.95rem',
		transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
		position: 'relative',
		overflow: 'hidden',
		background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)',
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
			background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
			transform: 'translateY(-2px)',
			boxShadow: '0 8px 24px rgba(102, 126, 234, 0.25)',
			'&::before': {
				left: '100%',
			},
		},
		'&:active': {
			transform: 'translateY(0)',
		},
	}

	return (
		<Stack direction="row" spacing={2}>
			<Button
				variant="outlined"
				fullWidth
				onClick={onFacebookClick}
				sx={buttonStyles}
				aria-label={t('signInWithFacebook')}>
				<Image
					src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/facebook.webp`}
					alt="Facebook"
					width={24}
					height={24}
				/>
			</Button>
			<Button
				variant="outlined"
				fullWidth
				onClick={onGoogleClick}
				sx={buttonStyles}
				aria-label={t('signInWithGoogle')}>
				<Image
					src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/google.webp`}
					alt="Google"
					width={24}
					height={24}
				/>
			</Button>
		</Stack>
	)
}

export default OAuthButtons
