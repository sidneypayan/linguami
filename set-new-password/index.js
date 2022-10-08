import styles from '../../styles/Register.module.css'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { useUserContext } from '../../context/user'

const SetNewPassword = () => {
	const { setNewPassword } = useUserContext()

	const [password, setPassword] = useState('')
	const handleSubmit = e => {
		e.preventDefault()
		if (!password) {
			toast.error('Veuillez saisir un mot de passe')
			return
		}

		if (password && password.length < 8) {
			toast.error("Veuillez saisir un mot de passe d'au moins 8 charactères")
			return
		}
		setNewPassword(password)
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

				<form onSubmit={handleSubmit} className={styles.formContainer}>
					<h2>Nouveau mot de passe</h2>

					<div>
						<input
							onChange={e => setPassword(e.target.value)}
							type='password'
							placeholder='Nouveau mot de passe'
							name='password'
							value={password}
						/>
					</div>

					<button className={`${styles.btn} mainBtn`}>Envoyer</button>
				</form>
			</div>
		</div>
	)
}

export default SetNewPassword
