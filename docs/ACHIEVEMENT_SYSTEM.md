# 🏆 Système de Notifications d'Achievements

## Vue d'ensemble

Système complet de notifications d'achievements avec animations RPG pour récompenser les progrès des utilisateurs.

## ✨ Features

### Achievements supportés:

1. **🎉 Level Up** - Montée de niveau
2. **⭐ Objectif quotidien atteint** - Récompense: 1 gold
3. **🏆 Objectif hebdomadaire atteint** - Récompense: 3 gold
4. **👑 Objectif mensuel atteint** - Récompense: 10 gold
5. **🔥 Streak milestones** - 3, 7, 30, 100 jours consécutifs

### Caractéristiques:

- ✅ Modal animée avec effets RPG (bounce-in, shine, float, pulse)
- ✅ File d'attente d'achievements (affichage séquentiel)
- ✅ Multilingue (FR, EN, RU)
- ✅ Auto-fermeture après 4 secondes
- ✅ Click/tap pour fermer manuellement
- ✅ Thème dark fantasy avec gradients et particules
- ✅ Disponible globalement dans toute l'application

## 📁 Architecture

```
components/
├── AchievementNotification.jsx   # Composant modal d'affichage
├── AchievementProvider.jsx       # Context provider global
└── games/Flashcards.jsx          # Exemple d'intégration

hooks/
└── useAchievements.js            # Hook de gestion des achievements

pages/
├── _app.js                       # Intégration du provider
└── api/xp/add.js                 # Détection automatique des achievements

locales/
├── fr/common.json                # Traductions françaises
├── en/common.json                # Traductions anglaises
└── ru/common.json                # Traductions russes
```

## 🚀 Utilisation

### Dans n'importe quel composant:

```jsx
import { useAchievementContext } from '@/components/AchievementProvider'

function MyComponent() {
  const { showAchievement, showAchievements } = useAchievementContext()

  // Afficher un achievement unique
  const handleLevelUp = () => {
    showAchievement({
      type: 'level_up',
      level: 5
    })
  }

  // Afficher plusieurs achievements (séquentiellement)
  const handleMultipleAchievements = () => {
    showAchievements([
      { type: 'daily_goal_achieved', goldEarned: 1 },
      { type: 'level_up', level: 5 },
      { type: 'streak_7_days', streak: 7 }
    ])
  }

  return (
    <button onClick={handleLevelUp}>Level Up!</button>
  )
}
```

### Automatique lors de l'ajout d'XP:

Lorsque vous appelez l'API `/api/xp/add`, les achievements sont automatiquement détectés et retournés dans la réponse. Il suffit de les afficher :

```jsx
const response = await fetch('/api/xp/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    actionType: 'flashcard_reviewed',
    sourceId: wordId,
    description: 'Reviewed flashcard'
  })
})

const data = await response.json()

// Afficher automatiquement tous les achievements
if (data.achievements && data.achievements.length > 0) {
  showAchievements(data.achievements)
}
```

## 🎨 Types d'achievements

| Type | Description | Données requises | Récompenses |
|------|-------------|------------------|-------------|
| `level_up` | Montée de niveau | `level: number` | Aucune |
| `daily_goal_achieved` | Objectif quotidien atteint | `goldEarned: number` | 1 gold |
| `weekly_goal_achieved` | Objectif hebdomadaire atteint | `goldEarned: number` | 3 gold |
| `monthly_goal_achieved` | Objectif mensuel atteint | `goldEarned: number` | 10 gold |
| `streak_X_days` | Streak milestone (3, 7, 30, 100) | `streak: number` | Aucune |

## 🔧 API `/api/xp/add`

L'API détecte automatiquement les achievements :

**Détection du level-up:**
```javascript
if (newLevel > profile.current_level) {
  achievements.push({ type: 'level_up', level: newLevel })
}
```

