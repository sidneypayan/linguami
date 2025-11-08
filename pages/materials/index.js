import useTranslation from 'next-translate/useTranslation'
import MaterialsGrid from '../../components/materials/MaterialsGrid'
import MaterialsFilter from '../../components/materials/MaterialsFilter'
import MaterialsFilterBar from '../../components/MaterialsFilterBar'
import SectionCard from '../../components/SectionCard'
import MaterialsTable from '../../components/MaterialsTable'
import Pagination from '../../components/layouts/Pagination'
import { materials_ru, materials_fr, materials_en } from '../../utils/constants'
import SEO from '../../components/SEO'
import { Box, Typography, Container, useTheme, Button } from '@mui/material'
import { useEffect, useState, useMemo } from 'react'
import { useUserContext } from '../../context/user'
import { useSelector, useDispatch } from 'react-redux'
import { getMaterials, getUserMaterialsStatus, changePage } from '../../features/materials/materialsSlice'
import { School, Palette, Museum, Movie, MusicNote, MenuBook, ViewModule, ViewList as ViewListIcon } from '@mui/icons-material'

const Material = () => {
	const { t, lang } = useTranslation('materials')
	const { userLearningLanguage, userProfile, isUserAdmin } = useUserContext()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const dispatch = useDispatch()

	// Redux state
	const materials_from_redux = useSelector(state => state.materials.materials || [])
	const user_materials_status = useSelector(state => state.materials.user_materials_status || [])
	const materials_loading = useSelector(state => state.materials.materials_loading)
	const page = useSelector(state => state.materials.page)

	// État local pour stocker tous les matériaux chargés
	const [allLoadedMaterials, setAllLoadedMaterials] = useState([])
	const [isLoadingAllMaterials, setIsLoadingAllMaterials] = useState(false)
	const [hasAppliedDefaultFilter, setHasAppliedDefaultFilter] = useState(false)

	const [materials, setMaterials] = useState([])
	const [practice, setPractice] = useState([])
	const [culture, setCulture] = useState([])
	const [literature, setLiterature] = useState([])

	// Mode d'affichage principal : 'category' (actuel) ou 'list' (filtres avancés)
	const [displayMode, setDisplayMode] = useState('category')

	// États pour le mode catégorie
	const [selectedCategory, setSelectedCategory] = useState('all')

	// États pour le mode liste
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedLevel, setSelectedLevel] = useState(null)
	const [selectedStatus, setSelectedStatus] = useState(null)
	const [selectedSection, setSelectedSection] = useState(null)
	const [viewMode, setViewMode] = useState('card') // 'card' ou 'list'

	// Pagination
	const materialsPerPage = 20

	// Niveau de l'utilisateur
	const userLevel = userProfile?.language_level || 'beginner'

	// Charger la préférence de mode d'affichage depuis le localStorage (après le montage)
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('materialsDisplayMode')
			if (saved && (saved === 'category' || saved === 'list')) {
				setDisplayMode(saved)
			}
		}
	}, [])

	// Sauvegarder la préférence de mode d'affichage dans le localStorage
	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('materialsDisplayMode', displayMode)
		}
	}, [displayMode])

	// Charger les sections (pour le mode catégorie)
	useEffect(() => {
		// Détermine quelle langue l'utilisateur apprend
		const learningLang = userLearningLanguage || 'fr' // Par défaut français si non défini

		let selectedMaterials = []
		if (learningLang === 'ru') {
			selectedMaterials = materials_ru // Apprendre le russe
		} else if (learningLang === 'fr') {
			selectedMaterials = materials_fr // Apprendre le français
		} else if (learningLang === 'en') {
			selectedMaterials = materials_en // Apprendre l'anglais (legacy - pour les utilisateurs existants)
		} else {
			// Par défaut : français
			selectedMaterials = materials_fr
		}

		setMaterials(selectedMaterials)
	}, [userLearningLanguage, lang])

	// Charger tous les matériaux au passage en mode liste
	useEffect(() => {
		if (displayMode === 'list' && userLearningLanguage && allLoadedMaterials.length === 0) {
			setIsLoadingAllMaterials(true)

			// Charger tous les matériaux de toutes les sections
			const sections = ['dialogues', 'slices-of-life', 'beautiful-places', 'legends', 'culture',
				'podcasts', 'short-stories', 'movie-trailers', 'movie-clips', 'cartoons',
				'eralash', 'galileo', 'various-materials', 'rock', 'pop', 'folk', 'variety', 'kids']

			const loadAllMaterials = async () => {
				const allPromises = sections.map(section =>
					dispatch(getMaterials({ userLearningLanguage, section })).unwrap()
				)

				try {
					const results = await Promise.all(allPromises)
					const flattenedMaterials = results.flat()
					setAllLoadedMaterials(flattenedMaterials)
				} catch (error) {
					console.error('Error loading materials:', error)
				} finally {
					setIsLoadingAllMaterials(false)
				}
			}

			loadAllMaterials()
			dispatch(getUserMaterialsStatus())
		}
	}, [displayMode, userLearningLanguage, dispatch])

	// Appliquer les filtres par défaut (niveau utilisateur + non étudiés) lors du passage en mode liste
	useEffect(() => {
		if (
			displayMode === 'list' &&
			!isLoadingAllMaterials &&
			allLoadedMaterials.length > 0 &&
			!hasAppliedDefaultFilter &&
			userLevel &&
			user_materials_status // Attendre que le statut des matériaux soit chargé
		) {
			// Appliquer le niveau de l'utilisateur et le statut "non étudiés" comme filtres par défaut
			setSelectedLevel(userLevel)
			setSelectedStatus('not_studied')
			setHasAppliedDefaultFilter(true)
		}
	}, [displayMode, isLoadingAllMaterials, allLoadedMaterials.length, hasAppliedDefaultFilter, userLevel, user_materials_status])

	// Réinitialiser le flag quand on change de mode d'affichage
	useEffect(() => {
		if (displayMode === 'category') {
			setHasAppliedDefaultFilter(false)
		}
	}, [displayMode])

	// Réinitialiser la page à 1 quand les filtres changent
	useEffect(() => {
		dispatch(changePage(1))
	}, [searchTerm, selectedLevel, selectedStatus, selectedSection, dispatch])

	// Charger les matériaux d'une section spécifique si elle est sélectionnée
	useEffect(() => {
		if (displayMode === 'list' && userLearningLanguage && selectedSection) {
			dispatch(getMaterials({ userLearningLanguage, section: selectedSection }))
		}
	}, [selectedSection, dispatch])

	// Accumuler les matériaux chargés depuis Redux quand une section est sélectionnée
	// Ne pas exécuter pendant le chargement initial de tous les matériaux
	useEffect(() => {
		if (materials_from_redux && materials_from_redux.length > 0 && selectedSection && !isLoadingAllMaterials) {
			setAllLoadedMaterials(prevMaterials => {
				// Filtrer les matériaux existants pour cette section
				const withoutCurrentSection = prevMaterials.filter(m => m.section !== selectedSection)
				// Ajouter les nouveaux matériaux
				return [...withoutCurrentSection, ...materials_from_redux]
			})
		}
	}, [materials_from_redux, selectedSection, isLoadingAllMaterials])

	// Filtre les matériaux par catégorie (mode category)
	useEffect(() => {
		const filterMaterials = (category) => {
			let filtered = materials.filter(material => material.newCategory === category)

			if (selectedCategory !== 'all') {
				filtered = filtered.filter(material => material.category === selectedCategory)
			}

			return filtered
		}

		setPractice(filterMaterials('practice'))
		setCulture(filterMaterials('culture'))
		setLiterature(filterMaterials('literature'))
	}, [materials, selectedCategory])

	// Fonction helper pour vérifier si un matériau correspond au statut utilisateur
	const checkIfUserMaterialIsInMaterials = (id) => {
		return user_materials_status.find(userMaterial => userMaterial.material_id === id)
	}

	// Filtre les matériaux pour le mode liste
	const filteredMaterialsForList = useMemo(() => {
		if (displayMode !== 'list') return []

		// Utiliser allLoadedMaterials ou materials_from_redux selon selectedSection
		let materialsToFilter = selectedSection ? materials_from_redux : allLoadedMaterials
		let filtered = [...materialsToFilter].filter(m => m.lang === userLearningLanguage)

		// Filtre par recherche
		if (searchTerm) {
			filtered = filtered.filter(material =>
				material.title.toLowerCase().includes(searchTerm.toLowerCase())
			)
		}

		// Filtre par niveau
		if (selectedLevel) {
			filtered = filtered.filter(material => material.level === selectedLevel)
		}

		// Filtre par statut
		if (selectedStatus) {
			filtered = filtered.filter(material => {
				const userMaterial = checkIfUserMaterialIsInMaterials(material.id)
				if (selectedStatus === 'not_studied') {
					return !userMaterial || (!userMaterial.is_being_studied && !userMaterial.is_studied)
				} else if (selectedStatus === 'is_being_studied') {
					return userMaterial?.is_being_studied
				} else if (selectedStatus === 'is_studied') {
					return userMaterial?.is_studied
				}
				return false
			})
		}

		return filtered
	}, [materials_from_redux, allLoadedMaterials, displayMode, selectedSection, searchTerm, selectedLevel, selectedStatus, userLearningLanguage, user_materials_status])

	// Calcul de la pagination
	const totalMaterials = filteredMaterialsForList.length
	const numOfPages = Math.ceil(totalMaterials / materialsPerPage)
	const startIndex = (page - 1) * materialsPerPage
	const endIndex = page * materialsPerPage
	const paginatedMaterials = filteredMaterialsForList.slice(startIndex, endIndex)

	// Handlers pour le mode liste
	const handleSearchChange = (value) => {
		setSearchTerm(value)
	}

	const handleSectionChange = (section) => {
		setSelectedSection(section)
	}

	const handleLevelChange = (level) => {
		setSelectedLevel(level)
	}

	const handleStatusChange = (status) => {
		setSelectedStatus(status)
	}

	const handleClear = () => {
		setSearchTerm('')
		setSelectedLevel(null)
		setSelectedStatus(null)
		setSelectedSection(null)
	}

	const handleViewChange = (view) => {
		setViewMode(view)
	}

	const toggleDisplayMode = () => {
		setDisplayMode(displayMode === 'category' ? 'list' : 'category')
		// Réinitialiser les filtres lors du changement de mode
		if (displayMode === 'category') {
			handleClear()
		}
	}

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
					pt: { xs: '3.75rem', md: '7rem' },
					pb: { xs: 2.5, md: 4 },
					px: { xs: 2, sm: 3 },
				}}>
				{/* Bouton de toggle entre les modes */}
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						mb: { xs: 3, md: 4 },
					}}>
					<Box
						sx={{
							display: 'inline-flex',
							gap: 1,
							p: { xs: 0.5, md: 0.75 },
							borderRadius: 4,
							background: isDark
								? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
								: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
							border: isDark ? '2px solid rgba(139, 92, 246, 0.3)' : '2px solid rgba(139, 92, 246, 0.2)',
							boxShadow: isDark ? '0 4px 20px rgba(139, 92, 246, 0.25)' : '0 4px 20px rgba(139, 92, 246, 0.15)',
						}}>
						<Button
							variant={displayMode === 'category' ? 'contained' : 'text'}
							onClick={toggleDisplayMode}
							startIcon={<ViewModule />}
							sx={{
								px: { xs: 1.5, sm: 3 },
								py: { xs: 0.85, md: 1 },
								borderRadius: 3,
								fontWeight: 600,
								fontSize: { xs: '0.85rem', sm: '0.95rem' },
								background: displayMode === 'category'
									? 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)'
									: 'transparent',
								color: displayMode === 'category' ? 'white' : isDark ? '#cbd5e1' : '#64748b',
								boxShadow: displayMode === 'category' ? '0 4px 15px rgba(139, 92, 246, 0.4)' : 'none',
								transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
								'&:hover': {
									background: displayMode === 'category'
										? 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)'
										: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
									transform: 'translateY(-2px)',
									boxShadow: displayMode === 'category' ? '0 6px 20px rgba(139, 92, 246, 0.5)' : 'none',
								},
							}}>
							<Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
								{t('categoryView') || 'Vue par catégories'}
							</Box>
							<Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
								{t('categories') || 'Catégories'}
							</Box>
						</Button>
						<Button
							variant={displayMode === 'list' ? 'contained' : 'text'}
							onClick={toggleDisplayMode}
							startIcon={<ViewListIcon />}
							sx={{
								px: { xs: 1.5, sm: 3 },
								py: { xs: 0.85, md: 1 },
								borderRadius: 3,
								fontWeight: 600,
								fontSize: { xs: '0.85rem', sm: '0.95rem' },
								background: displayMode === 'list'
									? 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)'
									: 'transparent',
								color: displayMode === 'list' ? 'white' : isDark ? '#cbd5e1' : '#64748b',
								boxShadow: displayMode === 'list' ? '0 4px 15px rgba(139, 92, 246, 0.4)' : 'none',
								transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
								'&:hover': {
									background: displayMode === 'list'
										? 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)'
										: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
									transform: 'translateY(-2px)',
									boxShadow: displayMode === 'list' ? '0 6px 20px rgba(139, 92, 246, 0.5)' : 'none',
								},
							}}>
							<Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
								{t('listView') || 'Vue liste avec filtres'}
							</Box>
							<Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
								{t('materials') || 'Matériels'}
							</Box>
						</Button>
					</Box>
				</Box>

				{/* Affichage conditionnel en fonction du mode */}
				{displayMode === 'category' ? (
					<>
						{/* Mode catégorie - Affichage actuel */}
						<MaterialsFilter
							selectedCategory={selectedCategory}
							onCategoryChange={setSelectedCategory}
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
							<Box id='practice' sx={{ scrollMarginTop: '100px', mb: { xs: 4, md: 8 } }}>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: { xs: 1.5, md: 2 },
										mb: { xs: 3, md: 4 },
										pb: 2,
										borderBottom: '2px solid',
										borderImage: 'linear-gradient(90deg, rgba(139, 92, 246, 0.5) 0%, transparent 100%) 1',
									}}>
									<Box
										sx={{
											width: { xs: 48, md: 56 },
											height: { xs: 48, md: 56 },
											borderRadius: 3,
											background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
											backdropFilter: 'blur(10px)',
											border: '1px solid rgba(139, 92, 246, 0.3)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											boxShadow: '0 4px 15px rgba(139, 92, 246, 0.2)',
										}}>
										<School sx={{ fontSize: { xs: '1.75rem', md: '2rem' }, color: '#8b5cf6' }} />
									</Box>
									<Typography
										variant='h3'
										sx={{
											fontWeight: 800,
											fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
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
							<Box id='culture' sx={{ scrollMarginTop: '100px', mb: { xs: 4, md: 8 } }}>
								{/* Titre principal */}
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: { xs: 1.5, md: 2 },
										mb: { xs: 3, md: 4 },
										pb: 2,
										borderBottom: '2px solid',
										borderImage: 'linear-gradient(90deg, rgba(139, 92, 246, 0.5) 0%, transparent 100%) 1',
									}}>
									<Box
										sx={{
											width: { xs: 48, md: 56 },
											height: { xs: 48, md: 56 },
											borderRadius: 3,
											background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
											backdropFilter: 'blur(10px)',
											border: '1px solid rgba(139, 92, 246, 0.3)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											boxShadow: '0 4px 15px rgba(139, 92, 246, 0.2)',
										}}>
										<Palette sx={{ fontSize: { xs: '1.75rem', md: '2rem' }, color: '#8b5cf6' }} />
									</Box>
									<Typography
										variant='h3'
										sx={{
											fontWeight: 800,
											fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
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
									<Box sx={{ mb: { xs: 3.5, md: 5 } }}>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												gap: 1.5,
												mb: { xs: 2.5, md: 3 },
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
									<Box sx={{ mb: { xs: 3.5, md: 5 } }}>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												gap: 1.5,
												mb: { xs: 2.5, md: 3 },
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
												mb: { xs: 2.5, md: 3 },
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
							<Box id='literature' sx={{ scrollMarginTop: '100px', mb: { xs: 2.5, md: 6 } }}>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: { xs: 1.5, md: 2 },
										mb: { xs: 3, md: 4 },
										pb: 2,
										borderBottom: '2px solid',
										borderImage: 'linear-gradient(90deg, rgba(139, 92, 246, 0.5) 0%, transparent 100%) 1',
									}}>
									<Box
										sx={{
											width: { xs: 48, md: 56 },
											height: { xs: 48, md: 56 },
											borderRadius: 3,
											background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
											backdropFilter: 'blur(10px)',
											border: '1px solid rgba(139, 92, 246, 0.3)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											boxShadow: '0 4px 15px rgba(139, 92, 246, 0.2)',
										}}>
										<MenuBook sx={{ fontSize: { xs: '1.75rem', md: '2rem' }, color: '#8b5cf6' }} />
									</Box>
									<Typography
										variant='h3'
										sx={{
											fontWeight: 800,
											fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
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
					</>
				) : (
					<>
						{/* Mode liste - Avec filtres avancés */}
						<MaterialsFilterBar
							onSearchChange={handleSearchChange}
							onSectionChange={handleSectionChange}
							onLevelChange={handleLevelChange}
							onStatusChange={handleStatusChange}
							onClear={handleClear}
							onViewChange={handleViewChange}
							searchValue={searchTerm}
							selectedSection={selectedSection}
							selectedLevel={selectedLevel}
							selectedStatus={selectedStatus}
							currentView={viewMode}
							showNotStudiedFilter={true}
							showStudiedFilter={isUserAdmin}
							showSectionFilter={true}
							translationNamespace="materials"
						/>

					{/* Affichage des matériaux filtrés */}
					{(materials_loading || isLoadingAllMaterials) ? (
						<Box
							sx={{
								textAlign: 'center',
								py: 8,
								px: 2,
							}}>
							<Typography
								variant='h5'
								sx={{
									color: isDark ? '#a78bfa' : '#8b5cf6',
									mb: 2,
									fontWeight: 600,
								}}>
								⏳ Chargement des matériaux...
							</Typography>
						</Box>
					) : filteredMaterialsForList.length === 0 ? (
						<Box
							sx={{
								textAlign: 'center',
								py: 8,
								px: 2,
							}}>
							<Typography
								variant='h5'
								sx={{
									color: '#718096',
									mb: 2,
									fontWeight: 600,
								}}>
								{t('noMaterialsFound')}
							</Typography>
							<Typography
								variant='body1'
								sx={{
									color: '#a0aec0',
								}}>
								{t('noMaterialsInCategory') || 'Aucun matériel trouvé dans cette catégorie'}
							</Typography>
						</Box>
						) : viewMode === 'card' ? (
							<>
								<Box
									sx={{
										display: 'grid',
										gridTemplateColumns: {
											xs: '1fr',
											sm: 'repeat(2, 1fr)',
											md: 'repeat(3, 1fr)',
											lg: 'repeat(4, 1fr)',
										},
										rowGap: 3,
										columnGap: 3,
									}}>
									{paginatedMaterials.map(material => (
										<SectionCard
											key={material.id}
											material={material}
											checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials(material.id)}
										/>
									))}
								</Box>
								{numOfPages > 1 && <Pagination numOfPages={numOfPages} />}
							</>
						) : (
							<>
								<MaterialsTable
									materials={paginatedMaterials}
									checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials}
								/>
								{numOfPages > 1 && <Pagination numOfPages={numOfPages} />}
							</>
						)}
					</>
				)}
			</Container>
		</>
	)
}

export default Material
