/**
 * Spaced Repetition System (SRS) - Anki-like Algorithm
 *
 * This module implements a spaced repetition algorithm similar to Anki
 * with 4 buttons: Again, Hard, Good, Easy
 */

// ==================== CONSTANTS ====================

export const CARD_STATES = {
  NEW: 'new',
  LEARNING: 'learning',
  REVIEW: 'review',
  RELEARNING: 'relearning'
}

export const BUTTON_TYPES = {
  AGAIN: 'again',      // Encore - Card forgotten
  HARD: 'hard',        // Difficile - Correct with effort
  GOOD: 'good',        // Bien - Correct normally
  EASY: 'easy'         // Facile - Correct instantly
}

// Learning steps in minutes
export const LEARNING_STEPS = [1, 10]  // 1 min, 10 min
export const RELEARNING_STEPS = [10]   // 10 min for relearning

// Default intervals for graduating cards (in days)
export const GRADUATING_INTERVAL = 1   // After completing learning steps
export const EASY_INTERVAL = 4         // Skip learning, go direct to review

// Ease factor settings
export const STARTING_EASE = 2.5
export const MINIMUM_EASE = 1.3
export const EASE_HARD_PENALTY = 0.15   // -15% ease for "Hard"
export const EASE_EASY_BONUS = 0.15     // +15% ease for "Easy"

// Interval multipliers
export const HARD_MULTIPLIER = 1.2
export const EASY_MULTIPLIER = 1.3

// ==================== HELPER FUNCTIONS ====================

/**
 * Convert minutes to milliseconds
 */
function minutesToMs(minutes) {
  return minutes * 60 * 1000
}

/**
 * Convert days to milliseconds
 */
function daysToMs(days) {
  return days * 24 * 60 * 60 * 1000
}

/**
 * Get current timestamp in milliseconds (for internal calculations)
 */
function now() {
  return Date.now()
}

/**
 * Convert milliseconds timestamp to ISO string for database storage
 */
function toISOString(timestamp) {
  return new Date(timestamp).toISOString()
}

/**
 * Constrain ease factor to minimum value
 */
function constrainEase(ease) {
  return Math.max(ease, MINIMUM_EASE)
}

/**
 * Format interval for display
 */
export function formatInterval(intervalMinutes, cardState) {
  if (cardState === CARD_STATES.NEW || cardState === CARD_STATES.LEARNING || cardState === CARD_STATES.RELEARNING) {
    // For learning cards, show in minutes
    if (intervalMinutes < 60) {
      return `${Math.round(intervalMinutes)}min`
    } else if (intervalMinutes < 1440) {
      return `${Math.round(intervalMinutes / 60)}h`
    } else {
      return `${Math.round(intervalMinutes / 1440)}j`
    }
  } else {
    // For review cards, show in days/months
    const days = intervalMinutes / 1440
    if (days < 30) {
      return `${Math.round(days)}j`
    } else if (days < 365) {
      return `${Math.round(days / 30)}mois`
    } else {
      return `${Math.round(days / 365)}an${days / 365 >= 2 ? 's' : ''}`
    }
  }
}

// ==================== MAIN ALGORITHM ====================

/**
 * Calculate next review for a NEW card
 */