**Détection des objectifs:**
```javascript
// Objectif quotidien
const previousDailyXp = dailyXpEarned - xpAmount
const justCompletedDaily = previousDailyXp < dailyGoalTarget && dailyXpEarned >= dailyGoalTarget

if (justCompletedDaily && dailyGoalTarget > 0) {
  achievements.push({ type: 'daily_goal_achieved', goldEarned: 1 })
}
```

**Détection des streaks:**
```javascript
if ([3, 7, 30, 100].includes(newStreak)) {
  achievements.push({ type: `streak_${newStreak}_days`, streak: newStreak })
}
```

## 📝 Traductions

Les clés de traduction sont dans `locales/{lang}/common.json` :

```json
{
  "achievement_level_up_title": "Nouveau niveau !",
  "achievement_level_up_desc": "Vous avez atteint le niveau {{level}} !",
  "achievement_daily_goal_title": "Objectif quotidien atteint !",
  "achievement_daily_goal_desc": "Vous avez gagné {{gold}} pièces d'or !",
  "tap_to_close": "Touchez pour fermer"
}
```

## 🎯 Intégration dans un nouveau composant

1. **Importer le context:**
```jsx
import { useAchievementContext } from '@/components/AchievementProvider'
```

2. **Utiliser le hook:**
```jsx
const { showAchievements } = useAchievementContext()
```

3. **Appeler après l'ajout d'XP:**
```jsx
if (xpData.achievements?.length > 0) {
  showAchievements(xpData.achievements)
}
```

## 🌈 Personnalisation

### Couleurs par type:

| Type | Couleur | Gradient |
|------|---------|----------|
| Level Up | Purple (`#8b5cf6`) | Purple → Cyan |
| Daily Goal | Orange (`#f59e0b`) | Orange → Dark Orange |
| Weekly Goal | Cyan (`#06b6d4`) | Cyan → Dark Cyan |
| Monthly Goal | Pink (`#ec4899`) | Pink → Dark Pink |
| Streak | Red (`#ef4444`) | Red → Dark Red |

### Animations:

- **bounceIn**: Entrée avec rebond
- **shine**: Reflet lumineux qui traverse
- **float**: Flottement vertical
- **pulse**: Pulsation continue

## 📊 Flow complet

```
User completes flashcard
       ↓
API /api/xp/add appelée
       ↓
Calcul du nouveau XP/niveau
       ↓
Vérification des achievements:
  - Level up?
  - Daily goal atteint?
  - Weekly goal atteint?
  - Monthly goal atteint?
  - Streak milestone?
       ↓
Return { achievements: [...] }
       ↓
showAchievements(achievements)
       ↓
Modal animée affichée séquentiellement
       ↓
Auto-close après 4s ou click
```

## ✅ Checklist d'intégration

- [x] Composant AchievementNotification créé
- [x] Hook useAchievements créé
- [x] Provider global dans _app.js
- [x] API /api/xp/add modifiée
- [x] Traductions FR/EN/RU ajoutées
- [x] Intégré dans Flashcards
- [ ] Intégrer dans Exercices
- [ ] Intégrer dans Matériaux
- [ ] Tests utilisateur

## 🐛 Troubleshooting

**Les achievements ne s'affichent pas:**
- Vérifier que `AchievementProvider` est bien dans `_app.js`
- Vérifier que `useAchievementContext()` est appelé
- Console: vérifier que `achievements` est retourné par l'API

**Animations ne fonctionnent pas:**
- Vérifier que MUI est bien installé
- Vérifier les imports de `@mui/material` et `@mui/system`

**Traductions manquantes:**
- Vérifier que la clé existe dans `locales/{lang}/common.json`
- Vérifier le format: `{{variable}}` pour l'interpolation

## 📚 Références

- MUI Animations: https://mui.com/material-ui/transitions/
- Next-translate: https://github.com/aralroca/next-translate
- Achievement patterns: https://www.nngroup.com/articles/gamification/
