import styles from '../../styles/materials/Material.module.css'
import DOMPurify from 'isomorphic-dompurify'
import { useDispatch } from 'react-redux'
import {
	translateWord,
	toggleTranslationContainer,
	cleanTranslation,
} from '../../features/words/wordsSlice'
import { addBeingStudiedMaterial } from '../../features/userMaterials/userMaterialsSlice'

const Words = ({ content, materialId }) => {
	const dispatch = useDispatch()

	const purifiedContent = DOMPurify.sanitize(content)

	// Regex pour match les <br>
	const brRegex = /[<br>]+/
	// Regex pour match tous type de caractères et <br>
	const regexAll = /[<br>]+|[ ….,;:?!–—«»"]|[\w\u0430-\u044f\ё\е́\-]+/gi
	// Regex pour match uniquement les lettres russes
	const regexWordsOnly = /[\u0430-\u044f]+/gi
	// Regex pour match les phrases
	const regexSentences =
		/[0-9\A-Z\a-z\u0430-\u044f\ё\е́\ ,;:'"«»–—-]+[….!?<br>]+/gi

	const wrapSentences = text => {
		const matchSentences = text.match(regexSentences)
		return matchSentences.map((sentence, sentenceIndex) => (
			<span key={sentenceIndex} className={styles.sentence}>
				{sentence.match(regexAll).map((word, wordIndex) =>
					regexWordsOnly.test(word) ? (
						<span
							key={wordIndex}
							className={styles.translate}
							onClick={e => handleClick(e)}>
							{word}
						</span>
					) : brRegex.test(word) ? (
						<span key={wordIndex} className={styles.break}></span>
					) : (
						<span key={wordIndex}>{word}</span>
					)
				)}
			</span>
		))
	}

	const handleClick = e => {
		const word = e.target.textContent
		const sentence = e.target.parentElement.textContent
		dispatch(translateWord({ word, sentence }))
		dispatch(toggleTranslationContainer())
		dispatch(cleanTranslation())
		dispatch(addBeingStudiedMaterial(materialId))
	}

	return <>{wrapSentences(purifiedContent)}</>
}

export default Words
