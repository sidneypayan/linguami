'use client'
import { useTranslations } from 'next-intl'
import { useState, useMemo, useEffect, useRef } from 'react'
import toast from '@/utils/toast'
import { useUserContext } from '@/context/user'
import { useTheme } from '@/context/ThemeContext'
import { supabase } from '@/lib/supabase'
import { AVATARS } from '@/utils/avatars'
import AuthLayout from '@/components/auth/AuthLayout'
import OAuthButtons from '@/components/auth/OAuthButtons'
import MagicLinkDialog from '@/components/auth/MagicLinkDialog'
import TurnstileWidget from '@/components/shared/TurnstileWidget'
import { FrenchFlag, RussianFlag, EnglishFlag } from '@/components/auth/FlagIcons'
import { Link } from '@/i18n/navigation'
import { logger } from '@/utils/logger'
import { verifyTurnstile } from '@/app/actions/auth'
import {
	UserPlus,
	AtSign,
	KeyRound,
	User,
	GraduationCap,
	MessageCircle,
	CheckCircle2,
	XCircle,
	SignalLow,
	SignalMedium,
	SignalHigh,
	ChevronDown,
	ChevronUp,
	Eye,
	EyeOff,
	TrendingUp
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const initialState = {
	email: '',
	password: '',
	username: '',
	spokenLanguage: '',
	learningLanguage: '',
	languageLevel: '',
	selectedAvatar: 'avatar1',
}

const Signup = () => {
	const t = useTranslations('register')
	const { register, loginWithThirdPartyOAuth, sendMagicLink } = useUserContext()
	const { isDark } = useTheme()
	const [values, setValues] = useState(initialState)
	const [showAvatars, setShowAvatars] = useState(false)
	const [magicLinkDialogOpen, setMagicLinkDialogOpen] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [turnstileToken, setTurnstileToken] = useState(null)
	const turnstileRef = useRef(null)

	// Liste de mots de passe communs a bloquer
	const commonPasswords = useMemo(() => [
		'password', 'password123', '123456', '12345678', '123456789',
		'qwerty', 'azerty', 'admin', 'letmein', 'welcome', 'monkey',
		'dragon', 'master', 'sunshine', 'princess', 'football',
		'iloveyou', 'trustno1', 'abc123', '111111', '1234567890'
	], [])

	// Validation du mot de passe (approche moderne NIST)
	const passwordValidation = useMemo(() => {
		const { password, username, email } = values
		const lowerPassword = password.toLowerCase()
		const lowerUsername = username.toLowerCase()
		const emailLocal = email.split('@')[0].toLowerCase()

		return {
			minLength: password.length >= 12,
			maxLength: password.length <= 128,
			notCommon: !commonPasswords.includes(lowerPassword),
			notPersonal: !(
				(lowerUsername && lowerPassword.includes(lowerUsername)) ||
				(emailLocal && lowerPassword.includes(emailLocal))
			),
		}
	}, [values.password, values.username, values.email, commonPasswords])

	const passwordStrength = useMemo(() => {
		const { password } = values
		if (password.length === 0) return 0

		// Calcul de la force base sur la longueur et la diversite
		let score = 0

		// Longueur (0-40 points)
		score += Math.min(password.length * 2, 40)

		// Diversite de caracteres (0-60 points)
		if (/[a-z]/.test(password)) score += 15
		if (/[A-Z]/.test(password)) score += 15
		if (/[0-9]/.test(password)) score += 15
		if (/[^a-zA-Z0-9]/.test(password)) score += 15

		return Math.min(score, 100)
	}, [values.password])

	const isPasswordValid = useMemo(() => {
		return Object.values(passwordValidation).every(Boolean)
	}, [passwordValidation])

	const handleChange = e => {
		const name = e.target.name
		let value = e.target.value

		// Securisation: nettoyer les caracteres dangereux sauf pour le password
		if (name !== 'password' && name !== 'email') {
			value = value.replace(/[<>]/g, '')
		}

		setValues({ ...values, [name]: value })
	}

	const handleSelectChange = (name, value) => {
		setValues({ ...values, [name]: value })
	}

	const handleAvatarSelect = avatarId => {
		setValues({ ...values, selectedAvatar: avatarId })
		setShowAvatars(false)
	}

	// Mapper les noms de langues vers les codes de langue pour la base de donnees
	const mapLanguageToCode = languageName => {
		const languageMap = {
			english: 'en',
			french: 'fr',
			russian: 'ru',
		}
		return languageMap[languageName] || languageName
	}

	// Filtrer les langues d'apprentissage disponibles (anglais suspendu temporairement)
	const availableLearningLanguages = useMemo(() => {
		const allLanguages = [
			{ value: 'french', label: t('french'), flag: FrenchFlag },
			{ value: 'russian', label: t('russian'), flag: RussianFlag },
		]

		if (!values.spokenLanguage) return allLanguages

		return allLanguages.filter(lang => lang.value !== values.spokenLanguage)
	}, [values.spokenLanguage, t])

	// Reinitialiser la langue d'apprentissage si elle devient invalide
	useEffect(() => {
		if (values.learningLanguage && values.spokenLanguage === values.learningLanguage) {
			setValues(prev => ({ ...prev, learningLanguage: '' }))
		}
	}, [values.spokenLanguage, values.learningLanguage])

	const handleSubmit = async e => {
		e.preventDefault()

		const {
			email,
			password,
			username,
			spokenLanguage,
			learningLanguage,
			languageLevel,
		} = values

		// Validation
		if (!email || !password || !username || !spokenLanguage || !learningLanguage || !languageLevel) {
			toast.error(t('fillAllFields'))
			return
		}

		logger.log('Signup form submitted')
		logger.log('Turnstile token in state:', turnstileToken ? 'YES' : 'NO')

		// Verify Turnstile token
		if (!turnstileToken) {
			logger.error('No Turnstile token found in state')
			toast.error(t('pleaseSolveCaptcha') || 'Veuillez completer la verification anti-bot')
			return
		}

		logger.log('Verifying token with backend...')

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

		if (username.length < 3) {
			toast.error(t('usernameMinLength'))
			return
		}

		if (!isPasswordValid) {
			toast.error(t('passwordRequirements'))
			return
		}

		if (spokenLanguage === learningLanguage) {
			toast.error(t('cannotLearnSameLanguage'))
			return
		}

		// Verifier l'unicite du pseudo
		try {
			const { data: existingUser, error: checkError } = await supabase
				.from('users_profile')
				.select('id')
				.eq('name', username)
				.maybeSingle()

			if (checkError && checkError.code !== 'PGRST116') {
				logger.error('Error checking username:', checkError)
				toast.error(t('errorCheckingUsername'))
				return
			}

			if (existingUser) {
				toast.error(t('usernameAlreadyTaken'))
				return
			}
		} catch (err) {
			logger.error('Error checking username:', err)
			toast.error(t('errorCheckingUsername'))
			return
		}

		// Enregistrer - reset turnstile on failure
		try {
			return await register({
				...values,
				spokenLanguage: mapLanguageToCode(spokenLanguage),
				learningLanguage: mapLanguageToCode(learningLanguage),
			})
		} catch (error) {
			logger.error('Registration failed:', error)
			setTurnstileToken(null)
			turnstileRef.current?.reset()
			throw error
		}
	}

	const inputClassName = cn(
		'h-12 rounded-xl border-2 transition-all',
		isDark
			? 'bg-slate-800/60 border-violet-500/30 focus:border-indigo-500'
			: 'bg-white border-indigo-500/20 focus:border-indigo-500'
	)

	return (
		<AuthLayout icon={<UserPlus className="w-8 h-8 sm:w-9 sm:h-9 text-white" />}>
			{/* Titre */}
			<h1 className="text-center text-2xl sm:text-4xl font-extrabold mb-3 sm:mb-2 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
				{t('signupTitle')}
			</h1>

			<p className={cn(
				'text-center mb-6 sm:mb-8 hidden sm:block',
				isDark ? 'text-slate-400' : 'text-slate-500'
			)}>
				{t('signupSubtitle')}
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
				{/* Pseudo */}
				<div className="space-y-2">
					<Label htmlFor="username" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
						{t('username')}
					</Label>
					<div className="relative">
						<User className={cn(
							'absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5',
							isDark ? 'text-slate-400' : 'text-slate-500'
						)} />
						<Input
							type="text"
							name="username"
							id="username"
							value={values.username}
							onChange={handleChange}
							autoComplete="username"
							required
							className={cn(inputClassName, 'pl-10')}
						/>
					</div>
					<p className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>
						{t('usernameHelper')}
					</p>
				</div>

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
							className={cn(inputClassName, 'pl-10')}
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
							autoComplete="new-password"
							required
							className={cn(inputClassName, 'pl-10 pr-12')}
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

					{/* Indicateur de force du mot de passe */}
					{values.password && (
						<div className="mt-3 space-y-3">
							<Progress
								value={passwordStrength}
								className="h-1.5"
								style={{
									background: '#E5E7EB',
								}}
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
										<span className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>
											{label}
										</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Langue parlee */}
				<div className="space-y-2">
					<Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
						{t('spokenLanguage')}
					</Label>
					<Select value={values.spokenLanguage} onValueChange={(val) => handleSelectChange('spokenLanguage', val)}>
						<SelectTrigger className={cn(inputClassName, 'pl-10')}>
							<MessageCircle className={cn(
								'absolute left-3 h-5 w-5',
								isDark ? 'text-slate-400' : 'text-slate-500'
							)} />
							<SelectValue placeholder={t('selectLanguage')} />
						</SelectTrigger>
						<SelectContent>
							{[
								{ value: 'english', label: t('english'), Flag: EnglishFlag },
								{ value: 'french', label: t('french'), Flag: FrenchFlag },
								{ value: 'russian', label: t('russian'), Flag: RussianFlag },
							].map(({ value, label, Flag }) => (
								<SelectItem key={value} value={value}>
									<div className="flex items-center gap-2">
										<Flag size={20} />
										<span>{label}</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Langue d'apprentissage */}
				<div className="space-y-2">
					<Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
						{t('learningLanguage')}
					</Label>
					<Select
						value={values.learningLanguage}
						onValueChange={(val) => handleSelectChange('learningLanguage', val)}
						disabled={!values.spokenLanguage}>
						<SelectTrigger className={cn(inputClassName, 'pl-10')}>
							<GraduationCap className={cn(
								'absolute left-3 h-5 w-5',
								isDark ? 'text-slate-400' : 'text-slate-500'
							)} />
							<SelectValue placeholder={t('selectLanguage')} />
						</SelectTrigger>
						<SelectContent>
							{availableLearningLanguages.map(({ value, label, flag: Flag }) => (
								<SelectItem key={value} value={value}>
									<div className="flex items-center gap-2">
										<Flag size={20} />
										<span>{label}</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Niveau de langue */}
				<div className="space-y-2">
					<Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
						{t('languageLevel')}
					</Label>
					<Select value={values.languageLevel} onValueChange={(val) => handleSelectChange('languageLevel', val)}>
						<SelectTrigger className={cn(inputClassName, 'pl-10')}>
							<TrendingUp className={cn(
								'absolute left-3 h-5 w-5',
								isDark ? 'text-slate-400' : 'text-slate-500'
							)} />
							<SelectValue placeholder={t('selectLevel')} />
						</SelectTrigger>
						<SelectContent>
							{[
								{ value: 'beginner', icon: <SignalLow className="h-5 w-5 text-emerald-500" />, label: t('beginner') },
								{ value: 'intermediate', icon: <SignalMedium className="h-5 w-5 text-purple-500" />, label: t('intermediate') },
								{ value: 'advanced', icon: <SignalHigh className="h-5 w-5 text-amber-400" />, label: t('advanced') },
							].map(({ value, icon, label }) => (
								<SelectItem key={value} value={value}>
									<div className="flex items-center gap-2">
										{icon}
										<span>{label}</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Selection d'avatar */}
				<div className="space-y-2">
					<Label className="text-indigo-500 font-semibold">
						{t('chooseAvatar')}
					</Label>

					<button
						type="button"
						onClick={() => setShowAvatars(!showAvatars)}
						className={cn(
							'w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between',
							showAvatars
								? 'border-indigo-500 bg-gradient-to-br from-indigo-500/10 to-purple-500/10'
								: cn(
									'hover:border-indigo-500',
									isDark
										? 'border-violet-500/30 bg-slate-800/60'
										: 'border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5'
								)
						)}>
						<div className="flex items-center gap-3">
							<Avatar className="h-14 w-14 border-[3px] border-indigo-500 shadow-lg">
								<AvatarImage
									src={AVATARS.find(a => a.id === values.selectedAvatar)?.url}
									alt={t('selectedAvatar')}
								/>
								<AvatarFallback>AV</AvatarFallback>
							</Avatar>
							<div className="text-left">
								<p className={cn('font-semibold', isDark ? 'text-slate-100' : 'text-slate-800')}>
									{t(AVATARS.find(a => a.id === values.selectedAvatar)?.nameKey)}
								</p>
								<p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>
									{showAvatars ? t('hideAvatars') : t('clickToChangeAvatar')}
								</p>
							</div>
						</div>
						{showAvatars ? (
							<ChevronUp className="h-6 w-6 text-indigo-500" />
						) : (
							<ChevronDown className="h-6 w-6 text-slate-500" />
						)}
					</button>

					{showAvatars && (
						<div className={cn(
							'mt-3 p-4 rounded-xl border-2 grid grid-cols-4 gap-3',
							isDark
								? 'border-violet-500/30 bg-slate-800/60'
								: 'border-indigo-500/15 bg-gradient-to-br from-indigo-500/5 to-purple-500/5'
						)}>
							{AVATARS.map(avatar => {
								const isSelected = values.selectedAvatar === avatar.id
								return (
									<button
										key={avatar.id}
										type="button"
										onClick={() => handleAvatarSelect(avatar.id)}
										className="flex flex-col items-center gap-1.5 transition-transform hover:scale-105">
										<div className="relative">
											<Avatar className={cn(
												'h-14 w-14 sm:h-16 sm:w-16 transition-all',
												isSelected
													? 'border-[3px] border-indigo-500 shadow-[0_0_0_4px_rgba(102,126,234,0.2)]'
													: 'border-2 border-transparent shadow-md'
											)}>
												<AvatarImage src={avatar.url} alt={avatar.name} />
												<AvatarFallback>AV</AvatarFallback>
											</Avatar>
											{isSelected && (
												<div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
													<CheckCircle2 className="h-4 w-4 text-white" />
												</div>
											)}
										</div>
										<span className={cn(
											'text-xs text-center',
											isSelected
												? 'text-indigo-500 font-semibold'
												: isDark ? 'text-slate-400' : 'text-slate-500'
										)}>
											{t(avatar.nameKey)}
										</span>
									</button>
								)
							})}
						</div>
					)}
				</div>

				{/* Turnstile Anti-Bot Widget */}
				<TurnstileWidget
					ref={turnstileRef}
					onSuccess={(token) => {
						logger.log('Signup page: Turnstile token received')
						setTurnstileToken(token)
					}}
					onError={(error) => {
						logger.error('Signup page: Turnstile error or expiration:', error)
						setTurnstileToken(null)
						toast.error(t('captchaExpired') || 'Le captcha a expire, veuillez le refaire')
					}}
					action="signup"
				/>

				{/* Bouton de soumission */}
				<Button
					type="submit"
					size="lg"
					className={cn(
						'w-full h-12 sm:h-14 rounded-xl font-bold text-base sm:text-lg mt-2',
						'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500',
						'shadow-[0_8px_24px_rgba(102,126,234,0.4)] hover:shadow-[0_12px_32px_rgba(102,126,234,0.5)]',
						'transition-all duration-300 hover:-translate-y-0.5'
					)}>
					{t('signupBtn')}
				</Button>

				{/* Lien vers connexion */}
				<p className={cn(
					'text-center text-sm sm:text-base mt-2',
					isDark ? 'text-slate-400' : 'text-slate-500'
				)}>
					{t('haveAccountQuestion')}{' '}
					<Link
						href="/login"
						className="font-bold text-indigo-500 hover:text-purple-600 hover:underline transition-colors">
						{t('haveaccount')}
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

export default Signup
