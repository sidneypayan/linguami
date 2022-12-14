import { useState } from 'react'
import { toast } from 'react-toastify'
import Image from 'next/image'
import styles from '../styles/Register.module.css'
import { useUserContext } from '../context/user'
import { Divider } from '@mui/material'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'

const initialState = {
	email: '',
	password: '',
}

const Login = () => {
	const { t, lang } = useTranslation()
	const [values, setValues] = useState(initialState)

	const { login, loginWithThirdPartyOAuth } = useUserContext()

	const handleChange = e => {
		const name = e.target.name
		const value = e.target.value

		setValues({ ...values, [name]: value })
	}

	const handleSubmit = e => {
		e.preventDefault()

		const { email, password } = values

		if (!email || !password) {
			toast.error('Veuillez renseigner tous les champs')
		}

		return login(values)
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<div className={styles.socialContainer}>
					<button
						className={styles.socialBtn}
						onClick={() => loginWithThirdPartyOAuth('facebook')}>
						<Image
							src='/img/facebook.png'
							alt='facebook'
							width={25}
							height={25}
							layout='fixed'></Image>
						<span className={styles.socialText}>Faceboook</span>
					</button>
					<button
						className={styles.socialBtn}
						onClick={() => loginWithThirdPartyOAuth('google')}>
						<Image
							src='/img/google.png'
							alt='google'
							width={25}
							height={25}
							layout='fixed'></Image>
						<span className={styles.socialText}>Google</span>
					</button>
				</div>
				<Divider sx={{ marginBottom: '1rem' }}>{t('register:or')}</Divider>
				<form onSubmit={handleSubmit} className={styles.formContainer}>
					<div>
						<input
							onChange={handleChange}
							type='email'
							placeholder={t('register:email')}
							name='email'
							value={values.email}
							autoComplete='email'
						/>
					</div>
					<div>
						<input
							onChange={handleChange}
							type='password'
							placeholder={t('register:password')}
							name='password'
							value={values.password}
							autoComplete='current-password'
						/>
					</div>

					<button className={`${styles.btn} mainBtn`}>
						{t('register:signin')}
					</button>
					<p className={styles.existingAccount}>
						{t('register:noaccount')}
						<br />
						<Link href={`/${lang}/register`}>{t('register:register')}</Link>
					</p>
				</form>
			</div>
		</div>
	)
}

export default Login
