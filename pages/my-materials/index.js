import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserMaterials } from '../../features/materials/materialsSlice'
import SectionCard from '../../components/SectionCard'
import styles from '../../styles/MyMaterials.module.css'
import Image from 'next/image'

const UserMaterials = () => {
	const dispatch = useDispatch()
	const { user_materials } = useSelector(store => store.materials)

	const [filteredUserMaterials, setFilteredUserMaterials] = useState([])
	const [displayMaterials, setDisplayMaterials] = useState(false)

	const filterUserMaterialsByStatus = status => {
		let filteredMaterials
		if (status === 'is_being_studied') {
			filteredMaterials = user_materials.filter(
				userMaterial => userMaterial.user_materials[0].is_being_studied
			)
		}
		if (status === 'is_studied') {
			filteredMaterials = user_materials.filter(
				userMaterial => userMaterial.user_materials[0].is_studied
			)
		}
		if (status === 'all') {
			filteredMaterials = user_materials
		}

		setFilteredUserMaterials(filteredMaterials)
	}

	const checkIfUserMaterialIsInMaterials = id => {
		const filteredUserMaterialsStatus = filteredUserMaterials.map(
			filteredUserMaterial => ({
				material_id: filteredUserMaterial.id,
				...filteredUserMaterial.user_materials[0],
			})
		)

		return filteredUserMaterialsStatus.find(
			filteredUserMaterialStatus =>
				filteredUserMaterialStatus.material_id === id
		)
	}

	// console.log(filteredUserMaterials)

	useEffect(() => {
		setFilteredUserMaterials(user_materials)
	}, [user_materials])

	useEffect(() => {
		dispatch(getUserMaterials())
	}, [dispatch])

	return (
		<>
			{!displayMaterials && (
				<div className={styles.wrapper}>
					<div className={styles.filterContainer}>
						<div
							onClick={() => {
								filterUserMaterialsByStatus('is_being_studied')
								setDisplayMaterials(true)
							}}
							className={styles.filterCard}>
							<p>En cours d&apos;étude</p>
							<div className={styles.imgContainer}>
								<Image
									src='/img/studying.jpg'
									// layout='fill'
									// objectFit='cover'
									quality={100}
									width={250}
									height={250}
									alt='studying'
									loading='eager'
								/>
							</div>
						</div>
						<div
							onClick={() => {
								filterUserMaterialsByStatus('is_studied')
								setDisplayMaterials(true)
							}}
							className={styles.filterCard}>
							<p>Etudiés</p>
							<div className={styles.imgContainer}>
								<Image
									src='/img/studied.jpg'
									layout='fill'
									objectFit='cover'
									quality={100}
									alt='studied'
									loading='eager'
								/>
							</div>
						</div>
					</div>
				</div>
			)}
			{displayMaterials && (
				<>
					<FontAwesomeIcon
						onClick={() => setDisplayMaterials(false)}
						className='back-arrow'
						icon={faArrowLeft}
						size='2xl'
					/>
					<div className={styles.container}>
						{filteredUserMaterials.map(material => (
							<SectionCard
								key={material.id}
								material={material}
								checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials(
									material.id
								)}
							/>
						))}
					</div>
				</>
			)}
		</>
	)
}

export default UserMaterials
