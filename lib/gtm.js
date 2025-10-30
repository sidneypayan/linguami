/**
 * Google Tag Manager Utilities
 * Fonctions pour interagir avec GTM et envoyer des événements personnalisés
 */

/**
 * Envoie un événement pageview à GTM
 * @param {string} url - L'URL de la page
 * @param {string} lang - La langue de la page (fr, ru, en)
 */
export const pageview = (url, lang = 'fr') => {
	if (typeof window !== 'undefined' && window.dataLayer) {
		window.dataLayer.push({
			event: 'pageview',
			page: url,
			language: lang,
			pagePath: url,
			pageTitle: document.title,
		})
	}
}

/**
 * Envoie un événement personnalisé à GTM
 * @param {Object} eventData - Les données de l'événement
 * @param {string} eventData.event - Le nom de l'événement
 * @param {string} eventData.category - La catégorie de l'événement (optionnel)
 * @param {string} eventData.action - L'action de l'événement (optionnel)
 * @param {string} eventData.label - Le label de l'événement (optionnel)
 * @param {*} eventData.value - La valeur de l'événement (optionnel)
 */
export const event = ({ event, category, action, label, value, ...otherData }) => {
	if (typeof window !== 'undefined' && window.dataLayer) {
		window.dataLayer.push({
			event,
			eventCategory: category,
			eventAction: action,
			eventLabel: label,
			eventValue: value,
			...otherData,
		})
	}
}

/**
 * Événements prédéfinis pour les interactions courantes
 */

// Suivi de l'inscription d'un utilisateur
export const trackSignup = (method = 'email', language = 'fr') => {
	event({
		event: 'signup',
		category: 'User',
		action: 'Signup',
		label: method,
		language,
	})
}

// Suivi de la connexion d'un utilisateur
export const trackLogin = (method = 'email', language = 'fr') => {
	event({
		event: 'login',
		category: 'User',
		action: 'Login',
		label: method,
		language,
	})
}

// Suivi du changement de langue d'apprentissage
export const trackLanguageSelection = (learningLanguage, interfaceLanguage = 'fr') => {
	event({
		event: 'language_selection',
		category: 'User',
		action: 'Select Learning Language',
		label: learningLanguage,
		interfaceLanguage,
	})
}

// Suivi de la consultation d'un matériel
export const trackMaterialView = (materialSection, materialTitle, language = 'fr') => {
	event({
		event: 'material_view',
		category: 'Content',
		action: 'View Material',
		label: `${materialSection} - ${materialTitle}`,
		materialSection,
		materialTitle,
		language,
	})
}

// Suivi de la complétion d'une leçon
export const trackLessonComplete = (lessonId, lessonTitle, language = 'fr') => {
	event({
		event: 'lesson_complete',
		category: 'Education',
		action: 'Complete Lesson',
		label: lessonTitle,
		lessonId,
		language,
	})
}

// Suivi de l'ajout d'un mot au dictionnaire
export const trackWordAdded = (word, translation, language = 'fr') => {
	event({
		event: 'word_added',
		category: 'Learning',
		action: 'Add Word to Dictionary',
		label: word,
		translation,
		language,
	})
}

// Suivi de l'utilisation des flashcards
export const trackFlashcardSession = (wordsReviewed, language = 'fr') => {
	event({
		event: 'flashcard_session',
		category: 'Learning',
		action: 'Use Flashcards',
		value: wordsReviewed,
		language,
	})
}

// Suivi de conversion premium
export const trackPremiumPurchase = (plan, price, language = 'fr') => {
	event({
		event: 'purchase',
		category: 'Ecommerce',
		action: 'Premium Purchase',
		label: plan,
		value: price,
		currency: 'EUR',
		language,
	})
}

// Suivi du contact avec le professeur
export const trackTeacherContact = (method, language = 'fr') => {
	event({
		event: 'teacher_contact',
		category: 'Lead',
		action: 'Contact Teacher',
		label: method,
		language,
	})
}
