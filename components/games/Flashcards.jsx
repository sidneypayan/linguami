import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import styles from '../../styles/FlashCards.module.css'
import { useState } from 'react'
import { useEffect } from 'react'
import { toggleFlashcardsContainer } from '../../features/cards/cardsSlice'
import { useRouter } from 'next/router'

const FlashCards = () => {
	const router = useRouter()
	const dispatch = useDispatch()
	const { user_material_words, user_words } = useSelector(store => store.words)
	const [cardIndex, setCardIndex] = useState(0)
	const [showAnswer, setShowAnswer] = useState(false)
	const [wordsLeft, setWordsLeft] = useState([])

	const wordsArray =
		router.pathname === '/dictionary' ? user_words : user_material_words

	useEffect(() => {
		setWordsLeft(wordsArray)
	}, [wordsArray])

	const nextWord = (status, id) => {
		if (status === 'notguessed') {
			setCardIndex(prevCardIndex => prevCardIndex + 1)
		}

		if (status === 'guessed') {
			setWordsLeft(prevWords => prevWords.filter(word => word.id !== id))
		}

		if (cardIndex === wordsLeft.length - 1) {
			setCardIndex(0)
		}

		setShowAnswer(false)
	}

	return wordsLeft.length > 0 ? (
		<div className={styles.container}>
			<FontAwesomeIcon
				onClick={() => dispatch(toggleFlashcardsContainer(false))}
				className={styles.closeIcon}
				icon={faXmark}
				size='2xl'
			/>
			<h3 className={styles.flashcardsTitle}>
				Essayez de vous souvenir de la traduction en français
			</h3>
			<div className={styles.wordsContainer}>
				<div className={styles.originalWord}>
					{wordsLeft[cardIndex].word_ru}
				</div>

				{showAnswer ? (
					<>
						<div className={styles.translatedWord}>
							{wordsLeft[cardIndex].word_fr}
						</div>
						<div className={styles.btnsContainer}>
							<button
								className={styles.guessedBtn}
								onClick={() => nextWord('guessed', wordsLeft[cardIndex].id)}>
								J&apos;ai deviné le mot <br />
							</button>
							<button
								className={styles.notguessedBtn}
								onClick={() => nextWord('notguessed', wordsLeft[cardIndex].id)}>
								Je n&apos;ai pas deviné le mot
							</button>
						</div>
					</>
				) : (
					<button
						className={styles.showAnswerBtn}
						onClick={() => setShowAnswer(true)}>
						Montrer la réponse
					</button>
				)}
			</div>
		</div>
	) : (
		<div className={styles.container}>
			<h3 className={styles.flashcardsTitle}>Bravo !</h3>
			<div className={styles.wordsContainer}>
				<p>
					Vous avez terminez la révision de mot, <br /> recommencez quand vous
					voulez !
				</p>
				<button
					onClick={() => dispatch(toggleFlashcardsContainer(false))}
					className='mainBtn'>
					Fermer
				</button>
			</div>
		</div>
	)
}

export default FlashCards
