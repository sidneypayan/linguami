import useTranslation from 'next-translate/useTranslation'
import MaterialsGrid from '../../components/materials/MaterialsGrid'
import MaterialsFilter from '../../components/materials/MaterialsFilter'
import { materials_ru, materials_fr, materials_en } from '../../utils/constants'
import SEO from '../../components/SEO'
import { Box, Typography, Container, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { useUserContext } from '../../context/user'
import { School, Palette, Museum, Movie, MusicNote, MenuBook } from '@mui/icons-material'

const Material = () => {
	const { t, lang } = useTranslation('materials')
	const { userLearningLanguage } = useUserContext()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const [materials, setMaterials] = useState([])
	const [practice, setPractice] = useState([])
	const [culture, setCulture] = useState([])
	const [literature, setLiterature] = useState([])
	const [selectedCategory, setSelectedCategory] = useState('all')
	const [selectedDuration, setSelectedDuration] = useState('all')

	useEffect(() => {
		// Détermine quelle langue l'utilisateur apprend
		const learningLang = userLearningLanguage || 'en' // Par défaut anglais si non défini

		let selectedMaterials = []
		if (learningLang === 'ru') {
			selectedMaterials = materials_ru // Apprendre le russe
		} else if (learningLang === 'fr') {
			selectedMaterials = materials_fr // Apprendre le français
		} else if (learningLang === 'en') {
			selectedMaterials = materials_en // Apprendre l'anglais
		} else {
			// Par défaut : afficher toutes les langues
			selectedMaterials = [...materials_ru, ...materials_fr, ...materials_en]
		}

		setMaterials(selectedMaterials)
	}, [userLearningLanguage, lang])

	// Filtre les matériaux par catégorie et filtres sélectionnés
	useEffect(() => {
		const filterMaterials = (category) => {
			let filtered = materials.filter(material => material.newCategory === category)

			if (selectedCategory !== 'all') {
				filtered = filtered.filter(material => material.category === selectedCategory)
			}

			if (selectedDuration !== 'all') {
				filtered = filtered.filter(material => material.duration === selectedDuration)
			}

			return filtered
		}

		setPractice(filterMaterials('practice'))
		setCulture(filterMaterials('culture'))
		setLiterature(filterMaterials('literature'))
	}, [materials, selectedCategory, selectedDuration])

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
				name: t('practiceCategory'),
				url: `https://www.linguami.com${lang === 'fr' ? '' : `/${lang}`}/materials#practice`
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: t('cultureCategory'),
				url: `https://www.linguami.com${lang === 'fr' ? '' : `/${lang}`}/materials#culture`
			},
			{
				'@type': 'ListItem',
				position: 3,
				name: t('literatureCategory'),
				url: `https://www.linguami.com${lang === 'fr' ? '' : `/${lang}`}/materials#literature`
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

			<Container
				maxWidth='lg'
				sx={{
					pt: { xs: '6.5rem', md: '7rem' },
					pb: { xs: 3, md: 4 },
					px: { xs: 2, sm: 3 },
				}}>
				{/* Filtres */}
				<MaterialsFilter
					selectedCategory={selectedCategory}
					selectedDuration={selectedDuration}
					onCategoryChange={setSelectedCategory}
					onDurationChange={setSelectedDuration}
				/>

				{/* Message si aucun matériau trouvé */}
				{practice.length === 0 && culture.length === 0 && literature.length === 0 && (
					<Box
						sx={{
							py: 8,
							textAlign: 'center',
						}}>
						<Typography
							variant="h6"
							sx={{
								color: isDark ? '#94a3b8' : '#64748b',
								fontWeight: 600,
							}}>
							{t('noMaterialsFound')}
						</Typography>
					</Box>
				)}

				{/* Section Pratique de la langue */}
				{practice.length > 0 && (
					<Box id='practice' sx={{ scrollMarginTop: '100px', mb: { xs: 6, md: 8 } }}>
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
								<School sx={{ fontSize: '2rem', color: '#8b5cf6' }} />
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
								{t('practiceCategory')}
							</Typography>
						</Box>
						<MaterialsGrid materials={practice} />
					</Box>
				)}

				{/* Section Culture & Divertissement */}
				{culture.length > 0 && (
					<Box id='culture' sx={{ scrollMarginTop: '100px', mb: { xs: 6, md: 8 } }}>
						{/* Titre principal */}
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
								<Palette sx={{ fontSize: '2rem', color: '#8b5cf6' }} />
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
								{t('cultureCategory')}
							</Typography>
						</Box>

						{/* Sous-section : Culture & Patrimoine */}
						{culture.filter(m => m.category === 'text & audio').length > 0 && (
							<Box sx={{ mb: 5 }}>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: 1.5,
										mb: 3,
										pl: { xs: 0, md: 2 },
									}}>
									<Museum sx={{ fontSize: '1.5rem', color: isDark ? '#a78bfa' : '#8b5cf6' }} />
									<Typography
										variant='h4'
										sx={{
											fontWeight: 700,
											fontSize: { xs: '1.25rem', sm: '1.5rem' },
											color: isDark ? '#cbd5e1' : '#475569',
										}}>
										{t('heritageCategory')}
									</Typography>
								</Box>
								<Box sx={{ pl: { xs: 0, md: 4 } }}>
									<MaterialsGrid materials={culture.filter(m => m.category === 'text & audio')} />
								</Box>
							</Box>
						)}

						{/* Sous-section : Cinéma & Vidéos */}
						{culture.filter(m => m.category === 'video').length > 0 && (
							<Box sx={{ mb: 5 }}>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: 1.5,
										mb: 3,
										pl: { xs: 0, md: 2 },
									}}>
									<Movie sx={{ fontSize: '1.5rem', color: isDark ? '#a78bfa' : '#8b5cf6' }} />
									<Typography
										variant='h4'
										sx={{
											fontWeight: 700,
											fontSize: { xs: '1.25rem', sm: '1.5rem' },
											color: isDark ? '#cbd5e1' : '#475569',
										}}>
										{t('cinemaCategory')}
									</Typography>
								</Box>
								<Box sx={{ pl: { xs: 0, md: 4 } }}>
									<MaterialsGrid materials={culture.filter(m => m.category === 'video')} />
								</Box>
							</Box>
						)}

						{/* Sous-section : Musique */}
						{culture.filter(m => m.category === 'music').length > 0 && (
							<Box sx={{ mb: 0 }}>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: 1.5,
										mb: 3,
										pl: { xs: 0, md: 2 },
									}}>
									<MusicNote sx={{ fontSize: '1.5rem', color: isDark ? '#a78bfa' : '#8b5cf6' }} />
									<Typography
										variant='h4'
										sx={{
											fontWeight: 700,
											fontSize: { xs: '1.25rem', sm: '1.5rem' },
											color: isDark ? '#cbd5e1' : '#475569',
										}}>
										{t('songsCategory')}
									</Typography>
								</Box>
								<Box sx={{ pl: { xs: 0, md: 4 } }}>
									<MaterialsGrid materials={culture.filter(m => m.category === 'music')} />
								</Box>
							</Box>
						)}
					</Box>
				)}

				{/* Section Littérature & Histoires */}
				{literature.length > 0 && (
					<Box id='literature' sx={{ scrollMarginTop: '100px', mb: { xs: 4, md: 6 } }}>
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
								<MenuBook sx={{ fontSize: '2rem', color: '#8b5cf6' }} />
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
								{t('literatureCategory')}
							</Typography>
						</Box>
						<MaterialsGrid materials={literature} />
					</Box>
				)}
			</Container>
		</>
	)
}

export default Material
