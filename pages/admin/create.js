import { supabase } from '../../lib/supabase'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Container, Stack } from '@mui/material'
import { CreatePostForm, CreateMaterialForm } from '../../components'
import {
	createContent,
	updateContent,
	toggleContentType,
} from '../../features/content/contentSlice'
import { useRouter } from 'next/router'
import { materialData, postData } from '../../utils/constants'
import { createServerClient } from '@supabase/ssr'

const CreateMaterial = () => {
	const [formData, setFormData] = useState(materialData)
	const [files, setFiles] = useState([])

	const router = useRouter()
	const dispatch = useDispatch()
	const {
		contentType,
		editingContent,
		isEditingContent,
		create_content_error,
	} = useSelector(store => store.content)

	const toggleContent = () => {
		dispatch(
			toggleContentType(contentType === 'materials' ? 'posts' : 'materials')
		)
		setFormData(contentType === 'materials' ? postData : materialData)
	}

	useEffect(() => {
		if (!create_content_error)
			setFormData(contentType === 'materials' ? materialData : postData)
	}, [create_content_error, contentType])

	const handleChange = e => {
		let { name, value } = e.target

		if (name === 'image' || name === 'audio') {
			const file = e.target.files[0]
			value = file.name

			setFiles(prev => {
				return [...prev, { file, fileName: value, fileType: name }]
			})
		}

		setFormData(prev => {
			return { ...prev, [name]: value }
		})
	}

	const submitContent = async e => {
		e.preventDefault()

		try {
			let cleanedFormData = { ...formData }

			// Pour les materials (pas les posts), toujours convertir les retours à la ligne en <br>
			if (contentType !== 'posts') {
				cleanedFormData = {
					...formData,
					body: formData.body.replace(/(\r\n|\n|\r)/gm, '<br>'),
					body_accents: formData.body_accents.replace(/(\r\n|\n|\r)/gm, '<br>'),
				}
			}

			if (!isEditingContent && contentType !== 'posts') {
				await dispatch(
					createContent({ content: cleanedFormData, contentType, files })
				).unwrap()
			} else if (!isEditingContent && contentType === 'posts') {
				await dispatch(
					createContent({ content: formData, contentType })
				).unwrap()
			} else if (isEditingContent) {
				await dispatch(
					updateContent({ content: cleanedFormData, contentType })
				).unwrap()
			}

			router.back()
		} catch (err) {
			console.error('Erreur lors de l envoi du contenu')
		}
	}

	useEffect(() => {
		if (Object.keys(editingContent).length > 0) {
			// Convertir les <br> en retours à la ligne pour l'édition
			const formattedContent = {
				...editingContent,
			}

			if (contentType !== 'posts' && editingContent.body) {
				formattedContent.body = editingContent.body.replace(/<br>/g, '\n')
				formattedContent.body_accents =
					editingContent.body_accents?.replace(/<br>/g, '\n') || ''
			}

			setFormData(formattedContent)
		}
	}, [editingContent, contentType])

	return (
		<Container sx={{ margin: '5rem auto' }}>
			<Stack direction='row' mb={4} gap={2} justifyContent='space-between'>
				{!isEditingContent && (
					<Button onClick={toggleContent} variant='contained'>
						Create {contentType === 'materials' ? 'posts' : 'materials'}
					</Button>
				)}
			</Stack>
			<form onSubmit={submitContent}>
				<Button
					type='submit'
					variant='contained'
					size='large'
					sx={{ display: 'block', margin: '0 auto', marginBottom: '2rem' }}>
					{isEditingContent ? 'EDIT' : 'CREATE'}
				</Button>
				{contentType === 'posts' ? (
					<>
						<CreatePostForm formData={formData} handleChange={handleChange} />
					</>
				) : (
					<CreateMaterialForm formData={formData} handleChange={handleChange} />
				)}
			</form>
		</Container>
	)
}

export const getServerSideProps = async ({ req, res }) => {
	// Créer un client Supabase pour le serveur
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				get(name) {
					return req.cookies[name]
				},
				set(name, value, options) {
					res.setHeader('Set-Cookie', `${name}=${value}; Path=/; ${options}`)
				},
				remove(name, options) {
					res.setHeader('Set-Cookie', `${name}=; Path=/; Max-Age=0`)
				},
			},
		}
	)

	// Récupérer l'utilisateur connecté
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()

	if (!user || authError) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}

	// Récupérer le profil utilisateur
	const { data: userProfile, error } = await supabase
		.from('users_profile')
		.select('*')
		.eq('id', user.id)
		.single()

	if (error || userProfile?.role !== 'admin') {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}

	return {
		props: { user: userProfile },
	}
}

export default CreateMaterial
