import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { useUserContext } from '../../context/user'
import styles from '../../styles/materials/WordsContainer.module.css'
import {
	getUserMaterialWords,
	deleteUserWord,
} from '../../features/words/wordsSlice'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { toggleFlashcardsContainer } from '../../features/cards/cardsSlice'
// import { useState } from 'react'

const WordsContainer = () => {
	const router = useRouter()
	const dispatch = useDispatch()
	const { user, isUserLoggedIn } = useUserContext()
	const { user_material_words, user_material_words_pending } = useSelector(
		store => store.words
	)
	// const [userMaterialWords, setUserMaterialWords] = useState()
	// const { isFlashcardsOpen } = useSelector(store => store.cards)
	const materialId = router.query.material
	const userId = user?.id

	const handleDelete = id => {
		dispatch(deleteUserWord(id))
	}

	const showTrash = e => {
		if (e.target.classList.contains('row')) {
			e.target.lastElementChild.style.visibility = 'visible'
		}
		if (e.target.classList.contains('originalWord')) {
			e.target.nextElementSibling.nextElementSibling.style.visibility =
				'visible'
		}
		if (e.target.classList.contains('translatedWord')) {
			e.target.nextElementSibling.style.visibility = 'visible'
		}
	}

	const hideTrash = e => {
		if (e.target.classList.contains('row')) {
			e.target.lastElementChild.style.visibility = 'hidden'
		}
		if (e.target.classList.contains('originalWord')) {
			e.target.nextElementSibling.nextElementSibling.style.visibility = 'hidden'
		}
		if (e.target.classList.contains('translatedWord')) {
			e.target.nextElementSibling.style.visibility = 'hidden'
		}
	}

	useEffect(() => {
		if (isUserLoggedIn) dispatch(getUserMaterialWords({ materialId, userId }))
	}, [
		dispatch,
		isUserLoggedIn,
		materialId,
		userId,
		user_material_words_pending,
	])

	return (
		<div className={styles.wordsContainer}>
			{isUserLoggedIn && user_material_words ? (
				<>
					<h3 className='headline'>Mots</h3>
					<ul>
						{user_material_words.map((words, index) => (
							<li
								key={index}
								className={`${styles.row} row`}
								onMouseEnter={showTrash}
								onMouseLeave={hideTrash}>
								{' '}
								<span className={`${styles.originalWord} originalWord`}>
									{words.word_ru}
								</span>{' '}
								-{' '}
								<span className={`${styles.translatedWord} translatedWord`}>
									{words.word_fr}
								</span>
								<FontAwesomeIcon
									className={styles.trashIcon}
									icon={faTrashAlt}
									onClick={() => handleDelete(words.id)}
								/>
							</li>
						))}
					</ul>
					<button
						onClick={() => dispatch(toggleFlashcardsContainer(true))}
						type='button'
						className={styles.flashcardsBtn}>
						Réviser les mots
					</button>
				</>
			) : (
				<>
					<h4 className='headline'>Créez un compte pour pouvoir :</h4>
					<ul className='lesson__words-list'>
						<li>
							<FontAwesomeIcon icon={faThumbsUp} /> Traduire n&apos;importe quel
							mot du texte en un clique
						</li>
						<li>
							<FontAwesomeIcon icon={faThumbsUp} /> Conserver les mots traduits
							sur cette même page
						</li>
						<li>
							<FontAwesomeIcon icon={faThumbsUp} /> Sauvegarder toutes vos
							traductions dans un dictionnaire personnel lié à votre compte
						</li>
						<li>
							<FontAwesomeIcon icon={faThumbsUp} /> Soutenir notre travail
						</li>
					</ul>
					<Link href='/register'>
						<button type='button' className={`${styles.registerBtn} mainBtn`}>
							S&apos;enregistrer
						</button>
					</Link>
				</>
			)}
		</div>
	)
}

export default WordsContainer
