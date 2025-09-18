import styles from '../../styles/materials/Material.module.css'
import { useDispatch } from 'react-redux'
import {
	translateWord,
	toggleTranslationContainer,
	cleanTranslation,
} from '../../features/words/wordsSlice'
import { useState, useEffect } from 'react'
import DOMPurify from 'isomorphic-dompurify'
import { useUserContext } from '../../context/user'

const Words = ({ content }) => {
	const { userLearningLanguage } = useUserContext()
	const [regexAll, setRegexAll] = useState('')
	const [regexWords, setRegexWords] = useState('')
	const [regexSentences, setRegexSentences] = useState('')
	const dispatch = useDispatch()

	const clean = DOMPurify.sanitize(content)

	useEffect(() => {
		if (userLearningLanguage === 'fr') {
			setRegexAll(/[ ….,;:?!–—«»"'’()]|[\w\u00C0-\u00FF\-]+/gi)
			setRegexWords(/[\w]+/gi)
		}
		if (userLearningLanguage === 'ru') {
			setRegexAll(/[ ….,;:?!–—«»"()]|[\w\u0430-\u044f\ё\е́\-]+/gi)
			setRegexWords(/[\u0430-\u044f]+/gi)
		}

		setRegexSentences(
			/[\d+\w+\u00C0-\u00FF\u0430-\u044f\ё\е́\- ,;:'’"«»()–—-]+[….:!?|<br\s*\/?>]/gi
		)
	}, [userLearningLanguage])

	const wrapSentences = text => {
		if (regexSentences) {
			const matchSentences = text.match(regexSentences)
			if (matchSentences) {
				return matchSentences.map((sentence, index) => (
					<span key={index} className={styles.sentence}>
						{wrapWords(sentence)}
					</span>
				))
			} else {
				return <span className={styles.sentence}>{text}</span>
			}
		}
	}

	const wrapWords = sentences => {
		// regexAll permet de conserver les espaces et la ponctuation
		return sentences.match(regexAll).map((item, index) => {
			// Vérifie si item correspond à br et fait un saut à la ligne si c'est le cas
			if (item) {
				if (/^br$/.test(item)) {
					return <span key={index} className={styles.break}></span>
				}

				// if (/^br$/.test(item)) {
				// 	return <br key={index} />
				// }

				// if (/^<br\s*\/?>$/.test(item)) {
				// 	return <br key={index} />
				// }

				// Vérifie si item correspond à un mot et lui applique le style translate si c'est le cas
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
	}

	return wrapSentences(clean)
}

export default Words
