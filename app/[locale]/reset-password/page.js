'use client'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import toast from '@/utils/toast'
import { Home, Mail, Lock, CheckCircle2, XCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useUserContext } from '@/context/user'
import { supabase } from '@/lib/supabase'
import { Link } from '@/i18n/navigation'
import { logger } from '@/utils/logger'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const initialState = {
	email: '',
	password: '',
	confirmPassword: '',
}

const UpdatePassword = () => {
	const t = useTranslations('register')
	const router = useRouter()
	const searchParams = useSearchParams()
	const [values, setValues] = useState(initialState)
	const [isResetting, setIsResetting] = useState(false)
	const [loading, setLoading] = useState(true)
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const { updatePassword, setNewPassword } = useUserContext()

	// Liste de mots de passe communs a bloquer
	const commonPasswords = useMemo(() => [
		'password', 'password123', '123456', '12345678', '123456789',
		'qwerty', 'azerty', 'admin', 'letmein', 'welcome', 'monkey',
		'dragon', 'master', 'sunshine', 'princess', 'football',
		'iloveyou', 'trustno1', 'abc123', '111111', '1234567890'
	], [])

	// Validation du mot de passe (approche moderne NIST)
	const passwordValidation = useMemo(() => {
		const { password, email } = values
		const lowerPassword = password.toLowerCase()
		const emailLocal = email.split('@')[0].toLowerCase()

		return {
			minLength: password.length >= 12,
			maxLength: password.length <= 128,
			notCommon: !commonPasswords.includes(lowerPassword),
			notPersonal: !(emailLocal && lowerPassword.includes(emailLocal)),
		}
	}, [values.password, values.email, commonPasswords])

	const passwordStrength = useMemo(() => {
		const { password } = values
		if (password.length === 0) return 0

		let score = 0
		score += Math.min(password.length * 2, 40)
		if (/[a-z]/.test(password)) score += 15
		if (/[A-Z]/.test(password)) score += 15
		if (/[0-9]/.test(password)) score += 15
		if (/[^a-zA-Z0-9]/.test(password)) score += 15

		return Math.min(score, 100)
	}, [values.password])

	const isPasswordValid = useMemo(() => {
		return Object.values(passwordValidation).every(Boolean)
	}, [passwordValidation])

	// Detecter si on arrive depuis l'email avec un token
	useEffect(() => {
		let mounted = true

		const initResetFlow = async () => {
			// Get URL parameters
			const error = searchParams.get('error')
			const error_code = searchParams.get('error_code')
			const code = searchParams.get('code')

			logger.log('URL params:', { error, error_code, code })

			// Verifier les parametres URL pour les erreurs
			if (error_code === 'otp_expired' || error === 'access_denied') {
				toast.error(t('resetLinkExpired') || 'Le lien de reinitialisation a expire. Veuillez en demander un nouveau.')
				setIsResetting(false)
				setLoading(false)
				return
			}

			// Si on a un code dans l'URL, attendre que Supabase l'echange automatiquement
			if (code && typeof code === 'string') {
				logger.log('Code de recuperation detecte dans URL')
				logger.log('Attente de l\'evenement SIGNED_IN de Supabase...')
				return
			}

			// 1) Verifier si une session de recuperation existe deja
			supabase.auth.getSession().then(({ data: { session } }) => {
				if (!mounted) return
				if (session?.user) {
					logger.log('Recovery session found')
					setIsResetting(true)
				} else {
					logger.log('No session yet, waiting for PASSWORD_RECOVERY event')
					setIsResetting(false)
				}
				setLoading(false)
			})
		}

		initResetFlow()

		// 2) Ecouter les evenements d'authentification
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
			logger.log('Auth event:', event)

			// Detecter une connexion suite a un reset password
			if (event === 'SIGNED_IN' && searchParams.get('code')) {
				logger.log('SIGNED_IN detecte avec code de recuperation')
				setIsResetting(true)
				setLoading(false)
			}

			// Detecter l'evenement PASSWORD_RECOVERY (ancien flow)
			if (event === 'PASSWORD_RECOVERY') {
				logger.log('PASSWORD_RECOVERY event detected')
				setIsResetting(true)
				setLoading(false)
			}
		})

		// Cleanup
		return () => {
			mounted = false
			subscription?.unsubscribe()
		}
	}, [searchParams, t])

	const handleChange = e => {
		const name = e.target.name
		const value = e.target.value

		setValues({ ...values, [name]: value })
	}

	const handleSubmit = async e => {
		e.preventDefault()

		if (isResetting) {
			// Cas 2 : Definir le nouveau mot de passe
			const { password, confirmPassword } = values

			if (!password || !confirmPassword) {
				return toast.error(t('fillAllFields'))
			}

			if (password !== confirmPassword) {
				return toast.error(t('passwordsDoNotMatch'))
			}

			if (!isPasswordValid) {
				return toast.error(t('passwordRequirements'))
			}

			return setNewPassword(password)
		} else {
			// Cas 1 : Demander le lien de reset
			const { email } = values

			if (!email) {
				return toast.error(t('fillAllFields'))
			}

			return updatePassword(email)
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
				<Loader2 className="h-16 w-16 text-white animate-spin" />
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center relative overflow-hidden py-8 sm:py-12">
			{/* Background effects */}
			<div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.25),rgba(255,255,255,0.1)_30%,transparent_70%)] blur-[40px] pointer-events-none" />
			<div className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.3),rgba(0,0,0,0.15)_30%,transparent_70%)] blur-[40px] pointer-events-none" />

			<div className="relative z-10 w-full max-w-md mx-auto px-4">
				<Card className="p-6 sm:p-10 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.3)] bg-white">
					{/* Logo */}
					<div className="flex items-center justify-center mb-2">
						<div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_8px_24px_rgba(102,126,234,0.4)]">
							<Home className="h-8 w-8 text-white" />
						</div>
					</div>

					{/* Titre */}
					<h1 className="text-center text-2xl sm:text-3xl font-extrabold mb-2 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
						{isResetting ? t('setNewPassword') : t('updatePasswordTitle')}
					</h1>

					<p className="text-center text-slate-500 mb-8">
						{isResetting ? t('enterNewPassword') : t('updatePasswordSubtitle')}
					</p>

					{/* Formulaire */}
					<form onSubmit={handleSubmit} className="flex flex-col gap-5">
						{isResetting ? (
							<>
								{/* Nouveau mot de passe */}
								<div className="space-y-2">
									<Label htmlFor="password">{t('newPassword')}</Label>
									<div className="relative">
										<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
										<Input
											type={showPassword ? 'text' : 'password'}
											name="password"
											id="password"
											value={values.password}
											onChange={handleChange}
											autoComplete="new-password"
											className="pl-10 pr-12 h-12 rounded-xl border-2 border-indigo-500/20 focus:border-indigo-500"
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-indigo-500 transition-colors">
											{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
										</button>
									</div>

									{/* Indicateur de force du mot de passe */}
									{values.password && (
										<div className="mt-3 space-y-3">
											<Progress
												value={passwordStrength}
												className="h-1.5"
												style={{ background: '#E5E7EB' }}
											/>
											<div className="flex flex-col gap-1.5">
												{[
													{ key: 'minLength', label: t('passwordMinLength12') },
													{ key: 'maxLength', label: t('passwordMaxLength') },
													{ key: 'notCommon', label: t('passwordNotCommon') },
													{ key: 'notPersonal', label: t('passwordNotPersonal') },
												].map(({ key, label }) => (
													<div key={key} className="flex items-center gap-2">
														{passwordValidation[key] ? (
															<CheckCircle2 className="h-4 w-4 text-emerald-500" />
														) : (
															<XCircle className="h-4 w-4 text-red-500" />
														)}
														<span className="text-xs text-slate-500">{label}</span>
													</div>
												))}
											</div>
										</div>
									)}
								</div>

								{/* Confirmation mot de passe */}
								<div className="space-y-2">
									<Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
									<div className="relative">
										<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
										<Input
											type={showConfirmPassword ? 'text' : 'password'}
											name="confirmPassword"
											id="confirmPassword"
											value={values.confirmPassword}
											onChange={handleChange}
											autoComplete="new-password"
											className="pl-10 pr-12 h-12 rounded-xl border-2 border-indigo-500/20 focus:border-indigo-500"
										/>
										<button
											type="button"
											onClick={() => setShowConfirmPassword(!showConfirmPassword)}
											className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-indigo-500 transition-colors">
											{showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
										</button>
									</div>
								</div>
							</>
						) : (
							<div className="space-y-2">
								<Label htmlFor="email">{t('email')}</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
									<Input
										type="email"
										name="email"
										id="email"
										value={values.email}
										onChange={handleChange}
										autoComplete="email"
										className="pl-10 h-12 rounded-xl border-2 border-indigo-500/20 focus:border-indigo-500"
									/>
								</div>
							</div>
						)}

						<Button
							type="submit"
							size="lg"
							className={cn(
								'w-full h-12 rounded-xl font-bold text-lg',
								'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500',
								'shadow-[0_8px_24px_rgba(102,126,234,0.4)] hover:shadow-[0_12px_32px_rgba(102,126,234,0.5)]',
								'transition-all duration-300 hover:-translate-y-0.5'
							)}>
							{isResetting ? t('updatePassword') : t('sendRequest')}
						</Button>

						<Link href="/login" className="block">
							<Button
								type="button"
								variant="ghost"
								className="w-full text-indigo-500 font-semibold hover:text-purple-600 hover:bg-indigo-500/5">
								{t('backToSignin')}
							</Button>
						</Link>
					</form>
				</Card>
			</div>
		</div>
	)
}

export default UpdatePassword
