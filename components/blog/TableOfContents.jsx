import { Box, Typography, List, ListItem, ListItemButton, useTheme } from '@mui/material'
import { useRef } from 'react'
import { slugify } from '@/utils/slugify'
import { useTranslations, useLocale } from 'next-intl'

/**
 * Table des matières générée automatiquement à partir du contenu Markdown
 * Extrait les titres H2 du contenu
 *
 * @param {string} content - Contenu markdown de l'article
 */
export default function TableOfContents({ content }) {
	const t = useTranslations('blog')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const scrollTimeoutRef = useRef(null)
	const isScrollingRef = useRef(false)

	// Extraire les titres H2 du contenu markdown
	const headings = content.match(/^## .+$/gm) || []
	const tocItems = headings.map((heading) => {
		const title = heading.replace('## ', '')
		const id = slugify(title)
		return { title, id }
	})

	if (tocItems.length === 0) return null

	const handleClick = (id, event) => {
		event.preventDefault()

		// Fonction pour faire le scroll
		const scrollToElement = () => {
			const element = document.getElementById(id)

			if (!element) {
				return false
			}

			// Clear tout timeout existant
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current)
			}

			// Si on est déjà en train de scroller, utiliser instant scroll
			const behavior = isScrollingRef.current ? 'auto' : 'smooth'

			isScrollingRef.current = true

			// Calculer la position avec offset
			const offset = 100
			const elementPosition = element.getBoundingClientRect().top + window.scrollY - offset

			// Scroll vers la position
			window.scrollTo({
				top: elementPosition,
				behavior: behavior
			})

			// Réinitialiser le flag après un délai
			scrollTimeoutRef.current = setTimeout(() => {
				isScrollingRef.current = false
			}, 100)

			return true
		}

		// Essayer de scroller immédiatement
		const success = scrollToElement()

		// Si ça échoue, réessayer après un court délai (au cas où le DOM n'est pas encore prêt)
		if (!success) {
			setTimeout(scrollToElement, 50)
		}
	}

	return (
		<Box
			sx={{
				position: 'sticky',
				top: 120,
				maxHeight: 'calc(100vh - 180px)',
				overflowY: 'auto',
				display: { xs: 'none', lg: 'block' },
				'&::-webkit-scrollbar': {
					width: '3px',
				},
				'&::-webkit-scrollbar-thumb': {
					bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
					borderRadius: '3px',
					'&:hover': {
						bgcolor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
					},
				},
			}}>
			<Typography
				variant="h6"
				sx={{
					fontWeight: 600,
					fontSize: '0.875rem',
					color: 'text.secondary',
					mb: 2,
					textTransform: 'uppercase',
					letterSpacing: '0.05em',
				}}>
				{t('tableOfContents')}
			</Typography>
			<List sx={{ p: 0 }}>
				{tocItems.map((item, index) => (
					<ListItem key={index} disablePadding sx={{ mb: 0 }}>
						<ListItemButton
							onClick={(e) => handleClick(item.id, e)}
							sx={{
								py: 1.25,
								px: 0,
								pl: 2,
								borderRadius: 0,
								borderLeft: `2px solid transparent`,
								fontSize: '0.875rem',
								lineHeight: 1.5,
								color: 'text.secondary',
								transition: 'all 0.15s ease',
								'&:hover': {
									bgcolor: 'transparent',
									color: 'primary.main',
									borderLeftColor: 'primary.main',
									pl: 2.5,
								},
							}}>
							{item.title}
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	)
}
