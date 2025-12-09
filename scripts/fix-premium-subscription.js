/**
 * Script to manually fix premium subscription for a user
 * Usage: node scripts/fix-premium-subscription.js YOUR_EMAIL
 */

const { createClient } = require('@supabase/supabase-js')
const Stripe = require('stripe')

// Load env from .env.production
require('dotenv').config({ path: '.env.production' })

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixSubscription(email) {
	console.log('🔍 Looking for user:', email)

	// Get user profile
	const { data: profile, error: profileError } = await supabase
		.from('users_profile')
		.select('*')
		.eq('email', email)
		.single()

	if (profileError || !profile) {
		console.error('❌ User not found:', profileError)
		return
	}

	console.log('✅ User found:', profile.id)
	console.log('📋 Current data:', {
		stripe_customer_id: profile.stripe_customer_id,
		stripe_subscription_id: profile.stripe_subscription_id,
		subscription_status: profile.subscription_status,
		subscription_type: profile.subscription_type,
	})

	if (!profile.stripe_customer_id) {
		console.error('❌ No stripe_customer_id found. Cannot proceed.')
		return
	}

	// Get customer from Stripe
	console.log('🔍 Fetching Stripe customer:', profile.stripe_customer_id)
	const customer = await stripe.customers.retrieve(profile.stripe_customer_id)
	console.log('✅ Customer found:', customer.email)

	// Get subscriptions
	const subscriptions = await stripe.subscriptions.list({
		customer: profile.stripe_customer_id,
		limit: 10,
	})

	if (subscriptions.data.length === 0) {
		console.error('❌ No subscriptions found for this customer')
		return
	}

	console.log(`📦 Found ${subscriptions.data.length} subscription(s)`)

	// Get the active subscription
	const activeSub = subscriptions.data.find(s => s.status === 'active') || subscriptions.data[0]
	console.log('📌 Using subscription:', activeSub.id)
	console.log('📊 Raw subscription data:', JSON.stringify(activeSub, null, 2))
	console.log('📊 Subscription details:', {
		status: activeSub.status,
		interval: activeSub.items.data[0]?.plan?.interval,
		current_period_end: activeSub.current_period_end,
		current_period_end_timestamp: activeSub.current_period_end * 1000,
	})

	const priceType = activeSub.items.data[0].plan.interval === 'year' ? 'yearly' : 'monthly'
	// current_period_end is on the subscription_item, not the subscription itself
	const currentPeriodEnd = activeSub.items.data[0].current_period_end
	const expiresAt = new Date(currentPeriodEnd * 1000).toISOString()

	// Update user profile
	console.log('💾 Updating user profile...')
	const { error: updateError } = await supabase
		.from('users_profile')
		.update({
			subscription_status: activeSub.status === 'active' ? 'active' : activeSub.status,
			subscription_type: priceType,
			subscription_expires_at: expiresAt,
			stripe_subscription_id: activeSub.id,
			stripe_customer_id: profile.stripe_customer_id,
		})
		.eq('id', profile.id)

	if (updateError) {
		console.error('❌ Error updating profile:', updateError)
		return
	}

	console.log('✅ Subscription fixed!')
	console.log('🎉 User is now premium with:', {
		subscription_status: 'active',
		subscription_type: priceType,
		stripe_subscription_id: activeSub.id,
		expires_at: expiresAt,
	})
}

// Get email from command line
const email = process.argv[2]

if (!email) {
	console.error('❌ Usage: node scripts/fix-premium-subscription.js YOUR_EMAIL')
	process.exit(1)
}

fixSubscription(email)
	.then(() => process.exit(0))
	.catch(err => {
		console.error('❌ Error:', err)
		process.exit(1)
	})
