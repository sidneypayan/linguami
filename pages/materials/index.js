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

			{/* Hero Section */}
			<Box
				sx={{
					position: 'relative',
					background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
					overflow: 'hidden',
					pt: { xs: '6rem', md: '7rem' },
					pb: { xs: '5rem', md: '6rem' },
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.25) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.2) 0%, transparent 50%)',
						pointerEvents: 'none',
					},
				}}>
				<Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center', pb: { xs: 2, md: 3 } }}>
					<Typography
						variant="h1"
						sx={{
							fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
							fontWeight: 800,
							mb: { xs: 2.5, md: 3 },
							background: 'linear-gradient(135deg, #ffffff 0%, #8b5cf6 50%, #06b6d4 100%)',
							backgroundSize: '200% 200%',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							animation: 'gradientShift 8s ease infinite',
							'@keyframes gradientShift': {
								'0%': { backgroundPosition: '0% 50%' },
								'50%': { backgroundPosition: '100% 50%' },
								'100%': { backgroundPosition: '0% 50%' },
							},
						}}>
						{t('pagetitle')}
					</Typography>
					<Typography
						variant="h5"
						sx={{
							fontSize: { xs: '1rem', md: '1.25rem' },
							fontWeight: 500,
							color: 'rgba(255, 255, 255, 0.85)',
							maxWidth: '700px',
							mx: 'auto',
							lineHeight: 1.7,
							px: { xs: 2, sm: 0 },
						}}>
						{t('description')}
					</Typography>
				</Container>

				{/* Diagonal separator */}
				<Box
					sx={{
						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						height: { xs: '60px', md: '80px' },
						background: '#ffffff',
						clipPath: 'polygon(0 50%, 100% 0, 100% 100%, 0 100%)',
					}}
				/>
			</Box>

			<Container
				maxWidth='lg'
				sx={{
					py: { xs: 4, md: 6 },
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
