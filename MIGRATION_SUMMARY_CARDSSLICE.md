# Migration Summary: cardsSlice → React Context

## Overview

Successfully migrated the `cardsSlice` Redux slice to React Context (`context/flashcards.js`). This completes another phase of the Redux → React Query/Context migration strategy.

**Date**: 2025-11-17
**Status**: ✅ Complete - Ready for testing

---

## What Was Changed

### 1. Created New Context Provider

**File**: `context/flashcards.js` (NEW)

```javascript
'use client'

import { createContext, useContext, useState } from 'react'

const FlashcardsContext = createContext()

export function FlashcardsProvider({ children }) {
    const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false)

    const openFlashcards = () => setIsFlashcardsOpen(true)
    const closeFlashcards = () => setIsFlashcardsOpen(false)
    const toggleFlashcards = (isOpen) => {
        if (typeof isOpen === 'boolean') {
            setIsFlashcardsOpen(isOpen)
        } else {
            setIsFlashcardsOpen(prev => !prev)
        }
    }

    return (
        <FlashcardsContext.Provider
            value={{
                isFlashcardsOpen,
                openFlashcards,
                closeFlashcards,
                toggleFlashcards,
            }}
        >
            {children}
        </FlashcardsContext.Provider>
    )
}

export function useFlashcards() {
    const context = useContext(FlashcardsContext)
    if (!context) {
        throw new Error('useFlashcards must be used within FlashcardsProvider')
    }
    return context
}
```

**Why**:
- Simpler API with dedicated methods (`openFlashcards`, `closeFlashcards`)
- No Redux boilerplate needed for simple UI state
- Follows the pattern of other Context providers in the codebase

---

### 2. Updated Provider Hierarchy

**File**: `app/providers.js`

Added `FlashcardsProvider` to the provider tree:

```javascript
<QueryClientProvider client={queryClient}>
    <UserProvider>
        <ThemeModeProvider>
            <FlashcardsProvider>  {/* ✅ ADDED */}
                <TranslationProvider>
                    <Provider store={store}>
                        {/* ... */}
                    </Provider>
                </TranslationProvider>
            </FlashcardsProvider>
        </ThemeModeProvider>
    </UserProvider>
</QueryClientProvider>
```

---

### 3. Migrated 5 Components

All components updated from Redux (`useSelector`, `useDispatch`) to Context (`useFlashcards`):

#### A. `components/AppRouterLayout.jsx`
```javascript
// BEFORE
import { useSelector } from 'react-redux'
const { isFlashcardsOpen } = useSelector(store => store.cards)

// AFTER
import { useFlashcards } from '@/context/flashcards'
const { isFlashcardsOpen } = useFlashcards()
```

#### B. `components/Layout.jsx`
Same pattern as AppRouterLayout.jsx (Pages Router version)

#### C. `components/dictionary/DictionaryClient.jsx`
```javascript
// BEFORE
import { useDispatch } from 'react-redux'
import { toggleFlashcardsContainer } from '@/features/cards/cardsSlice'
const dispatch = useDispatch()
onClick={() => dispatch(toggleFlashcardsContainer(true))}

// AFTER
import { useFlashcards } from '@/context/flashcards'
const { openFlashcards } = useFlashcards()
onClick={() => openFlashcards()}
```

#### D. `components/games/Flashcards.jsx`
```javascript
// BEFORE
import { useDispatch } from 'react-redux'
import { toggleFlashcardsContainer } from '@/features/cards/cardsSlice'
const dispatch = useDispatch()
dispatch(toggleFlashcardsContainer(false))

// AFTER
import { useFlashcards } from '@/context/flashcards'
const { closeFlashcards } = useFlashcards()
closeFlashcards()
```

#### E. `components/material/WordsContainer.jsx`
```javascript
// BEFORE
onClick={() => dispatch(toggleFlashcardsContainer(true))}

// AFTER
const { openFlashcards } = useFlashcards()
onClick={() => openFlashcards()}
```

---

### 4. Cleaned Up Redux Store

**File**: `features/store.js`

Removed `cardsSlice` from Redux store:

```javascript
// BEFORE
import cardsSlice from './cards/cardsSlice'

export const store = configureStore({
    reducer: {
        content: contentSlice,
        words: wordsSliceMinimal.reducer,
        cards: cardsSlice,  // ❌ REMOVED
    },
})

// AFTER
// import cardsSlice from './cards/cardsSlice' // ✅ MIGRATED to React Context

export const store = configureStore({
    reducer: {
        content: contentSlice,
        words: wordsSliceMinimal.reducer, // ⚠️ Temporary minimal slice
        // ✅ cards: MIGRATED to React Context (context/flashcards.js)
        // ✅ lessons: MIGRATED to React Query (lib/lessons-client.js)
        // ✅ courses: MIGRATED to React Query (lib/courses-client.js)
    },
})
```

---

### 5. Archived Old Slice

