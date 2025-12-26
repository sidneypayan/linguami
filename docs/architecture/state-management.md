# State Management Architecture

## Overview

Linguami uses a **modern data fetching architecture** combining:
- **React Query** for server state (data fetching, caching, synchronization)
- **Server Actions** for data mutations (Next.js App Router)
- **React Context** for local UI state (auth, theme)
- **localStorage** for guest user data

---

## ⚠️ CRITICAL: React Query + Server Actions

**DO NOT create API routes (`pages/api/*`) for data fetching in App Router pages.**

### The Pattern

When working with App Router (`app/` directory):

1. **Create Server Action** - Fetch/mutate data server-side
2. **Use React Query** - Cache and manage data client-side
3. **Include dependencies in queryKey** - Auto-refetch when they change

---

### ✅ Correct Pattern

**Step 1: Create Server Action** (`app/actions/myFeature.js`)
```javascript
'use server'

import { createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

export async function getDataByLanguage(lang) {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data, error } = await supabase
    .from('my_table')
    .select('*')
    .eq('lang', lang)

  if (error) return []
  return data
}
```

**Step 2: Use in Client Component with React Query**
```javascript
'use client'

import { useQuery } from '@tanstack/react-query'
import { getDataByLanguage } from '@/app/actions/myFeature'
import { useUserContext } from '@/context/user'

function MyComponent() {
  const { userLearningLanguage } = useUserContext()

  // React Query automatically refetches when userLearningLanguage changes!
  const { data } = useQuery({
    queryKey: ['myData', userLearningLanguage], // ← Auto refetch on change
    queryFn: () => getDataByLanguage(userLearningLanguage),
    enabled: !!userLearningLanguage,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return <div>{data?.map(item => ...)}</div>
}
```

---

### Why This Pattern?

✅ **Automatic refetching** when queryKey dependencies change
✅ **No page reload** needed (`window.location.reload()` is an anti-pattern)
✅ **Type-safe** - Server Actions can be typed
✅ **Better performance** - Caching, deduplication
✅ **No HTTP overhead** - Server Actions are RPC, not REST

---

### ❌ ANTI-PATTERNS

**DON'T: Create API routes**
```javascript
// ❌ Don't create pages/api/my-data.js
export default function handler(req, res) {
  // This is the OLD pattern
}
```

**DON'T: Use window.location.reload()**
```javascript
// ❌ Don't reload the whole page when data changes
useEffect(() => {
  if (userLearningLanguage !== previousLang) {
    window.location.reload() // ANTI-PATTERN!
  }
}, [userLearningLanguage])
```

**DO THIS instead:**
```javascript
// ✅ Include dynamic dependencies in queryKey
const { data } = useQuery({
  queryKey: ['materials', userLearningLanguage], // ← Auto refetch
  queryFn: () => getMaterialsAction(userLearningLanguage)
})
```

---

## React Context (Local UI State)

**Location:** `/context/`

### UserContext

**Location:** `/context/user.js`

**Purpose:** Authentication, user profile, learning language preferences

**State provided:**
```javascript
{
  user,                     // Supabase auth user
  userProfile,              // users_profile + user_xp_profile
  userLearningLanguage,     // Target language (fr/ru)
  isUserLoggedIn,           // Boolean
  isUserAdmin,              // Boolean (role === 'admin')
  loading                   // Auth state loading
}
```

**Functions provided:**
```javascript
register(email, password, name, username, learningLanguage, spokenLanguage)
login(email, password)
loginWithThirdPartyOAuth(provider)  // Google, Facebook, VK
sendMagicLink(email)
logout()
updateLearningLanguage(lang)
```

**Usage:**
```javascript
import { useUserContext } from '@/context/user'

function Component() {
  const { isUserLoggedIn, userProfile, userLearningLanguage } = useUserContext()

  if (!isUserLoggedIn) {
    return <div>Please log in</div>
  }

  return <div>Hello {userProfile.name}, learning {userLearningLanguage}</div>
}
```

**Learning Language Management:**
- **Authenticated users:** `users_profile.learning_language` (DB)
- **Guests:** `localStorage.getItem('learning_language')`
- **Accessed uniformly** via `useUserContext().userLearningLanguage`
- **Default logic:**
  - Interface `ru` → learn `fr`
  - Interface `fr` or `en` → learn `ru`

---

### ThemeContext

**Location:** `/context/ThemeContext.js`

**Purpose:** Dark/light mode toggle

**State provided:**
```javascript
{
  isDark,           // Boolean
  toggleTheme       // Function
}
```

**Usage:**
```javascript
import { useTheme } from '@/context/ThemeContext'

function Component() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button onClick={toggleTheme}>
      {isDark ? '🌙' : '☀️'}
    </button>
  )
}
```

**Storage:** Theme saved to `localStorage.getItem('theme')`

---

## localStorage for Guest Users

For non-authenticated users, certain data is stored in localStorage and migrated on login.

### Learning Language
```javascript
// Get
const learningLang = localStorage.getItem('learning_language') // 'fr' or 'ru'

// Set
localStorage.setItem('learning_language', 'ru')
```

### Course Progress
```javascript
// Utility: /utils/localCourseProgress.js
import { getLocalProgress, completeLocalLesson } from '@/utils/localCourseProgress'

// Get progress
const progress = getLocalProgress() // [{ lesson_id: 2, completed_at: "..." }, ...]

// Mark lesson complete
completeLocalLesson(lessonId)
```

### Dictionary
```javascript
// Get
const guestDict = JSON.parse(localStorage.getItem('guestDictionary') || '[]')

// Add word (max 20 for guests)
if (guestDict.length < 20) {
  guestDict.push({ word: 'bonjour', translation: 'hello' })
  localStorage.setItem('guestDictionary', JSON.stringify(guestDict))
}
```

**Migration on Login:**
All localStorage data is automatically migrated to database when user logs in.
See `UserContext.hydrateFromSession()` and `migrateLocalProgressToDatabase()`.

---

## When to Use Which?

### Use React Query when:
- Fetching server data
- Need caching to avoid repeated requests
- Data changes based on user state (language, auth)
- Multiple components need the same data

**Example:** Materials filtered by learning language

### Use Context when:
- Simple UI state (theme, modals)
- Authentication state (used everywhere)
- User preferences
- State doesn't need server sync

**Example:** Dark mode toggle

### Use localStorage when:
- Guest user data
- Preferences that persist across sessions
- Data to be migrated on login

**Example:** Guest dictionary, course progress

---

## Related Documentation

- [Database Architecture](database.md)
- [Authentication Flow](authentication.md)
- [i18n System](i18n.md)
