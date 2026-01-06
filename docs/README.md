# Documentation Linguami

Documentation complète du projet Linguami - Plateforme d'apprentissage des langues.

**Tech Stack:** Next.js 13.4, React 18.2, Material-UI 5.10, React Query, Supabase, next-translate

---

## 📂 Structure de la documentation

```
docs/
├── README.md                          # Ce fichier
├── architecture/                      # Architecture système
│   ├── database.md                   # Base de données (tables, RLS, queries)
│   ├── state-management.md           # React Query, Server Actions, Context, localStorage
│   ├── authentication.md             # Login, OAuth, user profiles
│   └── i18n.md                       # Système de traductions 3 langues
├── method/                            # Création de lessons pour la section Method
│   ├── LESSON_CREATION_GUIDE.md      # ⚠️ MUST READ : Créer des lessons
│   ├── LESSON_TEMPLATE.json          # Template JSON complet
│   ├── LESSON_BLOCKS_REFERENCE.md    # Tous les types de blocs disponibles
│   └── AUDIO_GENERATION.md           # Génération audio dialogues (Voice IDs, TTS)
└── exercises/                         # Création d'exercices interactifs autonomes
    └── CREATION_GUIDE.md              # ⚠️ MUST READ : 3 types d'exercices
```

---

## 🚀 Quick Start

**Avant de créer du contenu, lire obligatoirement :**
1. [Method - Lesson Creation Guide](method/LESSON_CREATION_GUIDE.md) - Créer des lessons pour /method
2. [Exercises - Creation Guide](exercises/CREATION_GUIDE.md) - Créer des exercices autonomes (3 types)
3. [Database Architecture](architecture/database.md) - Tables et schémas

**Pour travailler sur une feature :**
1. Consulter [State Management](architecture/state-management.md) - Server Actions + React Query
2. Consulter [i18n System](architecture/i18n.md) - Système 3 langues

---

## 📐 Architecture

### Core System Documentation

| Documentation | Description |
|---------------|-------------|
| [Database Architecture](architecture/database.md) | Tables, schemas, RLS policies, common queries |
| [State Management](architecture/state-management.md) | React Query, Server Actions, Context, localStorage |
| [Authentication](architecture/authentication.md) | Login flow, OAuth (VK ID, Google, Facebook), user profiles |
| [i18n System](architecture/i18n.md) | Three-language concept (interface/learning/spoken) |

### Key Concepts

**Three-Language System** (⚠️ CRITICAL):
- **Interface Language** (`router.locale`) : UI language (fr/ru/en)
- **Learning Language** (`userLearningLanguage`) : Target language being studied
- **Spoken Language** (`spoken_language`) : Native language for explanations

**Data Fetching Pattern**:
- ✅ Use Server Actions (`app/actions/*.js`) + React Query
- ❌ DO NOT create API routes for App Router pages

---

## 📚 Creation Guides

### Method Lessons (Section /method)

| Guide | Description |
|-------|-------------|
| [Lesson Creation Guide](method/LESSON_CREATION_GUIDE.md) | ⚠️ **MUST READ** - Rules, workflow, 3-language system, 2-phase audio |
| [Lesson Template](method/LESSON_TEMPLATE.json) | Complete JSON template with all block types |
| [Lesson Blocks Reference](method/LESSON_BLOCKS_REFERENCE.md) | Catalogue of all available blocks (Dialogue, Grammar, Vocabulary, etc.) |
| [Audio Generation](method/AUDIO_GENERATION.md) | Voice IDs, voice mapping, TTS generation process |

### Exercises (Interactive Quizzes)

| Guide | Description |
|-------|-------------|
| [Creation Guide](exercises/CREATION_GUIDE.md) | ⚠️ **MUST READ** - 3 types only: MCQ, Fill-in-blank, Drag-and-drop |

---

## 🔗 Quick Links

### For Developers

| I want to... | Documentation |
|--------------|---------------|
| Understand the database | [Database Architecture](architecture/database.md) |
| Manage state (React Query, Server Actions) | [State Management](architecture/state-management.md) |
| Implement login | [Authentication](architecture/authentication.md) |
| Add translations | [i18n System](architecture/i18n.md) |
| Create a method lesson | [Method - Lesson Creation Guide](method/LESSON_CREATION_GUIDE.md) ⚠️ |
| Create exercises | [Exercises - Creation Guide](exercises/CREATION_GUIDE.md) ⚠️ |
| Generate audio | [Method - Audio Generation](method/AUDIO_GENERATION.md) |

### For Content Creators

| I want to... | Documentation |
|--------------|---------------|
| Create a method lesson | [Method - Lesson Creation Guide](method/LESSON_CREATION_GUIDE.md) |
| Create interactive exercises | [Exercises - Creation Guide](exercises/CREATION_GUIDE.md) |
| Understand lesson blocks | [Method - Lesson Blocks Reference](method/LESSON_BLOCKS_REFERENCE.md) |
| Generate dialogue audio | [Method - Audio Generation](method/AUDIO_GENERATION.md) |

---

## 📝 Important Notes

### ⚠️ Critical Rules

1. **Database**: Production DB ONLY - No local DB setup
2. **Data Fetching**: Use Server Actions + React Query (NOT API routes for App Router)
3. **Three Languages**: Never confuse interface/learning/spoken languages
4. **Content Creation**: ALWAYS read creation guides before starting
5. **Audio Generation**: 2-phase process (text first, audio after validation)

### Guest User Limits

Non-authenticated users get:
- **20 translations max** (cookie-based, 24h reset)
- **20 words max** in dictionary (localStorage)
- Course progress in localStorage (migrated on login)
- Dictionary in localStorage (migrated on login)

### File Storage

All media files stored in **Cloudflare R2**:
- Audio: `audios/fr/`, `audios/ru/`, `audios/en/`
- Images: `images/ui/`, `images/materials/`, `images/blog/`
- Video: `video/materials/`

Public URL: `NEXT_PUBLIC_R2_PUBLIC_URL`

---

## 📚 External Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com/)
- [next-translate Documentation](https://github.com/aralroca/next-translate)

---

**Langues supportées:** Français 🇫🇷 | Russe 🇷🇺 | Anglais 🇬🇧

**Dernière mise à jour:** 2025-12-26
