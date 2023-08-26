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
	const { t } = useTranslation('materials', 'register')
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

		const originalWord = translation.inf ? translation.inf : translation.word

		dispatch(
			addWordToDictionary({
				originalWord,
				translatedWord,
				userId,
				materialId,
				word_sentence,
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
