'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState, useMemo } from 'react'
import { useThemeMode } from '@/context/ThemeContext'
import { useUserContext } from '@/context/user.js'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { GraduationCap, ChevronDown, CheckCircle } from 'lucide-react'

const LanguageMenu = ({ variant = 'auto', onClose }) => {
	const t = useTranslations('common')
	const locale = useLocale()
	const { userLearningLanguage, changeLearningLanguage, userSpokenLanguage } = useUserContext()
	const { isDark } = useThemeMode()

	// Use the spoken language from context (single source of truth)
	const spokenLanguage = userSpokenLanguage || locale

	// Langues disponibles pour l'apprentissage
	const allLanguages = [
		{
			lang: 'fr',
			name: t('french'),
		},
		{
			lang: 'ru',
			name: t('russian'),
		},
		{
			lang: 'it',
			name: t('italian'),
		},
	]

	// Filtrer selon la langue parlée (on ne peut pas apprendre sa propre langue)
	const languages = allLanguages.filter(language => {
		return language.lang !== spokenLanguage
	})

	const isSingleLanguage = languages.length === 1

	// Composants SVG des drapeaux (format carré pour conteneurs ronds)
	const flagStyle = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: '140%',
		height: '140%'
	}

	const FlagFR = () => (
		<svg viewBox="0 0 3 3" style={flagStyle}>
			<rect width="1" height="3" fill="#002654" />
			<rect x="1" width="1" height="3" fill="#fff" />
			<rect x="2" width="1" height="3" fill="#CE1126" />
		</svg>
	)

	const FlagRU = () => (
		<svg viewBox="0 0 3 3" style={flagStyle}>
			<rect width="3" height="1" fill="#fff" />
			<rect y="1" width="3" height="1" fill="#0039A6" />
			<rect y="2" width="3" height="1" fill="#D52B1E" />
		</svg>
	)

	const FlagGB = () => (
		<svg viewBox="0 0 60 60" style={flagStyle}>
			<rect width="60" height="60" fill="#012169" />
			<path d="M0,0 L60,60 M60,0 L0,60" stroke="#fff" strokeWidth="12" />
			<path d="M0,0 L60,60 M60,0 L0,60" stroke="#C8102E" strokeWidth="8" />
			<path d="M30,0 V60 M0,30 H60" stroke="#fff" strokeWidth="20" />
			<path d="M30,0 V60 M0,30 H60" stroke="#C8102E" strokeWidth="12" />
		</svg>
	)

	const FlagIT = () => (
		<svg viewBox="0 0 3 3" style={flagStyle}>
			<rect width="1" height="3" fill="#009246" />
			<rect x="1" width="1" height="3" fill="#fff" />
			<rect x="2" width="1" height="3" fill="#CE2B37" />
		</svg>
	)

	const getFlag = (langCode) => {
		const flags = { fr: FlagFR, ru: FlagRU, en: FlagGB, it: FlagIT }
		const Flag = flags[langCode]
		return Flag ? <Flag /> : null
	}

	const handleLanguageChange = async locale => {
		await changeLearningLanguage(locale)
		if (onClose) {
			setTimeout(() => onClose(), 100)
		}
	}

	const handleSingleLanguageClick = async () => {
		if (isSingleLanguage) {
			await changeLearningLanguage(languages[0].lang)
			if (onClose) {
				setTimeout(() => onClose(), 100)
			}
		}
	}

	return (
		<div>
			{/* Version desktop - bouton complet */}
			{isSingleLanguage ? (
				<Button
					variant="ghost"
					onClick={handleSingleLanguageClick}
					className={cn(
						'hidden 2xl:flex items-center gap-2.5',
						variant === 'full' ? 'flex' : 'hidden',
						'bg-white/15 backdrop-blur-sm',
						'text-white font-semibold text-sm',
						'px-5 py-3 h-11',
						'rounded-lg',
						'border border-white/20',
						'transition-all duration-300 relative overflow-hidden group',
						'hover:bg-white/25 hover:text-white hover:-translate-y-0.5'
					)}
				>
					{/* Shine effect */}
					<span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
					<GraduationCap className="w-5 h-5 transition-transform duration-300 relative z-10 group-hover:scale-110" />
					<span className="relative z-10">{t('learn')}</span>
					{userLearningLanguage && (
						<div className="w-6 h-6 relative z-0 rounded-full overflow-hidden ring-2 ring-white/30">
							{getFlag(userLearningLanguage)}
						</div>
					)}
				</Button>
			) : (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className={cn(
								'hidden 2xl:flex items-center gap-2.5',
								variant === 'full' ? 'flex' : 'hidden',
								'bg-white/15 backdrop-blur-sm',
								'text-white font-semibold text-sm',
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
								<GraduationCap className="w-5 h-5 transition-transform duration-300 relative z-10 group-hover:scale-110" />
								<span className="relative z-10">{t('learn')}</span>
								{userLearningLanguage && (
									<div className="w-6 h-6 relative z-0 rounded-full overflow-hidden ring-2 ring-white/30">
										{getFlag(userLearningLanguage)}
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
							const isSelected = userLearningLanguage === language.lang
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
										'w-6 h-6 relative rounded-full overflow-hidden',
										'ring-2',
										isSelected
											? 'ring-violet-500 shadow-lg shadow-violet-500/30'
											: 'ring-white/30'
									)}>
										{getFlag(language.lang)}
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
			)}

			{/* Version mobile - IconButton compact avec drapeau */}
			{isSingleLanguage ? (
				<Button
					variant="ghost"
					onClick={handleSingleLanguageClick}
					className={cn(
						'flex 2xl:hidden',
						variant === 'full' ? 'hidden' : 'flex',
						'w-9 h-9 sm:w-12 sm:h-12 rounded-full p-0',
						'bg-white/15 backdrop-blur-sm',
						'border border-white/20',
						'transition-all duration-300',
						'hover:bg-white/25 hover:shadow-lg hover:scale-105',
						'relative items-center justify-center'
					)}
				>
					{userLearningLanguage && (
						<div className="w-6 h-6 relative z-0 rounded-full overflow-hidden ring-2 ring-white/30">
							{getFlag(userLearningLanguage)}
						</div>
					)}
					<GraduationCap className={cn(
						'absolute -bottom-0.5 -right-0.5',
						'w-4 h-4 sm:w-5 sm:h-5 text-white',
						'bg-gradient-to-br from-violet-500 to-purple-600',
						'rounded-full p-0.5',
						'shadow-lg'
					)} />
				</Button>
			) : (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className={cn(
								'flex 2xl:hidden',
								variant === 'full' ? 'hidden' : 'flex',
								'w-9 h-9 sm:w-12 sm:h-12 rounded-full p-0',
								'bg-white/15 backdrop-blur-sm',
								'border border-white/20',
								'transition-all duration-300',
								'hover:bg-white/25 hover:shadow-lg hover:scale-105',
								'relative items-center justify-center'
							)}
						>
							{userLearningLanguage && (
								<div className="w-6 h-6 relative rounded-full overflow-hidden ring-2 ring-white/30">
									{getFlag(userLearningLanguage)}
								</div>
							)}
							<GraduationCap className={cn(
								'absolute -bottom-0.5 -right-0.5',
								'w-4 h-4 sm:w-5 sm:h-5 text-white',
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
							const isSelected = userLearningLanguage === language.lang
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
										'w-6 h-6 relative rounded-full overflow-hidden',
										'ring-2',
										isSelected
											? 'ring-violet-500 shadow-lg shadow-violet-500/30'
											: 'ring-white/30'
									)}>
										{getFlag(language.lang)}
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
			)}
		</div>
	)
}

export default LanguageMenu
