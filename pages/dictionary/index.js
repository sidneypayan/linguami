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
	deleteUserWords,
} from '../../features/words/wordsSlice'

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
		<div className={styles.container}>
			<div className={styles.table}>
				{/* <div className={styles.rowWords}>
					<div className={styles.tableWordSentence}></div>
					<div className={styles.tableIcon}>
						<FontAwesomeIcon
							onClick={() => dispatch(deleteUserWords(checkedWords))}
							icon={faTrashAlt}
						/>
					</div>
				</div> */}
				{user_words &&
					user_words.map((word, index) => (
						<div className={styles.rowWords} key={index}>
							{/* <div className={styles.tableCheckWord}>
								<input onChange={handleCheck} type='checkbox' value={word.id} />
							</div> */}
							<div className={styles.tableWords}>
								<span className={styles.tableOriginalWord}>{word.word_ru}</span>
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
					))}
			</div>
		</div>
	)
}

export default Dictionary
