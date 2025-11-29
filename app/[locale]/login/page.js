'use client'

import { useTranslations } from 'next-intl'
import { useState, useRef } from 'react'
import toast from '@/utils/toast'
import { useUserContext } from '@/context/user'
import { useTheme } from '@/context/ThemeContext'
import AuthLayout from '@/components/auth/AuthLayout'
import OAuthButtons from '@/components/auth/OAuthButtons'
import MagicLinkDialog from '@/components/auth/MagicLinkDialog'
import TurnstileWidget from '@/components/shared/TurnstileWidget'
import { Link } from '@/i18n/navigation'
import { logger } from '@/utils/logger'
import { LogIn, AtSign, KeyRound, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { verifyTurnstile } from '@/app/actions/auth'
import { cn } from '@/lib/utils'

const Login = () => {
	const t = useTranslations('register')
	const { login, loginWithThirdPartyOAuth, sendMagicLink } = useUserContext()
	const { isDark } = useTheme()
	const [values, setValues] = useState({ email: '', password: '' })
	const [magicLinkDialogOpen, setMagicLinkDialogOpen] = useState(false)
	const [turnstileToken, setTurnstileToken] = useState(null)
	const [showPassword, setShowPassword] = useState(false)
	const turnstileRef = useRef(null)

	const handleChange = e => {
		setValues({ ...values, [e.target.name]: e.target.value })
	}

	const handleSubmit = async e => {
		e.preventDefault()
		// Verify Turnstile token
		if (!turnstileToken) {
			logger.error('No Turnstile token found in state')
			toast.error(t('pleaseSolveCaptcha') || 'Veuillez completer la verification anti-bot')
			return
		}
		logger.log('Token (first 20 chars):', turnstileToken.substring(0, 20) + '...')

		// Verify token with backend
		try {
			const verifyData = await verifyTurnstile(turnstileToken)

			if (!verifyData.success) {
				toast.error(t('captchaVerificationFailed') || 'Echec de la verification anti-bot')
				setTurnstileToken(null)
				turnstileRef.current?.reset()
				return
			}
		} catch (error) {
			logger.error('Turnstile verification error:', error)
			toast.error(t('captchaVerificationError') || 'Erreur lors de la verification anti-bot')
			setTurnstileToken(null)
			turnstileRef.current?.reset()
			return
		}

		// Try to login - reset turnstile on failure
		try {
			await login(values)
		} catch (error) {
			logger.error('Login failed:', error)
			setTurnstileToken(null)
			turnstileRef.current?.reset()
		}
	}

	return (
		<AuthLayout icon={<LogIn className="h-8 w-8 sm:h-9 sm:w-9 text-white" />}>
			{/* Titre */}
			<h1 className="text-center text-2xl sm:text-4xl font-extrabold mb-3 sm:mb-2 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
				{t('signinTitle')}
			</h1>

			<p className={cn(
				'text-center mb-6 sm:mb-8 hidden sm:block',
				isDark ? 'text-slate-400' : 'text-slate-500'
			)}>
				{t('signinSubtitle')}
			</p>

			{/* Boutons OAuth */}
			<OAuthButtons
				onGoogleClick={() => loginWithThirdPartyOAuth('google')}
				onMagicLinkClick={() => setMagicLinkDialogOpen(true)}
			/>

			<div className="relative my-6 sm:my-8">
				<Separator />
				<span className={cn(
					'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-sm font-medium',
					isDark ? 'bg-slate-900 text-slate-400' : 'bg-white text-slate-500'
				)}>
					{t('or')}
				</span>
			</div>

			{/* Formulaire */}
			<form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
				{/* Email */}
				<div className="space-y-2">
					<Label htmlFor="email" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
						{t('email')}
					</Label>
					<div className="relative">
						<AtSign className={cn(
							'absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5',
							isDark ? 'text-slate-400' : 'text-slate-500'
						)} />
						<Input
							type="email"
							name="email"
							id="email"
							value={values.email}
							onChange={handleChange}
							autoComplete="email"
							required
							className={cn(
								'pl-10 h-12 rounded-xl border-2 transition-all',
								isDark
									? 'bg-slate-800/60 border-violet-500/30 focus:border-indigo-500'
									: 'bg-white border-indigo-500/20 focus:border-indigo-500'
							)}
						/>
					</div>
				</div>

				{/* Password */}
				<div className="space-y-2">
					<Label htmlFor="password" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
						{t('password')}
					</Label>
					<div className="relative">
						<KeyRound className={cn(
							'absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5',
							isDark ? 'text-slate-400' : 'text-slate-500'
						)} />
						<Input
							type={showPassword ? 'text' : 'password'}
							name="password"
							id="password"
							value={values.password}
							onChange={handleChange}
							autoComplete="current-password"
							required
							className={cn(
								'pl-10 pr-12 h-12 rounded-xl border-2 transition-all',
								isDark
									? 'bg-slate-800/60 border-violet-500/30 focus:border-indigo-500'
									: 'bg-white border-indigo-500/20 focus:border-indigo-500'
							)}
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className={cn(
								'absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors',
								isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
							)}
							aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
							{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
						</button>
					</div>

					{/* Mot de passe oublie */}
					<div className="text-right mt-2">
						<Link
							href="/reset-password"
							className="text-sm font-semibold text-indigo-500 hover:text-purple-600 hover:underline transition-colors">
							{t('forgot')}
						</Link>
					</div>
				</div>

				{/* Turnstile Anti-Bot Widget */}
				<TurnstileWidget
					ref={turnstileRef}
					onSuccess={(token) => {
						logger.log('Token:', token?.substring(0, 20) + '...')
						setTurnstileToken(token)
					}}
					onError={(error) => {
						logger.error('Login page: Turnstile error or expiration:', error)
						setTurnstileToken(null)
						toast.error(t('captchaExpired') || 'Le captcha a expire, veuillez le refaire')
					}}
					action="login"
				/>

				<Button
					type="submit"
					size="lg"
					className={cn(
						'w-full h-12 sm:h-14 rounded-xl font-bold text-base sm:text-lg',
						'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500',
						'shadow-[0_8px_24px_rgba(102,126,234,0.4)] hover:shadow-[0_12px_32px_rgba(102,126,234,0.5)]',
						'transition-all duration-300 hover:-translate-y-0.5'
					)}>
					{t('signinBtn')}
				</Button>

				{/* Lien vers inscription */}
				<p className={cn(
					'text-center text-sm sm:text-base mt-2',
					isDark ? 'text-slate-400' : 'text-slate-500'
				)}>
					{t('noAccountQuestion')}{' '}
					<Link
						href="/signup"
						className="font-bold text-indigo-500 hover:text-purple-600 hover:underline transition-colors">
						{t('noaccount')}
					</Link>
				</p>
			</form>

			<MagicLinkDialog
				open={magicLinkDialogOpen}
				onClose={() => setMagicLinkDialogOpen(false)}
				onSend={sendMagicLink}
			/>
		</AuthLayout>
	)
}

export default Login
