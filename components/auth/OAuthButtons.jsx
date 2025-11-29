'use client'

import Image from 'next/image'
import { Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { getUIImageUrl } from '@/utils/mediaUrls'
import VkIdButton from './VkIdButton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const OAuthButtons = ({ onGoogleClick, onMagicLinkClick }) => {
	const t = useTranslations('register')
	const { isDark } = useThemeMode()
	const showVkId = true

	const buttonClassName = cn(
		'w-full py-4 sm:py-5 px-6 sm:px-8 rounded-2xl',
		'border-2 font-semibold text-base sm:text-lg',
		'transition-all duration-300',
		'relative overflow-hidden group',
		isDark
			? 'border-violet-500/30 text-slate-300 bg-slate-800/50'
			: 'border-slate-200 text-slate-700 bg-slate-50 hover:bg-white',
		'hover:border-indigo-500 hover:-translate-y-0.5',
		isDark
			? 'hover:bg-slate-800 hover:shadow-[0_8px_24px_rgba(139,92,246,0.35)]'
			: 'hover:shadow-[0_8px_24px_rgba(102,126,234,0.2)]',
		'active:translate-y-0'
	)

	return (
		<div className="flex flex-col gap-4">
			{/* Google */}
			<Button
				variant="outline"
				onClick={onGoogleClick}
				className={buttonClassName}
				aria-label={t('signInWithGoogle')}
			>
				<div className="flex items-center gap-3 justify-center">
					<div className="w-7 h-7 flex items-center justify-center">
						<Image
							src={getUIImageUrl('google.webp')}
							alt="Google"
							width={24}
							height={24}
						/>
					</div>
					<span className="font-semibold">{t('google')}</span>
				</div>
			</Button>

			{/* VK ID button */}
			{showVkId && (
				<VkIdButton buttonClassName={buttonClassName} />
			)}

			{/* Email */}
			<Button
				variant="outline"
				onClick={onMagicLinkClick}
				className={buttonClassName}
				aria-label={t('signInWithEmail')}
			>
				<div className="flex items-center gap-3 justify-center">
					<div className="w-7 h-7 flex items-center justify-center">
						<Mail size={24} />
					</div>
					<span className="font-semibold">{t('magicLink')}</span>
				</div>
			</Button>
		</div>
	)
}

export default OAuthButtons
