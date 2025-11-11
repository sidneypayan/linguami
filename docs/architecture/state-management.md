# State Management Architecture

## Overview

Linguami uses a **two-tier state architecture** combining Redux for global domain state and React Context for local UI state.

## Redux (Global Domain State)

**Location:** `/features/`

**Store setup:** `/features/store.js`

### Redux Slices

**`materialsSlice`** (`/features/materials/materialsSlice.js`)
- Learning materials (videos, books, articles)
- Material filtering and search
- User's studying materials

**Key state:**
```javascript
{
  materials: [],           // All materials
  studyingMaterials: [],  // User's studying list
  currentMaterial: null,   // Currently viewed material
  loading: false,
  error: null
}
```

**Key actions:**
```javascript
getMaterials({ lang, section })     // Fetch materials by language/section
getMaterialBySlug(slug)             // Fetch single material
addToStudying(materialId)           // Add material to studying list
removeFromStudying(materialId)      // Remove from studying list
```

---

**`wordsSlice`** (`/features/words/wordsSlice.js`)
- User dictionary words
- Translations
- SRS flashcard data

**Key state:**
```javascript
{
  words: [],              // User's saved words
  translations: {},       // Cached translations
  loading: false,
  error: null
}
```

**Key actions:**
```javascript
getWords(userId)                    // Fetch user's words
addWord({ word, translation, ... }) // Add word to dictionary
deleteWord(wordId)                  // Remove word
translate({ text, from, to })       // Get translation from API
```

---

**`cardsSlice`** (`/features/cards/cardsSlice.js`)
- Flashcard UI state
- SRS review queue
- Card statistics

**Key state:**
```javascript
{
  cards: [],              // SRS cards data
  reviewQueue: [],        // Cards due for review
  currentCard: null,      // Card being reviewed
  stats: {},              // Review statistics
  loading: false
}
```

**Key actions:**
```javascript
getCards(userId)                    // Fetch user's cards
reviewCard({ cardId, rating })      // Submit card review (Again/Hard/Good/Easy)
getReviewQueue(userId)              // Get cards due today
```

---

**`lessonsSlice`** (`/features/lessons/lessonsSlice.js`)
- Lesson content
- Lesson exercises

**Key state:**
```javascript
{
  lessons: [],
  currentLesson: null,
  loading: false,
  error: null
}
```

---

**`coursesSlice`** (`/features/courses/coursesSlice.js`)
- Course levels
- Courses by target language
- Course lessons
- User progress

**Key state:**
```javascript
{
  levels: [],             // Course levels (beginner/intermediate/advanced)
  courses: [],            // Courses filtered by learning language
  lessons: [],            // Lessons for current course
  userAccess: [],         // Purchased levels
  userProgress: [],       // Completed lessons
  loading: false,
  error: null
}
```

**Key actions:**
```javascript
fetchCourseLevels()                 // Get all levels
fetchCourses(levelId)               // Get courses for level
fetchLessons(courseId)              // Get lessons for course
fetchUserProgress(userId)           // Get user's completed lessons
completeLesson(lessonId)            // Mark lesson as complete
loadLocalProgress()                 // Load progress from localStorage (guests)
completeLocalLessonAction(lessonId) // Complete lesson locally (guests)
```

---

**`activitiesSlice`** (`/features/activities/activitiesSlice.js`)
- User activity tracking
- Recent actions

---

**`contentSlice`** (`/features/content/contentSlice.js`)
- Blog posts
- General content

**Key actions:**
```javascript
getPosts({ lang })                  // Fetch blog posts
getPostBySlug(slug)                 // Fetch single post
```

## React Context (Local UI State)

**Location:** `/context/`

### UserContext

**Location:** `/context/user.js`

**Purpose:** Authentication, user profile, learning language preferences

**State provided:**
```javascript
{
  user,                     // Supabase auth user object
  userProfile,              // Combined users_profile + user_xp_profile
  userLearningLanguage,     // Target language (fr/ru) - works for auth & guest
  isUserLoggedIn,           // Boolean
  isUserAdmin,              // Boolean (role === 'admin')
  loading                   // Auth state loading
}
```

