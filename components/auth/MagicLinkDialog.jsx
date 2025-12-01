'use client'

import { useState } from 'react'
import { Mail, Send, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const MagicLinkDialog = ({ open, onClose, onSend }) => {
	const t = useTranslations('register')
	const { isDark } = useThemeMode()
	const [email, setEmail] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!email) return

		setLoading(true)
		const success = await onSend(email)
		setLoading(false)

		if (success) {
			setEmail('')
			onClose()
		}
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent
				isDark={isDark}
				className={cn(
					'sm:max-w-md rounded-xl',
					isDark
						? 'bg-gradient-to-br from-slate-800/98 to-slate-900/98 border-violet-500/30'
						: 'bg-white/98',
					'backdrop-blur-xl'
				)}
			>
				<form onSubmit={handleSubmit}>
					<DialogHeader className="text-center pt-2">
						<div
							className={cn(
								'w-16 h-16 rounded-xl mx-auto mb-4',
								'bg-gradient-to-br from-indigo-500 to-purple-600',
								'flex items-center justify-center',
								'shadow-[0_8px_24px_rgba(102,126,234,0.4)]'
							)}
						>
							<Mail className="w-8 h-8 text-white" />
						</div>
						<DialogTitle
							className={cn(
								'text-xl font-bold',
								'bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent'
							)}
						>
							{t('magicLinkTitle') || 'Connexion par email'}
						</DialogTitle>
					</DialogHeader>

					<div className="py-4">
						<p
							className={cn(
								'text-center text-sm mb-6',
								isDark ? 'text-slate-400' : 'text-slate-500'
							)}
						>
							{t('magicLinkDescription') || 'Entrez votre email et recevez un lien de connexion instantane'}
						</p>

						<div className="space-y-2">
							<Label htmlFor="magic-email">{t('email')}</Label>
							<div className="relative">
								<Mail
									className={cn(
										'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
										isDark ? 'text-slate-400' : 'text-slate-500'
									)}
								/>
								<Input
									id="magic-email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									autoFocus
									placeholder={t('email')}
									className={cn(
										'pl-10',
										isDark
											? 'bg-slate-800/60 border-violet-500/30 focus:border-indigo-500'
											: 'border-indigo-200 focus:border-indigo-500'
									)}
								/>
							</div>
						</div>
					</div>

					<DialogFooter className="gap-2 sm:gap-2">
						<Button
							type="button"
							variant="ghost"
							onClick={onClose}
							disabled={loading}
							className={cn(
								'font-semibold',
								isDark ? 'text-slate-400 hover:bg-violet-500/10' : 'text-slate-500 hover:bg-indigo-50'
							)}
						>
							{t('cancel') || 'Annuler'}
						</Button>
						<Button
							type="submit"
							disabled={loading || !email}
							className={cn(
								'font-bold',
								'bg-gradient-to-r from-indigo-500 to-purple-600',
								'shadow-[0_4px_12px_rgba(102,126,234,0.4)]',
								'hover:from-purple-600 hover:to-indigo-500',
								'hover:shadow-[0_6px_16px_rgba(102,126,234,0.5)]',
								'disabled:opacity-50'
							)}
						>
							{loading ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									{t('sending') || 'Envoi...'}
								</>
							) : (
								<>
									<Send className="w-4 h-4 mr-2" />
									{t('send') || 'Envoyer'}
								</>
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export default MagicLinkDialog
