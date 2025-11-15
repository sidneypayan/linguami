'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Box, Typography, CircularProgress, Button, Card, Container } from '@mui/material'
import { CheckCircleOutline, ErrorOutline, HomeRounded } from '@mui/icons-material'
import Link from 'next/link'
import { verifyEmail } from '@/lib/emailVerification'

export default function VerifyEmail() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const t = useTranslations('register')
	const [status, setStatus] = useState('loading')
	const [error, setError] = useState('')

	useEffect(() => {
		const token = searchParams.get('token')

		if (!token) {
			setStatus('error')
			setError(t('tokenMissing') || 'Missing token')
			return
		}

		const verify = async () => {
			const result = await verifyEmail(token)

			if (result.success) {
				setStatus('success')
				setTimeout(() => {
					router.push('/')
				}, 3000)
			} else {
				setStatus('error')
				setError(result.error || t('verificationFailed') || 'Verification failed')
			}
		}

		verify()
	}, [searchParams, router, t])

	return (
		<Box
			sx={{
				minHeight: '100vh',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative',
				overflow: 'hidden',
				py: 4,
			}}>
			<Container maxWidth='sm' sx={{ position: 'relative', zIndex: 1 }}>
				<Card
					sx={{
						p: { xs: 3, sm: 5 },
						borderRadius: 4,
						boxShadow: '0 24px 60px rgba(0, 0, 0, 0.3)',
						background: 'white',
						textAlign: 'center',
					}}>
					{status === 'loading' && (
						<>
							<CircularProgress
								size={80}
								sx={{
									color: '#667eea',
									mb: 3,
								}}
							/>
							<Typography variant='h5' sx={{ fontWeight: 600, color: '#2d3748' }}>
								{t('verifying') || 'Verifying...'}
							</Typography>
						</>
					)}

					{status === 'success' && (
						<>
							<CheckCircleOutline
								sx={{
									fontSize: 100,
									color: '#48bb78',
									mb: 3,
								}}
							/>
							<Typography
								variant='h4'
								sx={{
									fontWeight: 800,
									mb: 2,
									background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									backgroundClip: 'text',
								}}>
								{t('emailVerified') || 'Email Verified!'}
							</Typography>
							<Typography variant='body1' sx={{ color: '#718096', mb: 4 }}>
								{t('emailVerifiedMessage') || 'Your email has been successfully verified. Redirecting...'}
							</Typography>
							<Link href='/' style={{ textDecoration: 'none' }}>
								<Button
									variant='contained'
									startIcon={<HomeRounded />}
									sx={{
										background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
										color: 'white',
										fontWeight: 600,
										py: 1.5,
										px: 4,
										borderRadius: 2,
										'&:hover': {
											background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
										},
									}}>
									{t('goHome') || 'Go Home'}
								</Button>
							</Link>
						</>
					)}

					{status === 'error' && (
						<>
							<ErrorOutline
								sx={{
									fontSize: 100,
									color: '#f56565',
									mb: 3,
								}}
							/>
							<Typography
								variant='h4'
								sx={{
									fontWeight: 800,
									mb: 2,
									background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									backgroundClip: 'text',
								}}>
								{t('verificationFailed') || 'Verification Failed'}
							</Typography>
							<Typography variant='body1' sx={{ color: '#718096', mb: 1 }}>
								{error}
							</Typography>
							<Typography variant='body2' sx={{ color: '#a0aec0', mb: 4 }}>
								{t('tokenExpiredMessage') || 'The link may have expired. You can request a new one from your profile.'}
							</Typography>
							<Link href='/' style={{ textDecoration: 'none' }}>
								<Button
									variant='outlined'
									startIcon={<HomeRounded />}
									sx={{
										borderColor: '#667eea',
										color: '#667eea',
										fontWeight: 600,
										py: 1.5,
										px: 4,
										borderRadius: 2,
										'&:hover': {
											borderColor: '#764ba2',
											background: 'rgba(102, 126, 234, 0.05)',
										},
									}}>
									{t('goHome') || 'Go Home'}
								</Button>
							</Link>
						</>
					)}
				</Card>
			</Container>
		</Box>
	)
}
