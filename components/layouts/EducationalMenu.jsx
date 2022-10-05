import styles from '../../styles/materials/EducationalMenu.module.css'
// import { SiGoogletranslate } from 'react-icons/si'
import { GiBookmarklet } from 'react-icons/gi'
import { HiOutlineAcademicCap } from 'react-icons/hi'
import { useState, useRef } from 'react'
import Link from 'next/link'

const EducationalMenu = () => {
	const containerRef = useRef()
	const [isMenuOpen, setIsMenuOpen] = useState(null)

	const style = {
		width: isMenuOpen ? '225px' : '70px',
	}

	const mouseEnter = () => {
		setIsMenuOpen(true)
	}

	const mouseLeave = () => {
		setIsMenuOpen(false)
	}

	return (
		<div style={style} className={styles.container} ref={containerRef}>
			<nav
				className={styles.nav}
				onMouseEnter={mouseEnter}
				onMouseLeave={mouseLeave}>
				<ul>
					<Link href='/dictionary'>
						<li>
							<GiBookmarklet />
							<span>Mon dictionnaire</span>
						</li>
					</Link>
					<li>
						<HiOutlineAcademicCap />
						<span>Mes matériels</span>
					</li>
				</ul>
			</nav>
		</div>
	)
}

export default EducationalMenu
