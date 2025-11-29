'use client'

import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { useUserContext } from '@/context/user'
import { useThemeMode } from '@/context/ThemeContext'
import { useLocale } from 'next-intl'
import toast from '@/utils/toast'
import { AVATARS, getAvatarUrl } from '@/utils/avatars'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { useRouter } from 'next/navigation'
import { logger } from '@/utils/logger'
import { changePassword, deleteAccount } from '@/app/actions/auth'
import {
	User,
	Mail,
	Globe,
	Edit3,
	Check,
	X,
	Settings,
	Lock,
	Trash2,
	Target,
	Shield,
	Sparkles,
	Crown,
	Flame,
	Coins,
	Zap,
	Eye,
	EyeOff,
	Swords,
	Trophy,
	Star,
	Scroll,
	Wand2,
} from 'lucide-react'

const SettingsClient = ({ translations }) => {
	const { userProfile, updateUserProfile, logout } = useUserContext()
	const router = useRouter()
	const { isDark } = useThemeMode()

	const [formData, setFormData] = useState({
		username: '',
		email: '',
		languageLevel: '',
		learningLanguage: '',
		dailyXpGoal: 100,
		showInLeaderboard: true,
	})

	const [selectedAvatar, setSelectedAvatar] = useState('avatar1')
	const [loading, setLoading] = useState(false)
	const [editMode, setEditMode] = useState({
		username: false,
		email: false,
		languageLevel: false,
		learningLanguage: false,
		dailyXpGoal: false,
	})
	const [avatarDialogOpen, setAvatarDialogOpen] = useState(false)
	const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false)
	const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false)
	const [passwordData, setPasswordData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	})
	const [showPasswords, setShowPasswords] = useState({
		current: false,
		new: false,
		confirm: false,
	})

	const passwordStrength = useMemo(() => {
		const { newPassword } = passwordData
		if (newPassword.length === 0) return 0
		let score = 0
		score += Math.min(newPassword.length * 2, 40)
		if (/[a-z]/.test(newPassword)) score += 15
		if (/[A-Z]/.test(newPassword)) score += 15
		if (/[0-9]/.test(newPassword)) score += 15
		if (/[^a-zA-Z0-9]/.test(newPassword)) score += 15
		return Math.min(score, 100)
	}, [passwordData.newPassword])

	const isPasswordValid = useMemo(() => {
		return passwordData.newPassword.length >= 12
	}, [passwordData.newPassword])

	useEffect(() => {
		if (userProfile) {
			setFormData({
				username: userProfile.name || '',
				email: userProfile.email || '',
				languageLevel: userProfile.language_level || '',
				learningLanguage: userProfile.learning_language || 'fr',
				dailyXpGoal: userProfile.daily_xp_goal || 100,
				showInLeaderboard: userProfile.show_in_leaderboard ?? true,
			})
			setSelectedAvatar(userProfile.avatar_id || 'avatar1')
		}
	}, [userProfile])

	const handleChange = (field, value) => {
		setFormData({ ...formData, [field]: value })
	}

	const handleToggle = async (field) => {
		const newValue = !formData[field]
		setFormData({ ...formData, [field]: newValue })

		setLoading(true)
		try {
			const fieldMapping = { showInLeaderboard: 'show_in_leaderboard' }
			await updateUserProfile({ [fieldMapping[field]]: newValue })
			toast.success(translations.updateSuccess)
		} catch (error) {
			logger.error('Error updating toggle:', error)
			toast.error(error.message || translations.updateError)
			setFormData({ ...formData, [field]: !newValue })
		} finally {
			setLoading(false)
		}
	}

	const toggleEditMode = (field) => {
		setEditMode({ ...editMode, [field]: !editMode[field] })
	}

	const handleSave = async (field) => {
		setLoading(true)
		try {
			const fieldMapping = {
				username: 'name',
				email: 'email',
				languageLevel: 'language_level',
				learningLanguage: 'learning_language',
				dailyXpGoal: 'daily_xp_goal',
			}

			await updateUserProfile({ [fieldMapping[field]]: formData[field] })

			if (field === 'languageLevel') {
				try {
					localStorage.removeItem('materials_list_filters')
					const storageKeys = Object.keys(localStorage)
					storageKeys.forEach((key) => {
						if (key.startsWith('materials_section_')) {
							localStorage.removeItem(key)
						}
					})
				} catch (e) {}
			}

			toast.success(translations.updateSuccess)
			toggleEditMode(field)
		} catch (error) {
			logger.error('Error updating profile:', error)
			toast.error(error.message || translations.updateError)
		} finally {
			setLoading(false)
		}
	}

	const handleCancel = (field) => {
		toggleEditMode(field)
		if (userProfile) {
			const fieldMapping = {
				username: 'name',
				email: 'email',
				languageLevel: 'language_level',
				learningLanguage: 'learning_language',
				dailyXpGoal: 'daily_xp_goal',
			}
			setFormData({ ...formData, [field]: userProfile[fieldMapping[field]] || '' })
		}
	}

	const handleChangePassword = async () => {
		if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
			toast.error(translations.fillAllFields)
			return
		}
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			toast.error(translations.passwordMismatch)
			return
		}
		if (!isPasswordValid) {
			toast.error(translations.passwordRequirements)
			return
		}

		setLoading(true)
		try {
			const result = await changePassword({
				currentPassword: passwordData.currentPassword,
				newPassword: passwordData.newPassword,
			})

			if (!result.success) {
				throw new Error(result.error || translations.changePasswordError)
			}

			toast.success(translations.passwordChanged)
			setChangePasswordDialogOpen(false)
			setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
		} catch (error) {
			logger.error('Error changing password:', error)
			toast.error(error.message || translations.changePasswordError)
		} finally {
			setLoading(false)
		}
	}

	const handleDeleteAccount = async () => {
		setLoading(true)
		try {
			const result = await deleteAccount()
			if (!result.success) {
				throw new Error(result.error || translations.deleteAccountError)
			}
			toast.success(translations.accountDeleted)
			await logout()
			router.push('/')
		} catch (error) {
			logger.error('Error deleting account:', error)
			toast.error(error.message || translations.deleteAccountError)
		} finally {
			setLoading(false)
		}
	}

	const handleAvatarChange = async (newAvatarId) => {
		setLoading(true)
		try {
			await updateUserProfile({ avatar_id: newAvatarId })
			setSelectedAvatar(newAvatarId)
			toast.success(translations.avatarUpdated)
			setAvatarDialogOpen(false)
		} catch (error) {
			logger.error('Error updating avatar:', error)
			toast.error(error.message || translations.updateError)
		} finally {
			setLoading(false)
		}
	}

	const goals = [
		{ value: 50, emoji: '🌱', label: translations.goalRelaxed, time: translations.goal5to10min, color: 'emerald' },
		{ value: 100, emoji: '⭐', label: translations.goalRegular, time: translations.goal15to20min, color: 'amber', recommended: true },
		{ value: 200, emoji: '🔥', label: translations.goalMotivated, time: translations.goal30min, color: 'orange' },
		{ value: 300, emoji: '💪', label: translations.goalIntensive, time: translations.goal45minPlus, color: 'red' },
		{ value: 0, emoji: '🎯', label: translations.goalNone, time: translations.goalAtMyPace, color: 'violet' },
	]

	const handleGoalClick = async (goalValue) => {
		setFormData({ ...formData, dailyXpGoal: goalValue })
		setLoading(true)
		try {
			await updateUserProfile({ daily_xp_goal: goalValue })
			toast.success(translations.updateSuccess)
		} catch (error) {
			logger.error('Error updating goal:', error)
			toast.error(error.message || translations.updateError)
		} finally {
			setLoading(false)
		}
	}

	const getLevelLabel = (level) => {
		const labels = {
			beginner: translations.beginner,
			intermediate: translations.intermediate,
			advanced: translations.advanced,
		}
		return labels[level] || level
	}

	// Calculate level progress
	const currentLevelXp = userProfile?.xp || 0
	const xpForNextLevel = (userProfile?.level || 1) * 1000
	const levelProgress = Math.min((currentLevelXp / xpForNextLevel) * 100, 100)

	return (
		<div className={cn('min-h-screen py-8 pt-24 md:pt-20', isDark ? 'bg-slate-950' : 'bg-slate-50')}>
			{/* Decorative background elements */}
			<div className="fixed inset-0 pointer-events-none overflow-hidden">
				<div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl" />
				<div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/3 rounded-full blur-3xl" />
			</div>

			<div className="relative max-w-6xl mx-auto px-4">
				{/* Page Header */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center gap-3 mb-2">
						<div className={cn(
							'w-12 h-12 rounded-xl flex items-center justify-center',
							'bg-gradient-to-br from-violet-500 to-purple-600',
							'shadow-lg shadow-violet-500/30'
						)}>
							<Scroll className="w-6 h-6 text-white" />
						</div>
						<h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
							{translations.settingsTitle || 'Grimoire du Heros'}
						</h1>
					</div>
					<p className={cn('text-base', isDark ? 'text-slate-500' : 'text-slate-400')}>
						{translations.settingsSubtitle || 'Personnalisez votre aventure'}
					</p>
				</div>

				{/* Hero Card - Character Portrait - Full Width on Mobile */}
				<Card className={cn(
					'relative overflow-hidden mb-8',
					'bg-gradient-to-br from-violet-950 via-slate-900 to-purple-950',
					'border-2 border-violet-500/30 shadow-2xl shadow-violet-500/20'
				)}>
					{/* Animated glow effects */}
					<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
					<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-violet-400 to-transparent animate-pulse" />
					<div className="absolute -top-32 -right-32 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />
					<div className="absolute -bottom-32 -left-32 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />

					<CardContent className="p-6 md:p-8">
						<div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
							{/* Avatar Section */}
							<div className="relative flex-shrink-0">
								<div
									className="relative w-36 h-36 md:w-44 md:h-44 rounded-full p-1.5 bg-gradient-to-br from-violet-500 via-cyan-500 to-violet-500 shadow-2xl shadow-violet-500/40 cursor-pointer group animate-pulse-slow"
									onClick={() => setAvatarDialogOpen(true)}
								>
									<img
										src={getAvatarUrl(selectedAvatar)}
										alt="Avatar"
										className="w-full h-full rounded-full border-4 border-slate-900 object-cover"
									/>
									<div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
										<Edit3 className="w-8 h-8 text-white" />
									</div>
								</div>
								{/* Level badge */}
								<div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
									<Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-4 py-1 text-sm shadow-lg shadow-amber-500/40">
										<Crown className="w-4 h-4 mr-1" />
										Nv. {userProfile?.level || 1}
									</Badge>
								</div>
							</div>

							{/* Character Info */}
							<div className="flex-1 text-center md:text-left">
								<h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-violet-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent mb-2">
									{userProfile?.name || 'Aventurier'}
								</h2>

								{/* XP Progress Bar */}
								<div className="mb-4">
									<div className="flex items-center justify-between text-xs text-slate-400 mb-1">
										<span className="flex items-center gap-1">
											<Zap className="w-3 h-3 text-cyan-400" />
											{currentLevelXp} XP
										</span>
										<span>{xpForNextLevel} XP</span>
									</div>
									<div className="relative h-3 rounded-full bg-slate-800 border border-violet-500/30 overflow-hidden">
										<div
											className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500 rounded-full transition-all duration-500"
											style={{ width: `${levelProgress}%` }}
										/>
										<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
									</div>
								</div>

								{/* Stats Grid */}
								<div className="grid grid-cols-3 gap-4">
									<div className={cn(
										'p-3 rounded-xl text-center',
										'bg-gradient-to-br from-cyan-500/20 to-cyan-500/5',
										'border border-cyan-500/30'
									)}>
										<Zap className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
										<p className="text-2xl font-black bg-gradient-to-b from-cyan-300 to-cyan-500 bg-clip-text text-transparent">
											{userProfile?.xp || 0}
										</p>
										<p className="text-[10px] text-cyan-400/70 uppercase tracking-wider font-bold">XP Total</p>
									</div>
									<div className={cn(
										'p-3 rounded-xl text-center',
										'bg-gradient-to-br from-violet-500/20 to-violet-500/5',
										'border border-violet-500/30'
									)}>
										<Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
										<p className="text-2xl font-black bg-gradient-to-b from-orange-300 to-orange-500 bg-clip-text text-transparent">
											{userProfile?.streak || 0}
										</p>
										<p className="text-[10px] text-orange-400/70 uppercase tracking-wider font-bold">Streak</p>
									</div>
									<div className={cn(
										'p-3 rounded-xl text-center',
										'bg-gradient-to-br from-amber-500/20 to-amber-500/5',
										'border border-amber-500/30'
									)}>
										<Coins className="w-5 h-5 text-amber-400 mx-auto mb-1" />
										<p className="text-2xl font-black bg-gradient-to-b from-amber-300 to-amber-500 bg-clip-text text-transparent">
											{userProfile?.gold || 0}
										</p>
										<p className="text-[10px] text-amber-400/70 uppercase tracking-wider font-bold">Or</p>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Settings Sections - Bento Grid Style */}
				<div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
					{/* Profile Section - Spans 2 columns on large */}
					<Card className={cn(
						'lg:col-span-2 overflow-hidden transition-all duration-300 group',
						'hover:shadow-xl hover:-translate-y-1',
						isDark
							? 'bg-gradient-to-br from-slate-900/95 to-slate-800/90 border-violet-500/20 hover:border-violet-500/40 hover:shadow-violet-500/10'
							: 'bg-white border-violet-200 hover:border-violet-400 hover:shadow-violet-200/50'
					)}>
						<CardHeader className="pb-2">
							<div className="flex items-center gap-3">
								<div className={cn(
									'w-10 h-10 rounded-xl flex items-center justify-center',
									'bg-gradient-to-br from-violet-500 to-purple-600',
									'shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform'
								)}>
									<User className="w-5 h-5 text-white" />
								</div>
								<CardTitle className={cn(
									'font-bold uppercase tracking-wider text-base',
									isDark ? 'text-violet-300' : 'text-violet-700'
								)}>
									{translations.personalInfo}
								</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="space-y-1">
							{/* Username Field */}
							<SettingsField
								icon={<User className="w-4 h-4" />}
								label={translations.username}
								value={formData.username}
								isEditing={editMode.username}
								isDark={isDark}
								color="violet"
								onEdit={() => toggleEditMode('username')}
								onSave={() => handleSave('username')}
								onCancel={() => handleCancel('username')}
								onChange={(val) => handleChange('username', val)}
								loading={loading}
							/>

							{/* Email Field */}
							<SettingsField
								icon={<Mail className="w-4 h-4" />}
								label={translations.email}
								value={formData.email}
								isEditing={false}
								isDark={isDark}
								color="violet"
								readonly
								hint={translations.emailNotEditable}
							/>
						</CardContent>
					</Card>

					{/* Language Preferences - Single column */}
					<Card className={cn(
						'overflow-hidden transition-all duration-300 group',
						'hover:shadow-xl hover:-translate-y-1',
						isDark
							? 'bg-gradient-to-br from-slate-900/95 to-slate-800/90 border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-cyan-500/10'
							: 'bg-white border-cyan-200 hover:border-cyan-400 hover:shadow-cyan-200/50'
					)}>
						<CardHeader className="pb-2">
							<div className="flex items-center gap-3">
								<div className={cn(
									'w-10 h-10 rounded-xl flex items-center justify-center',
									'bg-gradient-to-br from-cyan-500 to-teal-600',
									'shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform'
								)}>
									<Globe className="w-5 h-5 text-white" />
								</div>
								<CardTitle className={cn(
									'font-bold uppercase tracking-wider text-base',
									isDark ? 'text-cyan-300' : 'text-cyan-700'
								)}>
									{translations.languagePreferences}
								</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							<SettingsField
								icon={<Wand2 className="w-4 h-4" />}
								label={translations.languageLevel}
								value={getLevelLabel(formData.languageLevel)}
								rawValue={formData.languageLevel}
								isEditing={editMode.languageLevel}
								isDark={isDark}
								color="cyan"
								type="select"
								options={[
									{ value: 'beginner', label: translations.beginner },
									{ value: 'intermediate', label: translations.intermediate },
									{ value: 'advanced', label: translations.advanced },
								]}
								onEdit={() => toggleEditMode('languageLevel')}
								onSave={() => handleSave('languageLevel')}
								onCancel={() => handleCancel('languageLevel')}
								onChange={(val) => handleChange('languageLevel', val)}
								loading={loading}
							/>
						</CardContent>
					</Card>

					{/* Goals Section - Full width */}
					<Card className={cn(
						'lg:col-span-2 overflow-hidden transition-all duration-300 group',
						'hover:shadow-xl hover:-translate-y-1',
						isDark
							? 'bg-gradient-to-br from-slate-900/95 to-slate-800/90 border-amber-500/20 hover:border-amber-500/40 hover:shadow-amber-500/10'
							: 'bg-white border-amber-200 hover:border-amber-400 hover:shadow-amber-200/50'
					)}>
						<CardHeader className="pb-2">
							<div className="flex items-center gap-3">
								<div className={cn(
									'w-10 h-10 rounded-xl flex items-center justify-center',
									'bg-gradient-to-br from-amber-500 to-orange-600',
									'shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform'
								)}>
									<Target className="w-5 h-5 text-white" />
								</div>
								<CardTitle className={cn(
									'font-bold uppercase tracking-wider text-base',
									isDark ? 'text-amber-300' : 'text-amber-700'
								)}>
									{translations.goalsAndMotivation}
								</CardTitle>
							</div>
						</CardHeader>

						<CardContent>
							<p className={cn(
								'text-sm font-semibold uppercase tracking-wider mb-4',
								isDark ? 'text-amber-400/70' : 'text-amber-600/70'
							)}>
								{translations.dailyXpGoal}
							</p>

							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
								{goals.map((goal) => {
									const isSelected = formData.dailyXpGoal === goal.value
									const goalColors = {
										emerald: { bg: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500', text: 'text-emerald-500', shadow: 'shadow-emerald-500/30' },
										amber: { bg: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500', text: 'text-amber-500', shadow: 'shadow-amber-500/30' },
										orange: { bg: 'from-orange-500/20 to-orange-500/5', border: 'border-orange-500', text: 'text-orange-500', shadow: 'shadow-orange-500/30' },
										red: { bg: 'from-red-500/20 to-red-500/5', border: 'border-red-500', text: 'text-red-500', shadow: 'shadow-red-500/30' },
										violet: { bg: 'from-violet-500/20 to-violet-500/5', border: 'border-violet-500', text: 'text-violet-500', shadow: 'shadow-violet-500/30' },
									}
									const colors = goalColors[goal.color] || goalColors.violet

									return (
										<button
											key={goal.value}
											onClick={() => !loading && handleGoalClick(goal.value)}
											disabled={loading}
											className={cn(
												'relative p-4 rounded-xl border-2 transition-all text-center',
												'hover:scale-105 hover:-translate-y-1',
												isSelected
													? `${colors.border} bg-gradient-to-br ${colors.bg} shadow-lg ${colors.shadow}`
													: isDark
														? 'border-slate-700/50 hover:border-slate-600 bg-slate-800/30'
														: 'border-slate-200 hover:border-slate-300 bg-slate-50',
												loading && 'opacity-50 cursor-not-allowed'
											)}
										>
											{goal.recommended && (
												<Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] px-2 shadow-lg">
													<Star className="w-3 h-3 mr-0.5" />
													{translations.recommended}
												</Badge>
											)}

											<div className="flex flex-col items-center gap-2">
												<div className={cn(
													'w-14 h-14 rounded-full flex items-center justify-center text-2xl',
													isSelected
														? `bg-gradient-to-br ${colors.bg} border-2 ${colors.border}`
														: 'bg-slate-700/30 border-2 border-slate-600/30'
												)}>
													{goal.emoji}
												</div>

												<div>
													<span className={cn(
														'font-bold text-base block',
														isSelected
															? colors.text
															: isDark ? 'text-white' : 'text-slate-900'
													)}>
														{goal.label}
													</span>
													{goal.value > 0 && (
														<span className={cn('text-sm font-bold', colors.text)}>
															{goal.value} XP
														</span>
													)}
												</div>
												<p className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>
													{goal.time}
												</p>

												{isSelected && (
													<div className={cn('w-6 h-6 rounded-full flex items-center justify-center', `bg-gradient-to-br ${colors.bg} ${colors.border} border`)}>
														<Check className={cn('w-3 h-3', colors.text)} />
													</div>
												)}
											</div>
										</button>
									)
								})}
							</div>
						</CardContent>
					</Card>

					{/* Security Section */}
					<Card className={cn(
						'overflow-hidden transition-all duration-300 group',
						'hover:shadow-xl hover:-translate-y-1',
						isDark
							? 'bg-gradient-to-br from-slate-900/95 to-slate-800/90 border-red-500/20 hover:border-red-500/40 hover:shadow-red-500/10'
							: 'bg-white border-red-200 hover:border-red-400 hover:shadow-red-200/50'
					)}>
						<CardHeader className="pb-2">
							<div className="flex items-center gap-3">
								<div className={cn(
									'w-10 h-10 rounded-xl flex items-center justify-center',
									'bg-gradient-to-br from-red-500 to-rose-600',
									'shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform'
								)}>
									<Shield className="w-5 h-5 text-white" />
								</div>
								<CardTitle className={cn(
									'font-bold uppercase tracking-wider text-base',
									isDark ? 'text-red-300' : 'text-red-700'
								)}>
									{translations.privacyAndSecurity}
								</CardTitle>
							</div>
						</CardHeader>

						<CardContent className="space-y-4">
							{/* Leaderboard Toggle */}
							<div className={cn(
								'flex items-center justify-between p-3 rounded-xl border',
								isDark
									? 'bg-slate-800/30 border-slate-700/30'
									: 'bg-slate-100 border-slate-200'
							)}>
								<div>
									<p className={cn('font-semibold text-base', isDark ? 'text-white' : 'text-slate-900')}>
										<Trophy className="w-4 h-4 inline mr-2 text-amber-500" />
										{translations.showInLeaderboard}
									</p>
									<p className={cn('text-sm mt-0.5', isDark ? 'text-slate-500' : 'text-slate-400')}>
										{translations.showInLeaderboardDesc}
									</p>
								</div>
								<Switch
									checked={formData.showInLeaderboard}
									onCheckedChange={() => handleToggle('showInLeaderboard')}
									disabled={loading}
								/>
							</div>

							{/* Change Password */}
							<Button
								variant="outline"
								className={cn(
									'w-full gap-2 border-2 h-12 text-base',
									'border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500',
									'transition-all hover:scale-[1.02]'
								)}
								onClick={() => setChangePasswordDialogOpen(true)}
							>
								<Lock className="w-5 h-5" />
								{translations.changePassword}
							</Button>

							{/* Delete Account */}
							<Button
								variant="outline"
								className={cn(
									'w-full gap-2 border-2 h-12 text-base',
									'border-red-600/40 text-red-500 hover:bg-red-600/10 hover:border-red-600',
									'transition-all hover:scale-[1.02]'
								)}
								onClick={() => setDeleteAccountDialogOpen(true)}
							>
								<Trash2 className="w-5 h-5" />
								{translations.deleteAccount}
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Avatar Dialog */}
			<Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
				<DialogContent className={cn(
					'max-w-2xl max-h-[90vh] overflow-auto rounded-2xl',
					'bg-gradient-to-br from-violet-950 via-slate-900 to-purple-950',
					'border-2 border-violet-500/30 shadow-2xl'
				)}>
					<DialogHeader>
						<DialogTitle className="text-xl font-bold text-center text-white flex items-center justify-center gap-2">
							<Sparkles className="w-5 h-5 text-violet-400" />
							{translations.chooseAvatar || 'Choisir un avatar'}
						</DialogTitle>
					</DialogHeader>

					<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
						{AVATARS.map((avatar) => {
							const isSelected = selectedAvatar === avatar.id
							return (
								<button
									key={avatar.id}
									onClick={() => !loading && handleAvatarChange(avatar.id)}
									disabled={loading}
									className={cn(
										'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
										'hover:scale-105',
										isSelected
											? 'border-violet-500 bg-violet-500/20 shadow-lg shadow-violet-500/30'
											: 'border-slate-700 hover:border-violet-500/50 bg-slate-800/50',
										loading && 'opacity-50'
									)}
								>
									<div className={cn(
										'relative w-20 h-20 rounded-full p-0.5',
										isSelected
											? 'bg-gradient-to-br from-violet-500 to-cyan-500'
											: 'bg-gradient-to-br from-violet-500/50 to-cyan-500/50'
									)}>
										<img
											src={avatar.url}
											alt={translations[avatar.nameKey]}
											className="w-full h-full rounded-full border-2 border-slate-900 object-cover"
										/>
										{isSelected && (
											<div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center border-2 border-slate-900">
												<Check className="w-3 h-3 text-white" />
											</div>
										)}
									</div>
								</button>
							)
						})}
					</div>
				</DialogContent>
			</Dialog>

			{/* Change Password Dialog */}
			<Dialog open={changePasswordDialogOpen} onOpenChange={setChangePasswordDialogOpen}>
				<DialogContent className={cn(
					'max-w-md rounded-2xl',
					'bg-gradient-to-br from-violet-950 via-slate-900 to-purple-950',
					'border-2 border-red-500/30 shadow-2xl'
				)}>
					<DialogHeader>
						<DialogTitle className="text-xl font-bold text-center text-red-300 flex items-center justify-center gap-2">
							<Lock className="w-5 h-5" />
							{translations.changePassword}
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<PasswordInput
							label={translations.currentPassword}
							value={passwordData.currentPassword}
							onChange={(val) => setPasswordData({ ...passwordData, currentPassword: val })}
							show={showPasswords.current}
							onToggleShow={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
							isDark={isDark}
						/>

						<div>
							<PasswordInput
								label={translations.newPassword}
								value={passwordData.newPassword}
								onChange={(val) => setPasswordData({ ...passwordData, newPassword: val })}
								show={showPasswords.new}
								onToggleShow={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
								isDark={isDark}
							/>
							{passwordData.newPassword && (
								<div className="mt-2">
									<Progress
										value={passwordStrength}
										className={cn(
											'h-1.5',
											isDark ? 'bg-slate-800' : 'bg-slate-200'
										)}
									/>
									<div className="flex items-center gap-2 mt-2">
										{isPasswordValid ? (
											<Check className="w-4 h-4 text-emerald-500" />
										) : (
											<X className="w-4 h-4 text-red-500" />
										)}
										<span className="text-xs text-slate-400">
											{translations.passwordMinLength12 || 'Au moins 12 caracteres'}
										</span>
									</div>
								</div>
							)}
						</div>

						<PasswordInput
							label={translations.confirmPassword}
							value={passwordData.confirmPassword}
							onChange={(val) => setPasswordData({ ...passwordData, confirmPassword: val })}
							show={showPasswords.confirm}
							onToggleShow={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
							isDark={isDark}
						/>
					</div>

					<DialogFooter className="gap-3">
						<Button
							variant="ghost"
							className="flex-1 text-slate-400 hover:text-white"
							onClick={() => setChangePasswordDialogOpen(false)}
						>
							{translations.cancel}
						</Button>
						<Button
							className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-500/30"
							onClick={handleChangePassword}
							disabled={loading}
						>
							{translations.save}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Account Dialog */}
			<Dialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
				<DialogContent className={cn(
					'max-w-md rounded-2xl',
					'bg-gradient-to-br from-violet-950 via-slate-900 to-purple-950',
					'border-2 border-red-600/50 shadow-2xl'
				)}>
					<DialogHeader>
						<DialogTitle className="text-xl font-bold text-center text-red-300 flex items-center justify-center gap-2">
							<Trash2 className="w-5 h-5" />
							{translations.deleteAccountConfirm}
						</DialogTitle>
					</DialogHeader>

					<div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 my-4">
						<Swords className="w-8 h-8 text-red-500 flex-shrink-0" />
						<p className="text-sm text-red-200 whitespace-pre-line">
							{translations.deleteAccountWarning}
						</p>
					</div>

					<DialogFooter className="gap-3">
						<Button
							variant="ghost"
							className="flex-1 text-slate-400 hover:text-white"
							onClick={() => setDeleteAccountDialogOpen(false)}
						>
							{translations.cancel}
						</Button>
						<Button
							className="flex-1 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 gap-2 shadow-lg shadow-red-500/30"
							onClick={handleDeleteAccount}
							disabled={loading}
						>
							<Trash2 className="w-4 h-4" />
							{translations.deleteAccount}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}

// Reusable Settings Field Component
const SettingsField = ({
	icon,
	label,
	value,
	rawValue,
	isEditing,
	isDark,
	color = 'violet',
	type = 'text',
	options = [],
	onEdit,
	onSave,
	onCancel,
	onChange,
	loading,
	readonly,
	hint,
}) => {
	const colorClasses = {
		violet: {
			icon: isDark ? 'bg-violet-500/20 border-violet-500/30 text-violet-400' : 'bg-violet-100 border-violet-200 text-violet-600',
			label: isDark ? 'text-violet-400' : 'text-violet-600',
			border: isDark ? 'border-violet-500/20' : 'border-violet-100',
			focus: 'focus-visible:ring-violet-500',
		},
		cyan: {
			icon: isDark ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400' : 'bg-cyan-100 border-cyan-200 text-cyan-600',
			label: isDark ? 'text-cyan-400' : 'text-cyan-600',
			border: isDark ? 'border-cyan-500/20' : 'border-cyan-100',
			focus: 'focus-visible:ring-cyan-500',
		},
	}

	const colors = colorClasses[color]

	return (
		<div className={cn(
			'p-4 rounded-xl transition-all',
			isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50',
			colors.border
		)}>
			<div className="flex items-center gap-3">
				<div className={cn(
					'w-9 h-9 rounded-lg flex items-center justify-center border',
					colors.icon
				)}>
					{icon}
				</div>

				<div className="flex-1 min-w-0">
					<p className={cn('text-xs font-bold uppercase tracking-wider mb-0.5', colors.label)}>
						{label}
					</p>

					{isEditing ? (
						type === 'select' ? (
							<Select value={rawValue || value} onValueChange={onChange}>
								<SelectTrigger className={cn(
									'w-full h-11 rounded-lg border-2 text-base',
									isDark
										? 'bg-slate-800/80 border-slate-600 text-white'
										: 'bg-white border-slate-200 text-slate-900',
									colors.focus
								)}>
									<SelectValue />
								</SelectTrigger>
								<SelectContent className={cn(
									'rounded-lg',
									isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'
								)}>
									{options.map((opt) => (
										<SelectItem
											key={opt.value}
											value={opt.value}
											className={cn(
												'rounded-md cursor-pointer text-base',
												isDark ? 'focus:bg-violet-500/20' : 'focus:bg-violet-50'
											)}
										>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						) : (
							<Input
								type={type}
								value={value}
								onChange={(e) => onChange(e.target.value)}
								className={cn(
									'h-11 rounded-lg border-2 text-base',
									isDark
										? 'bg-slate-800/80 border-slate-600 text-white'
										: 'bg-white border-slate-200 text-slate-900',
									colors.focus
								)}
							/>
						)
					) : (
						<>
							<p className={cn('font-semibold text-base', isDark ? 'text-white' : 'text-slate-900')}>
								{value || '-'}
							</p>
							{hint && (
								<p className={cn('text-xs italic mt-0.5', isDark ? 'text-slate-500' : 'text-slate-400')}>
									{hint}
								</p>
							)}
						</>
					)}
				</div>

				{!readonly && (
					<div className="flex gap-2">
						{isEditing ? (
							<>
								<Button
									size="icon"
									onClick={onSave}
									disabled={loading}
									className={cn(
										'w-8 h-8 rounded-lg',
										'bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700',
										'shadow-lg shadow-emerald-500/30 hover:scale-110 transition-transform'
									)}
								>
									<Check className="w-4 h-4" />
								</Button>
								<Button
									size="icon"
									variant="destructive"
									onClick={onCancel}
									disabled={loading}
									className={cn(
										'w-8 h-8 rounded-lg',
										'bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
										'shadow-lg shadow-red-500/30 hover:scale-110 transition-transform'
									)}
								>
									<X className="w-4 h-4" />
								</Button>
							</>
						) : (
							<Button
								size="icon"
								variant="ghost"
								onClick={onEdit}
								className={cn(
									'w-8 h-8 rounded-lg transition-all hover:scale-110',
									isDark
										? 'bg-violet-500/10 border border-violet-500/30 text-violet-400 hover:bg-violet-500/20'
										: 'bg-violet-50 border border-violet-200 text-violet-600 hover:bg-violet-100'
								)}
							>
								<Edit3 className="w-4 h-4" />
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

// Password Input Component
const PasswordInput = ({ label, value, onChange, show, onToggleShow, isDark }) => (
	<div>
		<label className="block text-sm font-bold uppercase tracking-wider text-red-300 mb-2">{label}</label>
		<div className="relative">
			<Input
				type={show ? 'text' : 'password'}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className={cn(
					'h-12 pr-10 rounded-lg border-2 text-base',
					'bg-slate-800/50 border-red-500/30 text-white',
					'focus-visible:ring-red-500 focus-visible:border-red-500'
				)}
			/>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				onClick={onToggleShow}
				className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
			>
				{show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
			</Button>
		</div>
	</div>
)

export default React.memo(SettingsClient)
