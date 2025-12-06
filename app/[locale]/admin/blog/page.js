import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import BlogListClient from './pageClient'

export const metadata = {
	title: 'Manage Blog Posts | Admin',
	description: 'Create and manage blog posts',
}

export default async function BlogAdminPage({ params }) {
	const { locale } = await params
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	// Check authentication
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect(`/${locale}/login`)
	}

	// Check admin role
	const { data: profile } = await supabase
		.from('users_profile')
		.select('role')
		.eq('id', user.id)
		.single()

	if (!profile || profile.role !== 'admin') {
		redirect(`/${locale}`)
	}

	return <BlogListClient />
}