function handleNewCard(card, buttonType) {
  const now_timestamp = now()

  switch (buttonType) {
    case BUTTON_TYPES.AGAIN:
      // Start learning from first step (very short interval)
      return {
        ...card,
        card_state: CARD_STATES.LEARNING,
        learning_step: 0,
        interval: LEARNING_STEPS[0], // 1 min
        next_review_date: toISOString(now_timestamp + minutesToMs(LEARNING_STEPS[0])),
        last_review_date: toISOString(now_timestamp),
        reviews_count: (card.reviews_count || 0) + 1,
        lapses: (card.lapses || 0) + 1
      }

    case BUTTON_TYPES.HARD:
      // Start learning but skip to middle of first step (moderate interval)
      const hardInterval = LEARNING_STEPS[0] * 3 // 3 min (between Again and Good)
      return {
        ...card,
        card_state: CARD_STATES.LEARNING,
        learning_step: 0,
        interval: hardInterval,
        next_review_date: toISOString(now_timestamp + minutesToMs(hardInterval)),
        last_review_date: toISOString(now_timestamp),
        reviews_count: (card.reviews_count || 0) + 1
      }

    case BUTTON_TYPES.GOOD:
      // Start learning at second step (normal progression)
      return {
        ...card,
        card_state: CARD_STATES.LEARNING,
        learning_step: 1,
        interval: LEARNING_STEPS[1], // 10 min
        next_review_date: toISOString(now_timestamp + minutesToMs(LEARNING_STEPS[1])),
        last_review_date: toISOString(now_timestamp),
        reviews_count: (card.reviews_count || 0) + 1
      }

    case BUTTON_TYPES.EASY:
      // Skip learning, go directly to review
      return {
        ...card,
        card_state: CARD_STATES.REVIEW,
        learning_step: null,
        interval: EASY_INTERVAL * 1440, // Convert to minutes (4 days)
        ease_factor: STARTING_EASE,
        next_review_date: toISOString(now_timestamp + daysToMs(EASY_INTERVAL)),
        last_review_date: toISOString(now_timestamp),
        reviews_count: (card.reviews_count || 0) + 1
      }

    default:
      return card
  }
}

/**
 * Calculate next review for a LEARNING card
 */
function handleLearningCard(card, buttonType) {
  const now_timestamp = now()
  const currentStep = card.learning_step || 0

  switch (buttonType) {
    case BUTTON_TYPES.AGAIN:
      // Restart from first step
      return {
        ...card,
        learning_step: 0,
        interval: LEARNING_STEPS[0],
        next_review_date: toISOString(now_timestamp + minutesToMs(LEARNING_STEPS[0])),
        last_review_date: toISOString(now_timestamp),
        reviews_count: (card.reviews_count || 0) + 1,
        lapses: (card.lapses || 0) + 1
      }

    case BUTTON_TYPES.HARD:
      // Repeat current step with multiplier, but ensure minimum interval
      let hardInterval = LEARNING_STEPS[currentStep] * HARD_MULTIPLIER

      // For step 0 (1 min), ensure "Hard" matches what a NEW card would get (3 min)
      // This maintains consistency: Difficile should never decrease in interval
      if (currentStep === 0) {
        hardInterval = Math.max(hardInterval, LEARNING_STEPS[0] * 3) // At least 3 minutes (same as NEW card "Hard")
      }

      hardInterval = Math.round(hardInterval)

      return {
        ...card,
        interval: hardInterval,
        next_review_date: toISOString(now_timestamp + minutesToMs(hardInterval)),
        last_review_date: toISOString(now_timestamp),
        reviews_count: (card.reviews_count || 0) + 1
      }

    case BUTTON_TYPES.GOOD:
      // Move to next step or graduate
      const nextStep = currentStep + 1
      if (nextStep >= LEARNING_STEPS.length) {
        // Graduate to review
        return {
          ...card,
          card_state: CARD_STATES.REVIEW,
          learning_step: null,
          interval: GRADUATING_INTERVAL * 1440, // Convert to minutes
          ease_factor: STARTING_EASE,
          next_review_date: toISOString(now_timestamp + daysToMs(GRADUATING_INTERVAL)),
          last_review_date: toISOString(now_timestamp),
          reviews_count: (card.reviews_count || 0) + 1
        }
      } else {
        // Move to next learning step
        return {
          ...card,
          learning_step: nextStep,
          interval: LEARNING_STEPS[nextStep],
          next_review_date: toISOString(now_timestamp + minutesToMs(LEARNING_STEPS[nextStep])),
          last_review_date: toISOString(now_timestamp),
          reviews_count: (card.reviews_count || 0) + 1
        }
      }

    case BUTTON_TYPES.EASY:
      // Graduate directly to review with easy interval
      return {
        ...card,
        card_state: CARD_STATES.REVIEW,
        learning_step: null,
        interval: EASY_INTERVAL * 1440, // Convert to minutes
        ease_factor: STARTING_EASE,
        next_review_date: toISOString(now_timestamp + daysToMs(EASY_INTERVAL)),
        last_review_date: toISOString(now_timestamp),
        reviews_count: (card.reviews_count || 0) + 1
      }

    default:
      return card
  }
}

