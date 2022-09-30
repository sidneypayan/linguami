import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { useUserContext } from '../../context/user'
import styles from '../../styles/materials/WordsContainer.module.css'

const WordsContainer = () => {
	const { isUserLoggedIn } = useUserContext()
	const { user_material_words } = useSelector(store => store.words)
	return (
		<div className={styles.wordsContainer}>
			{isUserLoggedIn ? (
				<>
					<h3 className='headline'>Mots</h3>
					<ul>
						{user_material_words.map((words, index) => (
							<li key={index}>
								{' '}
								<span className={styles.originalWord}>
									{words.originalWord}
								</span>{' '}
								-{' '}
								<span className={styles.translatedWord}>
									{words.translatedWord}
								</span>
								<FontAwesomeIcon icon={faTrashAlt} />
							</li>
						))}
						<li></li>
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
