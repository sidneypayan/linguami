'use client'

import React from 'react'
import { Pencil, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

/**
 * Reusable field renderer for Settings sections
 * Handles both display and edit modes with consistent styling
 */
export const FieldRenderer = ({
	field,
	label,
	icon,
	type = 'text',
	options = null,
	isEditing,
	value,
	isDark,
	loading,
	translations,
	handleChange,
	handleSave,
	handleCancel,
	toggleEditMode,
	isEmailField = false,
}) => {
	const isLanguageField = field === 'languageLevel'
	const accentColor = isLanguageField ? 'cyan' : 'violet'

	const getDisplayValue = () => {
		if (!value) return '-'
		if (field === 'languageLevel') {
			return translations[value]
		}
		return value
	}

	return (
		<div
			className={cn(
				'flex items-center py-4 px-4 border-b transition-all duration-300 relative group',
				isLanguageField
					? 'border-cyan-500/20 hover:bg-cyan-500/10'
					: 'border-violet-500/20 hover:bg-violet-500/10',
				'last:border-b-0'
			)}>
			{/* Left accent bar on hover */}
			<div
				className={cn(
					'absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity',
					isLanguageField
						? 'bg-gradient-to-b from-cyan-500 to-cyan-600 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
						: 'bg-gradient-to-b from-violet-500 to-violet-600 shadow-[0_0_10px_rgba(139,92,246,0.5)]'
				)}
			/>

			{/* Icon */}
			<div
				className={cn(
					'flex items-center justify-center w-11 h-11 rounded-full mr-3 transition-all duration-300',
					'border-2 group-hover:scale-110 group-hover:rotate-[5deg]',
					isLanguageField
						? 'bg-gradient-to-br from-cyan-500/25 to-cyan-600/25 border-cyan-500/30 text-cyan-500 shadow-[0_4px_12px_rgba(6,182,212,0.2)] group-hover:shadow-[0_6px_20px_rgba(6,182,212,0.4)]'
						: 'bg-gradient-to-br from-violet-500/25 to-violet-600/25 border-violet-500/30 text-violet-500 shadow-[0_4px_12px_rgba(139,92,246,0.2)] group-hover:shadow-[0_6px_20px_rgba(139,92,246,0.4)]'
				)}>
				{icon}
			</div>

			{/* Content */}
			<div className="flex-1 min-w-0">
				<Label
					className={cn(
						'text-[0.7rem] font-semibold uppercase tracking-wider mb-1 block',
						isLanguageField
							? isDark ? 'text-cyan-300' : 'text-cyan-700'
							: isDark ? 'text-violet-300' : 'text-violet-700'
					)}>
					{label}
				</Label>

				{isEditing ? (
					options ? (
						<Select value={value} onValueChange={(val) => handleChange(field)({ target: { value: val } })}>
							<SelectTrigger
								className={cn(
									'w-full text-sm',
									isLanguageField
										? 'border-cyan-500 focus:ring-cyan-500/40'
										: 'border-violet-500 focus:ring-violet-500/40'
								)}>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{options.map(option => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					) : (
						<Input
							type={type}
							value={value}
							onChange={handleChange(field)}
							className={cn(
								'text-sm',
								isLanguageField
									? 'border-cyan-500 focus-visible:ring-cyan-500/40'
									: 'border-violet-500 focus-visible:ring-violet-500/40'
							)}
						/>
					)
				) : (
					<>
						<p className={cn(
							'text-sm font-semibold',
							isDark ? 'text-slate-100' : 'text-slate-800'
						)}>
							{getDisplayValue()}
						</p>
						{isEmailField && (
							<p className={cn(
								'text-[0.7rem] italic mt-0.5',
								isDark ? 'text-white/50' : 'text-black/50'
							)}>
								{translations.emailNotEditable}
							</p>
						)}
					</>
				)}
			</div>

			{/* Action buttons */}
			<div className="flex gap-2 ml-3">
				{isEditing ? (
					<>
						<Button
							size="icon"
							onClick={() => handleSave(field)}
							disabled={loading}
							className={cn(
								'h-8 w-8 text-white border transition-all hover:scale-110',
								isLanguageField
									? 'bg-gradient-to-br from-cyan-500 to-cyan-600 border-cyan-500 shadow-[0_4px_12px_rgba(6,182,212,0.3)] hover:shadow-[0_6px_16px_rgba(6,182,212,0.5)]'
									: 'bg-gradient-to-br from-violet-500 to-violet-600 border-violet-500 shadow-[0_4px_12px_rgba(139,92,246,0.3)] hover:shadow-[0_6px_16px_rgba(139,92,246,0.5)]'
							)}>
							<Check className="h-4 w-4" />
						</Button>
						<Button
							size="icon"
							onClick={() => handleCancel(field)}
							disabled={loading}
							className="h-8 w-8 text-white bg-gradient-to-br from-red-500 to-red-600 border border-red-500 shadow-[0_4px_12px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_16px_rgba(239,68,68,0.5)] hover:scale-110 transition-all">
							<X className="h-4 w-4" />
						</Button>
					</>
				) : (
					!isEmailField && (
						<Button
							size="icon"
							variant="ghost"
							onClick={() => toggleEditMode(field)}
							className={cn(
								'h-8 w-8 text-white border transition-all hover:scale-110 hover:rotate-[15deg]',
								isLanguageField
									? 'bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 border-cyan-500 shadow-[0_4px_12px_rgba(6,182,212,0.2)] hover:from-cyan-500/50 hover:to-cyan-600/50 hover:shadow-[0_6px_16px_rgba(6,182,212,0.4)]'
									: 'bg-gradient-to-br from-violet-500/30 to-violet-600/30 border-violet-500 shadow-[0_4px_12px_rgba(139,92,246,0.2)] hover:from-violet-500/50 hover:to-violet-600/50 hover:shadow-[0_6px_16px_rgba(139,92,246,0.4)]'
							)}>
							<Pencil className="h-4 w-4" />
						</Button>
					)
				)}
			</div>
		</div>
	)
}

export default FieldRenderer
