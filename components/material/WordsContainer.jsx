import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { useUserContext } from '../../context/user'
import styles from '../../styles/materials/WordsContainer.module.css'
import { getUserWords, deleteUserWord } from '../../features/words/wordsSlice'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const WordsContainer = () => {
	const router = useRouter()
	const dispatch = useDispatch()
	const { user, isUserLoggedIn } = useUserContext()
	const { user_material_words } = useSelector(store => store.words)
	const materialId = router.query.material
	const userId = user?.id

	const handleDelete = id => {
		dispatch(deleteUserWord(id))
	}

	useEffect(() => {
		dispatch(getUserWords({ materialId, userId }))
	}, [])

	return (
		<div className={styles.wordsContainer}>
			{isUserLoggedIn ? (
				<>
					<h3 className='headline'>Mots</h3>
					<ul>
						{user_material_words.map((words, index) => (
							<li key={index} className={styles.row}>
								{' '}
								<span className={styles.originalWord}>
									{words.word_ru}
								</span> -{' '}
								<span className={styles.translatedWord}>{words.word_fr}</span>
								<FontAwesomeIcon
									className={styles.trashIcon}
									icon={faTrashAlt}
									onClick={() => handleDelete(words.id)}
								/>
							</li>
						))}
					</ul>
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
