# XP & Gamification System

## Overview

Linguami uses an XP (Experience Points) and gamification system to motivate users and track progress.

**Database:** `user_xp_profile`, `xp_rewards_config`, `xp_transactions`

## XP Components

### user_xp_profile

Stores user's XP and gamification data:

```javascript
{
  user_id: uuid,
  total_xp: 1250,           // All-time XP
  current_level: 5,         // Level based on total_xp
  daily_streak: 7,          // Consecutive days of activity
  total_gold: 450,          // Gold currency
  weekly_xp: 120,           // XP earned this week
  monthly_xp: 680,          // XP earned this month
  last_activity_date: '2025-01-10'
}
```

### xp_rewards_config

Defines XP amounts for each action:

| Action | XP Amount | Description |
|--------|-----------|-------------|
| material_started | 5 | Start studying a material |
| material_completed | 15 | Complete a material |
| word_added | 2 | Add word to dictionary |
| exercise_completed | 10-15 | Complete exercise (100% score) |
| lesson_completed | 10 | Complete course lesson |
| daily_goal | 50 | Meet daily XP goal |
| weekly_goal | 100 | Meet weekly XP goal |
| monthly_goal | 500 | Meet monthly XP goal |

### xp_transactions

Transaction log for XP changes:

```javascript
{
  id: integer,
  user_id: uuid,
  action: 'lesson_completed',
  xp_amount: 10,
  related_entity_type: 'course_lesson',
  related_entity_id: 42,
  created_at: timestamp
}
```

## Awarding XP

### Server Function: add_xp

**Database function:** `add_xp(p_user_id, p_xp_amount, p_action)`

Updates user's XP and creates transaction:

```sql
CREATE OR REPLACE FUNCTION add_xp(
  p_user_id UUID,
  p_xp_amount INTEGER,
  p_action TEXT
)
RETURNS void AS $$
BEGIN
  -- Update user_xp_profile
  UPDATE user_xp_profile
  SET
    total_xp = total_xp + p_xp_amount,
    weekly_xp = weekly_xp + p_xp_amount,
    monthly_xp = monthly_xp + p_xp_amount,
    last_activity_date = CURRENT_DATE
  WHERE user_id = p_user_id;

  -- Create transaction
  INSERT INTO xp_transactions (user_id, action, xp_amount, created_at)
  VALUES (p_user_id, p_action, p_xp_amount, NOW());

  -- Update level if needed
  -- (separate function calculates level from total_xp)
END;
$$ LANGUAGE plpgsql;
```

### API Route: /api/xp/add

Award XP from client:

```javascript
// pages/api/xp/add.js
export default async function handler(req, res) {
  const { action, relatedEntityId } = req.body
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Get XP amount for action
  const { data: config } = await supabase
    .from('xp_rewards_config')
    .select('xp_amount')
    .eq('action', action)
    .single()

  if (!config) {
    return res.status(400).json({ error: 'Invalid action' })
  }

  // Award XP
  await supabase.rpc('add_xp', {
    p_user_id: user.id,
    p_xp_amount: config.xp_amount,
    p_action: action
  })

  res.json({
    success: true,
    xpAwarded: config.xp_amount,
    action
  })
}
```

### Component Usage

```javascript
import { toast } from 'react-toastify'

async function awardXP(action) {
  try {
    const response = await fetch('/api/xp/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    })

    const data = await response.json()

    if (data.success) {
      toast.success(`+${data.xpAwarded} XP`)
    }
  } catch (error) {
    console.error('Failed to award XP:', error)
  }
}

// When user completes lesson
const handleLessonComplete = async () => {
  await markLessonComplete(lessonId)
  await awardXP('lesson_completed')
}
```

## Leveling System

### Level Calculation

Exponential XP requirements:

```javascript
// Level formula: 100 * level^2
function getXPForLevel(level) {
  return 100 * Math.pow(level, 2)
}

// Level 1: 100 XP
// Level 2: 400 XP (total)
// Level 3: 900 XP (total)
// Level 4: 1600 XP (total)
// Level 5: 2500 XP (total)
// ...
```

