'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter, useParams, usePathname, useSearchParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Box, Container, IconButton, Typography } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useUserContext } from '@/context/user'
import {
  addBeingStudiedMaterial,
  removeBeingStudiedMaterial,
  addMaterialToStudied,
  getMaterialsBySectionAction,
} from '@/app/actions/materials'
import SectionCard from '@/components/materials/SectionCard'
import BookCard from '@/components/materials/BookCard'
import MaterialsTable from '@/components/materials/MaterialsTable'
import MaterialsFilterBar from '@/components/materials/MaterialsFilterBar'
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
  const { userProfile, isUserAdmin, userLearningLanguage, changeLearningLanguage } = useUserContext()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  // Local UI state
  const [viewMode, setViewMode] = useState('card')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [hasAppliedDefaultFilter, setHasAppliedDefaultFilter] = useState(false)

  // Read page from URL query params
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  const prevPathnameRef = useRef(pathname)

  // Synchronize context with server language at mount to avoid mismatches
  useEffect(() => {
    // If server fetched with a different language than context has, sync context to match server
    if (learningLanguage && userLearningLanguage && learningLanguage !== userLearningLanguage) {
      changeLearningLanguage(learningLanguage)
    }
  }, []) // Only run once at mount

  // React Query: Fetch materials based on user's learning language
  // When userLearningLanguage changes, React Query will automatically refetch
  const { data: materials = [] } = useQuery({
    queryKey: ['materials', section, userLearningLanguage],
    queryFn: () => getMaterialsBySectionAction(userLearningLanguage, section),
    // Always use SSR data - React Query will invalidate cache if queryKey changes
    initialData: initialMaterials,
    enabled: !!userLearningLanguage,
    staleTime: 5 * 60 * 1000, // 5 minutes
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

    // Note: Materials are already filtered by language in the query (getMaterialsBySectionAction)
    // No need to filter by language here

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
  }, [materials, selectedLevel, selectedStatus, searchTerm, userMaterialsStatus])

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

  // Helper to update URL with page number
  const updatePage = (page) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', page.toString())
    }
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.push(newUrl, { scroll: false })
  }

  // Handlers
  const handleViewChange = view => setViewMode(view)
  const handleSearchChange = value => {
    setSearchTerm(value)
    updatePage(1) // Reset to page 1 on search
  }
  const handleLevelChange = level => {
    setSelectedLevel(level)
    updatePage(1)
  }
  const handleStatusChange = status => {
    setSelectedStatus(status)
    updatePage(1)
  }
  const handleClear = () => {
    setSearchTerm('')
    setSelectedLevel(null)
    setSelectedStatus(null)
    updatePage(1)
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
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(4, 1fr)',
                  lg: 'repeat(5, 1fr)',
                },
                rowGap: { xs: 1.5, md: 3 },
                columnGap: { xs: 1.5, md: 3 },
                mx: { xs: -0.5, sm: 0 },
                opacity: displayedMaterials.length > 0 ? 1 : 0,
                transition: 'opacity 0.15s ease-in',
              }}
            >
              {displayedMaterials.map(material => {
                // Use BookCard for books section, SectionCard for materials
                if (section === 'books') {
                  return (
                    <BookCard
                      key={material.id}
                      book={material}
                      checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials(
                        material.id
                      )}
                    />
                  )
                }
                return (
                  <SectionCard
                    key={material.id}
                    material={material}
                    checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials(
                      material.id
                    )}
                  />
                )
              })}
            </Box>
          ) : (
            <MaterialsTable
              materials={displayedMaterials}
              checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials}
              section={section}
            />
          )}

          {numOfPages > 1 && (
            <Pagination
              numOfPages={numOfPages}
              currentPage={safePage}
              onPageChange={updatePage}
            />
          )}
        </Box>
      </Container>
    </>
  )
}
