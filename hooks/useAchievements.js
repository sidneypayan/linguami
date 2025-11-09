import { useState, useCallback } from 'react'

/**
 * Hook personnalisé pour gérer l'affichage des achievements
 * Centralise la logique des notifications d'achievements
 *
 * @returns {Object} { showAchievement, currentAchievement, isOpen, handleClose }
 */
export const useAchievements = () => {
	const [currentAchievement, setCurrentAchievement] = useState(null)
	const [achievementQueue, setAchievementQueue] = useState([])
	const [isOpen, setIsOpen] = useState(false)

	/**
	 * Affiche un achievement
	 * Si un achievement est déjà affiché, l'ajoute à la queue
	 *
	 * @param {Object} achievement - L'achievement à afficher
	 * @param {string} achievement.type - Type d'achievement (level_up, daily_goal_achieved, etc.)
	 * @param {Object} achievement - Données additionnelles (level, streak, goldEarned, etc.)
	 */
	const showAchievement = useCallback((achievement) => {
		if (!achievement) return

		if (isOpen) {
			// Si un achievement est déjà affiché, ajouter à la queue
			setAchievementQueue(prev => [...prev, achievement])
		} else {
			// Sinon, afficher immédiatement
			setCurrentAchievement(achievement)
			setIsOpen(true)
		}
	}, [isOpen])

	/**
	 * Affiche plusieurs achievements
	 * Les achievements sont affichés séquentiellement
	 *
	 * @param {Array<Object>} achievements - Tableau d'achievements à afficher
	 */
	const showAchievements = useCallback((achievements) => {
		if (!achievements || achievements.length === 0) return

		if (isOpen) {
			// Si un achievement est déjà affiché, ajouter tous à la queue
			setAchievementQueue(prev => [...prev, ...achievements])
		} else {
			// Afficher le premier, mettre les autres en queue
			setCurrentAchievement(achievements[0])
			setIsOpen(true)
			if (achievements.length > 1) {
				setAchievementQueue(achievements.slice(1))
			}
		}
	}, [isOpen])

	/**
	 * Ferme l'achievement actuel et affiche le suivant dans la queue si disponible
	 */
	const handleClose = useCallback(() => {
		setIsOpen(false)
		setCurrentAchievement(null)

		// Afficher le prochain achievement dans la queue après un petit délai
		setTimeout(() => {
			if (achievementQueue.length > 0) {
				const nextAchievement = achievementQueue[0]
				setAchievementQueue(prev => prev.slice(1))
				setCurrentAchievement(nextAchievement)
				setIsOpen(true)
			}
		}, 500) // Délai de 500ms entre chaque achievement
	}, [achievementQueue])

	return {
		showAchievement,
		showAchievements,
		currentAchievement,
		isOpen,
		handleClose,
	}
}

export default useAchievements
