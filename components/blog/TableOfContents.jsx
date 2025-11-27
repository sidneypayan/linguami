'use client'

import { useRef } from 'react'
import { useThemeMode } from '@/context/ThemeContext'
import { useTranslations } from 'next-intl'
import { slugify } from '@/utils/slugify'
import { cn } from '@/lib/utils'
import { List } from 'lucide-react'

/**
 * Table des matieres generee automatiquement a partir du contenu Markdown
 * Extrait les titres H2 du contenu
 *
 * @param {string} content - Contenu markdown de l'article
 */
export default function TableOfContents({ content }) {
	const t = useTranslations('blog')
	const { isDark } = useThemeMode()
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

			// Si on est deja en train de scroller, utiliser instant scroll
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

			// Reinitialiser le flag apres un delai
			scrollTimeoutRef.current = setTimeout(() => {
				isScrollingRef.current = false
			}, 100)

			return true
		}

		// Essayer de scroller immediatement
		const success = scrollToElement()

		// Si ca echoue, reessayer apres un court delai (au cas ou le DOM n'est pas encore pret)
		if (!success) {
			setTimeout(scrollToElement, 50)
		}
	}

	return (
		<nav className={cn(
			'sticky top-[120px] max-h-[calc(100vh-180px)] overflow-y-auto',
			'hidden lg:block',
			'scrollbar-thin',
			isDark ? 'scrollbar-thumb-white/10' : 'scrollbar-thumb-black/10'
		)}>
			{/* Header */}
			<div className="flex items-center gap-2 mb-4">
				<List className={cn(
					'w-4 h-4',
					isDark ? 'text-violet-400' : 'text-violet-500'
				)} />
				<h3 className={cn(
					'text-sm font-semibold uppercase tracking-wider',
					isDark ? 'text-slate-400' : 'text-slate-500'
				)}>
					{t('tableOfContents')}
				</h3>
			</div>

			{/* Items */}
			<ul className="space-y-1">
				{tocItems.map((item, index) => (
					<li key={index}>
						<button
							onClick={(e) => handleClick(item.id, e)}
							className={cn(
								'w-full text-left py-2.5 pl-4 pr-2',
								'text-sm leading-snug',
								'border-l-2 border-transparent',
								'transition-all duration-200',
								isDark ? 'text-slate-400' : 'text-slate-500',
								'hover:text-violet-500 dark:hover:text-violet-400',
								'hover:border-violet-500 dark:hover:border-violet-400',
								'hover:pl-5',
								'hover:bg-violet-500/5'
							)}
						>
							{item.title}
						</button>
					</li>
				))}
			</ul>
		</nav>
	)
}
