import styles from '../../styles/materials/Materials.module.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useState, useRef } from 'react'
import MaterialsCard from './MaterialsCard'
import { useEffect } from 'react'
import { useLayoutEffect } from 'react'

const MaterialsCarousel = ({ materials }) => {
	const [left, setLeft] = useState(0)
	const [sizeLeft, setSizeLeft] = useState(0)
	const [carouselWrapperWidth, setCarouselWrapperWidth] = useState(0)
	const [carouselContainerWidth, setCarouselContainerWidth] = useState(0)
	const carouselWrapperRef = useRef(null)
	const carouselContainerRef = useRef(null)

	useLayoutEffect(() => {
		setCarouselContainerWidth(carouselContainerRef.current.scrollWidth)
	}, [])

	useLayoutEffect(() => {
		setCarouselWrapperWidth(carouselWrapperRef.current.clientWidth)
	}, [])

	useEffect(() => {
		setSizeLeft(carouselContainerWidth - carouselWrapperWidth + left)
	}, [carouselContainerWidth, carouselWrapperWidth, left])

	const style = {
		left: `${left}px`,
	}

	const handleCarousel = direction => {
		if (direction === 'prev' && left === 0) return

		if (sizeLeft === 0 && direction === 'next') return

		if (direction === 'next' && sizeLeft === 90) {
			return setLeft(prevLeft => prevLeft - 90)
		}

		if (direction === 'next') {
			setLeft(prevLeft => prevLeft - 235)
		}

		if (direction === 'prev') {
			setLeft(prevLeft => prevLeft + 235)
		}
	}
	return (
		<div className={styles.carouselBtnWrapper}>
			<div className={styles.materialsCarouselWrapper} ref={carouselWrapperRef}>
				{left < 0 && (
					<div className={styles.prev} onClick={() => handleCarousel('prev')}>
						<FontAwesomeIcon icon={faArrowLeft} size='xl' />
					</div>
				)}
				<div
					ref={carouselContainerRef}
					style={style}
					className={styles.materialsCarouselContainer}>
					{materials.map((material, index) => (
						<MaterialsCard material={material} key={index} />
					))}
				</div>
				{sizeLeft !== 0 && (
					<div className={styles.next} onClick={() => handleCarousel('next')}>
						<FontAwesomeIcon icon={faArrowRight} size='xl' />
					</div>
				)}
			</div>
		</div>
	)
}

export default MaterialsCarousel
