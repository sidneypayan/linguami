import styles from '../../styles/materials/Translation.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { useRef, useEffect, useState } from 'react'
import {
	toggleTranslationContainer,
	cleanTranslation,
	addWordToDictionary,
} from '../../features/words/wordsSlice'
import Link from 'next/link'
import { useUserContext } from '../../context/user'

const Translation = ({ coordinates, materialId, userId }) => {
	const dispatch = useDispatch()
	const ref = useRef()

	const { translation, isTranslationOpen, translation_loading } = useSelector(
		store => store.words
	)

	const [personalTranslation, setPersonalTranslation] = useState('')
	const { isUserLoggedIn } = useUserContext()

	const position = {
		left: coordinates.x + 'px',
		top: coordinates.y + 'px',
	}

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

	const addWord = e => {
		const translatedWord = personalTranslation
			? personalTranslation
			: e.target.textContent
		dispatch(
			addWordToDictionary({
				originalWord: translation.inf,
				translatedWord: translatedWord,
				userId,
				materialId,
			})
		)
		dispatch(toggleTranslationContainer(false))
		setPersonalTranslation('')
	}

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
		isTranslationOpen &&
		!translation_loading && (
			<div style={position} ref={ref} className={styles.container}>
				<>
					<div className={styles.inf}>
						<span>{translation.form}</span> - <span>{translation.inf}</span>
					</div>
					<ul className={styles.traductionsContainer}>
						{translation.definitions?.map((definition, index) => (
							<li key={index} onClick={addWord}>
								{definition}
							</li>
						))}
					</ul>
				</>

				<form onSubmit={addWord}>
					<input
						className={styles.input}
						type='text'
						placeholder='votre traduction'
						value={personalTranslation}
						onChange={e => setPersonalTranslation(e.target.value)}
					/>
					<button disabled={!personalTranslation} className={styles.btn}>
						Ajouter
					</button>
				</form>
			</div>
		)
	)
}

export default Translation
