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
import LevelBar from '../../components/layouts/LevelBar'

const Dictionary = () => {
	const { user } = useUserContext()
	const { user_words } = useSelector(store => store.words)
	const dispatch = useDispatch()
	// const [checkedWords, setCheckedWords] = useState([])

	const handleCheck = e => {
		console.log(e.target.value)
		if (e.target.checked) {
			setCheckedWords([...checkedWords, e.target.value])
		} else {
			setCheckedWords(prevCheckedWords =>
				prevCheckedWords.filter(word => word !== e.target.value)
			)
		}
	}

	useEffect(() => {
		dispatch(getAllUserWords(user.id))
	}, [])

	return (
		<div className={styles.container}>
			<LevelBar />
			<div className={styles.table}>
				{user_words &&
					user_words.map((word, index) => (
						<div className={styles.rowWords} key={index}>
							<div className={styles.tableCheckWord}>
								<input onChange={handleCheck} type='checkbox' value={word.id} />
							</div>
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
