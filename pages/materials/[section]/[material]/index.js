import Image from 'next/image'
import supabase from '../../../../utils/supabase'

const Material = ({ material }) => {
	return (
		<div className='lesson'>
			<div className='lesson__left-container'>
				{/* PREVIOUS PAGE ARROW */}

				<a>
					<i className='fas fa-long-arrow-alt-left pl-2'></i>
				</a>

				{/* MAIN TITLE */}
				<h1 className='headline headline--centered headline--blue mt-1'>
					{material.title}
				</h1>

				<div className='lesson__text-container text-trans'>
					{/* <Image src="" alt=""></Image> */}
					{/* DISPLAY IMAGE IF SECTION == LIEUX */}
					{/* {material.section === 'place' && <Image src="" alt=""></Image><br><br></br>} */}

					{/* DISPLAY VIDEO REGARDING THE SECTION */}
					<div className='lesson__video-container'>
						{/* {material.section === 'trailer' || material.section === 'extract' || material.section === 'music' || material.section === 'galileo' || material.section === 'eralas' || material.section === 'cartoon' || material.section === 'diverse'}
          <iframe src="{{ $materials->video }}" frameborder="0"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          {material.section === 'extract' &&           <iframe src="{{ $materials->video }}" frameborder="0"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>} */}
					</div>

					{/* BUTTON ACCENTS */}
					<button
						type='button'
						id='show-accents'
						className='btn btn--primary btn--small'>
						Montrer les accents
					</button>

					{/* TRANSLATION MODULE */}
					<div id='transPopup' className='trans-popup'>
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
								className='trans-popup__btn-text-form'
								className=''>
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
								className='trans-popup__btn-base-form'
								className=''>
								Ajouter
							</button>
						</div>
					</div>
					{/* END TRANSLATION MODULE */}

					{/* POST CONTENT */}
					<p className='lesson__text' id='accents-off'>
						{material.content}
					</p>
					<p className='lesson__text' id='accents-on'>
						{material.content_accent}
					</p>
					{/* END POST CONTENT */}
					<button
						id='checkMaterial'
						className='btn--lesson btn--primary t-center my-3'>
						J'ai terminé cette leçon <i className='fas fa-check'></i>
					</button>
				</div>

				{/* DISPLAY AUDIO REGARDING THE SECTION */}

				{/* AUDIO PLAYER */}
				<div className='audio-player'>
					<audio controls='controls' src=''></audio>
					<div className='audio-player__speed-icons'>
						<a className='audio-player__turtle-icon'>
							{/* <Image src="" alt=""></Image> */}
						</a>
						<a className='audio-player__hare-icon'>
							{/* <Image src="" alt=""></Image> */}
						</a>
					</div>
				</div>
			</div>

			<div className='lesson__right-container'>
				<p className='headline headline--small headline--blue headline--centered'>
					Mots
				</p>
				<hr className='lesson__hr' />

				<div className='lesson__words-container'>
					{/* DISPLAY IF USER NOT REGISTERED */}
					<p className='headline--very-small headline--blue'>
						Créez un compte pour pouvoir :
					</p>
					<ul className='lesson__words-list'>
						<li>
							<i className='far fa-thumbs-up'></i> Traduire n'importe quel mot
							du texte en un clique
						</li>
						<li>
							<i className='far fa-thumbs-up '></i> Conserver les mots traduits
							sur cette même page
						</li>
						<li>
							<i className='far fa-thumbs-up '></i> Sauvegarder toutes vos
							traductions dans un dictionnaire personnel lié à votre compte
						</li>
						<li>
							<i className='far fa-thumbs-up '></i> Soutenir notre travail
						</li>
					</ul>
					<a className='btn--words btn--secondary btn--shadow'>S'enregistrer</a>

					{/* DISPLAY WORDS IF USER IS REGISTERED */}

					<ul className='lesson__words-list'>
						<li data-id='{{ $userWord->id }}'>
							<span className='lesson__original-word'>russian word</span> -{' '}
							<span className='lesson__translated-word'>french word</span>
							<i className='far fa-trash-alt lesson__trash'></i>
						</li>
					</ul>
				</div>
			</div>
		</div>
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
		},
	}
}
