'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'

/**
 * Hook to paginate text content by paragraphs
 * @param {string} content - The full text content
 * @param {number} paragraphsPerPage - Number of paragraphs per page (default: 5)
 * @param {number} initialPage - Initial page to start on (default: 1)
 * @returns {Object} - Pagination state and controls
 */
export function usePaginatedContent(content, paragraphsPerPage = 5, initialPage = 1) {
	const [currentPage, setCurrentPage] = useState(initialPage)
	const [hasUserNavigated, setHasUserNavigated] = useState(false)

	// Sync with initialPage when it changes (e.g., from server data loading)
	// Only sync if user hasn't manually navigated yet
	useEffect(() => {
		if (!hasUserNavigated && initialPage !== currentPage) {
			setCurrentPage(initialPage)
		}
	}, [initialPage, hasUserNavigated, currentPage])

	// Split content into paragraphs
	const paragraphs = useMemo(() => {
		if (!content) return []

		// Split by double newlines or single newlines (paragraphs)
		const parts = content.split(/\n\n|\r\n\r\n/)

		// Filter out empty paragraphs and trim whitespace
		return parts
			.map(p => p.trim())
			.filter(p => p.length > 0)
	}, [content])

	// Calculate total pages
	const totalPages = useMemo(() => {
		return Math.ceil(paragraphs.length / paragraphsPerPage)
	}, [paragraphs.length, paragraphsPerPage])

	// Get current page's content
	const paginatedContent = useMemo(() => {
		if (totalPages <= 1) {
			// No pagination needed, return original content
			return content
		}

		const startIndex = (currentPage - 1) * paragraphsPerPage
		const endIndex = startIndex + paragraphsPerPage
		const pageParas = paragraphs.slice(startIndex, endIndex)

		// Join paragraphs back with double newlines
		return pageParas.join('\n\n')
	}, [content, paragraphs, currentPage, paragraphsPerPage, totalPages])

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
		totalParagraphs: paragraphs.length,
		paragraphsPerPage,
	}
}

export default usePaginatedContent
