import { supabase } from '../../../../lib/supabase'
import styles from '../../../../styles/materials/Material.module.css'
import Image from 'next/image'
import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useUserContext } from '../../../../context/user'

const Material = ({ material, audio, img }) => {
	const { user, isUserLoggedIn } = useUserContext()
	const router = useRouter()
	const [showAccents, setShowAccents] = useState(false)

	return (
		<>
			<FontAwesomeIcon
				onClick={() => router.back()}
				className={styles.arrowIcon}
				icon={faArrowLeft}
				size='2xl'
			/>
			<div className={styles.container}>
				<div className={styles.titleContainer}>
					<h1 className={`${styles.title} headline`}>{material.title}</h1>
				</div>
				<div className={styles.mediaContainer}>
					{/* AUDIO PLAYER */}
					{(material.section === 'dialogue' ||
						material.section === 'book-chapter' ||
						material.section === 'podcast' ||
						material.section === 'short-story' ||
						material.section === 'slice-of-life' ||
						material.section === 'culture' ||
						material.section === 'place') && (
						<div className={styles.audioContainer}>
							<Image
								width={250}
								height={250}
								src={img + material.img}
								alt={material.title}></Image>
							<audio controls='controls' src={audio + material.audio}></audio>
							<div className='audio-player__speed-icons'>
								<a className='audio-player__turtle-icon'>
									{/* <Image src="" alt=""></Image> */}
								</a>
								<a className='audio-player__hare-icon'>
									{/* <Image src="" alt=""></Image> */}
								</a>
							</div>
						</div>
					)}
					{/* DISPLAY VIDEO REGARDING THE SECTION */}

					{(material.section === 'trailer' ||
						material.section === 'eralash' ||
						material.section === 'music' ||
						material.section === 'galileo' ||
						material.section === 'diverse' ||
						material.section === 'extract' ||
						material.section === 'cartoon') && (
						<div className={styles.videoContainer}>
							<iframe
								src={material.video}
								frameBorder='0'
								allow='accelerometer; encrypted-media; gyroscope; picture-in-picture'
								allowFullscreen></iframe>
						</div>
					)}
				</div>

				<div className={styles.textContainer}>
					<div>
						{/* <Image src="" alt=""></Image> */}
						{/* DISPLAY IMAGE IF SECTION == LIEUX */}
						{material.section === 'place' && (
							<Image
								src={img + material.img}
								alt={material.title}
								width={1595}
								height={638}
							/>
						)}

						{/* {material.section === 'extract' && (
						<div className={styles.videoContainer}>
							<iframe
								src={material.video}
								frameBorder='0'
								allow='accelerometer; encrypted-media; gyroscope; picture-in-picture'
								allowfullscreen></iframe>
						</div>
					)} */}

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
									__html: DOMPurify.sanitize(material.content_accents),
								}}></p>
						) : (
							<p
								className='text'
								dangerouslySetInnerHTML={{
									__html: DOMPurify.sanitize(material.content),
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

export default Material

export const getServerSideProps = async ({ params }) => {
	let { data: material, error } = await supabase
		.from('materials')
		.select('*')
		.eq('id', params.material)
		.single()

	if (error) {
		throw new Error(error.message)
	}
	return {
		props: {
			material,
			audio: process.env.AUDIO_URL,
			img: process.env.IMG_URL,
		},
	}
}