**Functions provided:**
```javascript
register(email, password, name, username, learningLanguage, spokenLanguage)
login(email, password)
loginWithThirdPartyOAuth(provider)  // Google, Apple, Facebook
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
- For authenticated users: stored in `users_profile.learning_language`
- For guests: stored in `localStorage.getItem('learning_language')`
- Accessed uniformly via `useUserContext().userLearningLanguage`
- Default logic in `getDefaultLearningLanguage()`:
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
  toggleTheme       // Function to toggle
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

**Storage:** Theme preference is saved to `localStorage.getItem('theme')`

## When to Use Which?

### Use Redux when:
- Data is shared across multiple features
- Data comes from server (materials, words, courses)
- Need caching to avoid repeated API calls
- Complex state logic with async operations
- Multiple components need to update the same data

**Example:** Materials list is used in homepage, materials page, and study page → Redux

### Use Context when:
- Simple UI state (theme, modals)
- Authentication state (used everywhere)
- User preferences
- Data doesn't need to be cached
- State is relatively stable

**Example:** Dark mode toggle is simple UI state → Context

## Redux Patterns

### Creating a New Slice

**1. Create slice file:**
```javascript
// features/myFeature/myFeatureSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createBrowserClient } from '@/lib/supabase'

const supabase = createBrowserClient()

// Async thunks
export const fetchData = createAsyncThunk(
  'myFeature/fetchData',
  async (params, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('my_table')
        .select('*')
        .eq('field', params.value)

      if (error) throw error
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Slice
const myFeatureSlice = createSlice({
  name: 'myFeature',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    // Synchronous actions
    clearItems: (state) => {
      state.items = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearItems } = myFeatureSlice.actions
export default myFeatureSlice.reducer
```

**2. Add to store:**
```javascript
// features/store.js
import myFeatureReducer from './myFeature/myFeatureSlice'

export const store = configureStore({
  reducer: {
    // ... existing reducers
    myFeature: myFeatureReducer
  }
})
```

**3. Use in components:**
```javascript
import { useSelector, useDispatch } from 'react-redux'
import { fetchData, clearItems } from '@/features/myFeature/myFeatureSlice'

function Component() {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector(state => state.myFeature)

  useEffect(() => {
    dispatch(fetchData({ value: 'example' }))
  }, [dispatch])

  const handleClear = () => {
    dispatch(clearItems())
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {items.map(item => <div key={item.id}>{item.name}</div>)}
      <button onClick={handleClear}>Clear</button>
    </div>
  )
}
```

## Context Patterns

### Creating a New Context

**1. Create context file:**
```javascript
// context/MyContext.js
import { createContext, useContext, useState, useEffect } from 'react'

const MyContext = createContext()

export function MyContextProvider({ children }) {
  const [value, setValue] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize context
    const init = async () => {
      // Load data
      setValue('initial value')
      setLoading(false)
    }
    init()
  }, [])

  const updateValue = (newValue) => {
    setValue(newValue)
    // Save to localStorage if needed
    localStorage.setItem('my_key', newValue)
  }

  return (
    <MyContext.Provider value={{ value, loading, updateValue }}>
      {children}
    </MyContext.Provider>
  )
}

export function useMyContext() {
  const context = useContext(MyContext)
  if (!context) {
    throw new Error('useMyContext must be used within MyContextProvider')
  }
  return context
}
```

**2. Add to app:**
```javascript
// pages/_app.js
import { MyContextProvider } from '@/context/MyContext'

function MyApp({ Component, pageProps }) {
  return (
    <MyContextProvider>
      <Component {...pageProps} />
    </MyContextProvider>
  )
}
```

**3. Use in components:**
```javascript
import { useMyContext } from '@/context/MyContext'

function Component() {
  const { value, loading, updateValue } = useMyContext()

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div>Value: {value}</div>
      <button onClick={() => updateValue('new value')}>Update</button>
    </div>
  )
}
```

## localStorage for Guest Users

For non-authenticated users, certain preferences and data are stored in localStorage:

**Learning Language:**
```javascript
// Get
const learningLang = localStorage.getItem('learning_language') // 'fr' or 'ru'

// Set
localStorage.setItem('learning_language', 'ru')
```

**Course Progress:**
```javascript
// Utility: /utils/localCourseProgress.js
import { getLocalProgress, completeLocalLesson } from '@/utils/localCourseProgress'

// Get progress
const progress = getLocalProgress() // [{ lesson_id: 2, completed_at: "..." }, ...]

// Mark lesson complete
completeLocalLesson(lessonId)
```

**Dictionary:**
```javascript
// Get
const guestDict = JSON.parse(localStorage.getItem('guestDictionary') || '[]')

// Add word
guestDict.push({ word: 'bonjour', translation: 'hello' })
localStorage.setItem('guestDictionary', JSON.stringify(guestDict))
```

**Migration on Login:**
All localStorage data is automatically migrated to database when user logs in. See `UserContext.hydrateFromSession()` and `migrateLocalProgressToDatabase()` in `/utils/localCourseProgress.js`.

## Related Documentation

- [Database Architecture](database.md)
- [Authentication Flow](authentication.md)
- [Method Courses Features](../features/method-courses.md)
