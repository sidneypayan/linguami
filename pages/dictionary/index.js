import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import styles from '../../styles/Dictionary.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { useUserContext } from '../../context/user'
import { useEffect, useState } from 'react'
import {
	getAllUserWords,
	deleteUserWord,
} from '../../features/words/wordsSlice'
import { toggleFlashcardsContainer } from '../../features/cards/cardsSlice'
import Link from 'next/link'
import Head from 'next/head'

const Dictionary = () => {
	const dispatch = useDispatch()
	const { user, isUserLoggedIn } = useUserContext()
	const userId = user?.id
	const { user_words, user_words_pending, user_material_words_pending } =
		useSelector(store => store.words)
	const [checkedWords, setCheckedWords] = useState([])

	const handleCheck = e => {
		if (e.target.checked) {
			setCheckedWords([...checkedWords, e.target.value])
		} else {
			setCheckedWords(prevCheckedWords =>
				prevCheckedWords.filter(word => word !== e.target.value)
			)
		}
	}

	useEffect(() => {
		if (isUserLoggedIn) dispatch(getAllUserWords(userId))
	}, [
		dispatch,
		isUserLoggedIn,
		userId,
		user_words_pending,
		user_material_words_pending,
	])

	return (
		<>
			<Head>
				<title>Linguami | Dictionnaire personnel</title>
			</Head>
			<div className={styles.container}>
				<div className={styles.table}>
					{user_words.length > 0 && (
						<button
							onClick={() => dispatch(toggleFlashcardsContainer(true))}
							type='button'
							className={styles.flashcardsBtn}>
							Réviser les mots
						</button>
					)}
					{user_words.length > 0 ? (
						user_words.map((word, index) => (
							<div className={styles.rowWords} key={index}>
								<div className={styles.tableWords}>
									<span className={styles.tableOriginalWord}>
										{word.word_ru}
									</span>
									<span className={styles.tableTranslatedWord}>
										{word.word_fr}
									</span>
								</div>
								<div className={styles.tableWordSentence}>
									{word.word_sentence}
								</div>
								<div className={styles.tableIcon}>
									<FontAwesomeIcon
										onClick={() => dispatch(deleteUserWord(word.id))}
										icon={faTrashAlt}
									/>
								</div>
							</div>
						))
					) : (
						<>
							<p className={styles.nowordsText}>
								Vous n&apos;avez pas encore de mots dans votre dictionnaire.
								Choisissez un materiel à étudier, cliquez sur un mot du texte
								puis sur sa traduction afin de l&apos;ajouter à votre
								dictionnaire.
							</p>
							<Link href='/materials'>
								<button className={styles.flashcardsBtn}>Commencer</button>
							</Link>
						</>
					)}
				</div>
			</div>
		</>
	)
}

export default Dictionary
