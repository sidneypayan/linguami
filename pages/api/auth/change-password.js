import { createServerClient } from '@supabase/ssr'

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				get(name) {
					return req.cookies[name]
				},
				set(name, value, options) {
					const maxAge = options?.maxAge ? '; Max-Age=' + options.maxAge : '';
					res.setHeader('Set-Cookie', name + '=' + value + '; Path=/; HttpOnly; SameSite=Lax' + maxAge)
				},
				remove(name, options) {
					res.setHeader('Set-Cookie', name + '=; Path=/; Max-Age=0')
				},
			},
		}
	)

	// Get authenticated user
	const { data: { user }, error: authError } = await supabase.auth.getUser()

	if (!user || authError) {
		return res.status(401).json({ error: 'Unauthorized' })
	}

	const { currentPassword, newPassword } = req.body

	if (!currentPassword || !newPassword) {
		return res.status(400).json({ error: 'Current password and new password are required' })
	}

	// Validate password requirements (same as signup)
	const passwordValidation = {
		minLength: newPassword.length >= 8,
		hasUpperCase: /[A-Z]/.test(newPassword),
		hasNumber: /[0-9]/.test(newPassword),
		hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
	}

	const isPasswordValid = Object.values(passwordValidation).every(Boolean)

	if (!isPasswordValid) {
		return res.status(400).json({
			error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character',
		})
	}

	try {
		// Verify current password by attempting to sign in
		const { error: signInError } = await supabase.auth.signInWithPassword({
			email: user.email,
			password: currentPassword,
		})

		if (signInError) {
			return res.status(400).json({ error: 'Current password is incorrect' })
		}

		// Update password
		const { error: updateError } = await supabase.auth.updateUser({
			password: newPassword,
		})

		if (updateError) {
			throw updateError
		}

		return res.status(200).json({ success: true, message: 'Password changed successfully' })
	} catch (error) {
		console.error('Error changing password:', error)
		return res.status(500).json({ error: 'Failed to change password' })
	}
}
