import { createContext, useContext } from 'react'
import useAchievements from '../hooks/useAchievements'
import AchievementNotification from './AchievementNotification'

/**
 * Context pour le système d'achievements
 * Permet d'accéder au système d'achievements depuis n'importe quel composant
 */
const AchievementContext = createContext(null)

/**
 * Provider du système d'achievements
 * À utiliser dans _app.js pour rendre le système disponible globalement
 */
export const AchievementProvider = ({ children }) => {
	const { showAchievement, showAchievements, currentAchievement, isOpen, handleClose } = useAchievements()

	return (
		<AchievementContext.Provider value={{ showAchievement, showAchievements }}>
			{children}
			<AchievementNotification achievement={currentAchievement} open={isOpen} onClose={handleClose} />
		</AchievementContext.Provider>
	)
}

/**
 * Hook pour utiliser le système d'achievements
 * @returns {Object} { showAchievement, showAchievements }
 * @example
 * const { showAchievement, showAchievements } = useAchievementContext()
 *
 * // Afficher un achievement
 * showAchievement({ type: 'level_up', level: 5 })
 *
 * // Afficher plusieurs achievements (séquentiellement)
 * showAchievements([
 *   { type: 'level_up', level: 5 },
 *   { type: 'daily_goal_achieved', goldEarned: 1 }
 * ])
 */
export const useAchievementContext = () => {
	const context = useContext(AchievementContext)
	if (!context) {
		throw new Error('useAchievementContext must be used within AchievementProvider')
	}
	return context
}

export default AchievementProvider
