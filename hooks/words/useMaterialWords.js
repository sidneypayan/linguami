/**
 * Hook to manage material words for both logged-in users and guests
 * Handles React Query for logged-in users and localStorage for guests
 */

import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMaterialWords } from '@/lib/words-client'
import { getGuestWords } from '@/utils/guestDictionary'

export function useMaterialWords({ materialId, userId, isUserLoggedIn }) {
	const [guestWords, setGuestWords] = useState([])

	// Normalize materialId to string for consistent queryKey
	const normalizedMaterialId = materialId ? String(materialId) : null

	// For logged-in users: React Query
	const { data: userWords = [], isLoading } = useQuery({
		queryKey: ['materialWords', normalizedMaterialId, userId],
		queryFn: () => getMaterialWords({ materialId: normalizedMaterialId, userId }),
		enabled: !!userId && !!normalizedMaterialId && isUserLoggedIn,
		staleTime: 5 * 60 * 1000, // 5 minutes
	})

	// Load guest words from localStorage
	const loadGuestWords = useCallback(() => {
		if (!isUserLoggedIn && typeof window !== 'undefined' && materialId) {
			const words = getGuestWords()
			// Filter by material ID
			const materialWords = words.filter(
				word => String(word.material_id) === String(materialId)
			)
			setGuestWords(materialWords)
		}
	}, [isUserLoggedIn, materialId])

	// Initial load
	useEffect(() => {
		loadGuestWords()
	}, [loadGuestWords])

	// Listen to guest word events
	useEffect(() => {
		if (!isUserLoggedIn && typeof window !== 'undefined') {
			window.addEventListener('guestWordAdded', loadGuestWords)
			window.addEventListener('guestWordDeleted', loadGuestWords)

			return () => {
				window.removeEventListener('guestWordAdded', loadGuestWords)
				window.removeEventListener('guestWordDeleted', loadGuestWords)
			}
		}
	}, [isUserLoggedIn, loadGuestWords])

	// Return appropriate data based on user status
	return {
		words: isUserLoggedIn ? userWords : guestWords,
		isLoading: isUserLoggedIn ? isLoading : false,
	}
}
