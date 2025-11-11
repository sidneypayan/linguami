# Authentication Flow

## Overview

Linguami uses **Supabase Auth** for user authentication, managed through React Context (`UserContext`).

**Location:** `/context/user.js`

## Authentication Methods

### 1. Email/Password Registration

```javascript
import { useUserContext } from '@/context/user'

function SignupForm() {
  const { register } = useUserContext()

  const handleSignup = async () => {
    try {
      await register({
        email: 'user@example.com',
        password: 'secure_password',
        name: 'John Doe',
        username: 'johndoe',
        learningLanguage: 'ru',  // Target language to study
        spokenLanguage: 'fr'     // Native language for explanations
      })
      // User is now logged in
    } catch (error) {
      console.error('Registration failed:', error.message)
    }
  }

  return <button onClick={handleSignup}>Sign up</button>
}
```

**What happens:**
1. Creates Supabase auth user
2. Creates `users_profile` record with profile data
3. Creates `user_xp_profile` record with initial XP (0)
4. User is automatically logged in
5. Confirmation email sent (email verification required)

### 2. Email/Password Login

```javascript
import { useUserContext } from '@/context/user'

function LoginForm() {
  const { login } = useUserContext()

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'secure_password')
      // User is now logged in
    } catch (error) {
      console.error('Login failed:', error.message)
    }
  }

  return <button onClick={handleLogin}>Log in</button>
}
```

### 3. OAuth (Third-Party Login)

**Supported providers:**
- Google
- Apple
- Facebook

```javascript
import { useUserContext } from '@/context/user'

function OAuthButtons() {
  const { loginWithThirdPartyOAuth } = useUserContext()

  const handleGoogleLogin = async () => {
    try {
      await loginWithThirdPartyOAuth('google')
      // Redirects to Google OAuth
    } catch (error) {
      console.error('OAuth failed:', error.message)
    }
  }

  return (
    <>
      <button onClick={() => loginWithThirdPartyOAuth('google')}>
        Continue with Google
      </button>
      <button onClick={() => loginWithThirdPartyOAuth('apple')}>
        Continue with Apple
      </button>
      <button onClick={() => loginWithThirdPartyOAuth('facebook')}>
        Continue with Facebook
      </button>
    </>
  )
}
```

### 4. Magic Link (Passwordless)

```javascript
import { useUserContext } from '@/context/user'

function MagicLinkForm() {
  const { sendMagicLink } = useUserContext()

  const handleMagicLink = async () => {
    try {
      await sendMagicLink('user@example.com')
      // Email sent with login link
      alert('Check your email for the login link!')
    } catch (error) {
      console.error('Magic link failed:', error.message)
    }
  }

  return <button onClick={handleMagicLink}>Send magic link</button>
}
```

### 5. Logout

```javascript
import { useUserContext } from '@/context/user'

function LogoutButton() {
  const { logout } = useUserContext()

  const handleLogout = async () => {
    try {
      await logout()
      // User is now logged out
    } catch (error) {
      console.error('Logout failed:', error.message)
    }
  }

  return <button onClick={handleLogout}>Log out</button>
}
```

## User Profile Structure

### auth.users (Supabase Auth)
Managed by Supabase, contains:
- `id` (uuid)
- `email`
- `email_confirmed_at`
- `created_at`
- OAuth provider info

### users_profile (Custom Profile)
```javascript
{
  id: 'uuid',
  name: 'John Doe',
  username: 'johndoe',
  avatar_id: 1,
  learning_language: 'ru',    // Language being studied
  spoken_language: 'fr',      // Native language
  is_premium: false,
  role: 'user',               // 'user' or 'admin'
  created_at: '2025-01-10T...'
}
```

### user_xp_profile (Gamification)
```javascript
{
  user_id: 'uuid',
  total_xp: 1250,
  current_level: 5,
  daily_streak: 7,
  total_gold: 450,
  weekly_xp: 120,
  monthly_xp: 680,
  last_activity_date: '2025-01-10'
}
```

