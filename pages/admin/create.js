import { supabase } from '../../lib/supabase'
import jwtDecode from 'jwt-decode'
import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import {
	createContent,
	updateContent,
} from '../../features/createContent/createContentSlice'
import { Button, Container } from '@mui/material'
import { CreatePostForm, CreateMaterialForm } from '../../components'
import { postData, materialData } from '../../utils/constants'
import { toggleContentType } from '../../features/createContent/createContentSlice'
import { useRouter } from 'next/router'

const CreateMaterial = () => {
	const router = useRouter()
	const dispatch = useDispatch()
	const { contentType, contentEdit, edit } = useSelector(
		store => store.createContent
	)

	const [formData, setFormData] = useState(materialData)
	const [bodyValue, setBodyValue] = useState('')

	console.log(formData)

	const handleChange = e => {
		const { name, value } = e.target

		setFormData(prev => {
			return { ...prev, [name]: value }
		})
	}

	const submitContent = e => {
		e.preventDefault()
		if (!edit && contentType !== 'posts') {
			formData.body = formData.body.replace(/(\r\n|\n|\r)/gm, '<br>')
			formData.body_accents = formData.body_accents.replace(
				/(\r\n|\n|\r)/gm,
				'<br>'
			)
			dispatch(createContent(formData, contentType))
		}

		if (!edit) {
			dispatch(createContent({ content: formData, contentType }))
		} else {
			dispatch(updateContent({ content: formData, contentType }))
			router.back()
		}
	}

	useEffect(() => {
		setFormData(prev => {
			return { ...prev, body: bodyValue }
		})
	}, [bodyValue])

	useEffect(() => {
		if (Object.keys(contentEdit).length > 0) {
			return setFormData(contentEdit)
		}

		if (contentType === 'materials') {
			setFormData(materialData)
		}

		if (contentType === 'posts') {
			setFormData(postData)
		}
	}, [contentType, contentEdit])

	return (
		<Container sx={{ margin: '5rem auto' }}>
			<Button
				onClick={() =>
					dispatch(
						toggleContentType(
							contentType === 'materials' ? 'posts' : 'materials'
						)
					)
				}
				variant='contained'
				sx={{ display: 'block', margin: '2rem auto' }}>
				Create {contentType === 'materials' ? 'posts' : 'materials'}
			</Button>
			<form onSubmit={submitContent}>
				{contentType === 'posts' ? (
					<CreatePostForm
						formData={formData}
						handleChange={handleChange}
						setBodyValue={setBodyValue}
					/>
				) : (
					<CreateMaterialForm formData={formData} handleChange={handleChange} />
				)}
				<Button
					type='submit'
					variant='contained'
					size='large'
					sx={{ display: 'block', margin: '4rem auto' }}>
					Envoyer
				</Button>
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
