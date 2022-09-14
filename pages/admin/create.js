import { sections } from '../../data/sections'
import styles from '../../styles/admin/Create.module.css'

const Create = () => {
	return (
		<div className='wrapper-large'>
			<h2 className={styles.title}>Créer un materiel</h2>
			<form className={styles.form}>
				<div className={styles.optionsContainer}>
					<select name='lang' id='lang' value='value'>
						<option value='ru'>Russe</option>
						<option value='fr'>Français</option>
					</select>
					<select name='section' id='section' value='value'>
						{sections.map((section, index) => (
							<option value={section} key={index}>
								{section}
							</option>
						))}
					</select>
					<select name='level' id='level' value='value'>
						<option value='débutant'>débutant</option>
						<option value='intermediaire'>intermediaire</option>
						<option value='avancé'>avancé</option>
					</select>
				</div>
				<div className={styles.titleContainer}>
					<input placeholder='Title' type='text' id='title' name='title' />

					<input
						placeholder='Description'
						type='text'
						id='description'
						name='description'
					/>
				</div>
				<div className={styles.media}>
					<input placeholder='Image' type='text' id='img' name='img' />
					{/* </div>
				<div className={styles.level}> */}
					<input placeholder='Audio' type='text' id='audio' name='audio' />
					{/* </div>
				<div className={styles.level}> */}
					<input placeholder='Video' type='text' id='video' name='video' />
				</div>
				<div className={styles.text}>
					<textarea placeholder='Texte sans accents' id='text' name='text' />
					<textarea
						placeholder='Texte avec accents'
						id='textwithaccents'
						name='textwithaccents'
					/>
				</div>
			</form>
		</div>
	)
}

export default Create
