import { getTranslations } from 'next-intl/server'
import { getMaterialReports } from '@/app/actions/admin'
import ReportsClient from '@/components/admin/ReportsClient'

export async function generateMetadata({ params }) {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'admin' })

	return {
		title: `${t('materialReports')} | Admin | Linguami`,
	}
}

export default async function ReportsPage() {
	// Fetch all reports server-side
	const result = await getMaterialReports('all')
	const reports = result.success ? result.reports : []

	return <ReportsClient initialReports={reports} />
}
