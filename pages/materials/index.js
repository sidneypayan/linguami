import useTranslation from 'next-translate/useTranslation'
import MaterialsCarousel from '../../components/materials/MaterialsCarousel'
import { materials_ru, materials_fr } from '../../utils/constants'
import SEO from '../../components/SEO'
import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useUserContext } from '../../context/user'

const Material = () => {
	const { t, lang } = useTranslation('materials')
	const { userLearningLanguage } = useUserContext()
	const [materials, setMaterials] = useState([])
	const [text, setText] = useState([])
	const [video, setVideo] = useState([])
	const [music, setMusic] = useState([])

	useEffect(() => {
		// Détermine quelle langue l'utilisateur apprend
		// Si userLearningLanguage existe, on l'utilise, sinon on se base sur lang
		const learningLang = userLearningLanguage || (lang === 'ru' ? 'fr' : 'ru')

		if (learningLang === 'ru') {
			setMaterials(materials_ru) // Apprendre le russe
		} else if (learningLang === 'fr') {
			setMaterials(materials_fr) // Apprendre le français
		} else {
			// Par défaut ou si les deux langues
			setMaterials([...materials_ru, ...materials_fr])
		}

		setText(materials.filter(material => material.category === 'text & audio'))
		setVideo(materials.filter(material => material.category === 'video'))
		setMusic(materials.filter(material => material.category === 'music'))
	}, [userLearningLanguage, lang, materials])

	// Mots-clés SEO par langue
	const keywordsByLang = {
		fr: 'matériel russe, apprendre russe, vidéos russes, textes russes, audio russe, dialogues russes, chansons russes, cours russe',
		ru: 'материалы французский, изучение французского, французские видео, французские тексты, французское аудио, французские диалоги',
		en: 'russian materials, learn russian, russian videos, french materials, learn french, language learning materials, russian audio, french audio'
	}

	// JSON-LD pour ItemList (liste de matériaux)
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: lang === 'fr' ? 'Matériel pédagogique' : lang === 'ru' ? 'Учебные материалы' : 'Learning Materials',
		description: t('description'),
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: t('text'),
				url: `https://www.linguami.com${lang === 'fr' ? '' : `/${lang}`}/materials#texts`
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: t('video'),
				url: `https://www.linguami.com${lang === 'fr' ? '' : `/${lang}`}/materials#videos`
			},
			{
				'@type': 'ListItem',
				position: 3,
				name: t('music'),
				url: `https://www.linguami.com${lang === 'fr' ? '' : `/${lang}`}/materials#audio`
			}
		]
	}

	return (
		<>
			<SEO
				title={`${t('pagetitle')} | Linguami`}
				description={t('description')}
				path='/materials'
				keywords={keywordsByLang[lang]}
				jsonLd={jsonLd}
			/>

			<Box
				maxWidth='85%'
				width='1200px'
				sx={{
					margin: { xs: '6rem auto 2rem', sm: '8rem auto 3rem', md: '10rem auto' },
					px: { xs: 2, sm: 3 },
				}}>
				{/* Section Textes et Audio */}
				<Box id='texts' sx={{ scrollMarginTop: '100px' }}>
					<Typography
						variant='h4'
						mb={3}
						mt={2}
						sx={{
							fontWeight: 700,
							fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							position: 'relative',
							display: 'inline-block',
							'&::after': {
								content: '""',
								position: 'absolute',
								bottom: '-8px',
								left: 0,
								width: '60px',
								height: '4px',
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								borderRadius: '2px',
							},
						}}>
						{t('text')}
					</Typography>
					<MaterialsCarousel materials={text} />
				</Box>

				{/* Section Vidéos */}
				<Box id='videos' sx={{ scrollMarginTop: '100px' }}>
					<Typography
						variant='h4'
						mb={3}
						mt={6}
						sx={{
							fontWeight: 700,
							fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							position: 'relative',
							display: 'inline-block',
							'&::after': {
								content: '""',
								position: 'absolute',
								bottom: '-8px',
								left: 0,
								width: '60px',
								height: '4px',
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								borderRadius: '2px',
							},
						}}>
						{t('video')}
					</Typography>
					<MaterialsCarousel materials={video} />
				</Box>

				{/* Section Musique */}
				<Box id='audio' sx={{ scrollMarginTop: '100px' }}>
					<Typography
						variant='h4'
						mb={3}
						mt={6}
						sx={{
							fontWeight: 700,
							fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							position: 'relative',
							display: 'inline-block',
							'&::after': {
								content: '""',
								position: 'absolute',
								bottom: '-8px',
								left: 0,
								width: '60px',
								height: '4px',
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								borderRadius: '2px',
							},
						}}>
						{t('music')}
					</Typography>
					<MaterialsCarousel materials={music} />
				</Box>
			</Box>
		</>
	)
}

export default Material