/**
 * Calculate next review for a REVIEW card
 */
function handleReviewCard(card, buttonType) {
  const now_timestamp = now()
  const currentInterval = card.interval || GRADUATING_INTERVAL * 1440 // in minutes
  const currentEase = card.ease_factor || STARTING_EASE

  switch (buttonType) {
    case BUTTON_TYPES.AGAIN:
      // Move to relearning
      return {
        ...card,
        card_state: CARD_STATES.RELEARNING,
        learning_step: 0,
        interval: RELEARNING_STEPS[0],
        next_review_date: toISOString(now_timestamp + minutesToMs(RELEARNING_STEPS[0])),
        last_review_date: toISOString(now_timestamp),
        reviews_count: (card.reviews_count || 0) + 1,
        lapses: (card.lapses || 0) + 1
      }

    case BUTTON_TYPES.HARD:
      // Reduce ease and use hard multiplier
      const newEaseHard = constrainEase(currentEase - EASE_HARD_PENALTY)
      const hardInterval = Math.round(Math.max(currentInterval * HARD_MULTIPLIER, GRADUATING_INTERVAL * 1440))

      return {
        ...card,
        interval: hardInterval,
        ease_factor: newEaseHard,
        next_review_date: toISOString(now_timestamp + minutesToMs(hardInterval)),
        last_review_date: toISOString(now_timestamp),
        reviews_count: (card.reviews_count || 0) + 1
      }

    case BUTTON_TYPES.GOOD:
      // Use ease factor
      const goodInterval = Math.round(currentInterval * currentEase)

      return {
        ...card,
        interval: goodInterval,
        next_review_date: toISOString(now_timestamp + minutesToMs(goodInterval)),
        last_review_date: toISOString(now_timestamp),
        reviews_count: (card.reviews_count || 0) + 1
      }

    case BUTTON_TYPES.EASY:
      // Increase ease and use easy multiplier
      const newEaseEasy = currentEase + EASE_EASY_BONUS
      const easyInterval = Math.round(currentInterval * currentEase * EASY_MULTIPLIER)

      return {
        ...card,
        interval: easyInterval,
        ease_factor: newEaseEasy,
        next_review_date: toISOString(now_timestamp + minutesToMs(easyInterval)),
        last_review_date: toISOString(now_timestamp),
        reviews_count: (card.reviews_count || 0) + 1
      }

    default:
      return card
  }
}

/**
 * Calculate next review for a RELEARNING card
 */
function handleRelearningCard(card, buttonType) {
  const now_timestamp = now()
  const currentStep = card.learning_step || 0
  const currentInterval = card.interval || GRADUATING_INTERVAL * 1440

  switch (buttonType) {
    case BUTTON_TYPES.AGAIN:
      // Restart relearning
      return {
        ...card,
        learning_step: 0,
        interval: RELEARNING_STEPS[0],
        next_review_date: toISOString(now_timestamp + minutesToMs(RELEARNING_STEPS[0])),
        last_review_date: toISOString(now_timestamp),
        reviews_count: (card.reviews_count || 0) + 1,
        lapses: (card.lapses || 0) + 1
      }

    case BUTTON_TYPES.HARD:
    case BUTTON_TYPES.GOOD:
      // Graduate back to review with reduced interval
      const reducedInterval = Math.round(Math.max(currentInterval * 0.5, GRADUATING_INTERVAL * 1440))

      return {
        ...card,
        card_state: CARD_STATES.REVIEW,
        learning_step: null,
        interval: reducedInterval,
        next_review_date: toISOString(now_timestamp + minutesToMs(reducedInterval)),
        last_review_date: toISOString(now_timestamp),
        reviews_count: (card.reviews_count || 0) + 1
      }

    case BUTTON_TYPES.EASY:
      // Graduate back to review with original interval
      return {
        ...card,
        card_state: CARD_STATES.REVIEW,
        learning_step: null,
        next_review_date: toISOString(now_timestamp + minutesToMs(currentInterval)),
        last_review_date: toISOString(now_timestamp),
        reviews_count: (card.reviews_count || 0) + 1
      }

    default:
      return card
  }
}

