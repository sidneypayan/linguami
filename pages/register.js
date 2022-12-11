import { useState } from 'react'
import { toast } from 'react-toastify'
import Image from 'next/image'
import styles from '../styles/Register.module.css'
import { useUserContext } from '../context/user'
import { Divider } from '@mui/material'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'

const initialState = {
	name: '',
	email: '',
	password: '',
}

const Register = () => {
	const { t, lang } = useTranslation()
	const [values, setValues] = useState(initialState)

	const { register, loginWithThirdPartyOAuth } = useUserContext()

	const handleChange = e => {
		const name = e.target.name
		const value = e.target.value

		setValues({ ...values, [name]: value })
	}

	const handleSubmit = e => {
		e.preventDefault()

		const { name, email, password } = values

		if (!name || !email || !password) {
			toast.error('Veuillez renseigner tous les champs')
		}

		if (password && password.length < 6) {
			toast.error("Veuillez saisir un mot de passe d'au moins 6 charactères")
			return
		}

		register(values)
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
				<form
					data-testid='form'
					onSubmit={handleSubmit}
					className={styles.formContainer}>
					<div>
						{/* <label htmlFor='name'>{t('register:name')}</label> */}
						<input
							onChange={handleChange}
							type='text'
							placeholder={t('register:name')}
							name='name'
							value={values.name}
							autoComplete='username'
							id='name'
						/>
					</div>

					<div>
						{/* <label htmlFor='email'>{t('register:email')}</label> */}
						<input
							onChange={handleChange}
							type='email'
							placeholder={t('register:email')}
							name='email'
							value={values.email}
							autoComplete='email'
							id='email'
						/>
					</div>
					<div>
						{/* <label htmlFor='password'>{t('register:password')}</label> */}
						<input
							onChange={handleChange}
							type='password'
							placeholder={t('register:password')}
							name='password'
							value={values.password}
							autoComplete='current-password'
							id='password'
						/>
					</div>
					<button type='submit' className={`${styles.btn} mainBtn`}>
						{t('register:register')}
					</button>
					<p className={styles.existingAccount}>
						{t('register:haveaccount')}
						<br />
						<Link href={`/${lang}/login`}>{t('register:signin')}</Link>
					</p>
				</form>
			</div>
		</div>
	)
}

export default Register
