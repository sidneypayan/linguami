/**
 * Custom translation form component
 * Allows users to enter their own translation
 */

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { sanitizeInput, validateTranslation } from '@/utils/wordMapping'

const MAX_TRANSLATION_LENGTH = 100

export function CustomTranslationForm({ onSubmit }) {
	const t = useTranslations('words')
	const { isDark } = useThemeMode()

	const [personalTranslation, setPersonalTranslation] = useState('')
	const [translationError, setTranslationError] = useState('')

	const handleTranslationChange = (e) => {
		const sanitized = sanitizeInput(e.target.value)
		setPersonalTranslation(sanitized)

		if (sanitized) {
			const validation = validateTranslation(sanitized, MAX_TRANSLATION_LENGTH)
			setTranslationError(validation.isValid ? '' : validation.error)
		} else {
			setTranslationError('')
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		// Trim whitespace before validation and submission
		const trimmedTranslation = personalTranslation.trim()

		// Final validation before submit
		if (!trimmedTranslation) {
			setTranslationError('La traduction ne peut pas être vide')
			return
		}

		const validation = validateTranslation(trimmedTranslation, MAX_TRANSLATION_LENGTH)
		if (!validation.isValid) {
			setTranslationError(validation.error)
			return
		}

		// Call parent submit handler with trimmed translation
		onSubmit(trimmedTranslation)

		// Reset form
		setPersonalTranslation('')
		setTranslationError('')
	}

	return (
		<form
			onSubmit={handleSubmit}
			className={cn(
				'p-4',
				isDark ? 'bg-slate-800/50' : 'bg-white'
			)}
		>
			<label className={cn(
				'block mb-2 text-xs font-semibold',
				isDark ? 'text-slate-300' : 'text-slate-600'
			)}>
				{t('custom_translation')}
			</label>

			<div className="flex flex-col gap-2">
				<div className="flex gap-2">
					<div className="flex-1">
						<input
							type="text"
							placeholder="votre traduction"
							value={personalTranslation}
							onChange={handleTranslationChange}
							maxLength={MAX_TRANSLATION_LENGTH}
							autoComplete="off"
							spellCheck="true"
							className={cn(
								'w-full px-3 py-2 rounded-lg text-sm',
								'border-2 transition-colors',
								'focus:outline-none',
								isDark
									? 'bg-slate-900 text-slate-100 placeholder-slate-500'
									: 'bg-white text-slate-800 placeholder-slate-400',
								translationError
									? 'border-red-500 focus:border-red-500'
									: isDark
										? 'border-slate-600 hover:border-violet-500 focus:border-violet-500'
										: 'border-slate-300 hover:border-violet-500 focus:border-violet-500'
							)}
						/>
						{translationError && (
							<p className="mt-1 text-xs text-red-500">
								{translationError}
							</p>
						)}
					</div>
					<button
						type="submit"
						disabled={!personalTranslation || !!translationError}
						className={cn(
							'px-4 py-2 rounded-lg self-start',
							'bg-gradient-to-r from-violet-500 to-purple-600',
							'text-white font-semibold text-sm',
							'flex items-center gap-1.5',
							'transition-all duration-200',
							'hover:from-violet-600 hover:to-purple-700',
							'disabled:opacity-50 disabled:cursor-not-allowed'
						)}
					>
						<Plus className="w-4 h-4" />
						{t('add')}
					</button>
				</div>
				{personalTranslation && (
					<p className="text-xs text-slate-400 text-right">
						{personalTranslation.length}/{MAX_TRANSLATION_LENGTH}
					</p>
				)}
			</div>
		</form>
	)
}
