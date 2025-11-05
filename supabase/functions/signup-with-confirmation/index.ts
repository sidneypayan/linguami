import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers':
		'authorization, x-client-info, apikey, content-type',
}

// Fonction pour générer un token sécurisé
function generateSecureToken(): string {
	const array = new Uint8Array(32)
	crypto.getRandomValues(array)
	return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

serve(async req => {
	// Handle CORS
	if (req.method === 'OPTIONS') {
		return new Response('ok', { headers: corsHeaders })
	}

	try {
		// Créer un client Supabase Admin
		const supabaseAdmin = createClient(
			Deno.env.get('SUPABASE_URL') ?? '',
			Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
			{
				auth: {
					autoRefreshToken: false,
					persistSession: false,
				},
			}
		)

		const {
			email,
			password,
			username,
			spokenLanguage,
			learningLanguage,
			languageLevel,
			avatarId,
			appUrl,
		} = await req.json()

		// Validation
		if (!email || !password) {
			throw new Error('Email and password are required')
		}

		// 1. Créer l'utilisateur (non confirmé par défaut)
		const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
			email,
			password,
			email_confirm: false, // Important : l'utilisateur n'est pas confirmé
			user_metadata: {
				learning_language: learningLanguage || 'fr',
				spoken_language: spokenLanguage || 'fr',
				language_level: languageLevel || 'beginner',
				username: username || null,
				avatar_id: avatarId || 'avatar1',
			},
		})

		if (authError || !authData.user) {
			throw new Error(`Failed to create user: ${authError?.message}`)
		}

		// 2. Générer un token de confirmation sécurisé
		const confirmationToken = generateSecureToken()

		// 3. Stocker le token dans la table email_confirmations
		const { error: tokenError } = await supabaseAdmin
			.from('email_confirmations')
			.insert({
				user_id: authData.user.id,
				token: confirmationToken,
				email: email,
				expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
			})

		if (tokenError) {
			// Si erreur, supprimer l'utilisateur créé
			await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
			throw new Error(`Failed to create confirmation token: ${tokenError.message}`)
		}

		// 4. Construire l'URL de confirmation
		const confirmationUrl = `${appUrl}/auth/confirm?token=${confirmationToken}`

		// 5. Envoyer l'email de confirmation via notre Edge Function
		const resendApiKey = Deno.env.get('RESEND_API_KEY')
		if (!resendApiKey) {
			throw new Error('RESEND_API_KEY not configured')
		}

		// Sélectionner le template selon la langue
		const language = spokenLanguage || 'fr'

		// Importer les templates (simplifié, on va juste appeler l'autre fonction)
		const emailFunctionUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-confirmation-email`

		const emailResponse = await fetch(emailFunctionUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': req.headers.get('Authorization') || '',
			},
			body: JSON.stringify({
				email,
				confirmationUrl,
				language,
			}),
		})

		if (!emailResponse.ok) {
			const emailError = await emailResponse.text()
			console.error('Failed to send confirmation email:', emailError)
			// Ne pas échouer l'inscription si l'email échoue
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: 'User created successfully. Please check your email to confirm your account.',
				userId: authData.user.id,
			}),
			{
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				status: 201,
			}
		)
	} catch (error) {
		console.error('Signup error:', error)
		return new Response(
			JSON.stringify({
				error: error.message,
			}),
			{
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				status: 400,
			}
		)
	}
})
