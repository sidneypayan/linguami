import { useState } from 'react'
import { toast } from 'react-toastify'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../styles/Register.module.css'
import { useUserContext } from '../../context/user'

const initialState = {
	name: '',
	email: '',
	password: '',
}

const Register = () => {
	const [values, setValues] = useState(initialState)
	const [isEmailOpen, setIsEmailOpen] = useState(false)
	const { login, register, loginWithThirdPartyOAuth, toggleMember, isMember } =
		useUserContext()

	const handleChange = e => {
		const name = e.target.name
		const value = e.target.value

		setValues({ ...values, [name]: value })
	}

	const handleSubmit = e => {
		e.preventDefault()

		const { name, email, password } = values

		if ((!isMember && !name) || !email || !password) {
			toast.error('Veuillez renseigner tous les champs')
		}

		if (password && password.length < 6) {
			toast.error("Veuillez saisir un mot de passe d'au moins 6 charactères")
			return
		}

		if (isMember) {
			login(values)
			return
		}

		register(values)
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.switchBtnContainer}>
				<button
					onClick={() => toggleMember(true)}
					className={
						isMember
							? `${styles.switchBtn} ${styles.active}`
							: `${styles.switchBtn}`
					}>
					Se connecter
				</button>
				<button
					onClick={() => toggleMember(false)}
					className={
						!isMember
							? `${styles.switchBtn} ${styles.active}`
							: `${styles.switchBtn}`
					}>
					S&apos;inscrire
				</button>
			</div>
			<div className={styles.container}>
				{isEmailOpen && (
					<button
						className={styles.backBtn}
						onClick={() => setIsEmailOpen(false)}>
						<Image
							src='/img/back.png'
							alt='back'
							width={25}
							height={25}
							layout='fixed'></Image>
						<span className={styles.socialText}>Retour</span>
					</button>
				)}
				<h3 className={styles.title}>{`${
					isMember ? 'Connexion' : 'Créer un compte'
				}`}</h3>
				{!isEmailOpen && (
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
						<button
							className={styles.socialBtn}
							onClick={() => setIsEmailOpen(true)}>
							<Image
								src='/img/email.png'
								alt='email'
								width={25}
								height={25}
								layout='fixed'></Image>
							<span className={styles.socialText}>Email</span>
						</button>
						{isMember ? (
							<p className={styles.existingAccount}>
								Vous n&apos;avez pas encore de compte ? <br />
								<a onClick={() => toggleMember(false)}>
									Inscrivez-vous gratuitement !
								</a>
							</p>
						) : (
							<p className={styles.existingAccount}>
								Vous avez déjà un compte ?<br />
								<a onClick={() => toggleMember(true)}>Connectez vous !</a>
							</p>
						)}
					</div>
				)}
				{isEmailOpen && (
					<form onSubmit={handleSubmit} className={styles.formContainer}>
						{!isMember && (
							<div>
								<input
									onChange={handleChange}
									type='text'
									placeholder='nom'
									name='name'
									value={values.name}
									autoComplete='username'
								/>
							</div>
						)}
						<div>
							<input
								onChange={handleChange}
								type='email'
								placeholder='email'
								name='email'
								value={values.email}
								autoComplete='email'
							/>
						</div>
						<div>
							<input
								onChange={handleChange}
								type='password'
								placeholder='mot de passe'
								name='password'
								value={values.password}
								autoComplete='current-password'
							/>
						</div>

						<button className={`${styles.btn} mainBtn`}>
							S&apos;enregistrer
						</button>
					</form>
				)}
			</div>
		</div>
	)
}

export default Register