### Combined Profile in Context

`UserContext` automatically combines both profiles:

```javascript
const { userProfile } = useUserContext()

console.log(userProfile)
// {
//   // From users_profile
//   name: 'John Doe',
//   username: 'johndoe',
//   learning_language: 'ru',
//   spoken_language: 'fr',
//   is_premium: false,
//   role: 'user',
//   // From user_xp_profile
//   total_xp: 1250,
//   current_level: 5,
//   daily_streak: 7,
//   total_gold: 450,
//   weekly_xp: 120,
//   monthly_xp: 680
// }
```

## UserContext API

### State

```javascript
const {
  user,                    // Supabase auth.users object
  userProfile,             // Combined users_profile + user_xp_profile
  userLearningLanguage,    // Target language (works for auth & guest)
  isUserLoggedIn,          // Boolean
  isUserAdmin,             // Boolean (role === 'admin')
  loading                  // Auth state loading
} = useUserContext()
```

### Functions

```javascript
// Registration
register(email, password, name, username, learningLanguage, spokenLanguage)

// Login
login(email, password)
loginWithThirdPartyOAuth(provider)  // 'google', 'apple', 'facebook'
sendMagicLink(email)

// Logout
logout()

// Update preferences
updateLearningLanguage(lang)  // 'fr', 'ru', 'en'
```

## Protected Routes

### Component-level Protection

```javascript
import { useUserContext } from '@/context/user'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

function ProtectedPage() {
  const { isUserLoggedIn, loading } = useUserContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isUserLoggedIn) {
      router.push('/login')
    }
  }, [isUserLoggedIn, loading, router])

  if (loading) return <div>Loading...</div>
  if (!isUserLoggedIn) return null

  return <div>Protected content</div>
}
```

### Admin-only Routes

```javascript
import { useUserContext } from '@/context/user'

function AdminPage() {
  const { isUserAdmin } = useUserContext()

  if (!isUserAdmin) {
    return <div>Access denied. Admin only.</div>
  }

  return <div>Admin panel</div>
}
```

## API Route Authentication

For server-side authentication in API routes:

```javascript
// pages/api/protected-endpoint.js
import { createServerClient } from '@/lib/supabase-server'

export default async function handler(req, res) {
  const supabase = createServerClient(req, res)

  // Get authenticated user
  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user || error) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('users_profile')
    .select('*')
    .eq('id', user.id)
    .single()

  // Check if admin
  if (profile.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' })
  }

  // Proceed with authorized logic
  res.status(200).json({ message: 'Success', user: profile })
}
```

## Language System

### Three Language Concepts

**1. Interface Language** (`router.locale`)
- Language of the UI/menus/buttons
- Values: `fr`, `ru`, `en`
- Controlled by URL: `/fr/materials`, `/ru/materials`, `/en/materials`

**2. Learning Language** (`userProfile.learning_language`)
- Language the user is STUDYING
- Values: `fr`, `ru` (en suspended)
- For auth users: stored in database
- For guests: `localStorage.getItem('learning_language')`

**3. Spoken Language** (`userProfile.spoken_language`)
- User's NATIVE language (for explanations in lessons)
- Values: `fr`, `ru`, `en`
- For auth users: stored in database
- For guests: defaults to interface language

### Example Scenarios

**French speaker learning Russian with English interface:**
```javascript
{
  locale: 'en',                    // Interface language
  learning_language: 'ru',         // Target language
  spoken_language: 'fr'            // Native language
}
```
- Sees menus in English
- Studies Russian materials/courses
- Gets lesson explanations in French

**Russian speaker learning French with Russian interface:**
```javascript
{
  locale: 'ru',                    // Interface language
  learning_language: 'fr',         // Target language
  spoken_language: 'ru'            // Native language
}
```
- Sees menus in Russian
- Studies French materials/courses
- Gets lesson explanations in Russian

### Accessing Languages in Components

