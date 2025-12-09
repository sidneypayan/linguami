import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2024-11-20.acacia',
})

export const STRIPE_PRICES = {
	monthly: process.env.STRIPE_PRICE_MONTHLY,
	yearly: process.env.STRIPE_PRICE_YEARLY,
}
