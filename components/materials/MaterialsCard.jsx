import styles from '../../styles/materials/Materials.module.css'
import Link from 'next/link'
import Image from 'next/image'

const MaterialsCard = ({ material }) => {
	return (
		<div className={styles.materials}>
			<div className={styles.imgContainer}>
				<Link href={`/materials/${material.param}`}>
					<Image
						src={`/img/${material.img}`}
						layout='fill'
						objectFit='cover'
						quality={100}
						alt={material.title}
						loading='eager'
					/>
				</Link>
			</div>

			<Link href={`/materials/${material.param}`}>
				<h4 className={styles.materialsTitle}>{material.title}</h4>
			</Link>
		</div>
	)
}

export default MaterialsCard
