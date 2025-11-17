'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter, useParams, usePathname } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Box, Container, IconButton, Typography } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useUserContext } from '@/context/user'
import {
  addBeingStudiedMaterial,
  removeBeingStudiedMaterial,
  addMaterialToStudied,
} from '@/app/actions/materials'
import SectionCard from '@/components/SectionCard'
import MaterialsTable from '@/components/MaterialsTable'
import MaterialsFilterBar from '@/components/MaterialsFilterBar'
import Pagination from '@/components/layouts/Pagination'
import toast from '@/utils/toast'
import { getToastMessage } from '@/utils/toastMessages'
import { logger } from '@/utils/logger'

export default function SectionPageClient({
  initialMaterials = [],
  initialUserMaterialsStatus = [],
  section,
  learningLanguage,
}) {
  const t = useTranslations('materials')
  const locale = useLocale()
  const { userProfile, isUserAdmin } = useUserContext()
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  // Local UI state
  const [viewMode, setViewMode] = useState('card')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [hasAppliedDefaultFilter, setHasAppliedDefaultFilter] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const prevPathnameRef = useRef(pathname)

  // React Query: Hydrate materials with SSR data
  const { data: materials = [] } = useQuery({
    queryKey: ['materials', section, learningLanguage],
    queryFn: () => initialMaterials, // Won't refetch, uses initialData
    initialData: initialMaterials,
    staleTime: Infinity, // SSR data is fresh
  })

  // React Query: Hydrate user materials status
  const { data: userMaterialsStatus = [] } = useQuery({
    queryKey: ['userMaterialsStatus'],
    queryFn: () => initialUserMaterialsStatus,
    initialData: initialUserMaterialsStatus,
    staleTime: Infinity,
  })

  // Local filtering logic (client-side)
  const filteredMaterials = useMemo(() => {
    let result = [...materials]

    // Filter by learning language
    result = result.filter(m => m.lang === learningLanguage)

    // Filter by level
    if (selectedLevel && selectedLevel !== 'all') {
      result = result.filter(m => m.level === selectedLevel)
    }

    // Filter by status
    if (selectedStatus) {
      if (selectedStatus === 'not_studied') {
        const materialIdsWithStatus = userMaterialsStatus
          .filter(um => um.is_being_studied || um.is_studied)
          .map(um => um.material_id)
        result = result.filter(m => !materialIdsWithStatus.includes(m.id))
      } else {
        const materialIdsWithStatus = userMaterialsStatus
          .filter(um => um[selectedStatus])
          .map(um => um.material_id)
        result = result.filter(m => materialIdsWithStatus.includes(m.id))
      }
    }

    // Filter by search
    if (searchTerm) {
      result = result.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return result
  }, [materials, learningLanguage, selectedLevel, selectedStatus, searchTerm, userMaterialsStatus])

  // Pagination
  const itemsPerPage = viewMode === 'card' ? 8 : 10
  const numOfPages = Math.ceil(filteredMaterials.length / itemsPerPage)
  const safePage = Math.min(currentPage, Math.max(1, numOfPages)) || 1
  const sliceStart = (safePage - 1) * itemsPerPage
  const sliceEnd = safePage * itemsPerPage
  const displayedMaterials = filteredMaterials.slice(sliceStart, sliceEnd)

  // Helper to check if material has user status
  const checkIfUserMaterialIsInMaterials = id => {
    return userMaterialsStatus.find(um => um.material_id === id)
  }

  // Handlers
  const handleViewChange = view => setViewMode(view)
  const handleSearchChange = value => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to page 1 on search
  }
  const handleLevelChange = level => {
    setSelectedLevel(level)
    setCurrentPage(1)
  }
  const handleStatusChange = status => {
    setSelectedStatus(status)
    setCurrentPage(1)
  }
  const handleClear = () => {
    setSearchTerm('')
    setSelectedLevel(null)
    setSelectedStatus(null)
    setCurrentPage(1)
  }

  // Restore filters from localStorage on mount
  useEffect(() => {
    if (!section || section === 'books') return

    const prevPath = prevPathnameRef.current || ''
    const isReturningFromMaterial =
      prevPath.includes(`/materials/${section}/`) &&
      prevPath !== pathname &&
      pathname.includes(`/materials/${section}`) &&
      !pathname.includes(`/materials/${section}/`)

    const shouldRestore = !hasAppliedDefaultFilter || isReturningFromMaterial

    if (shouldRestore) {
      const storageKey = `materials_section_${section}_filters`
      const savedFilters = localStorage.getItem(storageKey)

      if (savedFilters) {
        try {
          const { level, status, search } = JSON.parse(savedFilters)
          setSelectedLevel(level ?? null)
          setSelectedStatus(status ?? null)
          setSearchTerm(search ?? '')
          setHasAppliedDefaultFilter(true)
        } catch (error) {
          logger.error('Error restoring filters:', error)
        }
      } else if (!hasAppliedDefaultFilter) {
        setHasAppliedDefaultFilter(true)
      }
    }

    prevPathnameRef.current = pathname
  }, [section, pathname, hasAppliedDefaultFilter])

  // Save filters to localStorage
  useEffect(() => {
    if (!section || section === 'books' || !hasAppliedDefaultFilter) return

    const storageKey = `materials_section_${section}_filters`
    const filtersToSave = {
      level: selectedLevel,
      status: selectedStatus,
      search: searchTerm,
    }
    localStorage.setItem(storageKey, JSON.stringify(filtersToSave))
  }, [section, selectedLevel, selectedStatus, searchTerm, hasAppliedDefaultFilter])

  // Apply default filters for authenticated users
  useEffect(() => {
    if (
      userProfile?.language_level &&
      section &&
      section !== 'books' &&
      !hasAppliedDefaultFilter
    ) {
      const storageKey = `materials_section_${section}_filters`
      const savedFilters = localStorage.getItem(storageKey)

      if (!savedFilters) {
        const userLevel = userProfile.language_level
        setSelectedLevel(userLevel)
        setSelectedStatus('not_studied')
        setHasAppliedDefaultFilter(true)
      }
    }
  }, [userProfile?.language_level, section, hasAppliedDefaultFilter])

  return (
    <>
      {/* Compact Header - Hidden on mobile/tablet */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'block' },
          pt: { xs: '3.75rem', md: '6rem' },
          pb: { xs: 2, md: 2.5 },
          borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
          bgcolor: 'background.paper',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1.5, md: 2 },
              mb: { xs: 1.25, md: 1.5 },
            }}
          >
            <IconButton
              sx={{
                background:
                  'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                color: '#8b5cf6',
                width: { xs: 40, md: 44 },
                height: { xs: 40, md: 44 },
                transition: 'all 0.3s ease',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                  transform: 'scale(1.05)',
                },
              }}
              aria-label="back"
              onClick={() => router.back()}
            >
              <ArrowBack fontSize="medium" />
            </IconButton>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '2rem' },
                background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                flex: 1,
              }}
            >
              {section && t(section)}
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: '3.75rem', lg: 2.5 },
          pb: { xs: 2.5, md: 4 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '100%' }}>
          <MaterialsFilterBar
            onSearchChange={handleSearchChange}
            onLevelChange={handleLevelChange}
            onStatusChange={handleStatusChange}
            onClear={handleClear}
            onViewChange={handleViewChange}
            searchValue={searchTerm}
            selectedLevel={selectedLevel}
            selectedStatus={selectedStatus}
            currentView={viewMode}
            showNotStudiedFilter={true}
            showStudiedFilter={isUserAdmin}
            translationNamespace="materials"
          />

          {viewMode === 'card' ? (
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
                opacity: displayedMaterials.length > 0 ? 1 : 0,
                transition: 'opacity 0.15s ease-in',
              }}
            >
              {displayedMaterials.map(material => (
                <SectionCard
                  key={material.id}
                  material={material}
                  checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials(
                    material.id
                  )}
                />
              ))}
            </Box>
          ) : (
            <MaterialsTable
              materials={displayedMaterials}
              checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials}
            />
          )}

          {numOfPages > 1 && (
            <Pagination
              numOfPages={numOfPages}
              currentPage={safePage}
              onPageChange={setCurrentPage}
            />
          )}
        </Box>
      </Container>
    </>
  )
}
