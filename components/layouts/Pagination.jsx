import { useSelector, useDispatch } from 'react-redux'
import { changePage } from '../../features/materials/materialsSlice'
import { Box, IconButton, Button, Stack } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'

const Pagination = () => {
	const { numOfPages, page } = useSelector(store => store.materials)
	const dispatch = useDispatch()

	const nextPage = () => {
		let newPage = page + 1
		if (newPage > numOfPages) {
			newPage = 1
		}
		dispatch(changePage(newPage))
	}

	const prevPage = () => {
		let newPage = page - 1
		if (newPage < 1) {
			newPage = numOfPages
		}
		dispatch(changePage(newPage))
	}

	// Générer les numéros de page à afficher
	const getPageNumbers = () => {
		const pages = []
		const maxVisible = 5 // Nombre maximum de pages visibles

		if (numOfPages <= maxVisible) {
			// Si peu de pages, afficher toutes
			for (let i = 1; i <= numOfPages; i++) {
				pages.push(i)
			}
		} else {
			// Toujours afficher la première page
			pages.push(1)

			// Calculer la plage autour de la page actuelle
			let start = Math.max(2, page - 1)
			let end = Math.min(numOfPages - 1, page + 1)

			// Ajuster si on est au début
			if (page <= 3) {
				end = 4
			}

			// Ajuster si on est à la fin
			if (page >= numOfPages - 2) {
				start = numOfPages - 3
			}

			// Ajouter "..." si nécessaire
			if (start > 2) {
				pages.push('...')
			}

			// Ajouter les pages du milieu
			for (let i = start; i <= end; i++) {
				pages.push(i)
			}

			// Ajouter "..." si nécessaire
			if (end < numOfPages - 1) {
				pages.push('...')
			}

			// Toujours afficher la dernière page
			pages.push(numOfPages)
		}

		return pages
	}

	const pageNumbers = getPageNumbers()

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				mt: 5,
				mb: 3,
			}}>
			<Stack direction='row' spacing={1} alignItems='center'>
				{/* Bouton précédent */}
				<IconButton
					onClick={prevPage}
					disabled={page === 1}
					sx={{
						backgroundColor: 'rgba(255, 255, 255, 0.9)',
						border: '2px solid #e0e0e0',
						transition: 'all 0.2s ease',
						'&:hover': {
							backgroundColor: '#667eea',
							borderColor: '#667eea',
							color: 'white',
							transform: 'translateX(-2px)',
						},
						'&:disabled': {
							backgroundColor: '#f5f5f5',
							borderColor: '#e0e0e0',
							opacity: 0.5,
						},
					}}>
					<ChevronLeft />
				</IconButton>

				{/* Numéros de page */}
				{pageNumbers.map((pageNumber, index) => {
					if (pageNumber === '...') {
						return (
							<Box
								key={`dots-${index}`}
								sx={{
									px: 1,
									color: '#718096',
									fontWeight: 600,
								}}>
								...
							</Box>
						)
					}

					return (
						<Button
							key={pageNumber}
							onClick={() => dispatch(changePage(pageNumber))}
							variant={page === pageNumber ? 'contained' : 'outlined'}
							sx={{
								minWidth: '40px',
								height: '40px',
								borderRadius: 2,
								fontWeight: 600,
								fontSize: '0.95rem',
								border: '2px solid',
								borderColor: page === pageNumber ? '#667eea' : '#e0e0e0',
								background:
									page === pageNumber
										? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
										: 'rgba(255, 255, 255, 0.9)',
								color: page === pageNumber ? 'white' : '#4a5568',
								transition: 'all 0.2s ease',
								'&:hover': {
									borderColor: '#667eea',
									backgroundColor:
										page === pageNumber
											? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
											: 'rgba(102, 126, 234, 0.1)',
									transform: 'translateY(-2px)',
									boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
								},
							}}>
							{pageNumber}
						</Button>
					)
				})}

				{/* Bouton suivant */}
				<IconButton
					onClick={nextPage}
					disabled={page === numOfPages}
					sx={{
						backgroundColor: 'rgba(255, 255, 255, 0.9)',
						border: '2px solid #e0e0e0',
						transition: 'all 0.2s ease',
						'&:hover': {
							backgroundColor: '#667eea',
							borderColor: '#667eea',
							color: 'white',
							transform: 'translateX(2px)',
						},
						'&:disabled': {
							backgroundColor: '#f5f5f5',
							borderColor: '#e0e0e0',
							opacity: 0.5,
						},
					}}>
					<ChevronRight />
				</IconButton>
			</Stack>
		</Box>
	)
}

export default Pagination