```javascript
import { useRouter } from 'next/router'
import { useUserContext } from '@/context/user'

function Component() {
  const router = useRouter()
  const { userProfile, userLearningLanguage } = useUserContext()

  const interfaceLang = router.locale            // fr/ru/en
  const learningLang = userLearningLanguage      // fr/ru (works for auth & guest)
  const spokenLang = userProfile?.spoken_language || router.locale

  return (
    <div>
      <p>Interface: {interfaceLang}</p>
      <p>Learning: {learningLang}</p>
      <p>Spoken: {spokenLang}</p>
    </div>
  )
}
```

## Email Verification

**Flow:**
1. User registers
2. Confirmation email sent automatically by Supabase
3. User clicks link in email
4. Redirected to `/auth/callback` which confirms email
5. User is now verified

**Checking verification status:**
```javascript
const { user } = useUserContext()

if (!user.email_confirmed_at) {
  // Email not verified
  return <div>Please verify your email</div>
}
```

## Session Management

### Middleware

`/middleware.js` runs on every request to:
- Refresh Supabase session tokens
- Maintain auth state across page loads
- Required for Supabase SSR

```javascript
// middleware.js
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession()
  return res
}
```

### Session Persistence

Supabase automatically handles session persistence:
- Sessions stored in cookies
- Tokens automatically refreshed
- Users stay logged in across browser sessions

## Guest Users (Non-Authenticated)

### localStorage Support

For non-authenticated users:

**Learning Language:**
```javascript
// Get (works for both auth & guest)
const { userLearningLanguage } = useUserContext()

// Set (guest only)
localStorage.setItem('learning_language', 'ru')
```

**Course Progress:**
```javascript
import { getLocalProgress, completeLocalLesson } from '@/utils/localCourseProgress'

// Get progress
const progress = getLocalProgress()

// Mark lesson complete
completeLocalLesson(lessonId)
```

**Dictionary:**
```javascript
const guestDict = JSON.parse(localStorage.getItem('guestDictionary') || '[]')
```

### Migration on Login

All localStorage data is automatically migrated to database when user logs in:

```javascript
// In UserContext.hydrateFromSession()
async hydrateFromSession() {
  // ... auth logic ...

  // Migrate localStorage data
  await migrateLocalProgressToDatabase()

  // Clear localStorage after migration
  localStorage.removeItem('localCourseProgress')
  localStorage.removeItem('guestDictionary')
}
```

## Error Handling

### Common Errors

**Invalid credentials:**
```javascript
try {
  await login(email, password)
} catch (error) {
  if (error.message === 'Invalid login credentials') {
    toast.error('Email or password is incorrect')
  }
}
```

**Email not confirmed:**
```javascript
try {
  await login(email, password)
} catch (error) {
  if (error.message.includes('Email not confirmed')) {
    toast.info('Please check your email to confirm your account')
  }
}
```

**User already exists:**
```javascript
try {
  await register({ email, password, ... })
} catch (error) {
  if (error.message.includes('already registered')) {
    toast.error('This email is already registered')
  }
}
```

## Security Best Practices

**1. Never expose service role key:**
```javascript
// ❌ NEVER do this
const supabase = createClient(url, SERVICE_ROLE_KEY)  // Client-side

// ✅ Use anon key for client
const supabase = createClient(url, ANON_KEY)  // Client-side

// ✅ Service role only in API routes
const supabase = createServerClient(req, res)  // Server-side with service role
```

**2. Always use Row Level Security (RLS):**
All tables have RLS policies - users can only access their own data.

**3. Validate user input:**
```javascript
// Validate before calling register
if (!isValidEmail(email)) {
  return toast.error('Invalid email format')
}
if (password.length < 8) {
  return toast.error('Password must be at least 8 characters')
}
```

**4. Use HTTPS only:**
All authentication requests go through HTTPS (enforced by Supabase).

## Related Documentation

- [Database Architecture](database.md)
- [State Management](state-management.md)
- [i18n System](i18n.md)
