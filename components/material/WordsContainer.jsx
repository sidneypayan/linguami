import React from 'react'
import useTranslation from 'next-translate/useTranslation'
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
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
} from '@mui/material'
import { ThumbUpOffAlt, DeleteOutline } from '@mui/icons-material'
import Link from 'next/link'
import { primaryButton } from '../../utils/buttonStyles'

const WordsContainer = () => {
	const { t } = useTranslation('words')
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
					<button
						className={styles.practiceBtn}
						onClick={() => dispatch(toggleFlashcardsContainer(true))}>
						{t('repeatwords')}
					</button>
					<List sx={{ margin: '2rem auto' }}>
						{user_material_words.map((words, index) => (
							<ListItem
								key={index}
								sx={{
									width: '100%',
									justifyContent: 'center',
									display: 'flex',
									gap: '0.5rem',
									alignItems: 'center',
								}}>
								<span className={styles.originalWord}>{words.word_ru}</span> -{' '}
								<span>{words.word_fr}</span>
								<IconButton
									sx={{
										marginLeft: 'auto',
										// Toujours visible sur mobile, visible au hover sur desktop
										opacity: { xs: 1, md: 0 },
										'&:hover': {
											opacity: 1,
										},
										transition: 'opacity 0.3s ease',
									}}
									onClick={() => handleDelete(words.id)}>
									<DeleteOutline />
								</IconButton>
							</ListItem>
						))}
					</List>
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
						{t('createaccount')}
					</Typography>

					<List sx={{ margin: '2rem auto' }}>
						<ListItem disablePadding>
							<ListItemIcon>
								<ThumbUpOffAlt />
							</ListItemIcon>
							<ListItemText primary={t('translatewords')} />
						</ListItem>

						<ListItem disablePadding>
							<ListItemIcon>
								<ThumbUpOffAlt />
							</ListItemIcon>
							<ListItemText primary={t('savewords')} />
						</ListItem>
						<ListItem disablePadding>
							<ListItemIcon>
								<ThumbUpOffAlt />
							</ListItemIcon>
							<ListItemText primary={t('flashcards')} />
						</ListItem>

						<ListItem disablePadding>
							<ListItemIcon>
								<ThumbUpOffAlt />
							</ListItemIcon>
							<ListItemText primary={t('supportus')} />
						</ListItem>
					</List>
					<Link href='/signin'>
						<Button
							variant='contained'
							sx={{
								...primaryButton,
								display: 'block',
								margin: '2rem auto',
								width: '250px',
							}}
							size='large'>
							{t('noaccount')}
						</Button>
					</Link>
				</>
			)}
		</>
	)
}

// Mémoïser le composant pour éviter re-renders
export default React.memo(WordsContainer)
