import { useSelector, useDispatch } from 'react-redux'
import { changePage } from '../../features/materials/materialsSlice'
import { Box, IconButton, Button, Stack, useTheme } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'

const Pagination = ({ numOfPages: numOfPagesProp }) => {
	const { numOfPages: numOfPagesRedux, page } = useSelector(store => store.materials)
	const dispatch = useDispatch()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	// Utiliser la prop si fournie, sinon utiliser la valeur Redux
	const numOfPages = numOfPagesProp !== undefined ? numOfPagesProp : numOfPagesRedux

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
						width: '44px',
						height: '44px',
						backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'white',
						color: isDark ? '#cbd5e1' : 'inherit',
						border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.2)',
						borderRadius: 2,
						transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
						position: 'relative',
						overflow: 'hidden',
						boxShadow: isDark ? '0 2px 6px rgba(139, 92, 246, 0.15)' : '0 2px 6px rgba(139, 92, 246, 0.08)',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: 0,
							left: '-100%',
							width: '100%',
							height: '100%',
							background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
							transition: 'left 0.5s ease',
						},
						'&:hover': {
							background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 182, 212, 0.8) 100%)',
							borderColor: 'rgba(139, 92, 246, 0.8)',
							color: 'white',
							transform: 'translateX(-3px) scale(1.05)',
							boxShadow: '0 6px 16px rgba(139, 92, 246, 0.5), 0 0 25px rgba(6, 182, 212, 0.3)',
							'&::before': {
								left: '100%',
							},
						},
						'&:disabled': {
							backgroundColor: isDark ? 'rgba(30, 41, 59, 0.4)' : '#f5f5f5',
							borderColor: 'rgba(139, 92, 246, 0.1)',
							opacity: 0.4,
							color: isDark ? '#475569' : 'inherit',
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
									color: isDark ? '#cbd5e1' : '#718096',
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
								minWidth: '44px',
								height: '44px',
								borderRadius: 2,
								fontWeight: 700,
								fontSize: '1rem',
								border: '1px solid',
								borderColor: page === pageNumber ? 'rgba(139, 92, 246, 0.6)' : (isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'),
								background: page === pageNumber
									? 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 182, 212, 0.8) 100%)'
									: (isDark ? 'rgba(30, 41, 59, 0.8)' : 'white'),
								color: page === pageNumber ? 'white' : (isDark ? '#cbd5e1' : '#4a5568'),
								transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
								position: 'relative',
								overflow: 'hidden',
								boxShadow: page === pageNumber
									? '0 4px 12px rgba(139, 92, 246, 0.4), 0 0 20px rgba(6, 182, 212, 0.2)'
									: '0 2px 6px rgba(139, 92, 246, 0.08)',
								'&::before': {
									content: '""',
									position: 'absolute',
									top: 0,
									left: '-100%',
									width: '100%',
									height: '100%',
									background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
									transition: 'left 0.5s ease',
								},
								'&:hover': {
									borderColor: 'rgba(139, 92, 246, 0.8)',
									background: page === pageNumber
										? 'linear-gradient(135deg, rgba(139, 92, 246, 1) 0%, rgba(6, 182, 212, 0.9) 100%)'
										: 'rgba(139, 92, 246, 0.08)',
									transform: 'translateY(-2px) scale(1.05)',
									boxShadow: page === pageNumber
										? '0 6px 16px rgba(139, 92, 246, 0.5), 0 0 25px rgba(6, 182, 212, 0.3)'
										: '0 4px 12px rgba(139, 92, 246, 0.25)',
									'&::before': {
										left: '100%',
									},
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
						width: '44px',
						height: '44px',
						backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'white',
						color: isDark ? '#cbd5e1' : 'inherit',
						border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.2)',
						borderRadius: 2,
						transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
						position: 'relative',
						overflow: 'hidden',
						boxShadow: isDark ? '0 2px 6px rgba(139, 92, 246, 0.15)' : '0 2px 6px rgba(139, 92, 246, 0.08)',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: 0,
							left: '-100%',
							width: '100%',
							height: '100%',
							background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
							transition: 'left 0.5s ease',
						},
						'&:hover': {
							background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 182, 212, 0.8) 100%)',
							borderColor: 'rgba(139, 92, 246, 0.8)',
							color: 'white',
							transform: 'translateX(3px) scale(1.05)',
							boxShadow: '0 6px 16px rgba(139, 92, 246, 0.5), 0 0 25px rgba(6, 182, 212, 0.3)',
							'&::before': {
								left: '100%',
							},
						},
						'&:disabled': {
							backgroundColor: isDark ? 'rgba(30, 41, 59, 0.4)' : '#f5f5f5',
							borderColor: 'rgba(139, 92, 246, 0.1)',
							opacity: 0.4,
							color: isDark ? '#475569' : 'inherit',
						},
					}}>
					<ChevronRight />
				</IconButton>
			</Stack>
		</Box>
	)
}

export default Pagination
