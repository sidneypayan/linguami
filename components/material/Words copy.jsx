import styles from '../../styles/materials/Material.module.css'
import DOMPurify from 'isomorphic-dompurify'
import { useDispatch } from 'react-redux'
import {
	translateWord,
	toggleTranslationContainer,
} from '../../features/words/wordsSlice'

const Words = ({ content }) => {
	const dispatch = useDispatch()

	const purifiedContent = DOMPurify.sanitize(content)
	console.log(purifiedContent)
	const brRegex = /[<br>]+/
	const regexAll = /[<br>]+|[ ….,;:?!–—«»"]|[\w\u0430-\u044f\ё\е́\-]+/gi
	const regexWordsOnly = /[\u0430-\u044f]+/gi

	const wrapWords = text => {
		const matchAll = text.match(regexAll)
		return matchAll.map((match, index) =>
			regexWordsOnly.test(match) ? (
				<span
					key={index}
					className={styles.translate}
					onClick={e => handleClick(e)}>
					{match}
				</span>
			) : brRegex.test(match) ? (
				<span key={index} className={styles.break}></span>
			) : (
				match
			)
		)
	}

	const handleClick = e => {
		dispatch(translateWord(e.target.textContent))
		dispatch(toggleTranslationContainer())
	}

	return <>{wrapWords(purifiedContent)}</>
}

export default Words
