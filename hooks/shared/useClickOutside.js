/**
 * Hook to detect clicks outside a referenced element
 * @param {React.RefObject} ref - Reference to the element
 * @param {Function} handler - Callback when clicking outside
 */

import { useEffect, useCallback } from 'react'

export function useClickOutside(ref, handler) {
	// Memoize the handler to prevent effect re-runs
	const memoizedHandler = useCallback(handler, [handler])

	useEffect(() => {
		// Only add listener if ref and handler exist
		if (!ref?.current || !memoizedHandler) {
			return
		}

		const handleClickOutside = (event) => {
			if (ref.current && !ref.current.contains(event.target)) {
				memoizedHandler(event)
			}
		}

		// Use requestAnimationFrame to wait for next render before activating listener
		// This prevents the click that opened the popup from immediately closing it
		let rafId = requestAnimationFrame(() => {
			document.addEventListener('mousedown', handleClickOutside)
		})

		return () => {
			cancelAnimationFrame(rafId)
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [ref, memoizedHandler])
}
