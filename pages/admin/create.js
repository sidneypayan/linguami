import { sections } from '../../data/sections'
import styles from '../../styles/admin/Create.module.css'

const Create = () => {
	return (
		<div className='wrapper-large'>
			<form className={styles.form}>
				<div className={styles.lang}>
					<select name='lang' id='lang' value='value'>
						<option value='ru'>Russe</option>
						<option value='fr'>Français</option>
					</select>
				</div>
				<div className={styles.section}>
					<select name='section' id='section' value='value'>
						{sections.map((section, index) => (
							<option value={section} key={index}>
								{section}
							</option>
						))}
					</select>
				</div>
				<div className={styles.level}>
					<select name='level' id='level' value='value'>
						<option value='débutant'>débutant</option>
						<option value='intermediaire'>intermediaire</option>
						<option value='avancé'>avancé</option>
					</select>
				</div>
				<div className={styles.level}>
					<input placeholder='Title' type='text' id='title' name='title' />
				</div>
				<div className={styles.level} createDescription>
					<input
						placeholder='Description'
						type='text'
						id='description'
						name='description'
					/>
				</div>
				<div className={styles.level}>
					<input placeholder='Image' type='text' id='img' name='img' />
				</div>
				<div className={styles.level}>
					<input placeholder='Audio' type='text' id='audio' name='audio' />
				</div>
				<div className={styles.level}>
					<input placeholder='Video' type='text' id='video' name='video' />
				</div>
			</form>
		</div>
	)
}

export default Create
