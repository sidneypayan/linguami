import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import BlogCreateClient from './pageClient'

export const metadata = {
	title: 'Create Blog Post | Admin',
	description: 'Create a new blog post',
}

export default async function CreateBlogPage({ params }) {
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

	return <BlogCreateClient />
}
