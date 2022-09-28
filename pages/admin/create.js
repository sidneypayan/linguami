import { useState } from 'react'
import { sections } from '../../data/sections'
import styles from '../../styles/admin/Create.module.css'
import dynamic from 'next/dynamic'
import 'suneditor/dist/css/suneditor.min.css' // Import Sun Editor's CSS File
import { useDispatch } from 'react-redux'
import { postMaterial } from '../../features/createMaterial/createMaterialSlice'

const SunEditor = dynamic(() => import('suneditor-react'), {
	ssr: false,
})

const SunEditorOptions = {
	buttonList: [
		['undo'],
		['redo'],
		['bold', 'underline', 'italic'],
		['outdent', 'indent'],
		['formatBlock', 'align'],
		['fullScreen'],
		['blockquote'],
		['list'],
		['image', 'link', 'video', 'audio'],
		['preview'],
	],
}

const Create = () => {
	const dispatch = useDispatch()
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

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => {
			return { ...prev, [name]: value }
		})
	}

	const submitMaterial = e => {
		e.preventDefault()
		// console.log(formData)
		dispatch(postMaterial(formData))
	}

	return (
		<div className='wrapper-large'>
			<h2 className={styles.title}>Créer un materiel</h2>
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
					<select
						onChange={e => handleChange(e)}
						value={formData.section}
						name='section'
						id='section'>
						{sections.map((section, index) => (
							<option value={section} key={index}>
								{section}
							</option>
						))}
					</select>
					<select
						onChange={e => handleChange(e)}
						value={formData.level}
						name='level'
						id='level'>
						<option value='débutant'>débutant</option>
						<option value='intermediaire'>intermediaire</option>
						<option value='avancé'>avancé</option>
					</select>
				</div>
				<div className={styles.titleContainer}>
					<input
						onChange={e => handleChange(e)}
						value={formData.title_ru}
						placeholder='Title ru'
						type='text'
						id='title_ru'
						name='title_ru'
					/>
					<input
						onChange={e => handleChange(e)}
						value={formData.title_fr}
						placeholder='Title fr'
						type='text'
						id='title_fr'
						name='title_fr'
					/>

					{/* <input
						onChange={e => handleChange(e)}
						value={formData.description}
						placeholder='Description'
						type='text'
						id='description'
						name='description'
					/> */}
				</div>
				<div className={styles.media}>
					<input
						onChange={e => handleChange(e)}
						value={formData.img}
						placeholder='Image'
						type='text'
						id='img'
						name='img'
					/>
					{/* </div>
				<div className={styles.level}> */}
					<input
						onChange={e => handleChange(e)}
						value={formData.audio}
						placeholder='Audio'
						type='text'
						id='audio'
						name='audio'
					/>
					{/* </div>
				<div className={styles.level}> */}
					<input
						onChange={e => handleChange(e)}
						value={formData.video}
						placeholder='Video'
						type='text'
						id='video'
						name='video'
					/>
				</div>
				<div className={styles.media}>
					<input
						onChange={e => handleChange(e)}
						value={formData.bookName}
						placeholder='Book Name'
						type='text'
						id='book_name'
						name='book_name'
					/>
					{/* </div>
				<div className={styles.level}> */}
					<input
						onChange={e => handleChange(e)}
						value={formData.chapter}
						placeholder='Chapter'
						type='text'
						id='chapter'
						name='chapter'
					/>
				</div>
				<div className={styles.text}>
					<textarea
						name='content'
						value={formData.content}
						onChange={e => handleChange(e)}
						placeholder='Content'
					/>
					<textarea
						name='content_accents'
						value={formData.content_accents}
						onChange={e => handleChange(e)}
						placeholder='Content with accents'
					/>
					{/* <SunEditor
						onChange={handleSunEditor}
						name='text'
						height='350px'
						placeholder='Content'
						setOptions={SunEditorOptions}
						value={formData.text}
					/>
					<SunEditor
						onChange={e => handleSunEditor(e)}
						name='textwithaccents'
						height='350px'
						placeholder='Content accents'
						setOptions={SunEditorOptions}
						value={formData.textwithaccents}
					/> */}
				</div>
				<input type='submit' className='mainBtn' value='Envoyer' />
			</form>
		</div>
	)
}

export default Create
