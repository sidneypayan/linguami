# 🚀 Pre-Production Checklist

**Date:** 2025-11-19
**Changes:** Blog migration to Supabase, XP system fixes, dev environment setup

---

## 🔐 1. Authentication & User Management

### Guest Users
- [ ] Can browse materials without login
- [ ] Can view blog posts
- [ ] Can access dictionary (with 20/day limit)
- [ ] Are redirected to login when accessing protected pages

### Registered Users
- [ ] Can register with email/password
- [ ] Can login with email/password
- [ ] Can login with Google OAuth
- [ ] Can login with VK OAuth
- [ ] Can login with Facebook OAuth
- [ ] Receive email verification link
- [ ] Can reset password via email
- [ ] Session persists after page reload

### User Profile
- [ ] Can update username
- [ ] Can update spoken language (fr/ru/en)
- [ ] Can update learning language (fr/ru)
- [ ] Can update daily XP goal (50/100/200/300/0)
- [ ] Profile picture updates correctly
- [ ] Settings save without errors

---

## 🎯 2. XP & Gamification System

### XP Rewards
- [ ] **Flashcards:**
  - [ ] "Again" button: 0 XP
  - [ ] "Hard" button: 1 XP
  - [ ] "Good" button: 2 XP
  - [ ] "Easy" button: 3 XP
- [ ] **Adding word to dictionary:** 3 XP + 1 Gold
- [ ] **Completing MCQ exercise:** 10 XP + 2 Gold
- [ ] **Completing Fill-in-blank exercise:** 15 XP + 3 Gold
- [ ] **Completing Drag-and-drop exercise:** 20 XP + 4 Gold
- [ ] **Completing material:** 25 XP + 5 Gold
- [ ] **Completing lesson:** 50 XP + 10 Gold
- [ ] **Daily login:** 5 XP + 1 Gold

### XP Display
- [ ] XP updates in real-time after action
- [ ] Level up notification appears
- [ ] Progress bar animates smoothly
- [ ] Total XP displayed correctly in navbar
- [ ] Gold count updates correctly

### Goals & Streaks
- [ ] Daily goal displays correct target (from settings)
- [ ] Daily goal progress updates after XP gain
- [ ] Weekly goal tracks correctly
- [ ] Monthly goal tracks correctly
- [ ] Daily streak increments on consecutive days
- [ ] Streak resets after missing a day
- [ ] Best streak record updates

### Statistics Page
- [ ] All XP stats display correctly
- [ ] Level and progress bar accurate
- [ ] Daily/weekly/monthly goals visible
- [ ] Vocabulary stats accurate
- [ ] Materials stats accurate
- [ ] Badges display correctly

---

## 📚 3. Blog System (NEW - Supabase Migration)

### Blog Listing Page (/blog)
- [ ] All blog posts load correctly
- [ ] Posts display in correct order (newest first)
- [ ] Images load correctly
- [ ] Pagination works (if applicable)
- [ ] Search/filter works (if applicable)
- [ ] Posts display in all 3 languages (fr/ru/en)

### Blog Post Page (/blog/[slug])
- [ ] Post content displays correctly
- [ ] Images load from R2
- [ ] Code blocks render correctly (if any)
- [ ] Metadata (title, description) correct
- [ ] SEO meta tags present
- [ ] Social share buttons work
- [ ] Comments section works (if enabled)

### Admin - Blog Management (/admin/blog)
- [ ] Can create new post
- [ ] Can edit existing post
- [ ] Can delete post
- [ ] Can upload images
- [ ] Can set featured image
- [ ] Can publish/unpublish
- [ ] Draft posts not visible to users
- [ ] Published posts visible immediately

---

## 📖 4. Materials System

### Materials Listing (/materials/[section])
- [ ] Materials load for all sections:
  - [ ] dialogues
  - [ ] culture
  - [ ] grammar
  - [ ] vocabulary
  - [ ] videos
  - [ ] reading
  - [ ] games
- [ ] Filters work correctly:
  - [ ] By level (beginner/intermediate/advanced)
  - [ ] By language (fr/ru)
  - [ ] By category
- [ ] Images display correctly (or fallback)
- [ ] Material cards clickable
- [ ] "My Materials" filter works

### Material Detail Page
- [ ] Content loads correctly
- [ ] Audio plays (if present)
- [ ] Video plays (if present)
- [ ] Exercises load (if present)
- [ ] "Mark as completed" works
- [ ] XP awarded on completion
- [ ] Progress saves correctly
- [ ] Can add to "My Materials"

---

## 🎓 5. Method Courses System

### Course Listing (/method/[level])
- [ ] Courses load for all levels:
  - [ ] beginner
  - [ ] intermediate
  - [ ] advanced
- [ ] Course cards display correctly
- [ ] Progress percentage accurate
- [ ] Locked courses show lock icon
- [ ] Free courses accessible

### Lesson Page (/method/[level]/[lessonSlug])
- [ ] Lesson blocks load in correct order
- [ ] Blocks display based on spoken language (blocks_fr/ru/en)
- [ ] Audio plays correctly for:
  - [ ] Dialogue lines
  - [ ] Grammar examples
  - [ ] Vocabulary words
  - [ ] Table content
- [ ] Exercises embedded correctly
- [ ] "Mark as complete" awards XP
- [ ] Progress saves

---

## 📝 6. Exercises System

