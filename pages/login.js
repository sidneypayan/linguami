import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Image from 'next/image'
import styles from '../styles/Register.module.css'
import { useUserContext } from '../context/user'
import { Divider } from '@mui/material'
import Link from 'next/link'

const initialState = {
	email: '',
	password: '',
}

const Login = () => {
	const { t } = useTranslation('register')
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
				<Divider sx={{ marginBottom: '1rem' }}>{t('or')}</Divider>
				<form onSubmit={handleSubmit} className={styles.formContainer}>
					<div>
						<input
							onChange={handleChange}
							type='email'
							placeholder={t('email')}
							name='email'
							value={values.email}
							autoComplete='email'
						/>
					</div>
					<div className={styles.inputWithBtn}>
						<input
							onChange={handleChange}
							type='password'
							placeholder={t('password')}
							name='password'
							value={values.password}
							autoComplete='current-password'
						/>
						<button className={styles.btnInsideInput}>Oublié ?</button>
					</div>

					<button className={`${styles.btn} mainBtn`}>{t('signin')}</button>
					<p className={styles.existingAccount}>
						{t('noaccount')}
						<br />
						<Link href={`/register`}>{t('register')}</Link>
					</p>
				</form>
			</div>
		</div>
	)
}

export default Login
