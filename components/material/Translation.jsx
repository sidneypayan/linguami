import useTranslation from 'next-translate/useTranslation'
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
	const { t, lang } = useTranslation('words')

	const dispatch = useDispatch()
	const ref = useRef()

	const {
		translation,
		isTranslationOpen,
		translation_loading,
		translation_error,
		word_sentence,
	} = useSelector(store => store.words)

	const [personalTranslation, setPersonalTranslation] = useState('')
	const { isUserLoggedIn } = useUserContext()

	// Calculer la position intelligemment pour éviter le débordement
	const getPosition = () => {
		// Vérifier si nous sommes côté client
		if (typeof window === 'undefined') {
			return {
				left: coordinates.x + 'px',
				top: coordinates.y + 'px',
			}
		}

		const viewportWidth = window.innerWidth
		const viewportHeight = window.innerHeight
		const padding = 10 // Marge de sécurité

		// Calculer la largeur du conteneur selon la taille d'écran
		const containerWidth =
			viewportWidth <= 600 ? Math.min(viewportWidth - 40, 350) : 350
		const containerHeight = 300 // Hauteur approximative
		const offset = 10 // Décalage depuis le point de clic

		// Position de départ : légèrement en dessous et à droite du mot cliqué
		let left = coordinates.x
		let top = coordinates.y + offset

		// Ajuster horizontalement
		// Si déborde à droite, positionner à gauche du point de clic
		if (left + containerWidth > viewportWidth - padding) {
			left = coordinates.x - containerWidth
			// Si déborde aussi à gauche, centrer autant que possible
			if (left < padding) {
				left = Math.max(padding, (viewportWidth - containerWidth) / 2)
			}
		}

		// S'assurer qu'on ne dépasse pas à gauche
		if (left < padding) {
			left = padding
		}

		// Ajuster verticalement
		// Si déborde en bas, positionner au-dessus du point de clic
		if (top + containerHeight > viewportHeight - padding) {
			top = coordinates.y - containerHeight - offset
			// Si déborde aussi en haut, ajuster pour être visible
			if (top < padding) {
				top = Math.max(padding, viewportHeight - containerHeight - padding)
			}
		}

		// S'assurer qu'on ne dépasse pas en haut
		if (top < padding) {
			top = padding
		}

		return {
			left: left + 'px',
			top: top + 'px',
		}
	}

	const position = getPosition()

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

		const originalWord = translation.inf ? translation.inf : translation.word

		dispatch(
			addWordToDictionary({
				originalWord,
				translatedWord,
				userId,
				materialId,
				word_sentence,
				lang,
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
						{t('registertotranslate')}
					</div>
					<Link href='/signin'>
						<button className={styles.btn}>{t('noaccount')}</button>
					</Link>
				</div>
			)
		)
	}

	return (
		isTranslationOpen &&
		!translation_loading && (
			<div style={position} ref={ref} className={styles.container}>
				{translation_error ? (
					<>
						<div className={styles.inf}>
							<span>{translation.word}</span>
						</div>
						<ul className={styles.traductionsContainer}>
							<li className={styles.errMsg}>{translation_error}</li>
						</ul>
					</>
				) : (
					<>
						<div className={styles.inf}>
							<span>{translation.form}</span> - <span>{translation.inf}</span>
						</div>
						<ul className={styles.traductionsContainer}>
							{translation.definitions?.map((definition, index) => (
								<li
									className={styles.translatedWord}
									key={index}
									onClick={addWord}>
									{definition}
								</li>
							))}
						</ul>
					</>
				)}

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
