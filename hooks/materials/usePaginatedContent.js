'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'

// Default characters per page (approximately 2000 chars is readable)
const DEFAULT_CHARS_PER_PAGE = 2000

/**
 * Hook to paginate text content by character count
 * Splits at sentence boundaries to avoid cutting words/sentences
 * @param {string} content - The full text content
 * @param {number} charsPerPage - Approximate characters per page (default: 2000)
 * @param {number} initialPage - Initial page to start on (default: 1)
 * @returns {Object} - Pagination state and controls
 */
export function usePaginatedContent(content, charsPerPage = DEFAULT_CHARS_PER_PAGE, initialPage = 1) {
	const [currentPage, setCurrentPage] = useState(initialPage)
	const [hasUserNavigated, setHasUserNavigated] = useState(false)

	// Sync with initialPage when it changes (e.g., from server data loading)
	// Only sync if user hasn't manually navigated yet
	useEffect(() => {
		if (!hasUserNavigated && initialPage !== currentPage) {
			setCurrentPage(initialPage)
		}
	}, [initialPage, hasUserNavigated, currentPage])

	// Split content into pages by character count (at sentence boundaries)
	const pages = useMemo(() => {
		if (!content) return []

		const contentLength = content.length
		if (contentLength <= charsPerPage) {
			return [content]
		}

		const result = []
		let startIndex = 0

		while (startIndex < contentLength) {
			let endIndex = startIndex + charsPerPage

			// If we're not at the end, find a good break point
			if (endIndex < contentLength) {
				// Look for sentence endings (. ! ? followed by space or newline) within a range
				const searchStart = Math.max(startIndex + Math.floor(charsPerPage * 0.7), startIndex)
				const searchEnd = Math.min(endIndex + 200, contentLength)
				const searchText = content.substring(searchStart, searchEnd)

				// Find the best break point (sentence end)
				let lastGoodBreak = -1
				for (const match of searchText.matchAll(/[.!?。？！]\s/g)) {
					const breakPos = searchStart + match.index + match[0].length
					if (breakPos <= endIndex + 100) {
						lastGoodBreak = breakPos
					}
				}

				if (lastGoodBreak > startIndex) {
					endIndex = lastGoodBreak
				} else {
					// No sentence end found, try to break at newline or space
					const newlinePos = content.lastIndexOf('\n', endIndex)
					const spacePos = content.lastIndexOf(' ', endIndex)
					const breakPos = Math.max(newlinePos, spacePos)
					if (breakPos > startIndex + charsPerPage * 0.5) {
						endIndex = breakPos + 1
					}
				}
			} else {
				endIndex = contentLength
			}

			const pageContent = content.substring(startIndex, endIndex).trim()
			if (pageContent.length > 0) {
				result.push(pageContent)
			}
			startIndex = endIndex
		}

		return result
	}, [content, charsPerPage])

	// Calculate total pages
	const totalPages = pages.length

	// Get current page's content
	const paginatedContent = useMemo(() => {
		if (totalPages <= 1) {
			return content
		}
		return pages[currentPage - 1] || ''
	}, [content, pages, currentPage, totalPages])

	// Navigation functions
	const goToPage = useCallback((page) => {
		const newPage = Math.max(1, Math.min(page, totalPages))
		setCurrentPage(newPage)
		setHasUserNavigated(true)
	}, [totalPages])

	const nextPage = useCallback(() => {
		if (currentPage < totalPages) {
			setCurrentPage(prev => prev + 1)
			setHasUserNavigated(true)
		}
	}, [currentPage, totalPages])

	const prevPage = useCallback(() => {
		if (currentPage > 1) {
			setCurrentPage(prev => prev - 1)
			setHasUserNavigated(true)
		}
	}, [currentPage])

	const goToFirst = useCallback(() => {
		setCurrentPage(1)
		setHasUserNavigated(true)
	}, [])

	const goToLast = useCallback(() => {
		setCurrentPage(totalPages)
		setHasUserNavigated(true)
	}, [totalPages])

	// Check if pagination is needed (more than 1 page)
	const isPaginated = totalPages > 1

	return {
		// Current page content
		paginatedContent,

		// Pagination state
		currentPage,
		totalPages,
		isPaginated,

		// Navigation functions
		goToPage,
		nextPage,
		prevPage,
		goToFirst,
		goToLast,

		// Helper booleans
		hasNextPage: currentPage < totalPages,
		hasPrevPage: currentPage > 1,

		// Stats
		totalCharacters: content?.length || 0,
		charsPerPage,
	}
}

export default usePaginatedContent
