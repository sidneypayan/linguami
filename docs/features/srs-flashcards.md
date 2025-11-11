# Spaced Repetition System (SRS)

## Overview

Linguami uses a Spaced Repetition System (SRS) inspired by Anki to optimize vocabulary retention through scientifically-timed reviews.

**Algorithm location:** `/utils/spacedRepetition.js`

**Database:** `user_words_cards` table

## How It Works

### The Spacing Effect

Words are reviewed at increasing intervals based on how well you remember them:

- **First review:** 1 day
- **Second review:** 3 days
- **Third review:** 7 days
- **Fourth review:** 14 days
- And so on...

The better you know a word, the longer the interval before the next review.

## Card States

Each flashcard has a state that determines how it's scheduled:

### 1. New

**Definition:** Card never reviewed before

**Schedule:** Shows up immediately for first learning

**Transition:** After first review → Learning

### 2. Learning

**Definition:** Card being actively learned

**Schedule:** Short intervals (1-10 minutes initially, then days)

**Transition:**
- After successful reviews → Review
- After forgotten → Relearning

### 3. Review

**Definition:** Card successfully learned

**Schedule:** Long intervals (weeks to months)

**Transition:**
- After successful reviews → Stays in Review (interval increases)
- After forgotten → Relearning

### 4. Relearning

**Definition:** Previously learned card that was forgotten

**Schedule:** Short intervals again (like Learning)

**Transition:** After re-learning → Review

## Review Buttons

During review, user has 4 options:

### Again (Rating: 1)

"I completely forgot this word"

- **Resets progress**
- Interval → 1 day
- Ease factor decreased
- State → Relearning

### Hard (Rating: 2)

"I remembered with difficulty"

- **Slight progress**
- Interval × 1.2
- Ease factor slightly decreased
- State remains same

### Good (Rating: 3)

"I remembered correctly"

- **Normal progress**
- Interval × ease_factor
- Ease factor stays same
- State remains same

### Easy (Rating: 4)

"I remembered instantly"

- **Maximum progress**
- Interval × (ease_factor × 1.3)
- Ease factor increased
- State → Review (if not already)

## Algorithm Parameters

### Ease Factor

**Range:** 1.3 to 2.5

**Starting value:** 2.5

**Purpose:** Multiplier for interval growth

**Adjustments:**
- Again: -0.2
- Hard: -0.15
- Good: No change
- Easy: +0.15

**Formula:**
```javascript
newInterval = oldInterval * easeFactor
```

### Intervals

**Initial intervals:**
- New cards: 1 day
- Relearning cards: 1 day

**Growth:**
- Again: Reset to 1 day
- Hard: oldInterval × 1.2
- Good: oldInterval × easeFactor
- Easy: oldInterval × (easeFactor × 1.3)

**Cap:** Maximum interval is 365 days (1 year)

### Repetitions

Counts consecutive successful reviews.

- Resets to 0 on "Again"
- Increments on "Hard", "Good", "Easy"

## Database Schema

### user_words_cards

```javascript
{
  id: integer,
  word_id: integer,          // FK to user_words
  user_id: uuid,             // FK to users_profile
  state: 'new|learning|review|relearning',
  ease_factor: 2.5,          // 1.3 to 2.5
  interval: 1,               // Days until next review
  repetitions: 0,            // Consecutive successful reviews
  last_review: null,         // Timestamp of last review
  next_review: '2025-01-11', // Date of next scheduled review
  created_at: timestamp
}
```

## Implementation

### Algorithm File

**Location:** `/utils/spacedRepetition.js`

**Main function:**
```javascript
export function calculateNextReview(card, rating) {
  // rating: 1 (again), 2 (hard), 3 (good), 4 (easy)

  let { ease_factor, interval, repetitions, state } = card

  if (rating === 1) {
    // Again - reset progress
    repetitions = 0
    interval = 1
    ease_factor = Math.max(1.3, ease_factor - 0.2)
    state = card.state === 'new' ? 'learning' : 'relearning'
  } else {
    repetitions++

    if (rating === 2) {
      // Hard
      interval = interval * 1.2
      ease_factor = Math.max(1.3, ease_factor - 0.15)
    } else if (rating === 3) {
      // Good
      interval = interval * ease_factor
    } else if (rating === 4) {
      // Easy
      interval = interval * ease_factor * 1.3
      ease_factor = Math.min(2.5, ease_factor + 0.15)
      state = 'review'
    }

    // Cap interval at 365 days
    interval = Math.min(interval, 365)

    if (state === 'learning' && repetitions >= 2) {
      state = 'review'
    }
  }

  const next_review = new Date()
  next_review.setDate(next_review.getDate() + Math.round(interval))

  return {
    ease_factor,
    interval: Math.round(interval),
    repetitions,
    state,
    last_review: new Date(),
    next_review
  }
}
```

### Redux Integration

**State:** `cardsSlice`

**Key actions:**
```javascript
dispatch(getCards(userId))           // Fetch all cards
dispatch(getReviewQueue(userId))     // Get cards due today
dispatch(reviewCard({ cardId, rating }))  // Submit review
```

