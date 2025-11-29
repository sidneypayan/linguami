'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState } from 'react'
import { useThemeMode } from '@/context/ThemeContext'
import { useRouter as useNextRouter, usePathname, useParams } from 'next/navigation'
import { useUserContext } from '@/context/user'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Languages, ChevronDown, CheckCircle } from 'lucide-react'

// Composant drapeau français
const FrenchFlag = ({ size = 32 }) => (
	<svg width="100%" height="100%" viewBox="0 0 32 32" preserveAspectRatio="none" style={{ display: 'block' }}>
		<defs>
			<clipPath id="circle-clip-french-interface">
				<circle cx="16" cy="16" r="16"/>
			</clipPath>
		</defs>
		<g clipPath="url(#circle-clip-french-interface)">
			<circle cx="16" cy="16" r="16" fill="#ED2939"/>
			<path d="M 16 0 A 16 16 0 0 0 16 32 L 16 0" fill="#002395"/>
			<path d="M 16 0 L 16 32 A 16 16 0 0 0 16 0" fill="#ED2939"/>
			<rect x="10.67" width="10.67" height="32" fill="white"/>
		</g>
	</svg>
)

// Composant drapeau russe
const RussianFlag = ({ size = 32 }) => (
	<svg width="100%" height="100%" viewBox="0 0 32 32" preserveAspectRatio="none" style={{ display: 'block' }}>
		<defs>
			<clipPath id="circle-clip-russian-interface">
				<circle cx="16" cy="16" r="16"/>
			</clipPath>
		</defs>
		<g clipPath="url(#circle-clip-russian-interface)">
			<circle cx="16" cy="16" r="16" fill="#0039A6"/>
			<rect width="32" height="10.67" fill="white"/>
			<rect y="10.67" width="32" height="10.67" fill="#0039A6"/>
			<rect y="21.33" width="32" height="10.67" fill="#D52B1E"/>
		</g>
	</svg>
)

// Composant drapeau anglais (UK)
const EnglishFlag = ({ size = 32 }) => (
	<svg width="100%" height="100%" viewBox="0 0 32 32" preserveAspectRatio="none" style={{ display: 'block' }}>
		<defs>
			<clipPath id="circle-clip-english-interface">
				<circle cx="16" cy="16" r="16"/>
			</clipPath>
		</defs>
		<g clipPath="url(#circle-clip-english-interface)">
			<rect width="32" height="32" fill="#012169"/>
			<path d="M 0 0 L 32 32 M 32 0 L 0 32" stroke="white" strokeWidth="5.3"/>
			<path d="M 0 0 L 32 32 M 32 0 L 0 32" stroke="#C8102E" strokeWidth="3.2"/>
			<path d="M 16 0 L 16 32 M 0 16 L 32 16" stroke="white" strokeWidth="8.5"/>
			<path d="M 16 0 L 16 32 M 0 16 L 32 16" stroke="#C8102E" strokeWidth="5.3"/>
		</g>
	</svg>
)

