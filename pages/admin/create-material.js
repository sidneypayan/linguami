import { supabase } from '../../lib/supabase'
import jwtDecode from 'jwt-decode'
import { useEffect, useState } from 'react'
import { allSections } from '../../data/sections'
import styles from '../../styles/admin/Create.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { postMaterial } from '../../features/createMaterial/createMaterialSlice'
import { updateMaterial } from '../../features/createMaterial/createMaterialSlice'
import TextEditor from '../../components/TextEditor'

const CreateMaterial = () => {
	const dispatch = useDispatch()
	const { materialEdit, edit } = useSelector(store => store.createMaterial)

	const [contentValue, setContentValue] = useState('')
	const [contentAccentsValue, setContentAccentsValue] = useState('')

	const [formData, setFormData] = useState({
		lang: 'ru',
		section: 'dialogues',
		book_name: '',
		chapter: '',
		level: 'débutant',
		title_ru: '',
		title_fr: '',
		img: '',
		audio: '',
		video: '',
		content: '',
		content_accents: '',
	})

	console.log(formData)

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => {
			return { ...prev, [name]: value }
		})
	}

	const submitMaterial = e => {
		e.preventDefault()

		if (!edit) {
			formData.content = formData.content.replace(/(\r\n|\n|\r)/gm, '<br>')
			formData.content_accents = formData.content_accents.replace(
				/(\r\n|\n|\r)/gm,
				'<br>'
			)
			dispatch(postMaterial(formData))
		} else {
			dispatch(updateMaterial(formData))
		}
	}

	useEffect(() => {
		if (Object.keys(materialEdit).length > 0) {
			setFormData(materialEdit)
		}
	}, [materialEdit])

	useEffect(() => {
		setFormData(prevData => ({ ...prevData, content: contentValue }))
	}, [contentValue])
	useEffect(() => {
		setFormData(prevData => ({
			...prevData,
			content_accents: contentAccentsValue,
		}))
	}, [contentAccentsValue])

	return (
		<div className='wrapper-large'>
			<h2 className={styles.title}>Créer un materiel</h2>
			<form onSubmit={submitMaterial} className={styles.form}>
				<div className={styles.optionsContainer}>
					<select
						onChange={e => handleChange(e)}
						value={formData.lang ?? ''}
						name='lang'
						id='lang'>
						<option value='ru'>Russe</option>
						<option value='fr'>Français</option>
					</select>
					<select
						onChange={e => handleChange(e)}
						value={formData.section ?? ''}
						name='section'
						id='section'>
						{allSections.map((section, index) => (
							<option value={section} key={index}>
								{section}
							</option>
						))}
					</select>
					<select
						onChange={e => handleChange(e)}
						value={formData.level ?? ''}
						name='level'
						id='level'>
						<option value='débutant'>débutant</option>
						<option value='intermédiaire'>intermediaire</option>
						<option value='avancé'>avancé</option>
					</select>
				</div>
				<div className={styles.titleContainer}>
					<input
						onChange={e => handleChange(e)}
						value={formData.title_ru ?? ''}
						placeholder='Title ru'
						type='text'
						id='title_ru'
						name='title_ru'
					/>
					<input
						onChange={e => handleChange(e)}
						value={formData.title_fr ?? ''}
						placeholder='Title fr'
						type='text'
						id='title_fr'
						name='title_fr'
					/>
				</div>
				<div className={styles.media}>
					<input
						onChange={e => handleChange(e)}
						value={formData.img ?? ''}
						placeholder='Image'
						type='text'
						id='img'
						name='img'
					/>

					<input
						onChange={e => handleChange(e)}
						value={formData.audio ?? ''}
						placeholder='Audio'
						type='text'
						id='audio'
						name='audio'
					/>

					<input
						onChange={e => handleChange(e)}
						value={formData.video ?? ''}
						placeholder='Video'
						type='text'
						id='video'
						name='video'
					/>
				</div>
				<div className={styles.media}>
					<input
						onChange={e => handleChange(e)}
						value={formData.book_name ?? ''}
						placeholder='Book Name'
						type='text'
						id='book_name'
						name='book_name'
					/>

					<input
						onChange={e => handleChange(e)}
						value={formData.chapter ?? ''}
						placeholder='Chapter'
						type='text'
						id='chapter'
						name='chapter'
					/>
				</div>
				{/* <div className={styles.text}>
					<textarea
						name='content'
						value={formData.content ?? ''}
						onChange={e => handleChange(e)}
						placeholder='Content'
					/>
					<textarea
						name='content_accents'
						value={formData.content_accents ?? ''}
						onChange={e => handleChange(e)}
						placeholder='Content with accents'
					/>
				</div> */}
				<div className={styles.text}>
					<TextEditor
						value={contentValue}
						handleContentChange={setContentValue}
					/>
					<TextEditor
						value={contentAccentsValue}
						handleContentChange={setContentAccentsValue}
					/>
					{/* <ReactQuill
						style={{
							flexBasis: '50%',
							height: '500px',
							backgroundColor: 'white',
						}}
						name='content_accents'
						theme='snow'
						value={contentAccentsValue}
						onChange={setContentAccentsValue}
					/> */}
				</div>
				<input
					style={{ margin: '4rem auto', width: '25%' }}
					type='submit'
					className='mainBtn'
					value={`${edit ? 'Editer' : 'Envoyer'} `}
				/>
			</form>
		</div>
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
