/**
 * Toast utility wrapper pour Sonner
 * Compatible avec l'ancienne API react-toastify pour faciliter la migration
 */
import { toast as sonnerToast } from 'sonner'

/**
 * Wrapper toast compatible avec react-toastify
 * Permet de migrer progressivement vers Sonner
 */
export const toast = {
	/**
	 * Toast de succès
	 * @param {string|React.ReactNode} message - Message à afficher
	 * @param {Object} options - Options du toast
	 */
	success: (message, options = {}) => {
		return sonnerToast.success(message, {
			duration: options.autoClose || 3000,
			position: options.position?.replace('top-', 'top-').replace('bottom-', 'bottom-') || 'top-center',
		})
	},

	/**
	 * Toast d'erreur
	 * @param {string|React.ReactNode} message - Message à afficher
	 * @param {Object} options - Options du toast
	 */
	error: (message, options = {}) => {
		return sonnerToast.error(message, {
			duration: options.autoClose || 3000,
			position: options.position?.replace('top-', 'top-').replace('bottom-', 'bottom-') || 'top-center',
		})
	},

	/**
	 * Toast d'information
	 * @param {string|React.ReactNode} message - Message à afficher
	 * @param {Object} options - Options du toast
	 */
	info: (message, options = {}) => {
		return sonnerToast.info(message, {
			duration: options.autoClose || 3000,
			position: options.position?.replace('top-', 'top-').replace('bottom-', 'bottom-') || 'top-center',
		})
	},

	/**
	 * Toast d'avertissement
	 * @param {string|React.ReactNode} message - Message à afficher
	 * @param {Object} options - Options du toast
	 */
	warning: (message, options = {}) => {
		return sonnerToast.warning(message, {
			duration: options.autoClose || 3000,
			position: options.position?.replace('top-', 'top-').replace('bottom-', 'bottom-') || 'top-center',
		})
	},

	/**
	 * Toast avec promesse (nouveauté de Sonner)
	 * @param {Promise} promise - Promesse à suivre
	 * @param {Object} messages - Messages pour chaque état
	 * @param {string} messages.loading - Message pendant le chargement
	 * @param {string} messages.success - Message en cas de succès
	 * @param {string} messages.error - Message en cas d'erreur
	 */
	promise: (promise, messages) => {
		return sonnerToast.promise(promise, messages)
	},

	/**
	 * Toast de chargement
	 * @param {string|React.ReactNode} message - Message à afficher
	 * @param {Object} options - Options du toast
	 */
	loading: (message, options = {}) => {
		return sonnerToast.loading(message, {
			duration: options.autoClose || Infinity,
			position: options.position?.replace('top-', 'top-').replace('bottom-', 'bottom-') || 'top-center',
		})
	},

	/**
	 * Fermer un toast spécifique
	 * @param {string|number} toastId - ID du toast à fermer
	 */
	dismiss: (toastId) => {
		return sonnerToast.dismiss(toastId)
	},

	/**
	 * Toast personnalisé
	 * @param {string|React.ReactNode} message - Message à afficher
	 * @param {Object} options - Options du toast
	 */
	custom: (message, options = {}) => {
		return sonnerToast.custom(message, {
			duration: options.autoClose || 3000,
			position: options.position?.replace('top-', 'top-').replace('bottom-', 'bottom-') || 'top-center',
		})
	},
}

export default toast
