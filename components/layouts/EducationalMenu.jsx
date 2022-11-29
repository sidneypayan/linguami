import styles from '../../styles/EducationalMenu.module.css'
// import { SiGoogletranslate } from 'react-icons/si'
import { GiBookmarklet } from 'react-icons/gi'
import { HiOutlineAcademicCap } from 'react-icons/hi'
import { useState, useRef } from 'react'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'

const EducationalMenu = () => {
	const { t, lang } = useTranslation()
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
							<span>{t('common:mydictionary')}</span>
						</li>
					</Link>
					<Link href='/my-materials'>
						<li>
							<HiOutlineAcademicCap />
							<span>{t('common:materials')}</span>
						</li>
					</Link>
				</ul>
			</nav>
		</div>
	)
}

export default EducationalMenu
