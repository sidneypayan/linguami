import { supabase } from '../../lib/supabase'
import jwtDecode from 'jwt-decode'
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

	// const submitContent = e => {
	// 	e.preventDefault()
	// 	if (!isEditingContent && contentType !== 'posts') {
	// 		formData.body = formData.body.replace(/(\r\n|\n|\r)/gm, '<br>')
	// 		formData.body_accents = formData.body_accents.replace(
	// 			/(\r\n|\n|\r)/gm,
	// 			'<br>'
	// 		)
	// 		return dispatch(createContent({ content: formData, contentType, files }))
	// 	}

	// 	if (!isEditingContent && contentType === 'posts')
	// 		return dispatch(createContent({ content: formData, contentType }))

	// 	if (isEditingContent)
	// 		return dispatch(updateContent({ content: formData, contentType }))
	// 	router.back()
	// }

	const submitContent = async e => {
		e.preventDefault()

		try {
			const cleanedFormData = {
				...formData,
				body: formData.body.replace(/(\r\n|\n|\r)/gm, '<br>'),
				body_accents: formData.body_accents.replace(/(\r\n|\n|\r)/gm, '<br>'),
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
					updateContent({ content: formData, contentType })
				).unwrap()
			}

			router.back()
		} catch (err) {
			console.error('Erreur lors de l’envoi du contenu :', err)
		}
	}

	useEffect(() => {
		if (Object.keys(editingContent).length > 0) {
			setFormData(editingContent)
		}
	}, [editingContent])

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

export const getServerSideProps = async ({ req }) => {
	if (req.cookies['sb-access-token']) {
		const decodedToken = jwtDecode(req.cookies['sb-access-token'])

		const { data: user, error } = await supabase
			.from('users_profile')
			.select('*')
			.eq('id', decodedToken.sub)
			.single()

		if (user.role !== 'admin') {
			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
			}
		}
	} else {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}

	return {
		props: { user: 'user' },
	}
}

export default CreateMaterial
