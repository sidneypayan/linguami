/**
 * Hook to manage guest user's word count
 * Listens to custom events for word addition/deletion
 */

import { useState, useEffect, useCallback } from 'react'
import { getGuestWordsCount } from '@/utils/guestDictionary'

export function useGuestWordsCount(isUserLoggedIn) {
	const [guestWordsCount, setGuestWordsCount] = useState(0)

	// Reload count from localStorage
	const reloadCount = useCallback(() => {
		if (!isUserLoggedIn && typeof window !== 'undefined') {
			setGuestWordsCount(getGuestWordsCount())
		}
	}, [isUserLoggedIn])

	// Initial load and on login status change
	useEffect(() => {
		reloadCount()
	}, [reloadCount])

	// Listen to custom events
	useEffect(() => {
		if (!isUserLoggedIn && typeof window !== 'undefined') {
			window.addEventListener('guestWordAdded', reloadCount)
			window.addEventListener('guestWordDeleted', reloadCount)

			return () => {
				window.removeEventListener('guestWordAdded', reloadCount)
				window.removeEventListener('guestWordDeleted', reloadCount)
			}
		}
	}, [isUserLoggedIn, reloadCount])

	return guestWordsCount
}
