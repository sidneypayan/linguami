# 🎮 Système XP et Gamification - Linguami

## 📋 Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Installation](#installation)
3. [Architecture](#architecture)
4. [API Endpoints](#api-endpoints)
5. [Utilisation](#utilisation)
6. [Configuration XP](#configuration-xp)
7. [Exemples d'intégration](#exemples-dintégration)

---

## 🎯 Vue d'ensemble

Le système XP de Linguami gamifie l'apprentissage en récompensant les utilisateurs pour leurs actions :
- Révision de flashcards
- Complétion de matériaux
- Engagement quotidien
- Streaks de connexion

### Fonctionnalités principales
- ✅ Système de niveaux progressifs
- ✅ Objectifs quotidiens/hebdomadaires/mensuels
- ✅ Streaks de connexion
- ✅ Historique des transactions XP
- ✅ Achievements/Badges
- ✅ Statistiques détaillées

---

## 🚀 Installation

### Étape 1 : Exécuter la migration SQL

1. Ouvrez Supabase Dashboard
2. Allez dans **SQL Editor**
3. Copiez le contenu de `database/migration_xp_system.sql`
4. Exécutez le script

Cela créera les tables suivantes :
- `xp_rewards_config` - Configuration des récompenses
- `user_xp_profile` - Profil XP des utilisateurs
- `xp_transactions` - Historique des gains XP
- `user_goals` - Objectifs utilisateur
- `user_achievements` - Badges débloqués

### Étape 2 : Vérifier les API endpoints

Les endpoints suivants sont maintenant disponibles :
- `/api/xp/add` - Ajouter de l'XP
- `/api/xp/profile` - Récupérer le profil XP
- `/api/goals` - Gérer les objectifs
- `/api/statistics` - Statistiques mises à jour

---

## 🏗️ Architecture

### Tables principales

#### `user_xp_profile`
Profil XP de chaque utilisateur
```sql
{
  user_id: UUID,
  total_xp: INTEGER,
  current_level: INTEGER,
  xp_in_current_level: INTEGER,
  total_gold: INTEGER,           // Ajouté avec le système Gold
  daily_streak: INTEGER,
  longest_streak: INTEGER,
  last_activity_date: DATE,
  created_at: TIMESTAMP,         // Horodatage de création
  updated_at: TIMESTAMP          // Horodatage de dernière mise à jour
}
```

#### `xp_rewards_config`
Configuration des récompenses (modifiable en DB)
```sql
{
  action_type: STRING,
  xp_amount: INTEGER,
  gold_amount: INTEGER,          // Ajouté avec le système Gold
  description: TEXT,
  is_active: BOOLEAN
}
```

#### `xp_transactions`
Historique de tous les gains XP et Gold
```sql
{
  user_id: UUID,
  xp_amount: INTEGER,
  gold_earned: INTEGER,          // Ajouté avec le système Gold
  source_type: STRING,
  source_id: STRING,
  description: TEXT,
  created_at: TIMESTAMP
}
```

### Calcul des niveaux

La formule utilisée : `100 * level^1.5`

**Système de niveaux illimité** - Les utilisateurs peuvent progresser indéfiniment.

| Niveau | XP nécessaire | Total XP cumulé | Palier / Titre |
|--------|---------------|-----------------|----------------|
| 1      | 100           | 100             | ⚔️ **Apprenti** (1-5) |
| 2      | 283           | 383             | |
| 3      | 520           | 903             | |
| 4      | 800           | 1,703           | |
| 5      | 1,118         | 2,821           | |
| 6      | 1,470         | 4,291           | 🗡️ **Guerrier** (6-10) |
| 7      | 1,854         | 6,145           | |
| 8      | 2,267         | 8,412           | |
| 9      | 2,708         | 11,120          | |
| 10     | 3,162         | 14,282          | |
| 11     | 3,640         | 17,922          | 🛡️ **Vétéran** (11-20) |
| 15     | 5,809         | 40,050          | |
| 20     | 8,944         | 85,775          | |
| 21     | 9,655         | 95,430          | 👑 **Champion** (21-30) |
| 30     | 16,431        | 218,566         | |
| 31     | 17,266        | 235,832         | ⚡ **Légende** (31-50) |
| 50     | 35,355        | 693,921         | |
| 51+    | ...           | ...             | 🔥 **Maître Absolu** (51+) |

**Paliers de titres :**
- **Niveau 1-5** : ⚔️ Apprenti
- **Niveau 6-10** : 🗡️ Guerrier
- **Niveau 11-20** : 🛡️ Vétéran
- **Niveau 21-30** : 👑 Champion
- **Niveau 31-50** : ⚡ Légende
- **Niveau 51+** : 🔥 Maître Absolu

---

## 🔌 API Endpoints

### POST `/api/xp/add`
Ajouter de l'XP à un utilisateur

**Request Body:**
```json
{
  "actionType": "flashcard_good",
  "sourceId": "card_123",
  "description": "Reviewed word 'bonjour'"
}
```

**Response:**
```json
{
  "success": true,
  "xpGained": 10,
  "totalXp": 450,
  "currentLevel": 3,
  "xpInCurrentLevel": 120,
  "leveledUp": false,
  "streak": 5,
  "longestStreak": 12,
  "achievements": []
}
```

### GET `/api/xp/profile`
Récupérer le profil XP complet

**Response:**
```json
{
  "profile": {
    "totalXp": 450,
    "currentLevel": 3,
    "xpInCurrentLevel": 120,
    "xpForNextLevel": 520,
    "progressPercent": 23,
    "dailyStreak": 5,
    "longestStreak": 12,
    "lastActivityDate": "2025-10-30"
  },
  "stats": {
    "xpToday": 45,
    "xpThisWeek": 230
  },
  "recentTransactions": [...],
  "achievements": [...]
}
```

### GET `/api/goals`
Récupérer les objectifs actifs

**Response:**
```json
{
  "goals": {
    "daily": {
      "id": "...",
      "target_xp": 100,
      "current_xp": 45,
      "is_completed": false,
      "period_start": "2025-10-30",
      "period_end": "2025-10-31"
    },
    "weekly": {...},
    "monthly": {...}
  }
}
```

### POST `/api/goals`
Créer ou mettre à jour un objectif

**Request Body:**
```json
{
  "goalType": "daily",
  "targetXp": 150
}
```

---

## 💡 Utilisation

### 1. Intégration dans les Flashcards

Modifiez `components/games/Flashcards.jsx` :

```javascript
import { useEffect } from 'react'

const handleReview = async (buttonType) => {
  // ... logique existante ...

  // Ajouter l'XP après la révision
  const xpActionTypes = {
    'again': 'flashcard_again',
    'hard': 'flashcard_hard',
    'good': 'flashcard_good',
    'easy': 'flashcard_easy'
  }

  try {
    const response = await fetch('/api/xp/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actionType: xpActionTypes[buttonType],
        sourceId: currentCard.id,
        description: `Reviewed: ${currentCard.word_ru}`
      })
    })

    const data = await response.json()

    if (data.leveledUp) {
      toast.success(`🎉 Niveau ${data.currentLevel} atteint !`)
    }

    // Vérifier les achievements
    data.achievements?.forEach(achievement => {
      if (achievement.type === 'streak_7_days') {
        toast.success('🔥 7 jours de suite !')
      }
    })
  } catch (error) {
    console.error('Error adding XP:', error)
  }
}
```

### 2. Intégration dans les matériaux

Modifiez `features/materials/materialsSlice.js` :

```javascript
.addCase(addMaterialToStudied.fulfilled, async (state, { payload }) => {
  // ... logique existante ...

  // Ajouter de l'XP pour la complétion
  try {
    await fetch('/api/xp/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actionType: 'material_completed',
        sourceId: payload.material_id.toString(),
        description: 'Material completed'
      })
    })
  } catch (error) {
    console.error('Error adding XP:', error)
  }
})
```

### 3. Afficher le profil XP

Créez un composant `components/XPProfile.jsx` :

```javascript
import { useState, useEffect } from 'react'
import { Box, LinearProgress, Typography } from '@mui/material'

export default function XPProfile() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    fetch('/api/xp/profile')
      .then(res => res.json())
      .then(data => setProfile(data.profile))
  }, [])

  if (!profile) return null

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">
        Niveau {profile.currentLevel}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={profile.progressPercent}
        sx={{ height: 10, borderRadius: 5, my: 2 }}
      />
      <Typography>
        {profile.xpInCurrentLevel} / {profile.xpForNextLevel} XP
      </Typography>
      <Typography>
        🔥 Streak: {profile.dailyStreak} jours
      </Typography>
    </Box>
  )
}
```

### 4. Afficher les objectifs

Créez un composant `components/Goals.jsx` :

```javascript
import { useState, useEffect } from 'react'
import { Card, LinearProgress, Typography } from '@mui/material'

export default function Goals() {
  const [goals, setGoals] = useState(null)

  useEffect(() => {
    fetch('/api/goals')
      .then(res => res.json())
      .then(data => setGoals(data.goals))
  }, [])

  if (!goals) return null

  return (
    <div>
      {/* Objectif quotidien */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Objectif quotidien</Typography>
        <LinearProgress
          variant="determinate"
          value={(goals.daily.current_xp / goals.daily.target_xp) * 100}
        />
        <Typography>
          {goals.daily.current_xp} / {goals.daily.target_xp} XP
        </Typography>
      </Card>

      {/* Objectif hebdomadaire */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Objectif hebdomadaire</Typography>
        <LinearProgress
          variant="determinate"
          value={(goals.weekly.current_xp / goals.weekly.target_xp) * 100}
        />
        <Typography>
          {goals.weekly.current_xp} / {goals.weekly.target_xp} XP
        </Typography>
      </Card>
    </div>
  )
}
```

---

## ⚙️ Configuration XP

Les récompenses XP sont configurables dans la table `xp_rewards_config`.

**Note importante** : Les gains d'XP ont été réduits de 5x pour encourager un apprentissage progressif et régulier.

### Philosophie du système XP

Le système XP récompense **l'apprentissage actif et l'engagement régulier** :
- ✅ **Récompensé** : Actions d'apprentissage (réviser, terminer des matériaux), objectifs atteints, engagement régulier (streaks)
- ❌ **Non récompensé** : Actions passives, milestones de session sans effort réel (20 cartes, 50 cartes)
- 💡 **Les bonus** : Les streaks et objectifs donnent des bonus représentant ~15-20% de l'effort total investi

### Actions disponibles

#### Flashcards
| Action | XP | Description |
|--------|-------|-------------|
| `flashcard_again` | 0 | ⚠️ Carte revue (Again) - Pas de récompense |
| `flashcard_hard` | 1 | Carte difficile (Hard) |
| `flashcard_good` | 2 | Bonne réponse (Good) |
| `flashcard_easy` | 3 | Réponse facile (Easy) |
| `card_graduated` | 5 | Carte passe en REVIEW |
| `perfect_session` | 20 | Session parfaite |
| `session_20_cards` | 0 | ⚠️ 20 cartes complétées - Pas de récompense |
| `session_50_cards` | 0 | ⚠️ 50 cartes complétées - Pas de récompense |

**Règles spéciales** :
- Le bouton "Encore" (Again) ne donne pas d'XP pour encourager une meilleure mémorisation
- Les milestones de session (20, 50 cartes) ne donnent pas d'XP - l'XP vient des cartes individuelles

#### Matériaux
| Action | XP | Description |
|--------|-------|-------------|
| `material_started` | 2 | Matériau commencé |
| `material_completed` | 10 | Matériau terminé |
| `book_chapter_read` | 5 | Chapitre de livre lu |
| `book_completed` | 30 | Livre complet terminé |

#### Vocabulaire
| Action | XP | Description |
|--------|-------|-------------|
| `word_added` | 1 | Mot ajouté au dictionnaire |
| `mastered_100_words` | 40 | 100 mots maîtrisés |
| `mastered_500_words` | 100 | 500 mots maîtrisés |

#### Engagement
| Action | XP | Gold | Description |
|--------|-------|------|-------------|
| `daily_login` | 2 | 0 | Première connexion du jour |
| `daily_goal_achieved` | 0 | **1** | 🎯 Objectif quotidien atteint (Gold uniquement) |
| `weekly_goal_achieved` | 0 | **3** | 🎯 Objectif hebdomadaire atteint (Gold uniquement) |
| `monthly_goal_achieved` | 0 | **10** | 🎯 Objectif mensuel atteint (Gold uniquement) |

**Note** : Les objectifs ne donnent **que de l'or**, pas d'XP. Cela encourage la constance sans gonfler artificiellement l'XP.

#### Streaks
| Action | XP | Description | Effort total |
|--------|-------|-------------|--------------|
| `streak_3_days` | 10 | 🔥 3 jours d'engagement consécutif | ~60 XP sur 3j (15% bonus) |
| `streak_7_days` | 25 | 🔥 7 jours d'engagement consécutif | ~140 XP sur 7j (18% bonus) |
| `streak_30_days` | 100 | 🔥 30 jours d'engagement consécutif | ~600 XP sur 30j (17% bonus) |

**Note** : Les streaks récompensent l'engagement régulier dans le temps. Un utilisateur qui maintient un streak de 30 jours a investi des heures d'apprentissage et mérite une récompense significative.

### Modifier les valeurs XP

Exécutez cette requête SQL dans Supabase :

```sql
UPDATE xp_rewards_config
SET xp_amount = 20
WHERE action_type = 'flashcard_good';
```

---

## 🎨 Exemples d'intégration

### Exemple 1 : Notification de niveau up

```javascript
const addXP = async (actionType, sourceId) => {
  const response = await fetch('/api/xp/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actionType, sourceId })
  })

  const data = await response.json()

  if (data.leveledUp) {
    // Afficher une animation ou modal
    showLevelUpAnimation(data.currentLevel)
  }

  return data
}
```

### Exemple 2 : Badge pour streak

```javascript
useEffect(() => {
  fetch('/api/xp/profile')
    .then(res => res.json())
    .then(data => {
      const streak = data.profile.dailyStreak

      if (streak >= 7) {
        // Débloquer badge
        unlockAchievement('streak_master')
      }
    })
}, [])
```

### Exemple 3 : Progression en temps réel

```javascript
const [xpProfile, setXpProfile] = useState(null)

// Rafraîchir après chaque action
const refreshXP = async () => {
  const res = await fetch('/api/xp/profile')
  const data = await res.json()
  setXpProfile(data.profile)
}

// Appeler après chaque gain d'XP
await addXP('flashcard_good', cardId)
await refreshXP()
```

---

## 🐛 Troubleshooting

### Problème : Les objectifs ne se mettent pas à jour

Vérifiez que la fonction `update_user_goals_progress` a bien été créée :

```sql
SELECT routine_name
FROM information_schema.routines
WHERE routine_name = 'update_user_goals_progress';
```

### Problème : Les niveaux ne calculent pas correctement

Testez la fonction de calcul :

```sql
SELECT * FROM calculate_level_from_xp(1500);
```

### Problème : Les statistiques sont vides

Vérifiez que la table `user_materials` contient des données :

```sql
SELECT COUNT(*) FROM user_materials WHERE user_id = 'YOUR_USER_ID';
```

---

## 📊 Prochaines étapes

1. ✅ Migration SQL exécutée
2. ✅ API endpoints créés
3. 🔲 Intégrer XP dans les flashcards
4. 🔲 Intégrer XP dans les matériaux
5. 🔲 Créer UI pour afficher le profil XP
6. 🔲 Créer UI pour les objectifs
7. 🔲 Ajouter animations de niveau up
8. 🔲 Créer système de badges visuels
9. 🔲 Ajouter leaderboard (classement)

---

## 📝 Notes

- Les streaks se réinitialisent automatiquement si l'utilisateur ne se connecte pas pendant 2 jours
- Les objectifs expirent automatiquement et de nouveaux sont créés
- L'XP est calculé côté serveur pour éviter la triche
- Toutes les transactions XP sont enregistrées dans l'historique

---

**Bon courage pour l'intégration ! 🚀**
