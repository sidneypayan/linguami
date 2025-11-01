import useTranslation from 'next-translate/useTranslation'
import MaterialsCarousel from '../../components/materials/MaterialsCarousel'
import { materials_ru, materials_fr } from '../../utils/constants'
import SEO from '../../components/SEO'
import { Box, Typography, Container } from '@mui/material'
import { useEffect, useState } from 'react'
import { useUserContext } from '../../context/user'
import { TextSnippet, VideoLibrary, MusicNote } from '@mui/icons-material'

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

		let selectedMaterials = []
		if (learningLang === 'ru') {
			selectedMaterials = materials_ru // Apprendre le russe
		} else if (learningLang === 'fr') {
			selectedMaterials = materials_fr // Apprendre le français
		} else {
			// Par défaut ou si les deux langues
			selectedMaterials = [...materials_ru, ...materials_fr]
		}

		setMaterials(selectedMaterials)
		setText(selectedMaterials.filter(material => material.category === 'text & audio'))
		setVideo(selectedMaterials.filter(material => material.category === 'video'))
		setMusic(selectedMaterials.filter(material => material.category === 'music'))
	}, [userLearningLanguage, lang])

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

			{/* Compact Header */}
			<Box
				sx={{
					pt: { xs: '5.5rem', md: '6rem' },
					pb: 3,
					borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
					bgcolor: '#fafafa',
				}}>
				<Container maxWidth='lg'>
					<Typography
						variant='h4'
						sx={{
							fontWeight: 700,
							fontSize: { xs: '1.75rem', sm: '2rem' },
							background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							textAlign: 'center',
							mb: 1,
						}}>
						{t('pagetitle')}
					</Typography>
					<Typography
						variant='body1'
						align='center'
						sx={{
							color: '#64748b',
							fontSize: { xs: '0.9375rem', sm: '1rem' },
						}}>
						{t('description')}
					</Typography>
				</Container>
			</Box>

			<Container
				maxWidth='lg'
				sx={{
					py: { xs: 3, md: 4 },
					px: { xs: 2, sm: 3 },
				}}>
				{/* Section Textes et Audio */}
				<Box id='texts' sx={{ scrollMarginTop: '100px', mb: { xs: 6, md: 8 } }}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 2,
							mb: 4,
							pb: 2,
							borderBottom: '2px solid',
							borderImage: 'linear-gradient(90deg, rgba(139, 92, 246, 0.5) 0%, transparent 100%) 1',
						}}>
						<Box
							sx={{
								width: 56,
								height: 56,
								borderRadius: 3,
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
								backdropFilter: 'blur(10px)',
								border: '1px solid rgba(139, 92, 246, 0.3)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 4px 15px rgba(139, 92, 246, 0.2)',
							}}>
							<TextSnippet sx={{ fontSize: '2rem', color: '#8b5cf6' }} />
						</Box>
						<Typography
							variant='h3'
							sx={{
								fontWeight: 800,
								fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
								background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 60%, #06b6d4 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							}}>
							{t('text')}
						</Typography>
					</Box>
					<MaterialsCarousel materials={text} />
				</Box>

				{/* Section Vidéos */}
				<Box id='videos' sx={{ scrollMarginTop: '100px', mb: { xs: 6, md: 8 } }}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 2,
							mb: 4,
							pb: 2,
							borderBottom: '2px solid',
							borderImage: 'linear-gradient(90deg, rgba(139, 92, 246, 0.5) 0%, transparent 100%) 1',
						}}>
						<Box
							sx={{
								width: 56,
								height: 56,
								borderRadius: 3,
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
								backdropFilter: 'blur(10px)',
								border: '1px solid rgba(139, 92, 246, 0.3)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 4px 15px rgba(139, 92, 246, 0.2)',
							}}>
							<VideoLibrary sx={{ fontSize: '2rem', color: '#8b5cf6' }} />
						</Box>
						<Typography
							variant='h3'
							sx={{
								fontWeight: 800,
								fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
								background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 60%, #06b6d4 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							}}>
							{t('video')}
						</Typography>
					</Box>
					<MaterialsCarousel materials={video} />
				</Box>

				{/* Section Musique */}
				<Box id='audio' sx={{ scrollMarginTop: '100px', mb: { xs: 4, md: 6 } }}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 2,
							mb: 4,
							pb: 2,
							borderBottom: '2px solid',
							borderImage: 'linear-gradient(90deg, rgba(139, 92, 246, 0.5) 0%, transparent 100%) 1',
						}}>
						<Box
							sx={{
								width: 56,
								height: 56,
								borderRadius: 3,
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
								backdropFilter: 'blur(10px)',
								border: '1px solid rgba(139, 92, 246, 0.3)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 4px 15px rgba(139, 92, 246, 0.2)',
							}}>
							<MusicNote sx={{ fontSize: '2rem', color: '#8b5cf6' }} />
						</Box>
						<Typography
							variant='h3'
							sx={{
								fontWeight: 800,
								fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
								background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 60%, #06b6d4 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							}}>
							{t('music')}
						</Typography>
					</Box>
					<MaterialsCarousel materials={music} />
				</Box>
			</Container>
		</>
	)
}

export default Material