/**
 * Main function: Calculate next review for any card
 *
 * @param {Object} card - The card object with SRS fields
 * @param {string} buttonType - One of BUTTON_TYPES (again, hard, good, easy)
 * @returns {Object} Updated card with new SRS values
 */
export function calculateNextReview(card, buttonType) {
  const cardState = card.card_state || CARD_STATES.NEW

  switch (cardState) {
    case CARD_STATES.NEW:
      return handleNewCard(card, buttonType)

    case CARD_STATES.LEARNING:
      return handleLearningCard(card, buttonType)

    case CARD_STATES.REVIEW:
      return handleReviewCard(card, buttonType)

    case CARD_STATES.RELEARNING:
      return handleRelearningCard(card, buttonType)

    default:
      return handleNewCard(card, buttonType)
  }
}

/**
 * Get intervals for all 4 buttons (for display purposes)
 *
 * @param {Object} card - The card object
 * @returns {Object} Object with intervals for each button
 */
export function getButtonIntervals(card) {
  const againCard = calculateNextReview(card, BUTTON_TYPES.AGAIN)
  const hardCard = calculateNextReview(card, BUTTON_TYPES.HARD)
  const goodCard = calculateNextReview(card, BUTTON_TYPES.GOOD)
  const easyCard = calculateNextReview(card, BUTTON_TYPES.EASY)

  return {
    again: formatInterval(againCard.interval, againCard.card_state),
    hard: formatInterval(hardCard.interval, hardCard.card_state),
    good: formatInterval(goodCard.interval, goodCard.card_state),
    easy: formatInterval(easyCard.interval, easyCard.card_state)
  }
}

/**
 * Check if a card is due for review
 *
 * @param {Object} card - The card object
 * @returns {boolean} True if card is due
 */
export function isCardDue(card) {
  // Suspended cards are never due
  if (card.is_suspended) {
    return false
  }

  // New cards are always due
  if (!card.card_state || card.card_state === CARD_STATES.NEW) {
    return true
  }

  // Cards in LEARNING or RELEARNING are always due during a session
  // (they should stay in the session until they graduate to REVIEW)
  if (card.card_state === CARD_STATES.LEARNING || card.card_state === CARD_STATES.RELEARNING) {
    return true
  }

  // Cards without next_review_date are due
  if (!card.next_review_date) {
    return true
  }

  // For REVIEW cards, check if next review date is in the past
  // Convert ISO string to timestamp for comparison
  const nextReviewTimestamp = new Date(card.next_review_date).getTime()
  return nextReviewTimestamp <= now()
}

/**
 * Filter cards to only those due for review
 *
 * @param {Array} cards - Array of card objects
 * @returns {Array} Filtered array of due cards
 */
export function getDueCards(cards) {
  return cards.filter(isCardDue)
}

/**
 * Initialize SRS fields for a new card
 *
 * @param {Object} card - Card object without SRS fields
 * @returns {Object} Card with initialized SRS fields
 */
export function initializeCard(card) {
  return {
    ...card,
    card_state: CARD_STATES.NEW,
    ease_factor: STARTING_EASE,
    interval: 0,
    learning_step: null,
    next_review_date: null,
    last_review_date: null,
    reviews_count: 0,
    lapses: 0
  }
}
