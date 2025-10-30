import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-toastify'
import {
	Box,
	Button,
	Typography,
	TextField,
	Card,
	Container,
	InputAdornment,
} from '@mui/material'
import { HomeRounded, EmailRounded } from '@mui/icons-material'
import { useUserContext } from '../context/user'
import Link from 'next/link'

const initialState = {
	email: '',
}

const UpdatePassword = () => {
	const { t } = useTranslation('register')
	const [values, setValues] = useState(initialState)
	const { updatePassword } = useUserContext()

	const handleChange = e => {
		const name = e.target.name
		const value = e.target.value

		setValues({ ...values, [name]: value })
	}

	const handleSubmit = e => {
		e.preventDefault()

		const { email } = values

		if (!email) {
			toast.error(t('fillAllFields'))
		}

		return updatePassword(email)
	}

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
				py: { xs: 4, sm: 6 },
				'&::before': {
					content: '""',
					position: 'absolute',
					top: '-10%',
					right: '-10%',
					width: '60%',
					height: '60%',
					background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 30%, transparent 70%)',
					pointerEvents: 'none',
					filter: 'blur(40px)',
				},
				'&::after': {
					content: '""',
					position: 'absolute',
					bottom: '-10%',
					left: '-10%',
					width: '60%',
					height: '60%',
					background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 30%, transparent 70%)',
					pointerEvents: 'none',
					filter: 'blur(40px)',
				},
			}}>
			<Container maxWidth='sm' sx={{ position: 'relative', zIndex: 1 }}>
				<Card
					sx={{
						p: { xs: 3, sm: 5 },
						borderRadius: 4,
						boxShadow: '0 24px 60px rgba(0, 0, 0, 0.3)',
						background: 'white',
					}}>
					{/* Logo */}
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							mb: 1,
						}}>
						<Box
							sx={{
								width: 56,
								height: 56,
								borderRadius: 3,
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
							}}>
							<HomeRounded sx={{ fontSize: '2rem', color: 'white' }} />
						</Box>
					</Box>

					{/* Titre */}
					<Typography
						variant='h4'
						align='center'
						sx={{
							fontWeight: 800,
							mb: 1,
							fontSize: { xs: '1.75rem', sm: '2rem' },
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
						}}>
						{t('updatePasswordTitle')}
					</Typography>

					<Typography
						variant='body2'
						align='center'
						sx={{
							color: '#718096',
							mb: 4,
						}}>
						{t('updatePasswordSubtitle')}
					</Typography>

					{/* Formulaire */}
					<Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
						<TextField
							fullWidth
							onChange={handleChange}
							type='email'
							label={t('email')}
							name='email'
							value={values.email}
							autoComplete='email'
							id='email'
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<EmailRounded sx={{ color: '#718096' }} />
									</InputAdornment>
								),
							}}
							sx={{
								'& .MuiOutlinedInput-root': {
									borderRadius: 2,
									'&:hover fieldset': {
										borderColor: '#667eea',
									},
									'&.Mui-focused fieldset': {
										borderColor: '#667eea',
										borderWidth: 2,
									},
								},
							}}
						/>

						<Button
							fullWidth
							type='submit'
							variant='contained'
							size='large'
							sx={{
								py: 1.75,
								borderRadius: 2,
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								fontWeight: 700,
								fontSize: '1.0625rem',
								textTransform: 'none',
								boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
								transition: 'all 0.3s ease',
								'&:hover': {
									background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
									transform: 'translateY(-2px)',
									boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
								},
								'&:active': {
									transform: 'translateY(0)',
								},
							}}>
							{t('sendRequest')}
						</Button>

						<Link href='/signin' style={{ textDecoration: 'none' }}>
							<Button
								sx={{
									color: '#667eea',
									fontWeight: 600,
									textTransform: 'none',
									fontSize: '0.9375rem',
									width: '100%',
									'&:hover': {
										background: 'rgba(102, 126, 234, 0.05)',
										textDecoration: 'underline',
									},
								}}>
								{t('backToSignin')}
							</Button>
						</Link>
					</Box>
				</Card>
			</Container>
		</Box>
	)
}

export default UpdatePassword
