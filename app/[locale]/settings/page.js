import { getTranslations } from 'next-intl/server'
import SettingsClient from '@/components/settings/SettingsClient'

export async function generateMetadata({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'settings' })

	return {
		title: `${t('title')} | Linguami`,
	}
}

export default async function SettingsPage({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'settings' })
	const tAvatar = await getTranslations({ locale, namespace: 'register' })

	// Get all translations as plain objects
	const translations = {
		title: t('title'),
		personalInfo: t('personalInfo'),
		username: t('username'),
		email: t('email'),
		emailNotEditable: t('emailNotEditable'),
		languagePreferences: t('languagePreferences'),
		languageLevel: t('languageLevel'),
		beginner: t('beginner'),
		intermediate: t('intermediate'),
		advanced: t('advanced'),
		goalsAndMotivation: t('goalsAndMotivation'),
		dailyXpGoal: t('dailyXpGoal'),
		goalRelaxed: t('goalRelaxed'),
		goal5to10min: t('goal5to10min'),
		goalRegular: t('goalRegular'),
		goal15to20min: t('goal15to20min'),
		recommended: t('recommended'),
		goalMotivated: t('goalMotivated'),
		goal30min: t('goal30min'),
		goalIntensive: t('goalIntensive'),
		goal45minPlus: t('goal45minPlus'),
		goalNone: t('goalNone'),
		goalAtMyPace: t('goalAtMyPace'),
		notifications: t('notifications'),
		emailReminders: t('emailReminders'),
		emailRemindersDesc: t('emailRemindersDesc'),
		streakReminders: t('streakReminders'),
		streakRemindersDesc: t('streakRemindersDesc'),
		newContentNotifications: t('newContentNotifications'),
		newContentNotificationsDesc: t('newContentNotificationsDesc'),
		privacyAndSecurity: t('privacyAndSecurity'),
		showInLeaderboard: t('showInLeaderboard'),
		showInLeaderboardDesc: t('showInLeaderboardDesc'),
		changePassword: t('changePassword'),
		deleteAccount: t('deleteAccount'),
		deleteAccountConfirm: t('deleteAccountConfirm'),
		deleteAccountWarning: t('deleteAccountWarning'),
		cancel: t('cancel'),
		save: t('save'),
		currentPassword: t('currentPassword'),
		newPassword: t('newPassword'),
		confirmPassword: t('confirmPassword'),
		passwordMinLength: t('passwordMinLength'),
		passwordUpperCase: t('passwordUpperCase'),
		passwordNumber: t('passwordNumber'),
		passwordSpecialChar: t('passwordSpecialChar'),
		passwordRequirements: t('passwordRequirements'),
		passwordMismatch: t('passwordMismatch'),
		fillAllFields: t('fillAllFields'),
		updateSuccess: t('updateSuccess'),
		updateError: t('updateError'),
		avatarUpdated: t('avatarUpdated'),
		passwordChanged: t('passwordChanged'),
		changePasswordError: t('changePasswordError'),
		accountDeleted: t('accountDeleted'),
		deleteAccountError: t('deleteAccountError'),
		// Avatar translations from register namespace
		avatarDwarfMale: tAvatar('avatarDwarfMale'),
		avatarDwarfFemale: tAvatar('avatarDwarfFemale'),
		avatarElfMale: tAvatar('avatarElfMale'),
		avatarElfFemale: tAvatar('avatarElfFemale'),
		avatarUndeadMale: tAvatar('avatarUndeadMale'),
		avatarUndeadFemale: tAvatar('avatarUndeadFemale'),
		avatarTaurenFemale: tAvatar('avatarTaurenFemale'),
		avatarTaurenMale: tAvatar('avatarTaurenMale'),
		avatarGnomeMale: tAvatar('avatarGnomeMale'),
		avatarGnomeFemale: tAvatar('avatarGnomeFemale'),
		avatarHumanFemale: tAvatar('avatarHumanFemale'),
		avatarHumanMale: tAvatar('avatarHumanMale'),
		avatarOrcMale: tAvatar('avatarOrcMale'),
		avatarOrcFemale: tAvatar('avatarOrcFemale'),
	}

	return <SettingsClient translations={translations} />
}
