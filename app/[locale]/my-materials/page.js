import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { getUserMaterialsByLanguage } from '@/app/data/materials'
import MyMaterialsClient from '@/components/materials/MyMaterialsClient'

export async function generateMetadata({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'materials' })

	const titles = {
		fr: 'Mes Matériaux',
		ru: 'Мои Материалы',
		en: 'My Materials',
	}

	const descriptions = {
		fr: 'Gérez vos matériaux sauvegardés. Suivez votre progression et continuez votre apprentissage.',
		ru: 'Управляйте своими сохраненными материалами. Отслеживайте прогресс и продолжайте обучение.',
		en: 'Manage your saved materials. Track your progress and continue your learning.',
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

export default async function MyMaterialsPage({ params }) {
	const { locale } = await params

	// Check auth server-side
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)
	const { data: { user } } = await supabase.auth.getUser()

	// Redirect if not logged in
	if (!user) {
		redirect(`/${locale}`)
	}

	// Get user's learning language from profile
	const { data: profile } = await supabase
		.from('profiles')
		.select('learning_language')
		.eq('user_id', user.id)
		.single()

	const learningLanguage = profile?.learning_language || 'fr'

	// Fetch user materials server-side
	const userMaterials = await getUserMaterialsByLanguage(learningLanguage, user.id)

	return <MyMaterialsClient initialMaterials={userMaterials} />
}
