import { useState } from 'react'
import { toast } from 'react-toastify'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../styles/Login.module.css'
import { useUserContext } from '../../context/user'

const initialState = {
	email: '',
	password: '',
}

const Login = () => {
	const { login, askNewPassword } = useUserContext()

	const [values, setValues] = useState(initialState)
	const [resetPassword, setResetPassword] = useState(false)
	const [email, setEmail] = useState('')

	const handleSubmit = e => {
		e.preventDefault()

		if (!values.email || !values.password) {
			toast.error('Veuillez remplir tous les champs')
			return
		}

		login(values)
	}

	const handleChange = e => {
		const name = e.target.name
		const value = e.target.value

		setValues(prev => {
			return {
				...prev,
				[name]: value,
			}
		})
	}

	const handleNewPassword = e => {
		e.preventDefault()
		askNewPassword(email)
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<div className={styles.img}>
					<Image
						src='/img/bear.png'
						alt='bear'
						width={125}
						height={150}></Image>
				</div>

				{resetPassword ? (
					<form onSubmit={handleNewPassword} className={styles.formContainer}>
						<h2>Mot de passe oublié ?</h2>
						<p className={styles.resetText}>
							Veuillez entrer votre adresse email
						</p>
						<div>
							<input
								type='email'
								placeholder='Email'
								name='email'
								value={email}
								onChange={e => setEmail(e.target.value)}
							/>
						</div>

						<span
							className={styles.resetBtn}
							onClick={() => setResetPassword(!resetPassword)}>
							Revenir vers l&apos;inscription
						</span>
						<button className={`${styles.btn} mainBtn`}>Envoyer</button>
					</form>
				) : (
					<form onSubmit={handleSubmit} className={styles.formContainer}>
						<h2>Login</h2>
						<div>
							<input
								type='email'
								placeholder='Email'
								name='email'
								value={values.email}
								onChange={handleChange}
							/>
						</div>
						<div>
							<input
								type='password'
								placeholder='Password'
								name='password'
								value={values.password}
								onChange={handleChange}
							/>
						</div>
						<span
							className={styles.resetBtn}
							onClick={() => setResetPassword(!resetPassword)}>
							Mot de passe oublié ?
						</span>
						<button className={`${styles.btn} mainBtn`}>Se connecter</button>
						<p>
							Vous n&apos;avez pas encore de compte ? <br />
							<Link href='/register'>
								<a>Inscrivez-vous gratuitement !</a>
							</Link>
						</p>
					</form>
				)}
			</div>
		</div>
	)
}

export default Login
