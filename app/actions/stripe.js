'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import { stripe, STRIPE_PRICES } from '@/lib/stripe'

/**
 * Create a Stripe Checkout session for subscription
 * @param {string} priceType - 'monthly' or 'yearly'
 * @param {string} locale - User's locale for redirect URLs
 * @returns {Object} - { url: string } or { error: string }
 */
export async function createCheckoutSession(priceType, locale = 'fr') {
	try {
		const supabase = createServerClient(await cookies())
		const { data: { user }, error: authError } = await supabase.auth.getUser()

		if (authError || !user) {
			return { error: 'not_authenticated' }
		}

		// Get user profile
		const { data: profile } = await supabase
			.from('users_profile')
			.select('stripe_customer_id, email, username')
			.eq('id', user.id)
			.single()

		const priceId = priceType === 'yearly' ? STRIPE_PRICES.yearly : STRIPE_PRICES.monthly

		if (!priceId) {
			return { error: 'invalid_price' }
		}

		// Get or create Stripe customer
		let customerId = profile?.stripe_customer_id

		if (!customerId) {
			const customer = await stripe.customers.create({
				email: user.email,
				name: profile?.username || undefined,
				metadata: {
					supabase_user_id: user.id,
				},
			})
			customerId = customer.id

			// Save customer ID to profile
			await supabase
				.from('users_profile')
				.update({ stripe_customer_id: customerId })
				.eq('id', user.id)
		}

		// Build URLs - Use localhost in development
		const isDev = process.env.NODE_ENV === 'development'
		const baseUrl = isDev ? 'http://localhost:3000' : (process.env.NEXT_PUBLIC_API_URL || 'https://www.linguami.com')
		const successUrl = `${baseUrl}/${locale}/premium/success?session_id={CHECKOUT_SESSION_ID}`
		const cancelUrl = `${baseUrl}/${locale}/premium`

		// Create checkout session
		const session = await stripe.checkout.sessions.create({
			customer: customerId,
			mode: 'subscription',
			payment_method_types: ['card'],
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			success_url: successUrl,
			cancel_url: cancelUrl,
			metadata: {
				supabase_user_id: user.id,
				price_type: priceType,
			},
			subscription_data: {
				metadata: {
					supabase_user_id: user.id,
					price_type: priceType,
				},
			},
			locale: locale === 'ru' ? 'ru' : locale === 'en' ? 'en' : 'fr',
		})

		return { url: session.url }
	} catch (error) {
		console.error('Stripe checkout error:', error)
		return { error: 'checkout_failed' }
	}
}

/**
 * Create a Stripe Customer Portal session for managing subscription
 * @param {string} locale - User's locale for redirect URL
 * @returns {Object} - { url: string } or { error: string }
 */
export async function createPortalSession(locale = 'fr') {
	try {
		const supabase = createServerClient(await cookies())
		const { data: { user }, error: authError } = await supabase.auth.getUser()

		if (authError || !user) {
			return { error: 'not_authenticated' }
		}

		// Get user profile
		const { data: profile } = await supabase
			.from('users_profile')
			.select('stripe_customer_id')
			.eq('id', user.id)
			.single()

		if (!profile?.stripe_customer_id) {
			return { error: 'no_customer' }
		}

		const isDev = process.env.NODE_ENV === 'development'
		const baseUrl = isDev ? 'http://localhost:3000' : (process.env.NEXT_PUBLIC_API_URL || 'https://www.linguami.com')
		const returnUrl = `${baseUrl}/${locale}/premium`

		const session = await stripe.billingPortal.sessions.create({
			customer: profile.stripe_customer_id,
			return_url: returnUrl,
		})

		return { url: session.url }
	} catch (error) {
		console.error('Stripe portal error:', error)
		return { error: 'portal_failed' }
	}
}

/**
 * Get user's subscription status
 * @returns {Object} - Subscription info or null
 */
export async function getSubscriptionStatus() {
	try {
		const supabase = createServerClient(await cookies())
		const { data: { user }, error: authError } = await supabase.auth.getUser()

		if (authError || !user) {
			return null
		}

		const { data: profile } = await supabase
			.from('users_profile')
			.select('subscription_status, subscription_type, subscription_expires_at, stripe_customer_id')
			.eq('id', user.id)
			.single()

		return profile
	} catch (error) {
		console.error('Get subscription status error:', error)
		return null
	}
}
