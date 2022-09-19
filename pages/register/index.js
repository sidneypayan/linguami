import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../styles/Login.module.css'
import { registerUser } from '../../features/user/userSlice'

const initialState = {
	name: '',
	email: '',
	password: '',
}

const Register = () => {
	const { isUserRegistered } = useSelector(store => store.user)
	const dispatch = useDispatch()
	const router = useRouter()

	const [values, setValues] = useState(initialState)
	const [error, setError] = useState('')

	const handleSubmit = e => {
		e.preventDefault()
		setError('')

		if (!values.name) {
			toast.error('Veuillez saisir votre nom')
			return
		}

		if (!values.email) {
			toast.error('Veuillez saisir un email')
			return
		}

		if (!values.password) {
			toast.error('Veuillez saisir un mot de passe')
			return
		}

		if (values.password && values.password.length < 8) {
			toast.error("Veuillez saisir un mot de passe d'au moins 8 charactères")
			return
		}

		dispatch(registerUser(values))
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

	useEffect(() => {
		if (isUserRegistered) {
			router.back()
		}
	}, [isUserRegistered])

	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<div>
					<Image
						src='/img/bear.png'
						alt='bear'
						width={125}
						height={150}></Image>
				</div>

				<form onSubmit={handleSubmit} className={styles.formContainer}>
					<h2>Register</h2>
					<p className={styles.error}>{error}</p>
					<div>
						<input
							onChange={handleChange}
							type='text'
							placeholder='nom'
							name='name'
							value={values.name}
						/>
					</div>
					<div>
						<input
							onChange={handleChange}
							type='email'
							placeholder='email'
							name='email'
							value={values.email}
						/>
					</div>
					<div>
						<input
							onChange={handleChange}
							type='password'
							placeholder='mot de passe'
							name='password'
							value={values.password}
						/>
					</div>

					<button className={`${styles.btn} mainBtn`}>S'enregistrer</button>
					<p>
						Vous avez déjà un compte ?<br />
						<Link href='/login'>
							<a>Connectez vous !</a>
						</Link>
					</p>
				</form>
			</div>
		</div>
	)
}

export default Register
