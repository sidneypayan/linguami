import useTranslation from 'next-translate/useTranslation'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
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
import {
	Button,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
} from '@mui/material'
import { ThumbUpOffAlt } from '@mui/icons-material'
import Link from 'next/link'

const WordsContainer = () => {
	const { t } = useTranslation('register')
	const router = useRouter()
	const dispatch = useDispatch()
	const { user, isUserLoggedIn } = useUserContext()
	const { user_material_words, user_material_words_pending } = useSelector(
		store => store.words
	)

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
		<>
			{isUserLoggedIn && user_material_words ? (
				<>
					<Typography variant='h5' align='center'>
						Vocabulaire
					</Typography>
					<List sx={{ margin: '2rem auto' }}>
						{user_material_words.map((words, index) => (
							<ListItem
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
							</ListItem>
						))}
					</List>
					<Button
						variant='contained'
						size='large'
						sx={{
							display: 'block',
							margin: '2rem auto',
							backgroundColor: 'clrPrimary1',
						}}
						onClick={() => dispatch(toggleFlashcardsContainer(true))}>
						Réviser les mots
					</Button>
				</>
			) : (
				<>
					<Typography
						variant='h5'
						align='center'
						sx={{
							marginTop: {
								md: '5rem',
							},
						}}>
						Créez un compte pour pouvoir :
					</Typography>

					<List sx={{ margin: '2rem auto' }}>
						<ListItem disablePadding>
							<ListItemIcon>
								<ThumbUpOffAlt />
							</ListItemIcon>
							<ListItemText
								primary="Traduire n'importe quel
							mot du texte en un clique"
							/>
						</ListItem>

						<ListItem disablePadding>
							<ListItemIcon>
								<ThumbUpOffAlt />
							</ListItemIcon>
							<ListItemText
								primary='Conserver le vocabulaire de ce texte
                  sur cette même page'
							/>
						</ListItem>

						<ListItem disablePadding>
							<ListItemIcon>
								<ThumbUpOffAlt />
							</ListItemIcon>
							<ListItemText
								primary='Sauvegarder toutes vos
                  traductions dans un dictionnaire personnel'
							/>
						</ListItem>
						<ListItem disablePadding>
							<ListItemIcon>
								<ThumbUpOffAlt />
							</ListItemIcon>
							<ListItemText primary='Réviser votre vocabulaire avec notre outil flashcards' />
						</ListItem>

						<ListItem disablePadding>
							<ListItemIcon>
								<ThumbUpOffAlt />
							</ListItemIcon>
							<ListItemText primary='Soutenir notre travail' />
						</ListItem>
					</List>
					<Link href='/signin'>
						<Button
							variant='contained'
							sx={{
								display: 'block',
								margin: '2rem auto',
								width: '150px',
								backgroundColor: 'clrPrimary1',
							}}
							size='large'
						>
							{t('signinBtn')}
						</Button>
					</Link>
				</>
			)}
		</>
	)
}

export default WordsContainer
