import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function handler(req, res) {
	const supabase = createServerComponentClient({ cookies })

	// Récupérer l'utilisateur connecté
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (user) {
		res.status(200).json({ user })
	} else {
		res.status(401).json({ error: 'Non authentifié' })
	}
}
