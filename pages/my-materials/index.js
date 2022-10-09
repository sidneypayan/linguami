import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserMaterials } from '../../features/userMaterials/userMaterialsSlice'
import SectionCard from '../../components/SectionCard'
import styles from '../../styles/sections/Sections.module.css'

const UserMaterials = () => {
	const dispatch = useDispatch()
	const { user_materials } = useSelector(store => store.userMaterials)

	useEffect(() => {
		dispatch(getUserMaterials())
	}, [dispatch])

	console.log(user_materials)

	return (
		<div className={styles.sectionsWrapper}>
			<div className={styles.container}>
				{user_materials.map(material => (
					<SectionCard key={material.id} material={material} />
				))}
			</div>
		</div>
	)
}

export default UserMaterials
