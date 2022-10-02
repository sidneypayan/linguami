import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import styles from '../../styles/Dictionary.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { useUserContext } from '../../context/user'
import { useEffect, useState } from 'react'
import {
	getAllUserWords,
	deleteUserWord,
} from '../../features/words/wordsSlice'
import LevelBar from '../../components/layouts/LevelBar'
// import {} from '../../features/words/wordsSlice'

const Dictionary = () => {
	const { user } = useUserContext()
	const userId = user?.id
	const { user_words } = useSelector(store => store.words)
	const dispatch = useDispatch()
	const [checkedWords, setCheckedWords] = useState([])
	console.log(user_words)

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
		dispatch(getAllUserWords(userId))
	}, [])

	return (
		<div className={styles.container}>
			<LevelBar />
			<table className={styles.table}>
				<tr>
					<th></th>
					<th></th>
					<th></th>
				</tr>
				{user_words &&
					user_words.map((word, index) => (
						<tr className={styles.rowWords} key={index}>
							<td className={styles.tableCheckWord}>
								<input onChange={handleCheck} type='checkbox' value={word.id} />
							</td>
							<td className={styles.tableOriginalWord}>{word.word_ru}</td>
							<td className={styles.tableTranslatedWord}>{word.word_fr}</td>
							<td className={styles.tableIcon}>
								<FontAwesomeIcon
									onClick={() => dispatch(deleteUserWord(word.id))}
									icon={faTrashAlt}
								/>
							</td>
						</tr>
					))}
			</table>
		</div>
	)
}

export default Dictionary
