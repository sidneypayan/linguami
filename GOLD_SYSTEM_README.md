# 💰 Système d'Or (Gold) - Linguami

## 📋 Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Installation](#installation)
3. [Architecture](#architecture)
4. [API Endpoints](#api-endpoints)
5. [Utilisation](#utilisation)
6. [Configuration Gold](#configuration-gold)
7. [Exemples d'intégration](#exemples-dintégration)

---

## 🎯 Vue d'ensemble

Le système d'or de Linguami complète le système XP en offrant une monnaie virtuelle que les utilisateurs peuvent accumuler et utiliser pour :
- Débloquer des fonctionnalités premium
- Acheter des items dans la boutique (future fonctionnalité)
- Personnaliser leur expérience d'apprentissage
- Récompenser les accomplissements majeurs

### Différence entre XP et Gold

- **XP** : Mesure de la progression et du niveau. Gagné fréquemment pour toutes les activités.
- **Gold** : Monnaie rare. Gagné uniquement pour les accomplissements significatifs et peut être dépensé.

### Fonctionnalités principales
- ✅ Monnaie virtuelle accumulable
- ✅ Gains pour accomplissements majeurs
- ✅ Historique des transactions dans `xp_transactions`
- ✅ Intégration avec le système XP existant
- 🔲 Boutique d'items (à venir)
- 🔲 Fonctionnalités premium débloquables (à venir)

---

## 🚀 Installation

### Étape 1 : Exécuter la migration SQL

1. Ouvrez Supabase Dashboard
2. Allez dans **SQL Editor**
3. Copiez le contenu de `database/migration_gold_system.sql`
4. Exécutez le script

Cela ajoutera les colonnes suivantes aux tables existantes :
- `user_xp_profile.total_gold` - Total d'or accumulé
- `xp_rewards_config.gold_amount` - Quantité d'or pour chaque action
- `xp_transactions.gold_earned` - Or gagné dans chaque transaction

### Étape 2 : Vérifier l'intégration

Les API endpoints existants sont automatiquement mis à jour :
- `/api/xp/add` - Ajoute maintenant de l'or ET de l'XP
- `/api/xp/profile` - Inclut maintenant le total d'or

---

## 🏗️ Architecture

### Colonnes principales

#### `user_xp_profile.total_gold`
Total d'or accumulé par l'utilisateur
```sql
{
  total_gold: INTEGER DEFAULT 0
}
```

#### `xp_rewards_config.gold_amount`
Quantité d'or attribuée pour chaque type d'action
```sql
{
  gold_amount: INTEGER DEFAULT 0
}
```

#### `xp_transactions.gold_earned`
Or gagné dans chaque transaction (historique)
```sql
{
  gold_earned: INTEGER DEFAULT 0
}
```

### Philosophie de distribution de l'or

L'or est beaucoup plus rare que l'XP (environ 50-100x plus rare) et récompense les **accomplissements significatifs**, pas les actions répétitives :
- **0 gold** : Actions répétitives individuelles (toutes les flashcards individuelles, word_added)
- **1-2 gold** : Actions quotidiennes significatives (login, objectif quotidien)
- **3-5 gold** : Accomplissements notables (session parfaite, matériau complété, streak 3 jours)
- **8-15 gold** : Accomplissements majeurs (streak 7 jours, objectif mensuel)
- **30 gold** : Accomplissements exceptionnels (streak 30 jours complet)

**Principe clé** : On ne peut pas "farmer" l'or facilement. Il faut un engagement réel dans le temps.

---

## 🔌 API Endpoints

### POST `/api/xp/add`
Ajouter de l'XP ET de l'or à un utilisateur

**Request Body:**
```json
{
  "actionType": "flashcard_good",
  "sourceId": "card_123",
  "description": "Reviewed word 'bonjour'"
}
```

**Response (mis à jour avec gold):**
```json
{
  "success": true,
  "xpGained": 2,
  "goldGained": 1,
  "totalXp": 450,
  "totalGold": 125,
  "currentLevel": 3,
  "xpInCurrentLevel": 120,
  "leveledUp": false,
  "streak": 5,
  "longestStreak": 12,
  "achievements": []
}
```

### GET `/api/xp/profile`
Récupérer le profil XP et Gold complet

**Response (mis à jour avec gold):**
```json
{
  "profile": {
    "totalXp": 450,
    "totalGold": 125,
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
    "xpThisWeek": 230,
    "goldToday": 8,
    "goldThisWeek": 45
  },
  "recentTransactions": [...],
  "achievements": [...]
}
```

---

## 💡 Utilisation

### 1. Afficher l'or dans l'interface utilisateur

Créez un composant `components/GoldDisplay.jsx` :

```javascript
import { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'

export default function GoldDisplay() {
  const [gold, setGold] = useState(0)

  useEffect(() => {
    fetch('/api/xp/profile')
      .then(res => res.json())
      .then(data => setGold(data.profile.totalGold))
  }, [])

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="h6">💰</Typography>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FFD700' }}>
        {gold.toLocaleString()}
      </Typography>
    </Box>
  )
}
```

### 2. Notification de gain d'or

Modifiez `components/games/Flashcards.jsx` pour afficher les gains d'or :

```javascript
const xpData = await xpResponse.json()

// Show gold notification
if (xpData.goldGained > 0) {
  toast.success(`💰 +${xpData.goldGained} gold`, {
    position: 'bottom-right',
    autoClose: 2000
  })
}
```

### 3. Historique des transactions avec or

L'API `/api/xp/profile` retourne maintenant les transactions avec le champ `gold_earned` :

```javascript
{
  "recentTransactions": [
    {
      "id": "...",
      "xp_amount": 2,
      "gold_earned": 1,
      "source_type": "flashcard_good",
      "description": "Reviewed: bonjour",
      "created_at": "2025-10-30T10:30:00Z"
    }
  ]
}
```

---

## ⚙️ Configuration Gold

Les récompenses en or sont configurables dans la table `xp_rewards_config`.

**Philosophie** : L'or est environ 50-100x plus rare que l'XP pour créer un sentiment de valeur et d'accomplissement.

### Actions disponibles

#### Flashcards
| Action | XP | Gold | Ratio XP:Gold | Notes |
|--------|-----|------|---------------|-------|
| `flashcard_again` | 0 | 0 | - | Pas de récompense |
| `flashcard_hard` | 1 | 0 | - | Pas d'or pour actions répétitives |
| `flashcard_good` | 2 | 0 | - | XP seulement |
| `flashcard_easy` | 3 | 0 | - | XP seulement |
| `perfect_session` | 20 | 5 | 4:1 | Seule les sessions parfaites donnent de l'or |
| `session_20_cards` | 0 | 0 | - | Pas de récompense |
| `session_50_cards` | 0 | 0 | - | Pas de récompense |

**Principe** : Les cartes individuelles ne donnent plus d'or (trop facile à farmer). Seule une session parfaite est récompensée.

#### Matériaux
| Action | XP | Gold | Ratio XP:Gold | Notes |
|--------|-----|------|---------------|-------|
| `material_started` | 2 | 1 | 2:1 | Encourager à explorer |
| `material_completed` | 10 | 5 | 2:1 | Accomplissement significatif |
| `book_chapter_read` | 5 | - | - | Non implémenté |
| `book_completed` | 30 | - | - | Non implémenté |

#### Activités H5P
| Action | XP | Gold | Ratio XP:Gold | Notes |
|--------|-----|------|---------------|-------|
| `h5p_activity_completed` | 4 | 2 | 2:1 | Activité complétée |

#### Vocabulaire
| Action | XP | Gold | Ratio XP:Gold | Notes |
|--------|-----|------|---------------|-------|
| `word_added` | 1 | 0 | - | Action simple, pas d'or |

#### Engagement quotidien
| Action | XP | Gold | Ratio XP:Gold | Notes |
|--------|-----|------|---------------|-------|
| `daily_login` | 2 | 1 | 2:1 | Récompense quotidienne |
| `daily_goal_achieved` | 10 | 2 | 5:1 | Bonus objectif quotidien |
| `weekly_goal_achieved` | 30 | 5 | 6:1 | Bonus objectif hebdomadaire |
| `monthly_goal_achieved` | 100 | 15 | 6.7:1 | Bonus objectif mensuel |

#### Streaks (meilleurs ratios pour l'engagement)
| Action | XP | Gold | Ratio XP:Gold | Notes |
|--------|-----|------|---------------|-------|
| `streak_3_days` | 10 | 3 | 3.3:1 | 3 jours consécutifs |
| `streak_7_days` | 25 | 8 | 3.1:1 | 1 semaine complète |
| `streak_30_days` | 100 | 30 | 3.3:1 | 1 mois complet - très rare ! |

**Note** : Les streaks ont les meilleurs ratios XP:Gold car ils représentent un engagement dans le temps difficile à maintenir.

### Économie attendue avec ce système

**Utilisateur actif (20 XP/jour)** :
- Login quotidien : 1 gold
- Objectif quotidien atteint : 2 gold
- Activités (matériaux, H5P) : ~1-3 gold
- **Total par jour** : ~3-6 gold

**Sur un mois (utilisateur régulier)** :
- Actions quotidiennes : ~90-120 gold
- Objectif hebdomadaire (x4) : 20 gold
- Objectif mensuel : 15 gold
- Streak 30 jours : 30 gold (bonus exceptionnel)
- **Total mensuel** : ~125-185 gold

**Prix recommandés pour la boutique future** :
- Items cosmétiques simples : 50-100 gold
- Fonctionnalités premium temporaires : 150-300 gold
- Items rares/exclusifs : 500-1000 gold

### Modifier les valeurs d'or

Exécutez cette requête SQL dans Supabase :

```sql
UPDATE xp_rewards_config
SET gold_amount = 3
WHERE action_type = 'flashcard_good';
```

Ou pour voir toutes les configurations actuelles :

```sql
SELECT action_type, xp_amount, gold_amount, description
FROM xp_rewards_config
ORDER BY gold_amount DESC;
```

---

## 🎨 Exemples d'intégration

### Exemple 1 : Afficher les gains dans les notifications

```javascript
const addXP = async (actionType, sourceId) => {
  const response = await fetch('/api/xp/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actionType, sourceId })
  })

  const data = await response.json()

  // Show combined notification
  if (data.goldGained > 0) {
    toast.success(
      `+${data.xpGained} XP, +${data.goldGained} 💰`,
      { position: 'bottom-right' }
    )
  } else {
    toast.success(`+${data.xpGained} XP`)
  }

  return data
}
```

### Exemple 2 : Barre de statut avec XP et Gold

```javascript
import { Box, LinearProgress, Typography } from '@mui/material'

export default function UserStatus({ profile }) {
  return (
    <Box>
      {/* XP Progress */}
      <Box>
        <Typography>Niveau {profile.currentLevel}</Typography>
        <LinearProgress
          variant="determinate"
          value={profile.progressPercent}
        />
        <Typography>
          {profile.xpInCurrentLevel} / {profile.xpForNextLevel} XP
        </Typography>
      </Box>

      {/* Gold Display */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
        <Typography variant="h5">💰</Typography>
        <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
          {profile.totalGold.toLocaleString()}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          gold
        </Typography>
      </Box>
    </Box>
  )
}
```

### Exemple 3 : Historique des transactions avec gold

```javascript
export default function TransactionHistory({ transactions }) {
  return (
    <div>
      {transactions.map(tx => (
        <div key={tx.id} className="transaction-item">
          <span>{tx.description}</span>
          <div className="rewards">
            <span className="xp">+{tx.xp_amount} XP</span>
            {tx.gold_earned > 0 && (
              <span className="gold">+{tx.gold_earned} 💰</span>
            )}
          </div>
          <span className="date">{formatDate(tx.created_at)}</span>
        </div>
      ))}
    </div>
  )
}
```

### Exemple 4 : Système de boutique (à implémenter)

```javascript
// Future implementation
const shopItems = [
  {
    id: 'theme_dark',
    name: 'Thème Sombre',
    cost: 100,
    icon: '🌙'
  },
  {
    id: 'avatar_frame',
    name: 'Cadre d\'avatar doré',
    cost: 250,
    icon: '🖼️'
  },
  {
    id: 'unlimited_hints',
    name: 'Indices illimités (1 mois)',
    cost: 500,
    icon: '💡'
  }
]

async function purchaseItem(itemId, cost) {
  // Vérifier si l'utilisateur a assez d'or
  const profile = await fetch('/api/xp/profile').then(r => r.json())

  if (profile.profile.totalGold < cost) {
    toast.error('Pas assez d\'or !')
    return
  }

  // Déduire l'or et débloquer l'item
  await fetch('/api/shop/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId })
  })

  toast.success('Item acheté !')
}
```

---

## 🐛 Troubleshooting

### Problème : L'or n'est pas attribué

Vérifiez que la colonne `gold_amount` existe :

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'xp_rewards_config'
  AND column_name = 'gold_amount';
```

### Problème : Le total d'or ne s'affiche pas

Vérifiez que la colonne `total_gold` existe dans `user_xp_profile` :

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'user_xp_profile'
  AND column_name = 'total_gold';
```

### Problème : Les anciennes transactions n'ont pas de gold

C'est normal - seules les nouvelles transactions après la migration auront un `gold_earned`. Les anciennes transactions auront `gold_earned = 0` par défaut.

---

## 📊 Prochaines étapes

1. ✅ Migration SQL exécutée
2. ✅ API endpoints mis à jour automatiquement
3. 🔲 Créer UI pour afficher l'or dans le header
4. 🔲 Ajouter notifications de gain d'or
5. 🔲 Créer page de boutique
6. 🔲 Implémenter système d'achat
7. 🔲 Créer items achetables (thèmes, avatars, bonus)
8. 🔲 Ajouter leaderboard par or
9. 🔲 Implémenter système de dépenses d'or

---

## 📝 Notes importantes

### Équilibre XP vs Gold

- **XP** : Donné généreusement pour toute activité. Ne peut pas être dépensé. Sert uniquement à monter de niveau.
- **Gold** : Rare et précieux. Peut être dépensé. Créé une économie dans l'application.

### Ratios XP:Gold appliqués

Le système utilise des ratios variables selon le type d'action :

- **Actions répétitives** : ∞:0 (XP seulement, pas d'or) - ex: flashcards individuelles
- **Actions quotidiennes** : 2:1 (2 XP = 1 Gold) - ex: login, matériaux
- **Accomplissements** : 4:1 à 6:1 - ex: perfect_session, objectifs
- **Engagement à long terme** : 3:1 (meilleur ratio) - ex: streaks

**Pourquoi ces ratios ?**
- Les actions répétitives ne donnent pas d'or pour éviter le "farming"
- Les accomplissements significatifs ont de meilleurs ratios
- Les streaks ont les meilleurs ratios car ils sont difficiles à maintenir

Cela crée une économie où :
- L'or est suffisamment rare pour avoir de la valeur (50-100x plus rare que l'XP)
- Les utilisateurs doivent s'engager dans le temps pour accumuler de l'or
- Les items de la boutique peuvent être prix entre 50-1000 gold selon leur valeur

### Éviter l'inflation

⚠️ **Attention** : Ne donnez pas trop d'or ! L'or doit rester rare pour maintenir son intérêt. Si les utilisateurs accumulent trop d'or trop vite, le système perd de son attrait.

Règles :
- Actions répétables infiniment (flashcards) = peu ou pas d'or (0-1 gold)
- Actions quotidiennes limitées (login) = or modéré (2-5 gold)
- Accomplissements majeurs uniques = beaucoup d'or (10-50 gold)

---

**Bon courage pour l'intégration du système d'or ! 💰**
