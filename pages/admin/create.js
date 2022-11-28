import { supabase } from '../../lib/supabase'
import jwtDecode from 'jwt-decode'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Container, Stack } from '@mui/material'
import {
	CreatePostForm,
	CreateMaterialForm,
	TextEditor,
} from '../../components'
import {
	createContent,
	updateContent,
	toggleContentType,
} from '../../features/content/contentSlice'
import { useRouter } from 'next/router'
import { materialData, postData } from '../../utils/constants'

const CreateMaterial = () => {
	const [formData, setFormData] = useState(materialData)
	// const [value, setValue] = useState('')

	const router = useRouter()
	const dispatch = useDispatch()
	const { contentType, contentEdit, edit, create_content_error } = useSelector(
		store => store.content
	)

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
			return dispatch(createContent({ content: formData, contentType }))
		}

		if (!edit && contentType === 'posts')
			return dispatch(createContent({ content: formData, contentType }))

		if (edit) return dispatch(updateContent({ content: formData, contentType }))
		router.back()
	}

	// useEffect(() => {
	// 	setFormData(prev => {
	// 		return { ...prev, body: value }
	// 	})
	// }, [value])

	useEffect(() => {
		if (Object.keys(contentEdit).length > 0) {
			setFormData(contentEdit)
			// setValue(contentEdit.body)
		}
	}, [contentEdit])

	return (
		<Container sx={{ margin: '5rem auto' }}>
			<Stack direction='row' mb={4} gap={2} justifyContent='space-between'>
				<Button onClick={toggleContent} variant='contained'>
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
					<>
						<CreatePostForm formData={formData} handleChange={handleChange} />
						{/* <Box>
							<TextEditor value={value} setValue={setValue} />
						</Box> */}
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
