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
	const getFlag = (langCode) => {
		const flags = {
			fr: 'https://flagcdn.com/w80/fr.png',
			ru: 'https://flagcdn.com/w80/ru.png',
			en: 'https://flagcdn.com/w80/gb.png',
		}
		return (
			<img
				src={flags[langCode]}
				alt={langCode}
				className="w-full h-full object-cover"
			/>
		)
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
								<div className="p-[3px] rounded-full bg-gradient-to-br from-white/70 to-white/30 shadow-lg shadow-black/30 hover:scale-105 transition-all duration-200">
									<div className="w-6 h-6 rounded-full overflow-hidden">
										{getFlag(locale)}
									</div>
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
									'w-6 h-6 rounded-full overflow-hidden',
									'ring-2',
									isSelected
										? 'ring-violet-500 shadow-lg shadow-violet-500/30'
										: 'ring-slate-400/30'
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
							<div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden flex items-center justify-center">
								{getFlag(locale)}
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
									'w-6 h-6 rounded-full overflow-hidden',
									'ring-2',
									isSelected
										? 'ring-violet-500 shadow-lg shadow-violet-500/30'
										: 'ring-slate-400/30'
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
		</div>
	)
}

export default InterfaceLanguageMenu
