import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import BlogEditClient from './pageClient'

export const metadata = {
	title: 'Edit Blog Post | Admin',
	description: 'Edit blog post',
}

export default async function EditBlogPage({ params }) {
	const { id } = await params
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	// Check authentication
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect('/login')
	}

	// Check admin role
	const { data: profile } = await supabase
		.from('users_profile')
		.select('role')
		.eq('id', user.id)
		.single()

	if (!profile || profile.role !== 'admin') {
		redirect('/')
	}

	return <BlogEditClient postId={parseInt(id)} />
}