### Current Level

Calculate level from total XP:

```javascript
function getLevelFromXP(totalXP) {
  let level = 1
  while (getXPForLevel(level + 1) <= totalXP) {
    level++
  }
  return level
}
```

### Level Progress

Show progress bar to next level:

```javascript
function getLevelProgress(totalXP) {
  const currentLevel = getLevelFromXP(totalXP)
  const currentLevelXP = getXPForLevel(currentLevel)
  const nextLevelXP = getXPForLevel(currentLevel + 1)

  const xpIntoLevel = totalXP - currentLevelXP
  const xpNeeded = nextLevelXP - currentLevelXP
  const percentage = (xpIntoLevel / xpNeeded) * 100

  return {
    currentLevel,
    xpIntoLevel,
    xpNeeded,
    percentage
  }
}

// Example:
// totalXP: 1250
// currentLevel: 4 (requires 1600 XP)
// xpIntoLevel: 1250 - 900 = 350
// xpNeeded: 1600 - 900 = 700
// percentage: 50%
```

### Level-Up Notification

Show achievement when user levels up:

```javascript
import toast from '@/utils/toast'

// After awarding XP, check if leveled up
const oldLevel = userProfile.current_level

await awardXP('lesson_completed')

// Refetch profile
const { data: updatedProfile } = await supabase
  .from('users_profile')
  .select('*, user_xp_profile(*)')
  .eq('id', userId)
  .single()

const newLevel = updatedProfile.user_xp_profile.current_level

if (newLevel > oldLevel) {
  toast.success(
    <AchievementNotification
      title={t('achievement_level_up_title')}
      description={t('achievement_level_up_desc', { level: newLevel })}
      icon="🎉"
    />
  )
}
```

## Daily Streak

### Tracking

- Updates on any XP-earning action
- `last_activity_date` in `user_xp_profile`

### Calculation

```javascript
function updateStreak(lastActivityDate, currentStreak) {
  const today = new Date()
  const lastActivity = new Date(lastActivityDate)

  // Calculate days difference
  const diffTime = today - lastActivity
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    // Same day - no change
    return currentStreak
  } else if (diffDays === 1) {
    // Consecutive day - increment
    return currentStreak + 1
  } else {
    // Broke streak - reset
    return 1
  }
}
```

### Streak Milestones

Show achievements for streak milestones:

```javascript
const streakMilestones = [7, 14, 30, 50, 100, 365]

if (streakMilestones.includes(newStreak)) {
  toast.success(
    <AchievementNotification
      title={t('achievement_streak_title')}
      description={t('achievement_streak_desc', { days: newStreak })}
      icon="🔥"
    />
  )
}
```

## Gold Currency

### Earning Gold

Gold is earned from goals:
- Daily goal: +50 gold
- Weekly goal: +100 gold
- Monthly goal: +500 gold

### Using Gold

Future features:
- Buy avatar items
- Unlock themes
- Purchase hints
- Skip wait times

## Leaderboard

### Global Leaderboard

**API:** `/api/leaderboard/index.js`

**Tabs:**
1. **Total XP** - All-time leaderboard
2. **Weekly XP** - This week's top earners
3. **Monthly XP** - This month's top earners
4. **Gold** - Total gold earned
5. **Streak** - Longest current streak

### Query

```javascript
// pages/api/leaderboard/index.js
export default async function handler(req, res) {
  const { type } = req.query  // 'total' | 'weekly' | 'monthly' | 'gold' | 'streak'

  const orderBy = {
    total: 'total_xp',
    weekly: 'weekly_xp',
    monthly: 'monthly_xp',
    gold: 'total_gold',
    streak: 'daily_streak'
  }[type]

  const { data } = await supabase
    .from('user_xp_profile')
    .select(`
      *,
      users_profile (name, avatar_id)
    `)
    .order(orderBy, { ascending: false })
    .limit(100)

  res.json(data)
}
```

### User's Rank

Show user their position:

