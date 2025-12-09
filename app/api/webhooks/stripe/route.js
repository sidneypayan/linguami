import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

// Create Supabase admin client (bypasses RLS)
const supabaseAdmin = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
	console.log('🔔 Webhook received')
	const body = await request.text()
	const signature = request.headers.get('stripe-signature')

	let event

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET
		)
		console.log('✅ Signature verified, event type:', event.type)
	} catch (err) {
		console.error('❌ Webhook signature verification failed:', err.message)
		return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
	}

	try {
		switch (event.type) {
			case 'checkout.session.completed': {
				console.log('💳 Processing checkout.session.completed')
				const session = event.data.object
				await handleCheckoutCompleted(session)
				break
			}

			case 'customer.subscription.updated': {
				const subscription = event.data.object
				await handleSubscriptionUpdated(subscription)
				break
			}

			case 'customer.subscription.deleted': {
				const subscription = event.data.object
				await handleSubscriptionDeleted(subscription)
				break
			}

			case 'invoice.payment_succeeded': {
				const invoice = event.data.object
				await handlePaymentSucceeded(invoice)
				break
			}

			case 'invoice.payment_failed': {
				const invoice = event.data.object
				await handlePaymentFailed(invoice)
				break
			}

			default:
				console.log(`Unhandled event type: ${event.type}`)
		}

		return NextResponse.json({ received: true })
	} catch (error) {
		console.error('Webhook handler error:', error)
		return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
	}
}

/**
 * Handle successful checkout - activate subscription
 */
async function handleCheckoutCompleted(session) {
	console.log('📝 handleCheckoutCompleted called with session:', session.id)
	const userId = session.metadata?.supabase_user_id
	const priceType = session.metadata?.price_type
	console.log('👤 User ID from metadata:', userId)
	console.log('💰 Price type:', priceType)

	if (!userId) {
		console.error('❌ No user ID in session metadata')
		return
	}

	// Get subscription details
	console.log('📦 Retrieving subscription:', session.subscription)
	const subscription = await stripe.subscriptions.retrieve(session.subscription)
	console.log('✅ Subscription retrieved:', subscription.id)

	// current_period_end is on the subscription_item, not the subscription itself
	const currentPeriodEnd = subscription.items.data[0].current_period_end
	const expiresAt = new Date(currentPeriodEnd * 1000).toISOString()

	console.log('💾 Updating user profile in Supabase...')
	const { error } = await supabaseAdmin
		.from('users_profile')
		.update({
			subscription_status: 'active',
			subscription_type: priceType || (subscription.items.data[0].plan.interval === 'year' ? 'yearly' : 'monthly'),
			subscription_expires_at: expiresAt,
			stripe_subscription_id: subscription.id,
			stripe_customer_id: session.customer,
		})
		.eq('id', userId)

	if (error) {
		console.error('❌ Error updating user subscription:', error)
		throw error
	}

	console.log(`✅ Subscription activated for user ${userId}`)
}

/**
 * Handle subscription updates (renewal, plan change)
 */
async function handleSubscriptionUpdated(subscription) {
	const userId = subscription.metadata?.supabase_user_id

	if (!userId) {
		// Try to find user by customer ID
		const { data: profile } = await supabaseAdmin
			.from('users_profile')
			.select('id')
			.eq('stripe_customer_id', subscription.customer)
			.single()

		if (!profile) {
			console.error('No user found for subscription:', subscription.id)
			return
		}

		await updateUserSubscription(profile.id, subscription)
	} else {
		await updateUserSubscription(userId, subscription)
	}
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionDeleted(subscription) {
	const userId = subscription.metadata?.supabase_user_id

	let targetUserId = userId

	if (!targetUserId) {
		const { data: profile } = await supabaseAdmin
			.from('users_profile')
			.select('id')
			.eq('stripe_customer_id', subscription.customer)
			.single()

		if (!profile) {
			console.error('No user found for cancelled subscription:', subscription.id)
			return
		}
		targetUserId = profile.id
	}

	const { error } = await supabaseAdmin
		.from('users_profile')
		.update({
			subscription_status: 'cancelled',
			stripe_subscription_id: null,
		})
		.eq('id', targetUserId)

	if (error) {
		console.error('Error cancelling subscription:', error)
		throw error
	}

	console.log(`Subscription cancelled for user ${targetUserId}`)
}

/**
 * Handle successful payment (subscription renewal)
 */
async function handlePaymentSucceeded(invoice) {
	if (!invoice.subscription) return

	const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
	await handleSubscriptionUpdated(subscription)
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice) {
	if (!invoice.subscription) return

	const { data: profile } = await supabaseAdmin
		.from('users_profile')
		.select('id')
		.eq('stripe_customer_id', invoice.customer)
		.single()

	if (!profile) {
		console.error('No user found for failed payment')
		return
	}

	const { error } = await supabaseAdmin
		.from('users_profile')
		.update({
			subscription_status: 'past_due',
		})
		.eq('id', profile.id)

	if (error) {
		console.error('Error updating subscription status:', error)
	}

	console.log(`Payment failed for user ${profile.id}`)
}

/**
 * Helper to update user subscription data
 */
async function updateUserSubscription(userId, subscription) {
	const status = subscription.status === 'active' ? 'active' :
		subscription.status === 'past_due' ? 'past_due' :
		subscription.status === 'canceled' ? 'cancelled' : subscription.status

	// current_period_end is on the subscription_item, not the subscription itself
	const currentPeriodEnd = subscription.items.data[0].current_period_end
	const expiresAt = new Date(currentPeriodEnd * 1000).toISOString()
	const priceType = subscription.items.data[0].plan.interval === 'year' ? 'yearly' : 'monthly'

	const { error } = await supabaseAdmin
		.from('users_profile')
		.update({
			subscription_status: status,
			subscription_type: priceType,
			subscription_expires_at: expiresAt,
			stripe_subscription_id: subscription.id,
		})
		.eq('id', userId)

	if (error) {
		console.error('Error updating subscription:', error)
		throw error
	}

	console.log(`Subscription updated for user ${userId}: ${status}`)
}
