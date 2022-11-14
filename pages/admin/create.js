import { supabase } from '../../lib/supabase'
import jwtDecode from 'jwt-decode'
import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import {
	createContent,
	updateContent,
} from '../../features/createContent/createContentSlice'
import { Button, Container, Stack } from '@mui/material'
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

	const handleChange = e => {
		const { name, value } = e.target

		setFormData(prev => {
			return { ...prev, [name]: value }
		})
	}

	const submitContent = e => {
		console.log('ok')
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
			setFormData(materialData)
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
			<Stack direction='row' mb={4} gap={2} justifyContent='space-between'>
				<Button
					onClick={() =>
						dispatch(
							toggleContentType(
								contentType === 'materials' ? 'posts' : 'materials'
							)
						)
					}
					variant='contained'>
					Create {contentType === 'materials' ? 'posts' : 'materials'}
				</Button>
			</Stack>
			<form onSubmit={submitContent}>
				<Button
					type='submit'
					variant='contained'
					size='large'
					sx={{ display: 'block', margin: '0 auto', marginBottom: '2rem' }}>
					{edit ? 'EDIT' : 'CREATE'}
				</Button>
				{contentType === 'posts' ? (
					<CreatePostForm
						formData={formData}
						handleChange={handleChange}
						setBodyValue={setBodyValue}
					/>
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