**File**: `features/_archived/cardsSlice.js.old`

The original `features/cards/cardsSlice.js` was moved to the archive folder for reference.

---

## Migration Strategy Recap

### Current Architecture

1. **React Query** → Server state (lessons, courses, materials, words)
   - Automatic caching
   - Background refetching
   - Optimistic updates
   - Loading/error states

2. **React Context** → UI state (flashcards toggle, theme, user session)
   - Simple, local state
   - No network requests
   - Provider pattern

3. **Redux (Minimal)** → Legacy admin features
   - `contentSlice`: Admin CRUD operations (to be migrated)
   - `wordsSliceMinimal`: Temporary compatibility layer (to be removed)

---

## Current Redux Store Status

```javascript
{
  content: contentSlice,        // ⚠️ Admin features - pending migration
  words: wordsSliceMinimal,     // ⚠️ Temporary - to be removed
}
```

**Migrations completed**:
- ✅ `lessonsSlice` → React Query (lib/lessons-client.js)
- ✅ `coursesSlice` → React Query (lib/courses-client.js)
- ✅ `wordsSlice` → React Query + TranslationContext
- ✅ `cardsSlice` → React Context (context/flashcards.js)

**Still pending**:
- ⚠️ `wordsSliceMinimal` → Remove temporary compatibility layer
- ⚠️ `contentSlice` → Migrate to React Query (admin features)

---

## Files Modified (Total: 7)

### Created
1. `context/flashcards.js` - New FlashcardsProvider and useFlashcards hook

### Modified
2. `app/providers.js` - Added FlashcardsProvider to hierarchy
3. `components/AppRouterLayout.jsx` - Migrated from Redux to Context
4. `components/Layout.jsx` - Migrated from Redux to Context
5. `components/dictionary/DictionaryClient.jsx` - Migrated from Redux to Context
6. `components/games/Flashcards.jsx` - Migrated from Redux to Context
7. `components/material/WordsContainer.jsx` - Migrated from Redux to Context
8. `features/store.js` - Removed cardsSlice from Redux store

### Archived
9. `features/_archived/cardsSlice.js.old` - Original Redux slice (for reference)

---

## Testing Checklist

Before committing, please test the following scenarios:

### 1. Open Flashcards from Dictionary Page
- [ ] Go to `/dictionary`
- [ ] Click "Réviser les mots" button
- [ ] Flashcards modal should open

### 2. Open Flashcards from Material Page
- [ ] Go to any material page (e.g., `/materials/beautiful-places/478`)
- [ ] Add some words to your dictionary
- [ ] Click "Répéter les mots" button
- [ ] Flashcards modal should open

### 3. Close Flashcards
- [ ] With flashcards open, click the close button (X)
- [ ] Modal should close smoothly

### 4. Review Session
- [ ] Complete a full flashcards review session
- [ ] Click "Encore", "Difficile", "Bien", "Facile" buttons
- [ ] Session should complete normally

### 5. Check Both Routers
- [ ] Test on App Router pages (e.g., `/fr/dictionary`)
- [ ] Test on Pages Router pages (e.g., older pages if any)
- [ ] Both should handle flashcards state correctly

---

## Next Steps

Once testing is validated:

### Option 1: Remove wordsSliceMinimal
- Remove temporary Redux compatibility layer
- Ensure DictionaryClient fully uses React Query hooks
- Clean up any remaining Redux dispatches

### Option 2: Migrate contentSlice
- Migrate admin CRUD operations to React Query
- Create new hooks: useCreateContent, useUpdateContent, useDeleteContent
- Remove Redux dependency completely from the codebase

**Recommendation**: Start with Option 1 (remove wordsSliceMinimal) as it's simpler and will allow us to remove more Redux code. Then tackle Option 2 (contentSlice migration).

---

## Technical Notes

### Why React Context for Flashcards?

The `cardsSlice` was only managing a single boolean (`isFlashcardsOpen`). This is **UI state**, not server state, so React Context is the appropriate choice:

- ✅ Simpler API (no actions, reducers, or dispatch)
- ✅ No Redux DevTools overhead for trivial state
- ✅ Easier to test and maintain
- ✅ Follows React best practices

### Architecture Decision

**Rule of thumb**:
- **React Query** → Data from the server (lessons, courses, words, etc.)
- **React Context** → UI state and client-side preferences (theme, modals, etc.)
- **Redux** → Complex global state with many interdependent actions (being phased out)

Since flashcards open/close is pure UI state with no server interaction, React Context is perfect.

---

## Summary

✅ **Completed**: cardsSlice → React Context migration
📝 **Files Modified**: 7 files
🧪 **Testing**: Required before commit
⏭️ **Next**: Remove wordsSliceMinimal or migrate contentSlice

All changes were made autonomously as requested. No errors encountered during migration.

---

**Questions or issues?** Please test the scenarios above and let me know if anything doesn't work as expected.
