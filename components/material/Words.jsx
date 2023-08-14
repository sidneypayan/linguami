import styles from '../../styles/materials/Material.module.css'
import { useDispatch } from 'react-redux'
import {
	translateWord,
	toggleTranslationContainer,
	cleanTranslation,
} from '../../features/words/wordsSlice'
import { addBeingStudiedMaterial } from '../../features/materials/materialsSlice'
import useTranslation from 'next-translate/useTranslation'
import { useState, useEffect } from 'react'
import DOMPurify from 'isomorphic-dompurify'
import { useUserContext } from '../../context/user'

const Words = ({ content, materialId }) => {
	const { t, lang } = useTranslation()
	const { userLearningLanguage } = useUserContext()
	const [regexAll, setRegexAll] = useState('')
	const [regexWords, setRegexWords] = useState('')
	const [regexSentences, setRegexSentences] = useState('')
	const dispatch = useDispatch()

	const clean = DOMPurify.sanitize(content)

	useEffect(() => {
		if (userLearningLanguage === 'fr') {
			setRegexAll(/[ ….,;:?!–—«»"']|[\w\u00C0-\u00FF\-]+/gi)
			setRegexWords(/[\w]+/gi)
		}
		if (userLearningLanguage === 'ru') {
			setRegexAll(/[ ….,;:?!–—«»"]|[\w\u0430-\u044f\ё\е́\-]+/gi)
			setRegexWords(/[\u0430-\u044f]+/gi)
		}

		setRegexSentences(
			/[\d+\w+\u00C0-\u00FF\u0430-\u044f\ё\е́\- ,;:'"«»–—-]+[….:!?br]/gi
		)
	}, [userLearningLanguage])

	const wrapSentences = text => {
		if (regexSentences) {
			const matchSentences = text.match(regexSentences)
			return matchSentences.map((sentence, index) => (
				<span key={index} className={styles.sentence}>
					{wrapWords(sentence)}
				</span>
			))
		}
	}

	const wrapWords = sentences => {
		// regexAll permet de conserver les espaces et la ponctuation
		return sentences.match(regexAll).map((item, index) => {

			if (item) {
				if (/^br$/.test(item)) {
					return <span key={index} className={styles.break}></span>
				}

				if (regexWords.test(item)) {
					return (
						<span
							key={index}
							className={styles.translate}
							onClick={e => handleClick(e)}>
							{item}
						</span>
					)
				}

				return item
			}
		})
	}

	const handleClick = e => {
		const word = e.target.textContent
		const sentence = e.target.parentElement.textContent
		dispatch(translateWord({ word, sentence, userLearningLanguage }))
		dispatch(toggleTranslationContainer())
		dispatch(cleanTranslation())
		dispatch(addBeingStudiedMaterial(materialId))
	}

	return wrapSentences(clean)
}

export default Words
