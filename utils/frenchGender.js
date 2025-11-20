/**
 * Utility functions for French gender transformation
 */

/**
 * Feminize a French adjective
 * Applies French grammar rules for feminine forms
 * @param {string} masculine - Masculine form of the adjective
 * @returns {string} Feminine form
 */
export function feminizeFrenchAdjective(masculine) {
	if (!masculine || typeof masculine !== 'string') return masculine

	const word = masculine.trim().toLowerCase()

	// Skip if it's a phrase (contains spaces) - not a simple adjective
	if (word.includes(' ')) return masculine

	// Already ends with 'e' - likely already feminine or invariable
	if (word.endsWith('e') && !word.endsWith('que')) {
		return masculine
	}

	// Common patterns
	const rules = [
		// -el, -eil → -elle, -eille (cruel → cruelle)
		{ pattern: /el$/, replacement: 'elle' },
		{ pattern: /eil$/, replacement: 'eille' },

		// -il → -ille (gentil → gentille)
		{ pattern: /il$/, replacement: 'ille' },

		// -en → -enne (ancien → ancienne)
		{ pattern: /en$/, replacement: 'enne' },

		// -on → -onne (bon → bonne, mignon → mignonne)
		{ pattern: /on$/, replacement: 'onne' },

		// -et → -ette (coquet → coquette)
		{ pattern: /et$/, replacement: 'ette' },

		// -er → -ère (cher → chère, léger → légère)
		{ pattern: /er$/, replacement: 'ère' },

		// -eux → -euse (heureux → heureuse)
		{ pattern: /eux$/, replacement: 'euse' },

		// -eur → -euse (trompeur → trompeuse) - not all, but common
		{ pattern: /eur$/, replacement: 'euse' },

		// -if → -ive (vif → vive, actif → active)
		{ pattern: /f$/, replacement: 've' },

		// -c → -que (public → publique, turc → turque)
		{ pattern: /c$/, replacement: 'que' },

		// -ou → -olle (fou → folle, mou → molle) - special cases
		{ pattern: /ou$/, replacement: 'olle' },
	]

	// Try each rule
	for (const rule of rules) {
		if (rule.pattern.test(word)) {
			const feminized = word.replace(rule.pattern, rule.replacement)
			// Preserve original casing
			return preserveCase(masculine, feminized)
		}
	}

	// Default: just add 'e' (grand → grande, petit → petite)
	return preserveCase(masculine, word + 'e')
}

/**
 * Preserve the original casing when transforming a word
 * @param {string} original - Original word with its casing
 * @param {string} transformed - Transformed word (lowercase)
 * @returns {string} Transformed word with original casing
 */
function preserveCase(original, transformed) {
	if (!original || !transformed) return transformed

	// If original starts with uppercase, capitalize result
	if (original[0] === original[0].toUpperCase()) {
		return transformed.charAt(0).toUpperCase() + transformed.slice(1)
	}

	return transformed
}

/**
 * Neutralize a French adjective (make it neuter/neutral)
 * For Russian neuter adjectives, we often keep masculine in French
 * @param {string} masculine - Masculine form
 * @returns {string} Neutral form (often same as masculine in French)
 */
export function neutralizeFrenchAdjective(masculine) {
	// French doesn't have neuter gender, so we keep masculine form
	return masculine
}