### MCQ (Multiple Choice)
- [ ] Questions display correctly
- [ ] Options randomized (if configured)
- [ ] Correct answer validates
- [ ] Wrong answer shows feedback
- [ ] XP awarded on completion (10 XP)
- [ ] Can retry after failure

### Fill-in-blank
- [ ] Blanks display correctly
- [ ] User can type answer
- [ ] Answer validation works
- [ ] Accents/special characters handled
- [ ] XP awarded on completion (15 XP)
- [ ] Audio plays for sentences (if available)

### Drag-and-drop
- [ ] Draggable items work
- [ ] Drop zones accept items
- [ ] Correct placement validates
- [ ] Wrong placement shows feedback
- [ ] XP awarded on completion (20 XP)
- [ ] Mobile touch works

---

## 📚 7. Dictionary & Flashcards

### Dictionary Page (/dictionary)
- [ ] Can search words
- [ ] Can add translation manually
- [ ] Yandex API integration works
- [ ] Translations save to database
- [ ] Guest users limited to 20/day
- [ ] Logged users unlimited
- [ ] XP awarded when adding word (3 XP)

### Flashcards (SRS System)
- [ ] Words appear based on SRS algorithm
- [ ] Next review date calculated correctly
- [ ] Card states transition correctly:
  - [ ] New → Learning → Review → Relearning
- [ ] Buttons work:
  - [ ] Again (0 XP)
  - [ ] Hard (1 XP)
  - [ ] Good (2 XP)
  - [ ] Easy (3 XP)
- [ ] Interval increases correctly
- [ ] Ease factor adjusts
- [ ] Audio pronunciation plays
- [ ] Reverse mode works (translation → word)
- [ ] Session limit setting works

---

## 👑 8. Premium Features

### Premium Check
- [ ] Free users see premium wall
- [ ] Premium users access all content
- [ ] Premium badge displays correctly
- [ ] Stripe payment flow works (if enabled)
- [ ] Premium status persists

---

## 🔧 9. Admin Panel (/admin)

### Access Control
- [ ] Only admin users can access
- [ ] Non-admin redirected with error
- [ ] Admin badge visible in navbar

### Admin Functions
- [ ] Can view all users
- [ ] Can edit user roles
- [ ] Can view analytics
- [ ] Can manage content
- [ ] Can access blog admin
- [ ] Can access materials admin

---

## 🌍 10. Internationalization (i18n)

### Language Switching
- [ ] Interface changes to FR
- [ ] Interface changes to RU
- [ ] Interface changes to EN
- [ ] URL changes (/fr, /ru, /en)
- [ ] All pages translate correctly
- [ ] Fallback to default language works

### Content Filtering
- [ ] Materials filter by learning language
- [ ] Courses filter by learning language
- [ ] Exercises display correct language content

---

## 🎨 11. UI & UX

### Dark Mode
- [ ] Toggle switches correctly
- [ ] All pages support dark mode
- [ ] Colors readable in both modes
- [ ] Preference persists

### Mobile Responsive
- [ ] Test on mobile viewport (< 600px)
- [ ] Bottom navigation works on mobile
- [ ] Drawer menu works
- [ ] Touch interactions work
- [ ] Forms usable on mobile

### Performance
- [ ] Pages load in < 3 seconds
- [ ] Images lazy load
- [ ] No console errors
- [ ] No memory leaks
- [ ] Smooth animations

---

## 🐛 12. Critical Paths (Must Work!)

### Happy Path - New User
1. [ ] Register account
2. [ ] Verify email
3. [ ] Set learning language
4. [ ] Browse materials
5. [ ] Complete first material
6. [ ] Gain XP and level up
7. [ ] Review daily goal progress

### Happy Path - Existing User
1. [ ] Login
2. [ ] View statistics
3. [ ] Review flashcards
4. [ ] Complete lesson
5. [ ] Check leaderboard (if enabled)

### Critical Errors to Check
- [ ] No 500 errors on any page
- [ ] No infinite loading states
- [ ] No broken images (check R2 URLs)
- [ ] No auth loops
- [ ] No data loss on save

---

## 📊 13. Database Integrity

### Production DB Check
- [ ] All tables exist
- [ ] RLS policies active
- [ ] Indexes created
- [ ] Foreign keys intact
- [ ] No orphaned records
- [ ] Migrations applied

---

## 🔍 14. SEO & Meta

### Meta Tags
- [ ] All pages have title
- [ ] All pages have description
- [ ] Open Graph tags present
- [ ] Twitter Card tags present
- [ ] Canonical URLs correct

### Sitemap & Robots
- [ ] /sitemap.xml accessible
- [ ] /robots.txt correct
- [ ] No index on admin pages

---

## ✅ Final Checks

### Before Deploy
- [ ] All tests pass (`npm run test` if applicable)
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors (`npm run type-check` if applicable)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Environment variables set in production
- [ ] Backup production database
- [ ] Backup R2 bucket (if applicable)

### After Deploy
- [ ] Homepage loads
- [ ] Login works
- [ ] Test one material
- [ ] Test one exercise
- [ ] Test one blog post
- [ ] Check error logs
- [ ] Monitor for 30 minutes

---

## 🚨 Rollback Plan

If critical issues occur:
1. Revert to previous deployment
2. Check error logs in Vercel/hosting platform
3. Check Supabase logs
4. Restore database backup if needed

---

**Good luck! 🍀**
