import axios from 'axios'
import { useState } from 'react'
import { sections } from '../../data/sections'
import styles from '../../styles/admin/Create.module.css'
import dynamic from 'next/dynamic'
import 'suneditor/dist/css/suneditor.min.css' // Import Sun Editor's CSS File

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
	const [formData, setFormData] = useState({
		lang: 'ru',
		section: 'dialogues',
		level: 'débutant',
		title: '',
		description: '',
		img: '',
		audio: '',
		video: '',
		text: '',
		textwithaccents: '',
	})

	const createMaterial = async material => {
		try {
			await axios.post('http://localhost:3000/api/materials', material)
		} catch (error) {
			console.log(error)
		}
	}

	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => {
			return { ...prev, [name]: value }
		})
	}
	const submitMaterial = e => {
		e.preventDefault()
		createMaterial(formData)
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
						value={formData.title}
						placeholder='Title'
						type='text'
						id='title'
						name='title'
					/>

					<input
						onChange={e => handleChange(e)}
						value={formData.description}
						placeholder='Description'
						type='text'
						id='description'
						name='description'
					/>
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
				<div className={styles.text}>
					<SunEditor
						height='350px'
						placeholder='Content'
						setOptions={SunEditorOptions}
					/>
					<SunEditor
						height='350px'
						placeholder='Content accents'
						setOptions={SunEditorOptions}
					/>
					{/* <textarea
						onChange={e => handleChange(e)}
						value={formData.text}
						placeholder='Texte sans accents'
						id='text'
						name='text'
					/>
					<textarea
						onChange={e => handleChange(e)}
						value={formData.textwithaccents}
						placeholder='Texte avec accents'
						id='textwithaccents'
						name='textwithaccents'
					/> */}
				</div>
				<input type='submit' className='mainBtn' value='Envoyer' />
			</form>
		</div>
	)
}

export default Create