**Usage in component:**
```javascript
import { useSelector, useDispatch } from 'react-redux'
import { getReviewQueue, reviewCard } from '@/features/cards/cardsSlice'

function FlashcardReview() {
  const dispatch = useDispatch()
  const { reviewQueue, loading } = useSelector(state => state.cards)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    dispatch(getReviewQueue(userId))
  }, [])

  const handleReview = async (rating) => {
    const card = reviewQueue[currentIndex]
    await dispatch(reviewCard({ cardId: card.id, rating })).unwrap()
    setCurrentIndex(prev => prev + 1)
  }

  const currentCard = reviewQueue[currentIndex]

  if (!currentCard) {
    return <div>All reviews complete! 🎉</div>
  }

  return (
    <div>
      <div className="card">
        <div>{currentCard.word.word}</div>
        <div>{currentCard.word.translation}</div>
      </div>

      <div className="buttons">
        <button onClick={() => handleReview(1)}>Again</button>
        <button onClick={() => handleReview(2)}>Hard</button>
        <button onClick={() => handleReview(3)}>Good</button>
        <button onClick={() => handleReview(4)}>Easy</button>
      </div>

      <div>
        {currentIndex + 1} / {reviewQueue.length}
      </div>
    </div>
  )
}
```

## User Workflow

### 1. Adding Words

User clicks on word in material → translates → saves to dictionary:

```javascript
// When word is saved
const { data: word } = await supabase
  .from('user_words')
  .insert({
    user_id: userId,
    material_id: materialId,
    word: 'привет',
    translation: 'hello',
    context: 'Привет, как дела?'
  })
  .select()
  .single()

// Automatically create card
await supabase
  .from('user_words_cards')
  .insert({
    word_id: word.id,
    user_id: userId,
    state: 'new',
    ease_factor: 2.5,
    interval: 1,
    repetitions: 0,
    next_review: new Date()  // Available immediately
  })
```

### 2. Reviewing Words

**Daily review flow:**

1. User opens flashcards page
2. System loads cards due today (`next_review <= today`)
3. User reviews each card, pressing one of 4 buttons
4. Algorithm calculates next review date
5. Card updated in database
6. Next card shown
7. When queue empty → "All done!"

### 3. Review Statistics

Show user their progress:

```javascript
const stats = {
  new: cards.filter(c => c.state === 'new').length,
  learning: cards.filter(c => c.state === 'learning').length,
  review: cards.filter(c => c.state === 'review').length,
  dueToday: cards.filter(c => new Date(c.next_review) <= new Date()).length
}
```

## API Endpoints

### GET /api/cards

Fetch user's cards with word data:

```javascript
const { data, error } = await supabase
  .from('user_words_cards')
  .select(`
    *,
    word:user_words (
      word,
      translation,
      context
    )
  `)
  .eq('user_id', userId)
  .order('next_review')
```

### POST /api/cards/review

Submit card review:

```javascript
// pages/api/cards/review.js
export default async function handler(req, res) {
  const { cardId, rating } = req.body  // rating: 1-4
  const { data: { user } } = await supabase.auth.getUser()

  // Get current card
  const { data: card } = await supabase
    .from('user_words_cards')
    .select('*')
    .eq('id', cardId)
    .single()

  // Calculate next review
  const updates = calculateNextReview(card, rating)

  // Update card
  await supabase
    .from('user_words_cards')
    .update(updates)
    .eq('id', cardId)

  res.json({ success: true, updates })
}
```

## UI Components

### FlashCard Component

Shows word/translation with flip animation:

```javascript
function FlashCard({ word, onFlip }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className={`flashcard ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="front">{word.word}</div>
      <div className="back">{word.translation}</div>
    </div>
  )
}
```

### Review Buttons

Color-coded for easy recognition:

```javascript
<div className="review-buttons">
  <button className="again" onClick={() => handleReview(1)}>
    <span>Again</span>
    <span>1 day</span>
  </button>
  <button className="hard" onClick={() => handleReview(2)}>
    <span>Hard</span>
    <span>3 days</span>
  </button>
  <button className="good" onClick={() => handleReview(3)}>
    <span>Good</span>
    <span>7 days</span>
  </button>
  <button className="easy" onClick={() => handleReview(4)}>
    <span>Easy</span>
    <span>14 days</span>
  </button>
</div>
```

### Progress Bar

Shows review session progress:

```javascript
function ReviewProgress({ current, total }) {
  const percentage = (current / total) * 100

  return (
    <div className="progress-bar">
      <div className="fill" style={{ width: `${percentage}%` }} />
      <span>{current} / {total}</span>
    </div>
  )
}
```

## Best Practices

### 1. Daily Reviews

Encourage users to review cards daily for best retention:
- Show "cards due today" count prominently
- Send reminder notifications
- Gamify with streak tracking

### 2. Reasonable Session Length

Don't overwhelm users:
- Cap daily reviews at 50 cards
- Allow "pause" and resume later
- Show time estimate

### 3. Context Preservation

Always show word in context:
```javascript
<div className="context">
  "{word.context}"
</div>
```

### 4. Statistics & Motivation

Show progress to motivate:
- Total words learned
- Success rate
- Longest streak
- Cards mastered (long intervals)

## Related Documentation

- [Database Architecture](../architecture/database.md) - Card tables schema
- [State Management](../architecture/state-management.md) - Redux integration
- [XP & Gamification](xp-gamification.md) - XP for reviews
