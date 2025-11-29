'use client'

import React from 'react'
import { Lock, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/**
 * Privacy & Security Section
 * Displays privacy toggle and security actions
 */
export const SecuritySection = ({
	isDark,
	translations,
	formData,
	loading,
	handleToggle,
	setChangePasswordDialogOpen,
	setDeleteAccountDialogOpen,
}) => {
	return (
		<Card
			className={cn(
				'h-full overflow-hidden border-2 border-red-500/20 transition-all duration-400',
				'hover:-translate-y-1 hover:border-red-500/40',
				'shadow-[0_8px_32px_rgba(239,68,68,0.15),0_0_0_1px_rgba(239,68,68,0.05)_inset]',
				'hover:shadow-[0_12px_48px_rgba(239,68,68,0.25),0_0_0_1px_rgba(239,68,68,0.3)_inset]',
				isDark
					? 'bg-gradient-to-br from-slate-800/95 to-slate-900/98'
					: 'bg-gradient-to-br from-white/95 to-slate-50/98',
				'backdrop-blur-xl'
			)}>
			{/* Header */}
			<CardHeader
				className={cn(
					'px-4 py-3 border-b border-red-500/30 relative',
					'bg-gradient-to-r from-red-600/85 to-red-700/85'
				)}>
				{/* Glow line */}
				<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
				<CardTitle className="text-center text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-white to-red-300 bg-clip-text text-transparent">
					{translations.privacyAndSecurity}
				</CardTitle>
			</CardHeader>

			<CardContent className="p-4 space-y-4">
				{/* Leaderboard Toggle */}
				<div className="flex items-center justify-between mb-6">
					<div className="space-y-1">
						<Label className="text-sm font-semibold">
							{translations.showInLeaderboard}
						</Label>
						<p className={cn(
							'text-xs',
							isDark ? 'text-white/50' : 'text-black/50'
						)}>
							{translations.showInLeaderboardDesc}
						</p>
					</div>
					<Switch
						checked={formData.showInLeaderboard}
						onCheckedChange={(checked) => handleToggle('showInLeaderboard')({ target: { checked } })}
						disabled={loading}
						className="data-[state=checked]:bg-emerald-500"
					/>
				</div>

				{/* Change Password Button */}
				<Button
					variant="outline"
					className="w-full border-red-500 text-red-500 hover:bg-red-500/10 hover:border-red-600"
					onClick={() => setChangePasswordDialogOpen(true)}>
					<Lock className="h-4 w-4 mr-2" />
					{translations.changePassword}
				</Button>

				{/* Delete Account Button */}
				<Button
					variant="outline"
					className="w-full border-red-600 text-red-600 hover:bg-red-600/10 hover:border-red-700"
					onClick={() => setDeleteAccountDialogOpen(true)}>
					<Trash2 className="h-4 w-4 mr-2" />
					{translations.deleteAccount}
				</Button>
			</CardContent>
		</Card>
	)
}

export default SecuritySection
