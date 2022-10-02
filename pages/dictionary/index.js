import styles from '../../styles/Dictionary.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { useUserContext } from '../../context/user'
import { useEffect, useState } from 'react'
import {
	getAllUserWords,
	deleteUserWord,
} from '../../features/words/wordsSlice'
import LevelBar from '../../components/layouts/LevelBar'
import TableRow from '../../components/dictionary/TableRow'
// import {} from '../../features/words/wordsSlice'

const Dictionary = () => {
	const { user } = useUserContext()
	// const userId = user?.id
	const { user_words } = useSelector(store => store.words)
	// const dispatch = useDispatch()
	// const [checkedWords, setCheckedWords] = useState([])

	return (
		<div className={styles.container}>
			<LevelBar />
			<table className={styles.table}>
				<tr>
					<th></th>
					<th></th>
					<th></th>
				</tr>
				<TableRow />
			</table>
		</div>
	)
}

export default Dictionary