const InterfaceLanguageMenu = ({ variant = 'auto', onClose }) => {
	const t = useTranslations('common')
	const locale = useLocale()
	const router = useNextRouter()
	const pathname = usePathname()
	const params = useParams()
	const { changeSpokenLanguage } = useUserContext()
	const { isDark } = useThemeMode()

	const languages = [
		{
			lang: 'fr',
			name: t('french'),
		},
		{
			lang: 'ru',
			name: t('russian'),
		},
		{
			lang: 'en',
			name: t('english'),
		},
	]

	// Helper pour obtenir le drapeau selon la langue
	const getFlag = (langCode, size = 32) => {
		if (langCode === 'fr') return <FrenchFlag size={size} />
		if (langCode === 'ru') return <RussianFlag size={size} />
		if (langCode === 'en') return <EnglishFlag size={size} />
		return null
	}

	const handleLanguageChange = async newLocale => {
		await changeSpokenLanguage(newLocale)

		const currentLocale = params.locale || locale
		let newPath

		if (pathname.startsWith(`/${currentLocale}`)) {
			newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`)
		} else {
			newPath = `/${newLocale}${pathname === '/' ? '' : pathname}`
		}

		router.push(newPath)

		if (onClose) {
			setTimeout(() => onClose(), 100)
		}
	}

	return (
		<div>
			{/* Version desktop - bouton complet */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className={cn(
							'hidden 2xl:flex items-center gap-2.5',
							variant === 'full' ? 'flex' : 'hidden',
							'bg-white/15 backdrop-blur-sm',
							'text-white font-semibold text-base',
							'px-5 py-3 h-11',
							'rounded-lg',
							'border border-white/20',
							'transition-all duration-300 relative overflow-hidden group',
							'hover:bg-white/25 hover:text-white hover:-translate-y-0.5',
							variant === 'full' && 'w-full justify-between'
						)}
					>
					{/* Shine effect */}
					<span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
						<div className="flex items-center gap-2 relative z-10">
							<Languages className="w-5 h-5 transition-transform duration-300 relative z-10 group-hover:scale-110" />
							<span className="relative z-10">{t('speak')}</span>
							{locale && (
								<div className="w-8 h-8 rounded-full overflow-hidden border border-white/50 shadow-md flex items-center justify-center bg-white/10">
									{getFlag(locale, 32)}
								</div>
							)}
						</div>
						<ChevronDown className="w-4 h-4 opacity-70 relative z-10" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					className={cn(
						'min-w-[180px] rounded-xl',
						isDark
							? 'bg-slate-800/95 border-violet-500/40'
							: 'bg-white/95 border-violet-500/20'
					)}
				>
					{languages.map(language => {
						const isSelected = locale === language.lang
						return (
							<DropdownMenuItem
								key={language.lang}
								onClick={() => handleLanguageChange(language.lang)}
								className={cn(
									'rounded-lg cursor-pointer',
									'flex items-center gap-3',
									isSelected && (isDark ? 'bg-violet-500/20' : 'bg-violet-500/10')
								)}
							>
								<div className={cn(
									'w-6 h-6 rounded-full overflow-hidden flex items-center justify-center',
									'border bg-white/10',
									isSelected
										? 'border-violet-500 shadow-lg shadow-violet-500/30'
										: 'border-slate-300/30'
								)}>
									{getFlag(language.lang, 32)}
								</div>
								<span className={cn(
									'flex-1 font-medium',
									isSelected && 'text-violet-500 font-semibold'
								)}>
									{language.name}
								</span>
								{isSelected && (
									<CheckCircle className="w-5 h-5 text-violet-500" />
								)}
							</DropdownMenuItem>
						)
					})}
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Version mobile - IconButton compact avec drapeau */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className={cn(
							'flex 2xl:hidden',
							variant === 'full' ? 'hidden' : 'flex',
							'w-11 h-11 sm:w-12 sm:h-12 rounded-full p-0',
							'bg-white/15 backdrop-blur-sm',
							'border border-white/20',
							'transition-all duration-300',
							'hover:bg-white/25 hover:shadow-lg hover:scale-105',
							'relative items-center justify-center'
						)}
					>
						{locale && (
							<div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-white/70 flex items-center justify-center bg-white/10">
								{getFlag(locale, 32)}
							</div>
						)}
						<Languages className={cn(
							'absolute -bottom-0.5 -right-0.5',
							'w-5 h-5 text-white',
							'bg-gradient-to-br from-violet-500 to-purple-600',
							'rounded-full p-0.5',
							'shadow-lg'
						)} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					className={cn(
						'min-w-[180px] rounded-xl',
						isDark
							? 'bg-slate-800/95 border-violet-500/40'
							: 'bg-white/95 border-violet-500/20'
					)}
				>
					{languages.map(language => {
						const isSelected = locale === language.lang
						return (
							<DropdownMenuItem
								key={language.lang}
								onClick={() => handleLanguageChange(language.lang)}
								className={cn(
									'rounded-lg cursor-pointer',
									'flex items-center gap-3',
									isSelected && (isDark ? 'bg-violet-500/20' : 'bg-violet-500/10')
								)}
							>
								<div className={cn(
									'w-6 h-6 rounded-full overflow-hidden flex items-center justify-center',
									'border bg-white/10',
									isSelected
										? 'border-violet-500 shadow-lg shadow-violet-500/30'
										: 'border-slate-300/30'
								)}>
									{getFlag(language.lang, 32)}
								</div>
								<span className={cn(
									'flex-1 font-medium',
									isSelected && 'text-violet-500 font-semibold'
								)}>
									{language.name}
								</span>
								{isSelected && (
									<CheckCircle className="w-5 h-5 text-violet-500" />
								)}
							</DropdownMenuItem>
						)
					})}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export default InterfaceLanguageMenu
