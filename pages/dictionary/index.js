import jwtDecode from 'jwt-decode'
import { supabase } from '../../lib/supabase'
import { useSelector, useDispatch } from 'react-redux'
import { useUserContext } from '../../context/user'
import { useEffect, useState } from 'react'
import {
	getAllUserWords,
	deleteUserWord,
} from '../../features/words/wordsSlice'
import { toggleFlashcardsContainer } from '../../features/cards/cardsSlice'
import Link from 'next/link'
import Head from 'next/head'
import {
	Button,
	Container,
	IconButton,
	Table,
	TableCell,
	TableContainer,
	TableRow,
	Typography,
} from '@mui/material'
import { DeleteOutline } from '@mui/icons-material'
import Image from 'next/image'

const Dictionary = () => {
	const dispatch = useDispatch()
	const { user, isUserLoggedIn } = useUserContext()
	const userId = user?.id
	const {
		user_words,
		user_words_loading,
		user_words_pending,
		user_material_words_pending,
	} = useSelector(store => store.words)
	const [checkedWords, setCheckedWords] = useState([])

	const handleCheck = e => {
		if (e.target.checked) {
			setCheckedWords([...checkedWords, e.target.value])
		} else {
			setCheckedWords(prevCheckedWords =>
				prevCheckedWords.filter(word => word !== e.target.value)
			)
		}
	}

	useEffect(() => {
		if (isUserLoggedIn) dispatch(getAllUserWords(userId))
	}, [
		dispatch,
		isUserLoggedIn,
		userId,
		user_words_pending,
		user_material_words_pending,
	])

	if (user_words_loading) {
		return (
			<div className='loader'>
				<Image
					src='/img/loader.gif'
					width={200}
					height={200}
					alt='loader'></Image>
			</div>
		)
	}

	return (
		<>
			<Head>
				<title>Linguami | Dictionnaire personnel</title>
			</Head>
			<Container sx={{ margin: '10rem auto' }} maxWidth='lg'>
				{user_words.length > 0 && (
					<Button
						sx={{
							backgroundColor: 'clrBtn1',
							display: 'block',
							margin: '2rem auto',
							width: '175px',
						}}
						variant='contained'
						onClick={() => dispatch(toggleFlashcardsContainer(true))}>
						Réviser les mots
					</Button>
				)}
				<TableContainer>
					<Table>
						{user_words.length > 0 ? (
							user_words.map((word, index) => (
								<tbody key={index}>
									<TableRow>
										<TableCell>
											<Typography
												sx={{ fontWeight: '600' }}
												variant='subtitle1'>
												{word.word_ru}
											</Typography>
											<Typography variant='subtitle1'>
												{word.word_fr}
											</Typography>
										</TableCell>
										<TableCell>{word.word_sentence}</TableCell>
										<TableCell>
											<IconButton
												onClick={() => dispatch(deleteUserWord(word.id))}>
												<DeleteOutline />
											</IconButton>
										</TableCell>
									</TableRow>
								</tbody>
							))
						) : (
							<>
								<Typography variant='subtitle1'>
									Vous n&apos;avez pas encore de mots dans votre dictionnaire.
									Choisissez un materiel à étudier, cliquez sur un mot du texte
									puis sur sa traduction afin de l&apos;ajouter à votre
									dictionnaire.
								</Typography>
								<Link href='materials'>
									<Button variant='contained'>Commencer</Button>
								</Link>
							</>
						)}
					</Table>
				</TableContainer>
			</Container>
		</>
	)
}

export const getServerSideProps = async ({ req }) => {
	if (req.cookies['sb-access-token']) {
		const decodedToken = jwtDecode(req.cookies['sb-access-token'])

		const { data: user, error } = await supabase
			.from('users_profile')
			.select('*')
			.eq('id', decodedToken.sub)
			.single()




		return {
			props: user,
		}
	}

	return {
		redirect: {
			destination: '/',
			permanent: false,
		},
	}

}

export default Dictionary
