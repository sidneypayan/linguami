# Migration Pages Router → App Router - Summary

**Date**: 2025-01-15
**Branch**: `claude`
**Status**: ✅ Completed (except admin exercises pages)

## What Was Migrated

### ✅ Pages Migrated to App Router (26 pages)
- Homepage (`/`)
- Authentication: `/login`, `/signup`, `/reset-password`, `/settings`, `/auth/callback`, `/auth/verify-email`
- User pages: `/dictionary`, `/lessons`, `/my-materials`, `/premium`, `/statistics`, `/leaderboard`, `/privacy`, `/teacher`
- Materials: `/materials`, `/materials/[section]`, `/materials/[section]/[material]`
- Method: `/method`, `/method/[level]`, `/method/[level]/[lessonSlug]`
- Blog: `/blog`, `/blog/[slug]`
- Admin (partial): `/admin`, `/admin/users`

### ✅ Translation System Migrated
- **From**: `next-translate` (Pages Router)
- **To**: `next-intl` (App Router compatible)
- **Files updated**: 45+ components

### ✅ Components Updated (80+ files)
- Changed `useRouter` from `next/router` → `next/navigation`
- Changed `useTranslation` from `next-translate` → `next-intl`
- Added `'use client'` directives where needed
- Fixed `router.query` → `useParams()` / `useSearchParams()`

## Key Technical Changes

### Router Migration
```javascript
// OLD (Pages Router)
import { useRouter } from 'next/router'
const router = useRouter()
const { id } = router.query
if (!router.isReady) return null

// NEW (App Router)
import { useRouter, useParams, useSearchParams } from 'next/navigation'
const router = useRouter()
const params = useParams()
const searchParams = useSearchParams()
const id = params.id
const query = searchParams.get('query')
// Note: router.isReady doesn't exist in App Router
```

### Translation Migration
```javascript
// OLD (next-translate)
import useTranslation from 'next-translate/useTranslation'
const { t, lang } = useTranslation('common')

// NEW (next-intl)
import { useTranslations, useLocale } from 'next-intl'
const t = useTranslations('common')
const locale = useLocale()
```

### Critical Bug Fixes

#### 1. Material Cards Not Displaying
**Problem**: Materials filtered by `material.locale` but DB has `material.lang`
```javascript
// BEFORE (broken)
filtered_materials.filter(m => m.locale === userLearningLanguage)

// AFTER (fixed)
filtered_materials.filter(m => m.lang === userLearningLanguage)
```

#### 2. Reset Password Infinite Loading
**Problem**: Using `router.isReady` and `router.query` from Pages Router
```javascript
// BEFORE (infinite loading)
if (!router.isReady) return
const { code } = router.query

// AFTER (works)
const searchParams = useSearchParams()
const code = searchParams.get('code')
```

## What Remains in Pages Router

### ❌ Not Yet Migrated
- Admin exercise pages (7 pages):
  - `/admin/create`
  - `/admin/exercises/*` (create-mcq, create-fitb, create-drag-drop, edit/[id], preview/[id], index)
- All API routes (stay in `pages/api/`)
- Special files: `_app.js`, `_document.js`

## Environment Configuration

### For Local Development
```bash
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### For Password Reset Testing Locally
**Issue**: Supabase Site URL should point to production (`https://www.linguami.com`)
**Solutions**:
1. **Ngrok** (quick): Use ngrok URL in .env.local
2. **Separate Supabase project** (recommended): Create dev Supabase project with Site URL = localhost
3. **Skip local testing**: Test password reset only in production/staging

## File Structure Changes

```
linguami/
├── app/[locale]/              # ✅ All user-facing pages migrated here
│   ├── page.js               # Homepage
│   ├── login/page.js
│   ├── materials/[section]/page.js
│   └── ...
├── pages/                     # Only admin exercises + API routes remain
│   ├── api/                  # ✅ Stays here (not migrated)
│   ├── admin/exercises/      # ❌ To be migrated later
│   ├── _app.js              # ✅ Required file
│   └── _document.js         # ✅ Required file
├── messages/                  # ✅ NEW: next-intl translations
│   ├── en.json
│   ├── fr.json
│   └── ru.json
└── i18n/                     # ✅ NEW: next-intl config
    ├── config.ts
    ├── request.ts
    └── routing.ts
```

## Testing Checklist

- [x] Homepage loads
- [x] Material cards display correctly
- [x] Material section pages work
- [x] Method lessons load
- [x] Blog pages work
- [x] Translations work (all 3 languages)
- [x] Navigation between pages works
- [x] Reset password page loads (no infinite spinner)
- [ ] Reset password flow works (needs Supabase config)
- [ ] All user pages tested systematically

## Commits

1. `feat: complete App Router migration and cleanup` (254de2e)
   - Migrated 26 pages
   - Updated 80+ components
   - Removed duplicate Pages Router files

2. `fix: migrate reset-password page to App Router` (581f591)
   - Fixed infinite loading
   - Added useSearchParams

## Next Steps

1. **Test thoroughly** in dev environment
2. **Set up separate Supabase dev project** (recommended)
3. **Migrate admin exercise pages** to App Router
4. **Create PR** to merge `claude` → `develop` → `main`
5. **Update production env vars** before deploying

## Breaking Changes

### For Developers
- Must use `next-intl` instead of `next-translate`
- Must use `next/navigation` instead of `next/router`
- No more `router.isReady` - components render immediately
- Query params accessed via `useSearchParams()` not `router.query`

### For Users
- No breaking changes (UI/UX remains the same)

## Known Issues

1. **Password reset local testing**: Requires Supabase Site URL = localhost OR ngrok
2. **VK ID OAuth**: May need ngrok for local testing (requires HTTPS callback)

## References

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Supabase Auth with App Router](https://supabase.com/docs/guides/auth/server-side/nextjs)

---

**Migration completed by**: Claude Code
**Review needed**: Yes (before merging to main)
