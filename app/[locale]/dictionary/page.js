import { getTranslations } from 'next-intl/server'
import DictionaryClient from '@/components/dictionary/DictionaryClient'

export async function generateMetadata({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'words' })

	const titles = {
		fr: 'Mon Dictionnaire Personnel',
		ru: 'Мой Личный Словарь',
		en: 'My Personal Dictionary'
	}

	const descriptions = {
		fr: 'Votre dictionnaire personnel avec tous vos mots sauvegardés. Révisez votre vocabulaire avec les flashcards et suivez votre progression.',
		ru: 'Ваш личный словарь со всеми сохраненными словами. Повторяйте словарный запас с помощью флеш-карт и отслеживайте свой прогресс.',
		en: 'Your personal dictionary with all your saved words. Review your vocabulary with flashcards and track your progress.'
	}

	return {
		title: `${titles[locale] || titles.fr} | Linguami`,
		description: descriptions[locale] || descriptions.fr,
		robots: {
			index: false,
			follow: false,
		},
	}
}

export default async function DictionaryPage({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'words' })
	const tCommon = await getTranslations({ locale, namespace: 'common' })

	const titles = {
		fr: 'Mon Dictionnaire Personnel',
		ru: 'Мой Личный Словарь',
		en: 'My Personal Dictionary'
	}

	const descriptions = {
		fr: 'Votre dictionnaire personnel avec tous vos mots sauvegardés. Révisez votre vocabulaire avec les flashcards et suivez votre progression.',
		ru: 'Ваш личный словарь со всеми сохраненными словами. Повторяйте словарный запас с помощью флеш-карт и отслеживайте свой прогресс.',
		en: 'Your personal dictionary with all your saved words. Review your vocabulary with flashcards and track your progress.'
	}

	// Get all translations as plain objects
	const translations = {
		guest_dictionary_message: t('guest_dictionary_message'),
		feature_save_words: t('feature_save_words'),
		feature_flashcards: t('feature_flashcards'),
		feature_add_manually: t('feature_add_manually'),
		dictionary_disabled_benefit_access: t('dictionary_disabled_benefit_access'),
		noaccount: t('noaccount'),
		repeatwords: t('repeatwords'),
		add_word_btn: t('add_word_btn'),
		search_words: t('search_words'),
		words_per_page: t('words_per_page'),
		all: t('all'),
		words_total_plural: t('words_total_plural'),
		words_total: t('words_total'),
		dictionary_empty_title: t('dictionary_empty_title'),
		feature_translate_materials: t('feature_translate_materials'),
		start: tCommon('start'),
	}

	return <DictionaryClient translations={translations} />
}
