'use client'

import React from 'react'
import { Languages } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { FieldRenderer } from './FieldRenderer'
import { cn } from '@/lib/utils'

/**
 * Language Preferences Section
 * Displays language level selection
 */
export const LanguagePreferencesSection = ({
	isDark,
	translations,
	editMode,
	formData,
	loading,
	handleChange,
	handleSave,
	handleCancel,
	toggleEditMode,
}) => {
	return (
		<Card
			className={cn(
				'h-full overflow-hidden border-2 border-cyan-500/20 transition-all duration-400',
				'hover:-translate-y-1 hover:border-cyan-500/40',
				'shadow-[0_8px_32px_rgba(6,182,212,0.15),0_0_0_1px_rgba(6,182,212,0.05)_inset]',
				'hover:shadow-[0_12px_48px_rgba(6,182,212,0.25),0_0_0_1px_rgba(6,182,212,0.3)_inset]',
				isDark
					? 'bg-gradient-to-br from-slate-800/95 to-slate-900/98'
					: 'bg-gradient-to-br from-white/95 to-slate-50/98',
				'backdrop-blur-xl'
			)}>
			{/* Header */}
			<CardHeader
				className={cn(
					'px-4 py-3 border-b border-cyan-500/30 relative',
					'bg-gradient-to-r from-slate-900/90 to-cyan-600/85'
				)}>
				{/* Glow line */}
				<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_10px_rgba(6,182,212,0.6)]" />
				<CardTitle className="text-center text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
					{translations.languagePreferences}
				</CardTitle>
			</CardHeader>

			<CardContent className="p-0">
				<FieldRenderer
					field='languageLevel'
					label={translations.languageLevel}
					icon={<Languages className="h-4 w-4" />}
					type='select'
					options={[
						{ value: 'beginner', label: translations.beginner },
						{ value: 'intermediate', label: translations.intermediate },
						{ value: 'advanced', label: translations.advanced },
					]}
					isEditing={editMode.languageLevel}
					value={formData.languageLevel}
					isDark={isDark}
					loading={loading}
					translations={translations}
					handleChange={handleChange}
					handleSave={handleSave}
					handleCancel={handleCancel}
					toggleEditMode={toggleEditMode}
				/>
			</CardContent>
		</Card>
	)
}

export default LanguagePreferencesSection