```javascript
// Get user's rank
const { data: rank } = await supabase.rpc('get_user_rank', {
  p_user_id: userId,
  p_type: 'total'  // 'total' | 'weekly' | 'monthly'
})

// Display
<div>Your ranking: #{rank}</div>
```

## Achievement Notifications

### Component

**Location:** `/components/shared/AchievementNotification.jsx`

```javascript
function AchievementNotification({ title, description, icon }) {
  return (
    <div className="achievement">
      <div className="icon">{icon}</div>
      <div className="content">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  )
}
```

### Usage with toast

```javascript
import toast from '@/utils/toast'
import useTranslation from 'next-translate/useTranslation'

function showAchievement() {
  const { t } = useTranslation('common')

  toast.success(
    <AchievementNotification
      title={t('achievement_level_up_title')}
      description={t('achievement_level_up_desc', { level: 5 })}
      icon="🎉"
    />,
    { duration: 5000 }
  )
}
```

### Achievement Types

**Level up:**
```javascript
{
  title: "achievement_level_up_title",   // "Nouveau niveau !"
  description: "achievement_level_up_desc",  // "Vous avez atteint le niveau {{level}} !"
  icon: "🎉"
}
```

**Daily goal:**
```javascript
{
  title: "achievement_daily_goal_title",     // "Objectif quotidien atteint !"
  description: "achievement_daily_goal_desc",   // "Vous avez gagné {{gold}} pièces d'or !"
  icon: "⭐"
}
```

**Streak milestone:**
```javascript
{
  title: "achievement_streak_title",         // "Série de feu !"
  description: "achievement_streak_desc",       // "{{days}} jours consécutifs !"
  icon: "🔥"
}
```

## XP Display Components

### XP Badge

Show user's level and XP:

```javascript
function XPBadge({ userProfile }) {
  const { current_level, total_xp } = userProfile

  return (
    <div className="xp-badge">
      <span className="level">Lvl {current_level}</span>
      <span className="xp">{total_xp} XP</span>
    </div>
  )
}
```

### Progress Bar

Show progress to next level:

```javascript
function LevelProgress({ totalXP }) {
  const { currentLevel, percentage, xpIntoLevel, xpNeeded } = getLevelProgress(totalXP)

  return (
    <div className="level-progress">
      <div className="label">
        Level {currentLevel}
        <span>{xpIntoLevel} / {xpNeeded} XP</span>
      </div>
      <div className="bar">
        <div className="fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
```

### Streak Display

Show current streak with flame icon:

```javascript
function StreakDisplay({ streak }) {
  return (
    <div className="streak">
      <span className="icon">🔥</span>
      <span className="days">{streak} days</span>
    </div>
  )
}
```

## Best Practices

### 1. Real-time Updates

Update XP immediately after actions:
```javascript
// After completing action
await awardXP('lesson_completed')

// Immediately refetch profile
dispatch(fetchUserProfile())

// Show notification
toast.success('+10 XP')
```

### 2. Prevent Duplicate XP

Check if action already rewarded:
```javascript
// For one-time rewards
const { data: existing } = await supabase
  .from('xp_transactions')
  .select('*')
  .eq('user_id', userId)
  .eq('action', 'lesson_completed')
  .eq('related_entity_id', lessonId)
  .single()

if (existing) {
  return // Already rewarded
}

await awardXP('lesson_completed')
```

### 3. Balance XP Amounts

Ensure XP amounts are balanced:
- Small actions (word_added): 2-5 XP
- Medium actions (exercise): 10-15 XP
- Large actions (lesson): 10-20 XP
- Goals: 50-500 XP

### 4. Celebrate Milestones

Show achievements for:
- Every level up
- Streak milestones (7, 14, 30, 50, 100, 365 days)
- Goal completions
- Total XP milestones (1000, 5000, 10000, etc.)

## Related Documentation

- [Database Architecture](../architecture/database.md) - XP tables schema
- [State Management](../architecture/state-management.md) - XP state in Redux
- [Method Courses](method-courses.md) - XP from lessons
- [Exercises](exercises.md) - XP from exercises
