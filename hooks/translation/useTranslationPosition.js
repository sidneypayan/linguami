/**
 * Hook to calculate smart position for translation popup
 * Prevents overflow and adapts to mobile/desktop
 */

import { useMemo } from 'react'

const CONTAINER_WIDTH_DESKTOP = 380
const CONTAINER_WIDTH_MOBILE = 350
const CONTAINER_HEIGHT = 500
const PADDING = 20
const MOBILE_BREAKPOINT = 600

export function useTranslationPosition(coordinates, isOpen) {
	return useMemo(() => {
		// Server-side or not open - return default
		if (!isOpen || typeof window === 'undefined') {
			return {
				left: `${coordinates.x}px`,
				top: `${coordinates.y}px`,
			}
		}

		const viewportWidth = window.innerWidth
		const viewportHeight = window.innerHeight
		const isMobile = viewportWidth <= MOBILE_BREAKPOINT

		// Calculate container dimensions
		const containerWidth = isMobile
			? Math.min(viewportWidth - 40, CONTAINER_WIDTH_MOBILE)
			: CONTAINER_WIDTH_DESKTOP

		const offset = isMobile ? 25 : 2 // More space on mobile

		// Initial position: close to clicked word
		let left = isMobile ? 20 : coordinates.x - 10
		let top = coordinates.y + offset

		// Horizontal adjustment
		// If overflows right, position to the left of click
		if (left + containerWidth > viewportWidth - PADDING) {
			left = coordinates.x - containerWidth
			// If also overflows left, center as much as possible
			if (left < PADDING) {
				left = Math.max(PADDING, (viewportWidth - containerWidth) / 2)
			}
		}

		// Ensure not overflow left
		if (left < PADDING) {
			left = PADDING
		}

		// Vertical adjustment
		// If overflows bottom, position above click point
		if (top + CONTAINER_HEIGHT > viewportHeight - PADDING) {
			top = coordinates.y - CONTAINER_HEIGHT - offset
			// If also overflows top, adjust to be visible
			if (top < PADDING) {
				top = Math.max(PADDING, viewportHeight - CONTAINER_HEIGHT - PADDING)
			}
		}

		// Ensure not overflow top
		if (top < PADDING) {
			top = PADDING
		}

		return {
			left: `${left}px`,
			top: `${top}px`,
		}
	}, [coordinates.x, coordinates.y, isOpen])
}
