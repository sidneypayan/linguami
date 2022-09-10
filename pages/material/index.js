import Link from 'next/link'
import Image from 'next/image'
import { ressources } from '../../data/ressources'
import styles from '../../styles/Material.module.css'

const Material = () => {
	const items = ressources.map(ressource => {
		for (const [key, value] of Object.entries(ressource)) {
			return (
				<>
					<h3>{key}</h3>
					<div className={styles.materialContainer}>
						{value.map((item, index) => {
							return (
								<div className={styles.material} key={index}>
									<Image
										src={`https://linguami.s3.eu-west-3.amazonaws.com/images${item.img}`}
										alt={item.title}
										width={155}
										height={155}
									/>
									<h4 className={styles.materialTitle}>{item.title}</h4>
									<p>{item.text}</p>
								</div>
							)
						})}
					</div>
					<hr className='hr' />
				</>
			)
		}
	})

	return <div className={styles.container}>{items}</div>
}

export default Material
