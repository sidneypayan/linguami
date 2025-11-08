/**
 * Get localized text from exercise data
 * Supports both legacy format (plain string) and new format (object with language keys)
 *
 * @param {string|object} text - The text content (either string or {fr, en, ru})
 * @param {string} locale - The current locale (fr, en, ru)
 * @returns {string} The localized text
 */
export const getLocalizedText = (text, locale = 'fr') => {
  // If text is null or undefined, return empty string
  if (!text) return ''

  // If text is a plain string (legacy format), return it as-is
  if (typeof text === 'string') {
    return text
  }

  // If text is an object with language keys (new format)
  if (typeof text === 'object' && !Array.isArray(text)) {
    // Return the text for the current locale, fallback to French, then any available language
    return text[locale] || text.fr || text.en || text.ru || Object.values(text)[0] || ''
  }

  return ''
}

/**
 * Get localized question data
 * Converts all text fields in a question to the appropriate language
 *
 * @param {object} question - The question object
 * @param {string} locale - The current locale (fr, en, ru)
 * @returns {object} The question with localized text
 */
export const getLocalizedQuestion = (question, locale = 'fr') => {
  if (!question) return null

  const localized = {
    ...question,
    question: getLocalizedText(question.question, locale),
  }

  // Localize options if present (for MCQ)
  if (question.options && Array.isArray(question.options)) {
    localized.options = question.options.map(option => ({
      ...option,
      text: getLocalizedText(option.text, locale)
    }))
  }

  // Localize pairs if present (for DragAndDrop)
  if (question.pairs && Array.isArray(question.pairs)) {
    localized.pairs = question.pairs.map(pair => ({
      ...pair,
      left: getLocalizedText(pair.left, locale),
      right: getLocalizedText(pair.right, locale)
    }))
  }

  // Localize blanks if present (for FITB)
  if (question.blanks && Array.isArray(question.blanks)) {
    localized.blanks = question.blanks.map(blank => ({
      ...blank,
      // correctAnswers is already an array, doesn't need localization
    }))
  }

  // Localize explanation if present
  if (question.explanation) {
    localized.explanation = getLocalizedText(question.explanation, locale)
  }

  // Localize text if present (for FITB)
  if (question.text) {
    localized.text = getLocalizedText(question.text, locale)
  }

  return localized
}
