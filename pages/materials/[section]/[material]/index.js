import { supabase } from '../../../../lib/supabase'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faXmark, faBook } from '@fortawesome/free-solid-svg-icons'
import styles from '../../../../styles/materials/Material.module.css'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { getBookChapters } from '../../../../features/materials/materialsSlice'
import { useDispatch } from 'react-redux'
import BookMenu from '../../../../components/material/BookMenu'
import Translation from '../../../../components/material/Translation'
import Words from '../../../../components/material/Words'
import WordsContainer from '../../../../components/material/WordsContainer'
import { useUserContext } from '../../../../context/user'
import { sections } from '../../../../data/sections'

const Material = ({ material: single_material }) => {
	const dispatch = useDispatch()
	const { user } = useUserContext()

	const bookName = single_material.book_name
	const router = useRouter()
	const { material, section } = router.query

	const [showAccents, setShowAccents] = useState(false)
	const [isBookMenuOpen, setIsBookMenuOpen] = useState(false)
	const [coordinates, setCoordinates] = useState({})

	const getImageRegardingSection = section => {
		if (section === 'place') {
			return (
				<div
					className={styles.imgPlace}
					style={{
						backgroundImage: `url(https://linguami.s3.eu-west-3.amazonaws.com/images/${single_material.img})`,
					}}></div>
			)
		}

		if (
			section === 'dialogue' ||
			section === 'culture' ||
			section === 'slice-of-life' ||
			section === 'book' ||
			section === 'short-story' ||
			section === 'legend'
		) {
			return (
				<div
					className={styles.img}
					style={{
						backgroundImage: `url(https://linguami.s3.eu-west-3.amazonaws.com/images/${single_material.img})`,
					}}></div>
			)
		}
	}

	const displayAudioPlayer = section => {
		if (sections.audio.includes(section)) {
			return (
				<audio
					controls='controls'
					src={`https://linguami.s3.eu-west-3.amazonaws.com/audio/${single_material.audio}`}></audio>
			)
		}
	}

	const displayVideo = section => {
		if (sections.music.includes(section) || sections.video.includes(section)) {
			return (
				<div className={styles.videoContainer}>
					<iframe
						src={single_material.video}
						frameBorder='0'
						allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen'></iframe>
				</div>
			)
		}
	}

	useEffect(() => {
		if (bookName) {
			dispatch(getBookChapters(bookName))
		}
	}, [dispatch, bookName])

	useEffect(() => {
		setIsBookMenuOpen(false)
	}, [material])

	const getCoordinates = e => {
		const xCoordinate =
			window.innerWidth < 768
				? e.pageX - e.pageX / 2
				: window.innerWidth < 1024
				? e.pageX - e.pageX / 3
				: e.pageX - 100
		setCoordinates({
			x: xCoordinate,
			y: e.pageY - 50,
		})
	}

	return (
		single_material && (
			<>
				<FontAwesomeIcon
					onClick={() => router.back()}
					className='back-arrow '
					icon={faArrowLeft}
					size='2xl'
				/>

				<div className={styles.container}>
					<div className={styles.titleContainer}>
						<h1 className={`${styles.title} headline`}>
							{single_material.title_ru}
						</h1>
					</div>

					{/* MEDIACONTAINER*/}
					<div className={styles.mediaContainer}>
						<div className={styles.audioContainer}>
							{getImageRegardingSection(section)}

							{/* DISPLAY AUDIO */}
							{displayAudioPlayer(section)}

							{/* CHAPTER MENU */}
							{section === 'book' && (
								<>
									<button
										onClick={() => setIsBookMenuOpen(!isBookMenuOpen)}
										className={styles.bookMenuBtn}>
										{isBookMenuOpen
											? 'Cacher le menu des chapitres'
											: 'Afficher le menu des chapitres'}
										<FontAwesomeIcon
											className={styles.bookMenuIcon}
											icon={isBookMenuOpen ? faXmark : faBook}
										/>
									</button>
									{isBookMenuOpen && <BookMenu />}
								</>
							)}
						</div>

						{/* DISPLAY VIDEO */}
						{displayVideo(section)}
					</div>

					{/* TextContainer */}
					<div className={styles.textContainer}>
						{/* <div> */}
						<Translation
							coordinates={coordinates}
							materialId={single_material.id}
							userId={user && user.id}
						/>

						<button
							onClick={() => setShowAccents(!showAccents)}
							type='button'
							id='show-accents'
							className={`${styles.showAccentsBtn} mainBtn`}>
							Montrer les accents
						</button>

						{showAccents ? (
							<p onClick={e => getCoordinates(e)} className={styles.text}>
								<Words
									content={single_material.content_accents}
									materialId={single_material.id}
								/>
							</p>
						) : (
							<p onClick={e => getCoordinates(e)} className={styles.text}>
								<Words
									content={single_material.content}
									materialId={single_material.id}
								/>
							</p>
						)}

						<button
							type='button'
							id='checkMaterial'
							className={`${styles.checkLesson} mainBtn`}>
							J&apos;ai terminé cette leçon <i className='fas fa-check'></i>
						</button>
						{/* </div> */}
					</div>

					{/* WordsContainer */}
					<div className={styles.rightContainer}>
						<WordsContainer />
					</div>
				</div>
			</>
		)
	)
}

export const getStaticProps = async ({ params }) => {
	const { data: material, error } = await supabase
		.from('materials')
		.select('*')
		.eq('lang', 'ru')
		.eq('id', params.material)
		.single()

	return {
		props: {
			material,
		},
		revalidate: 60,
	}
}

export const getStaticPaths = async () => {
	const { data: materials, error } = await supabase
		.from('materials')
		.select('*')
		.eq('lang', 'ru')
		.neq('section', 'book')

	const paths = materials.map(material => ({
		params: { section: material.section, material: material.id.toString() },
	}))

	return {
		paths,
		fallback: 'blocking',
	}
}

export default Material
