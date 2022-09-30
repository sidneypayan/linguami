import styles from '../../styles/Translation.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { useRef, useEffect } from 'react'
import {
	toggleTranslationContainer,
	cleanTranslation,
} from '../../features/words/wordsSlice'
import TranslationLoader from './TranslationLoader'
import Link from 'next/link'
import { useUserContext } from '../../context/user'

const Translation = ({ coordinates }) => {
	const { isUserLoggedIn } = useUserContext()
	const position = {
		left: coordinates.x + 'px',
		top: coordinates.y + 'px',
	}

	const dispatch = useDispatch()
	const ref = useRef()
	const { translation, isTranslationOpen, translation_loading } = useSelector(
		store => store.words
	)

	useEffect(() => {
		const checkIfClickedOutside = e => {
			if (isTranslationOpen && ref.current && !ref.current.contains(e.target)) {
				dispatch(toggleTranslationContainer(false))
				dispatch(cleanTranslation())
			}
		}
		document.addEventListener('mousedown', checkIfClickedOutside)

		return () => {
			document.removeEventListener('mousedown', checkIfClickedOutside)
		}
	}, [dispatch, isTranslationOpen])

	if (!isUserLoggedIn) {
		return (
			isTranslationOpen && (
				<div style={position} ref={ref} className={styles.container}>
					<div className={styles.registerContainer}>
						Créez un compte pour pouvoir utiliser l&apos; outil de traduction
					</div>
					<Link href='/register'>
						<button className={styles.btn}>S&apos;enregistrer</button>
					</Link>
				</div>
			)
		)
	}

	return (
		isTranslationOpen && (
			<div style={position} ref={ref} className={styles.container}>
				{translation_loading ? (
					<TranslationLoader />
				) : (
					<>
						<div className={styles.inf}>
							<span>{translation.form}</span> - <span>{translation.inf}</span>
						</div>
						<ul className={styles.traductionsContainer}>
							{translation.definitions?.map((definition, index) => (
								<li key={index}>{definition}</li>
							))}
						</ul>
					</>
				)}

				<form>
					<input
						className={styles.input}
						type='text'
						placeholder='votre traduction'
					/>
					<button className={styles.btn}>Ajouter</button>
				</form>
			</div>
		)
	)
}

export default Translation
