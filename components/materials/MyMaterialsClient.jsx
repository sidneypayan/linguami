'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useMaterialFilters } from '@/hooks/materials/useMaterialFilters'
import SectionCard from '@/components/materials/SectionCard'
import MaterialsTable from '@/components/materials/MaterialsTable'
import MaterialsFilterBar from '@/components/materials/MaterialsFilterBar'

import {
	Box,
	Container,
	IconButton,
	Typography,
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

const UserMaterials = ({ initialMaterials = [] }) => {
	const t = useTranslations('materials')
	const locale = useLocale()
	const router = useRouter()

	// React Query: Hydrate user materials with SSR data
	const { data: userMaterials = [] } = useQuery({
		queryKey: ['userMaterials'],
		queryFn: () => initialMaterials,
		initialData: initialMaterials,
		staleTime: Infinity,
	})

	// Filter hook (without category mode, always in list mode)
	const {
		searchTerm,
		selectedLevel,
		selectedStatus,
		selectedSection,
		viewMode,
		filteredMaterials,
		handleSearchChange,
		handleLevelChange,
		handleStatusChange,
		handleSectionChange,
		handleViewModeChange,
		clearFilters,
	} = useMaterialFilters(
		// Exclude books and book-chapters
		userMaterials.filter(material =>
			material.section !== 'books' && material.section !== 'book-chapters'
		),
		[], // No user status needed here (materials are already filtered by user)
		null // No user level needed
	)

	const checkIfUserMaterialIsInMaterials = id => {
		return userMaterials.find(material => material.id === id)
	}

	return (
		<>
			{/* Header Section - App Style */}
			<Box
				sx={{
					display: { xs: 'none', lg: 'block' },
					pt: { xs: '3.75rem', md: '6rem' },
					pb: { xs: 2, md: 2.5 },
					borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
					bgcolor: 'background.paper',
				}}>
				<Container maxWidth='lg'>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 }, mb: { xs: 1.25, md: 1.5 } }}>
						<IconButton
							sx={{
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
								border: '1px solid rgba(139, 92, 246, 0.3)',
								color: '#8b5cf6',
								width: { xs: 40, md: 44 },
								height: { xs: 40, md: 44 },
								transition: 'all 0.3s ease',
								'&:hover': {
									background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
									transform: 'scale(1.05)',
								},
							}}
							aria-label='back'
							onClick={() => router.back()}>
							<ArrowBack fontSize='medium' />
						</IconButton>
						<Box>
							<Typography
								variant='h4'
								sx={{
									fontWeight: 700,
									fontSize: { xs: '1.5rem', sm: '2rem' },
									background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									mb: 0.5,
								}}>
								{t('myMaterialsTitle')}
							</Typography>
							<Typography
								variant='body2'
								sx={{
									color: '#64748b',
									fontSize: { xs: '0.875rem', sm: '0.9375rem' },
								}}>
								{filteredMaterials.length} {filteredMaterials.length <= 1 ? t('material') : t('materials')}
							</Typography>
						</Box>
					</Box>
				</Container>
			</Box>

			<Container sx={{ pt: { xs: '3.75rem', lg: 2.5 }, pb: { xs: 2.5, md: 4 } }}>

				{/* Mobile Title - Hidden on desktop */}
				<Box
					sx={{
						display: { xs: 'flex', lg: 'none' },
						alignItems: 'center',
						justifyContent: 'space-between',
						mb: 2.5,
						pb: 1.5,
						borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
					}}>
					<Box>
						<Typography
							variant='h5'
							sx={{
								fontWeight: 700,
								fontSize: '1.5rem',
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								mb: 0.25,
							}}>
							{t('myMaterialsTitle')}
						</Typography>
						<Typography
							variant='body2'
							sx={{
								color: '#64748b',
								fontSize: '0.875rem',
							}}>
							{filteredMaterials.length} {filteredMaterials.length <= 1 ? t('material') : t('materials')}
						</Typography>
					</Box>
				</Box>

				<MaterialsFilterBar
					onSearchChange={handleSearchChange}
					onSectionChange={handleSectionChange}
					onLevelChange={handleLevelChange}
					onStatusChange={handleStatusChange}
					onClear={clearFilters}
					onViewChange={handleViewModeChange}
					searchValue={searchTerm}
					selectedSection={selectedSection}
					selectedLevel={selectedLevel}
					selectedStatus={selectedStatus}
					currentView={viewMode}
					showNotStudiedFilter={false}
					showSectionFilter={true}
					translationNamespace="materials"
				/>

				{/* Materials display */}
				{filteredMaterials.length === 0 ? (
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
							{t('noMaterialsInCategory')}
						</Typography>
					</Box>
				) : viewMode === 'card' ? (
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: {
								xs: '1fr',
								sm: 'repeat(2, 1fr)',
								md: 'repeat(3, 1fr)',
								lg: 'repeat(4, 1fr)',
							},
							rowGap: { xs: 2, md: 3 },
							columnGap: { xs: 2, md: 3 },
						}}>
						{filteredMaterials.map(material => (
							<SectionCard
								key={material.id}
								material={material}
								checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials(material.id)}
							/>
						))}
					</Box>
				) : (
					<MaterialsTable
						materials={filteredMaterials}
						checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials}
					/>
				)}
			</Container>
		</>
	)
}

export default UserMaterials
