import { supabase } from '../../lib/supabase'
import jwtDecode from 'jwt-decode'
import { useState } from 'react'
import styles from '../../styles/admin/Create.module.css'
import { useDispatch } from 'react-redux'
import { postPost } from '../../features/createMaterial/createMaterialSlice'

const CreatePost = () => {
	const dispatch = useDispatch()
	const [formData, setFormData] = useState({
		lang: 'ru',
		title: '',
		img: '',
		content: '',
	})

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => {
			return { ...prev, [name]: value }
		})
	}

	const submitMaterial = e => {
		e.preventDefault()
		formData.content = formData.content.replace(/(\r\n|\n|\r)/gm, '<br>')

		dispatch(postPost(formData))
	}

	return (
		<div className='wrapper-large'>
			<h2 className={styles.title}>Créer un post</h2>
			<form onSubmit={submitMaterial} className={styles.form}>
				<div className={styles.optionsContainer}>
					<select
						onChange={e => handleChange(e)}
						value={formData.lang}
						name='lang'
						id='lang'>
						<option value='ru'>Russe</option>
						<option value='fr'>Français</option>
					</select>
					<input
						onChange={e => handleChange(e)}
						value={formData.title}
						placeholder='Title'
						type='text'
						id='title'
						name='title'
					/>
					<input
						onChange={e => handleChange(e)}
						value={formData.img}
						placeholder='Image'
						type='text'
						id='img'
						name='img'
					/>
				</div>
				<div className={styles.text}>
					<textarea
						name='description'
						value={formData.description}
						onChange={e => handleChange(e)}
						placeholder='Description'
					/>
					<textarea
						name='content'
						value={formData.content}
						onChange={e => handleChange(e)}
						placeholder='Content'
					/>
				</div>
				<input type='submit' className='mainBtn' value='Envoyer' />
			</form>
		</div>
	)
}

export const getServerSideProps = async ({ req }) => {
	if (req.cookies['sb-access-token']) {
		const decodedToken = jwtDecode(req.cookies['sb-access-token'])

		const { data: user, error } = await supabase
			.from('users')
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

export default CreatePost
