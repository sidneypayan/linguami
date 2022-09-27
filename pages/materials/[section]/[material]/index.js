import { supabase } from '../../../../lib/supabase'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons'
import { faArrowLeft, faXmark, faBook } from '@fortawesome/free-solid-svg-icons'
import styles from '../../../../styles/materials/Material.module.css'
import Image from 'next/image'
import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import {
	getMaterial,
	getBookChapters,
} from '../../../../features/materials/materialsSlice'
import { useSelector, useDispatch } from 'react-redux'
import BookMenu from '../../../../components/layouts/BookMenu'

import { useUserContext } from '../../../../context/user'

const Material = ({ material: single_material }) => {
	console.log(single_material)
	const { user, isUserLoggedIn } = useUserContext()
	const dispatch = useDispatch()
	// const { single_material, single_material_loading } = useSelector(
	// 	store => store.materials
	// )

	const bookName = single_material.book_name
	const router = useRouter()
	const { material, section } = router.query

	const [showAccents, setShowAccents] = useState(false)
	const [isBookMenuOpen, setIsBookMenuOpen] = useState(false)

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
			section === 'short-story'
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

	// useEffect(() => {
	// 	if (material) {
	// 		dispatch(getMaterial(material))
	// 	}
	// }, [dispatch, material])

	useEffect(() => {
		if (bookName) {
			dispatch(getBookChapters(bookName))
		}
	}, [dispatch, bookName])

	// if (single_material_loading) {
	// 	return (
	// 		<div className='loader'>
	// 			<Image
	// 				src='/img/loader.gif'
	// 				width={200}
	// 				height={200}
	// 				alt='loader'></Image>
	// 		</div>
	// 	)
	// }

	return (
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
						{single_material.title}
					</h1>
				</div>
				<div className={styles.mediaContainer}>
					{/* AUDIO PLAYER */}

					<div className={styles.audioContainer}>
						{getImageRegardingSection(section)}

						<audio
							controls='controls'
							src={`https://linguami.s3.eu-west-3.amazonaws.com/audio/${single_material.audio}`}></audio>

						{section === 'book' && isBookMenuOpen && (
							<>
								<button
									onClick={() => setIsBookMenuOpen(false)}
									className={styles.bookMenuBtn}>
									Cacher le menu des chapitres
									<FontAwesomeIcon
										className={styles.bookMenuIcon}
										icon={faXmark}
									/>
								</button>

								<BookMenu />
							</>
						)}

						{section === 'book' && !isBookMenuOpen && (
							<>
								<button
									onClick={() => setIsBookMenuOpen(true)}
									className={styles.bookMenuBtn}>
									Afficher le menu des chapitres
									<FontAwesomeIcon
										className={styles.bookMenuIcon}
										icon={faBook}
									/>
								</button>
							</>
						)}

						{/* <div className='audio-player__speed-icons'>
								<a className='audio-player__turtle-icon'>
									<Image src="" alt=""></Image>
								</a>
								<a className='audio-player__hare-icon'>
									<Image src="" alt=""></Image>
								</a>
							</div> */}
					</div>

					{/* DISPLAY VIDEO REGARDING THE SECTION */}

					{(single_material.section === 'trailer' ||
						single_material.section === 'eralash' ||
						single_material.section === 'music' ||
						single_material.section === 'galileo' ||
						single_material.section === 'diverse' ||
						single_material.section === 'extract' ||
						single_material.section === 'cartoon') && (
						<div className={styles.videoContainer}>
							<iframe
								src={single_material.video}
								frameBorder='0'
								allow='accelerometer; encrypted-media; gyroscope; picture-in-picture'
								allowFullscreen></iframe>
						</div>
					)}
				</div>

				<div className={styles.textContainer}>
					<div>
						{/* TRANSLATION MODULE */}
						{/* <div id='transPopup' className='trans-popup'>
						<button
							type='button'
							id='transPopupTextForm'
							className='trans-popup__o-word keep-open'></button>

						<div
							id='ShowInputTextForm'
							className='trans-popup__showInput keep-open'>
							<i
								id='iconTextForm'
								className='fas fa-angle-down keep-open icon-text-form'></i>
						</div>
						<div
							id='InputContainerTextForm'
							className='trans-popup__input-container'>
							<input
								id='transInputTextForm'
								className='trans-popup__input keep-open'
								type='text'
								placeholder='Votre traduction'
							/>
							<button
								type='button'
								id='transPopupBtnTextForm'
								className='trans-popup__btn-text-form'>
								Ajouter
							</button>
						</div>

						<button
							type='button'
							id='transPopupBaseForm'
							className='trans-popup__o-word keep-open'></button>

						<div
							id='ShowInputBaseForm'
							className='trans-popup__showInput keep-open'>
							<i
								id='iconBaseForm'
								className='fas fa-angle-down keep-open icon-base-form'></i>
						</div>
						<div
							id='InputContainerBaseForm'
							className='trans-popup__input-container'>
							<input
								id='transInputBaseForm'
								className='trans-popup__input keep-open'
								type='text'
								placeholder='Votre traduction'
							/>
							<button
								id='transPopupBtnBaseForm'
								className='trans-popup__btn-base-form'>
								Ajouter
							</button>
						</div>
					</div> */}
						{/* END TRANSLATION MODULE */}

						{/* BUTTON ACCENTS */}
						<button
							onClick={() => setShowAccents(!showAccents)}
							type='button'
							id='show-accents'
							className={`${styles.showAccentsBtn} mainBtn`}>
							Montrer les accents
						</button>

						{/* POST CONTENT */}

						{showAccents ? (
							<p
								className='text-accents'
								dangerouslySetInnerHTML={{
									__html: DOMPurify.sanitize(single_material.content_accents),
								}}></p>
						) : (
							<p
								className='text'
								dangerouslySetInnerHTML={{
									__html: DOMPurify.sanitize(single_material.content),
								}}></p>
						)}

						{/* END POST CONTENT */}
						<button
							type='button'
							id='checkMaterial'
							className={`${styles.checkLesson} mainBtn`}>
							J&apos;ai terminé cette leçon <i className='fas fa-check'></i>
						</button>
					</div>

					{/* DISPLAY AUDIO REGARDING THE SECTION */}
				</div>

				<div className={styles.rightContainer}>
					<div className={styles.wordsContainer}>
						{isUserLoggedIn ? (
							<>
								<h3 className='headline'>Mots</h3>
								<ul>
									<li>
										<span className='lesson__original-word'>russian word</span>{' '}
										-{' '}
										<span className='lesson__translated-word'>french word</span>
										<i className='far fa-trash-alt lesson__trash'></i>
									</li>
								</ul>
							</>
						) : (
							<>
								<h4 className='headline'>Créez un compte pour pouvoir :</h4>
								<ul className='lesson__words-list'>
									<li>
										<FontAwesomeIcon icon={faThumbsUp} /> Traduire
										n&apos;importe quel mot du texte en un clique
									</li>
									<li>
										<FontAwesomeIcon icon={faThumbsUp} /> Conserver les mots
										traduits sur cette même page
									</li>
									<li>
										<FontAwesomeIcon icon={faThumbsUp} /> Sauvegarder toutes vos
										traductions dans un dictionnaire personnel lié à votre
										compte
									</li>
									<li>
										<FontAwesomeIcon icon={faThumbsUp} /> Soutenir notre travail
									</li>
								</ul>
								<Link href='/register'>
									<button
										type='button'
										className={`${styles.registerBtn} mainBtn`}>
										S&apos;enregistrer
									</button>
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</>
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

	const paths = materials.map(material => ({
		params: { section: material.section, material: material.id.toString() },
	}))

	return {
		paths,
		fallback: 'blocking',
	}
}

export default Material
