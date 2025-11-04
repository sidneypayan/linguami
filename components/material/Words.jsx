import React from 'react'
import styles from '../../styles/materials/Material.module.css'
import { useDispatch } from 'react-redux'
import {
	translateWord,
	toggleTranslationContainer,
	cleanTranslation,
} from '../../features/words/wordsSlice'
import { useMemo, useCallback } from 'react'
import DOMPurify from 'isomorphic-dompurify'
import { useUserContext } from '../../context/user'

// Définir les regex en dehors du composant pour éviter recréations
const REGEX_CONFIG = {
	fr: {
		all: /[ \t….,;:?!–—«»"()]|[^ \t….,;:?!–—«»"()]+/gi, // Capture espaces, ponctuation et mots
		words: /[\w\u00C0-\u00FF]+/i, // Détection de mots (sans apostrophes pour éviter faux positifs)
	},
	ru: {
		all: /[ \t….,;:?!–—«»"()]|[\w\u0430-\u044f\ё\е́\-]+/gi,
		words: /[\u0430-\u044f\ё\е́]+/i,
	},
	en: {
		all: /[ \t….,;:?!–—«»"()]|[^ \t….,;:?!–—«»"()]+/gi, // Capture espaces, ponctuation et mots
		words: /[\w]+/i, // Détection de mots
	},
}

const Words = ({ content, locale = 'fr' }) => {
	const { userLearningLanguage, isUserLoggedIn } = useUserContext()
	const dispatch = useDispatch()

	// Mémoïser le sanitize pour éviter recalcul à chaque render
	const clean = useMemo(() => {
		if (!content) return ''
		// Sanitize le contenu (les sauts de ligne sont déjà en \n dans la DB)
		return DOMPurify.sanitize(content)
	}, [content])

	// Sélectionner les regex selon la langue avec fallback sur 'en'
	const regexConfig = useMemo(() => {
		return REGEX_CONFIG[userLearningLanguage] || REGEX_CONFIG.en
	}, [userLearningLanguage])

	const handleClick = useCallback(
		e => {
			const word = e.target.textContent
			const sentence = e.target.parentElement.textContent

			// Dispatch custom event to pause video
			if (typeof window !== 'undefined') {
				window.dispatchEvent(new Event('word-clicked'))
			}

			dispatch(
				translateWord({
					word,
					sentence,
					userLearningLanguage,
					locale,
					isAuthenticated: isUserLoggedIn,
				})
			)
			dispatch(toggleTranslationContainer())
			dispatch(cleanTranslation())
		},
		[dispatch, userLearningLanguage, locale, isUserLoggedIn]
	)

	const wrapWords = useCallback(
		sentence => {
			// Sécurité : vérifier que la regex existe et que sentence est valide
			if (!sentence || !regexConfig.all) {
				return sentence
			}

			const matches = sentence.match(regexConfig.all)

			// Sécurité : vérifier que match() a retourné un résultat
			if (!matches) {
				return sentence
			}

			return matches.map((item, index) => {
				if (!item) return null

				// Vérifier si c'est un mot (utiliser match au lieu de test pour éviter problèmes de lastIndex)
				if (item.match(regexConfig.words)) {
					// Vérifier si le mot est suivi de ponctuation (directement ou après un espace)
					const nextItem = matches[index + 1]
					const nextNextItem = matches[index + 2]

					// Vérifier si le prochain élément est de la ponctuation
					let isFollowedByPunctuation = false
					if (nextItem) {
						// Si le prochain élément est de la ponctuation directement
						if (nextItem.trim() && !nextItem.match(regexConfig.words)) {
							isFollowedByPunctuation = true
						}
						// Si le prochain élément est un espace, vérifier l'élément d'après
						else if (!nextItem.trim() && nextNextItem && nextNextItem.trim() && !nextNextItem.match(regexConfig.words)) {
							isFollowedByPunctuation = true
						}
					}

					// Vérifier si le mot contient une apostrophe (j'étais, l'ami, etc.)
					const apostropheRegex = /['''`\u2019]/
					if (apostropheRegex.test(item)) {
						// Découper le mot en parties autour des apostrophes
						const parts = item.split(apostropheRegex)
						const apostrophes = item.match(new RegExp(apostropheRegex, 'g'))

						const elements = []
						parts.forEach((part, i) => {
							if (part) {
								// Vérifier si c'est la dernière partie du mot
								const isLastPart = i === parts.length - 1
								// Vérifier si cette partie est suivie d'une apostrophe
								const isFollowedByApostrophe = apostrophes && apostrophes[i]

								// Appliquer .nospace si :
								// - C'est la dernière partie et le mot est suivi de ponctuation
								// - OU c'est suivi d'une apostrophe
								const className = (isLastPart && isFollowedByPunctuation) || isFollowedByApostrophe
									? `${styles.translate} ${styles.nospace}`
									: styles.translate

								// Partie du mot (cliquable)
								elements.push(
									<span
										key={`${index}-${i}-word`}
										className={className}
										onClick={handleClick}>
										{part}
									</span>
								)
							}
							// Ajouter l'apostrophe entre les parties (non cliquable)
							if (apostrophes && apostrophes[i]) {
								elements.push(
									<span key={`${index}-${i}-apos`} className={styles.punctuation}>
										{apostrophes[i]}
									</span>
								)
							}
						})

						return <React.Fragment key={index}>{elements}</React.Fragment>
					}

					return (
						<span
							key={index}
							className={`${styles.translate} ${isFollowedByPunctuation ? styles.nospace : ''}`}
							onClick={handleClick}>
							{item}
						</span>
					)
				}

				// Pour les espaces et la ponctuation, les wrapper dans un span aussi
				// pour qu'ils héritent correctement de la taille de police
				return (
					<span key={index} className={styles.punctuation}>
						{item}
					</span>
				)
			})
		},
		[regexConfig, handleClick]
	)

	const wrapSentences = useMemo(() => {
		// Sécurité : vérifier que le texte existe
		if (!clean) {
			return clean
		}

		// Splitter sur les sauts de ligne pour traiter ligne par ligne
		const lines = clean.split(/\r?\n/)

		return lines.map((line, index) => (
			<React.Fragment key={index}>
				{line && (
					<span className={styles.sentence}>
						{wrapWords(line)}
					</span>
				)}
				{index < lines.length - 1 && <br />}
			</React.Fragment>
		))
	}, [clean, wrapWords])

	return wrapSentences
}

// Mémoïser le composant pour éviter re-renders inutiles
export default React.memo(Words)
