import styles from '../../styles/materials/Material.module.css'
import DOMPurify from 'isomorphic-dompurify'
import { useDispatch } from 'react-redux'
import {
	translateWord,
	toggleTranslationContainer,
	cleanTranslation,
} from '../../features/words/wordsSlice'

const Words = ({ content }) => {
	const dispatch = useDispatch()

	const purifiedContent = DOMPurify.sanitize(content)

	// Regex pour match les <br>
	const brRegex = /[<br>]+/
	// Regex pour match tous type de caractères et <br>
	const regexAll = /[<br>]+|[ ….,;:?!–—«»"]|[\w\u0430-\u044f\ё\е́\-]+/gi
	// Regex pour match uniquement les lettres russes
	const regexWordsOnly = /[\u0430-\u044f]+/gi
	// Regex pour match les phrases
	// const regexSentences =
	// 	/[<br>]+|[0-9\A-Z\a-z\u0430-\u044f\ё\е́\ ,;:'"«»–—-]+[….!?$]/gi
	const regexSentences =
		/[0-9\A-Z\a-z\u0430-\u044f\ё\е́\ ,;:'"«»–—-]+[….!?<br>$]+/gi
	const wrapSentences = text => {
		const matchSentences = text.match(regexSentences)
		return matchSentences.map((sentence, index) => (
			<>
				<span key={index} className={styles.sentence}>
					{sentence.match(regexAll).map((word, index) =>
						regexWordsOnly.test(word) ? (
							<span
								key={index}
								className={styles.translate}
								onClick={e => handleClick(e)}>
								{word}
							</span>
						) : brRegex.test(word) ? (
							<span key={index} className={styles.break}></span>
						) : (
							word
						)
					)}
				</span>
			</>
		))
	}

	const handleClick = e => {
		const word = e.target.textContent
		const sentence = e.target.parentElement.textContent
		dispatch(translateWord({ word, sentence }))
		dispatch(toggleTranslationContainer())
		dispatch(cleanTranslation())
	}

	return <>{wrapSentences(purifiedContent)}</>
}

export default Words
