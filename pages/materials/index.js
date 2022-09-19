import Link from 'next/link'
import Image from 'next/image'
import { materials } from '../../data/materials'
import styles from '../../styles/materials/Materials.module.css'

const Material = () => {
	const items = materials.map(material => {
		for (const [key, value] of Object.entries(material)) {
			return (
				<>
					<h3>{key}</h3>
					<div className={styles.materialsContainer}>
						{value.map((item, index) => {
							return (
								<div className={styles.materials} key={index}>
									<Link href={`/materials/${item.param}`}>
										<Image
											src={`https://linguami.s3.eu-west-3.amazonaws.com/images${item.img}`}
											alt={item.title}
											width={155}
											height={155}
										/>
									</Link>
									<Link href={`/materials/${item.param}`}>
										<h4 className={styles.materialsTitle}>{item.title}</h4>
									</Link>

									<p>{item.text}</p>
								</div>
							)
						})}
					</div>

					{/* <hr className='hr' /> */}
				</>
			)
		}
	})

	return <div className={styles.container}>{items}</div>
}

export default Material
