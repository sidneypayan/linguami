/**
 * Subscription limits and tiers configuration
 * Centralized configuration for guest, free, and premium users
 */

// ==========================================
// Subscription Tiers
// ==========================================

export const SUBSCRIPTION_TIERS = {
	GUEST: 'guest',
	FREE: 'free',
	PREMIUM: 'premium',
}

// ==========================================
// Limits Configuration
// ==========================================

export const LIMITS = {
	// Guest users (not logged in)
	[SUBSCRIPTION_TIERS.GUEST]: {
		maxTranslations: 20, // Maximum translations per session (stored in cookie)
		maxWords: 20, // Maximum words in dictionary (localStorage)
		canUseFlashcards: true, // Can use flashcards with their words
		features: ['translations', 'dictionary', 'flashcards'],
	},

	// Free registered users
	[SUBSCRIPTION_TIERS.FREE]: {
		maxTranslations: Infinity, // Unlimited translations
		maxWords: 50, // Maximum 50 words in dictionary
		canUseFlashcards: true, // Can use flashcards
		features: ['translations', 'dictionary', 'flashcards', 'progress-tracking', 'statistics'],
	},

	// Premium users
	[SUBSCRIPTION_TIERS.PREMIUM]: {
		maxTranslations: Infinity, // Unlimited
		maxWords: Infinity, // Unlimited
		canUseFlashcards: true, // Can use flashcards
		features: [
			'translations',
			'dictionary',
			'flashcards',
			'progress-tracking',
			'statistics',
			'advanced-features',
			'priority-support',
		],
	},
}

// ==========================================
// Premium Pricing
// ==========================================

export const PREMIUM_PRICING = {
	monthly: {
		price: 7, // €7/month
		currency: 'EUR',
		interval: 'month',
		features: [
			'Dictionnaire illimité',
			'Flashcards avancées',
			'Statistiques détaillées',
			'Suivi de progression',
			'Support prioritaire',
		],
	},
}

// ==========================================
// Helper Functions
// ==========================================

/**
 * Get subscription tier for a user
 * @param {Object} user - User object
 * @param {Object} userProfile - User profile object
 * @returns {string} Subscription tier
 */
export function getUserTier(user, userProfile) {
	if (!user) {
		return SUBSCRIPTION_TIERS.GUEST
	}

	// Check if user has premium subscription
	if (userProfile?.is_premium || userProfile?.subscription_status === 'active') {
		return SUBSCRIPTION_TIERS.PREMIUM
	}

	return SUBSCRIPTION_TIERS.FREE
}

/**
 * Get limits for a specific tier
 * @param {string} tier - Subscription tier
 * @returns {Object} Limits object
 */
export function getLimitsForTier(tier) {
	return LIMITS[tier] || LIMITS[SUBSCRIPTION_TIERS.GUEST]
}

/**
 * Check if user can add more words
 * @param {number} currentWordCount - Current number of words
 * @param {string} tier - Subscription tier
 * @returns {boolean} True if user can add more words
 */
export function canAddMoreWords(currentWordCount, tier) {
	const limits = getLimitsForTier(tier)
	return currentWordCount < limits.maxWords
}

/**
 * Get remaining words count
 * @param {number} currentWordCount - Current number of words
 * @param {string} tier - Subscription tier
 * @returns {number} Number of remaining words
 */
export function getRemainingWords(currentWordCount, tier) {
	const limits = getLimitsForTier(tier)
	if (limits.maxWords === Infinity) {
		return Infinity
	}
	return Math.max(0, limits.maxWords - currentWordCount)
}

/**
 * Check if user has reached translation limit
 * @param {number} translationCount - Current translation count
 * @param {string} tier - Subscription tier
 * @returns {boolean} True if limit reached
 */
export function hasReachedTranslationLimit(translationCount, tier) {
	const limits = getLimitsForTier(tier)
	return translationCount >= limits.maxTranslations
}

/**
 * Check if user can use flashcards
 * @param {string} tier - Subscription tier
 * @returns {boolean} True if user can use flashcards
 */
export function canUseFlashcards(tier) {
	const limits = getLimitsForTier(tier)
	return limits.canUseFlashcards
}
