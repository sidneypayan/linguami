import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../styles/Login.module.css'
import { loginUser } from '../../features/user/userSlice'
import { useRouter } from 'next/router'

const initialState = {
	email: '',
	password: '',
}

const Login = () => {
	const router = useRouter()
	const dispatch = useDispatch()
	const { userData } = useSelector(store => store.user)

	console.log(userData)

	const [values, setValues] = useState(initialState)
	const [error, setError] = useState('')

	const handleSubmit = e => {
		e.preventDefault()
		setError('')

		if (!values.email || !values.password) {
			toast.error('Veuillez remplir tous les champs')
			return
		}

		dispatch(loginUser(values))
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
		if (userData) {
			router.back()
		}
	}, [userData])

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
					<h2>Login</h2>
					<p className={styles.error}>{error}</p>
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

					<button className={`${styles.btn} mainBtn`}>Log In</button>
					<p>
						Vous n'avez pas encore de compte ?
						<Link href='/register'>
							<a>Inscrivez-vous gratuitement !</a>
						</Link>
					</p>
				</form>
			</div>
		</div>
	)
}

export default Login
