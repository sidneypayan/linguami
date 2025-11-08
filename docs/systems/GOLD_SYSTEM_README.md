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

L'or utilise un **ratio uniforme de 10:1** (10 XP = 1 Gold) pour toutes les activités :
- **0 gold** : Actions donnant moins de 10 XP (flashcards individuelles, word_added, login quotidien)
- **1 gold** : Actions de 10-19 XP (objectif quotidien, matériau complété, streak 3 jours)
- **2-3 gold** : Accomplissements de 20-39 XP (session parfaite, streak 7 jours, objectifs hebdomadaires)
- **4-10 gold** : Accomplissements majeurs de 40-100 XP (mastered words, objectifs mensuels, streak 30 jours)

**Principe clé** : Ratio simple et constant de 10:1 - l'or reste rare car calculé automatiquement depuis l'XP.

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

**Philosophie** : L'or utilise un **ratio uniforme de 10:1** (10 XP = 1 Gold) pour toutes les activités, calculé automatiquement.

### Actions disponibles

#### Flashcards
| Action | XP | Gold | Ratio | Notes |
|--------|-----|------|-------|-------|
| `flashcard_again` | 0 | 0 | 10:1 | Pas de récompense |
| `flashcard_hard` | 1 | 0 | 10:1 | < 10 XP, donc 0 gold |
| `flashcard_good` | 2 | 0 | 10:1 | < 10 XP, donc 0 gold |
| `flashcard_easy` | 3 | 0 | 10:1 | < 10 XP, donc 0 gold |
| `card_graduated` | 5 | 0 | 10:1 | < 10 XP, donc 0 gold |
| `perfect_session` | 20 | 2 | 10:1 | Session parfaite récompensée |
| `session_20_cards` | 0 | 0 | 10:1 | Pas de récompense |
| `session_50_cards` | 0 | 0 | 10:1 | Pas de récompense |

#### Matériaux
| Action | XP | Gold | Ratio | Notes |
|--------|-----|------|-------|-------|
| `material_started` | 2 | 0 | 10:1 | < 10 XP, donc 0 gold |
| `material_completed` | 10 | 1 | 10:1 | Accomplissement significatif |
| `book_chapter_read` | 5 | 0 | 10:1 | < 10 XP, donc 0 gold |
| `book_completed` | 30 | 3 | 10:1 | Livre complet |

#### Activités H5P
| Action | XP | Gold | Ratio | Notes |
|--------|-----|------|-------|-------|
| `h5p_activity_completed` | 4 | 0 | 10:1 | < 10 XP, donc 0 gold |

#### Vocabulaire
| Action | XP | Gold | Ratio | Notes |
|--------|-----|------|-------|-------|
| `word_added` | 1 | 0 | 10:1 | < 10 XP, donc 0 gold |
| `mastered_100_words` | 40 | 4 | 10:1 | Accomplissement majeur |
| `mastered_500_words` | 100 | 10 | 10:1 | Grand accomplissement |

#### Engagement quotidien
| Action | XP | Gold | Ratio | Notes |
|--------|-----|------|-------|-------|
| `daily_login` | 2 | 0 | 10:1 | < 10 XP, donc 0 gold |
| `daily_goal_achieved` | 10 | 1 | 10:1 | Objectif quotidien atteint |
| `weekly_goal_achieved` | 30 | 3 | 10:1 | Objectif hebdomadaire |
| `monthly_goal_achieved` | 100 | 10 | 10:1 | Objectif mensuel |

#### Streaks
| Action | XP | Gold | Ratio | Notes |
|--------|-----|------|-------|-------|
| `streak_3_days` | 10 | 1 | 10:1 | 3 jours consécutifs |
| `streak_7_days` | 25 | 2 | 10:1 | 1 semaine complète |
| `streak_30_days` | 100 | 10 | 10:1 | 1 mois complet - très rare ! |

#### Progression
| Action | XP | Gold | Ratio | Notes |
|--------|-----|------|-------|-------|
| `level_up` | 30 | 3 | 10:1 | Niveau supérieur |
| `first_material_per_section` | 8 | 0 | 10:1 | < 10 XP, donc 0 gold |
| `all_sections_tried` | 40 | 4 | 10:1 | Toutes sections explorées |

**Note** : Ratio uniforme et simple - tout est calculé automatiquement avec `Math.floor(xp / 10)`.

### Économie attendue avec ce système (ratio 10:1)

**Utilisateur actif (20 XP/jour)** :
- Login quotidien : 0 gold (2 XP < 10)
- Objectif quotidien atteint : 1 gold (10 XP)
- Activités (matériaux, révisions) : ~1 gold (10 XP pour material_completed)
- **Total par jour** : ~2 gold

**Sur un mois (utilisateur régulier)** :
- Actions quotidiennes : ~30-60 gold
- Objectif hebdomadaire (x4) : 12 gold (30 XP × 4)
- Objectif mensuel : 10 gold (100 XP)
- Streak 30 jours : 10 gold (100 XP bonus)
- **Total mensuel** : ~52-92 gold

**Prix recommandés pour la boutique future** :
- Items cosmétiques simples : 25-50 gold
- Fonctionnalités premium temporaires : 75-150 gold
- Items rares/exclusifs : 250-500 gold

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

### Ratio XP:Gold appliqué

Le système utilise un **ratio uniforme de 10:1** pour toutes les actions :

- **Ratio unique** : 10 XP = 1 Gold (calculé avec `Math.floor(xp / 10)`)
- **Actions < 10 XP** : Donnent 0 gold - ex: flashcards individuelles, login quotidien
- **Actions ≥ 10 XP** : Donnent gold proportionnellement - ex: 10 XP = 1 gold, 20 XP = 2 gold, 100 XP = 10 gold

**Avantages de ce système :**
- Simplicité : un seul ratio facile à comprendre
- Prévisibilité : les utilisateurs savent exactement combien d'or ils gagneront
- Équité : tous les types d'actions utilisent le même calcul
- Automatique : pas besoin de configurer manuellement les montants d'or

Cela crée une économie où :
- L'or est environ 10x plus rare que l'XP
- Les petites actions (< 10 XP) ne donnent pas d'or, évitant le "farming"
- Les items de la boutique peuvent être prix entre 25-500 gold selon leur valeur

### Éviter l'inflation

Avec le ratio 10:1, l'inflation est naturellement contrôlée :

✅ **Avantages du ratio 10:1 :**
- Actions répétables (< 10 XP) ne donnent pas d'or → évite le farming
- Seuls les accomplissements significatifs (≥ 10 XP) donnent de l'or
- Ratio automatique → cohérence garantie pour toutes les actions
- L'or reste suffisamment rare (~10x plus rare que l'XP)

📊 **Contrôle naturel :**
- Actions < 10 XP = 0 gold (flashcards individuelles, login)
- Actions 10-20 XP = 1-2 gold (objectifs quotidiens, matériaux)
- Actions 20-100 XP = 2-10 gold (objectifs hebdo/mensuels, streaks)

---

**Bon courage pour l'intégration du système d'or ! 💰**
