# Ordre d'exécution des fichiers SQL - Méthode Linguami

## 📋 Principe de base

**Un cours ne doit JAMAIS être traduit dans la langue qu'il enseigne.**

- **Cours de RUSSE** → Disponible pour FR et EN uniquement (pas RU)
- **Cours de FRANÇAIS** → Disponible pour RU et EN uniquement (pas FR)

## 🗂️ Structure finale

### Cours de RUSSE (`premiers-pas`)
- **Interface FR** (`lang='fr'`) → `blocks_fr` (explications en français)
- **Interface EN** (`lang='en'`) → `blocks_en` (explications en anglais)
- ❌ Pas de `lang='ru'` ni `blocks_ru`

### Cours de FRANÇAIS (`premiers-pas-francais`)
- **Interface RU** (`lang='ru'`) → `blocks_ru` (explications en russe)
- **Interface EN** (`lang='en'`) → `blocks_en` (explications en anglais)
- ❌ Pas de `lang='fr'` ni `blocks_fr`

## 🚀 Ordre d'exécution (nouvelle installation propre)

### 1. Migrations
```sql
-- Structure de base
supabase/migrations/create_courses_structure.sql
supabase/migrations/20250111_add_multilingual_objectives.sql
supabase/migrations/20250111_add_multilingual_blocks.sql
```

### 2. Cours de RUSSE (pour francophones et anglophones)
```sql
-- Créer cours + leçons pour FR et EN
supabase/seed/fix_courses_multilang_corrected.sql

-- Ajouter le contenu enrichi français
supabase/seed/update_se_presenter_complete_content.sql

-- Traduction anglaise
supabase/seed/translate_se_presenter_en.sql
```

### 3. Cours de FRANÇAIS (pour russophones et anglophones)
```sql
-- Créer le cours pour RU et EN
supabase/seed/create_french_learning_course_corrected.sql

-- Créer la leçon avec blocks_fr (interface FR comme base)
supabase/seed/lesson_french_se_presenter_fr.sql

-- Créer leçon pour interface RU
supabase/seed/lesson_french_se_presenter_ru_insert.sql

-- Ajouter blocks_ru
supabase/seed/lesson_french_se_presenter_ru.sql

-- Créer leçon pour interface EN
supabase/seed/lesson_french_se_presenter_en_insert.sql

-- Ajouter blocks_en
supabase/seed/lesson_french_se_presenter_en.sql
```

### 4. Traductions des objectifs
```sql
supabase/seed/add_objectives_translations.sql
```

## 🧹 Nettoyage (si DB existante avec erreurs)

Si tu as déjà exécuté les anciens fichiers qui créaient les cours illogiques :

```sql
-- Supprimer cours de russe pour russophones et cours de français pour francophones
supabase/seed/cleanup_illogical_courses.sql
```

## ✅ Résultat attendu

### Interface FRANÇAISE (`/fr/method/debutant`)
- ✅ Cours "Premiers pas en russe" (apprendre le russe)
- ❌ PAS de cours de français

### Interface RUSSE (`/ru/method/debutant`)
- ✅ Cours "Первые шаги во французском" (apprendre le français)
- ❌ PAS de cours de russe

### Interface ANGLAISE (`/en/method/debutant`)
- ✅ Cours "First steps in Russian" (apprendre le russe)
- ✅ Cours "First steps in French" (apprendre le français)

## 📊 Base de données finale

### Table `courses`
| slug | lang | Pour qui | Contenu |
|------|------|----------|---------|
| premiers-pas | fr | Francophones | Apprendre le russe |
| premiers-pas | en | Anglophones | Apprendre le russe |
| premiers-pas-francais | ru | Russophones | Apprendre le français |
| premiers-pas-francais | en | Anglophones | Apprendre le français |

### Table `course_lessons` - Colonnes blocks utilisées
| Course slug | lang | blocks_fr | blocks_ru | blocks_en |
|-------------|------|-----------|-----------|-----------|
| premiers-pas | fr | ✅ | ❌ | ❌ |
| premiers-pas | en | ❌ | ❌ | ✅ |
| premiers-pas-francais | ru | ❌ | ✅ | ❌ |
| premiers-pas-francais | en | ❌ | ❌ | ✅ |

## 🔍 Vérification

### Vérifier qu'il n'y a pas de doublons
```sql
-- Cette requête doit retourner exactement 4 lignes
SELECT slug, lang, title_fr, title_ru, title_en
FROM courses
WHERE level_id = (SELECT id FROM course_levels WHERE slug = 'debutant')
ORDER BY slug, lang;
```

### Vérifier les leçons
```sql
-- Doit retourner 4 leçons
SELECT
  c.slug as course_slug,
  c.lang,
  cl.slug as lesson_slug,
  CASE WHEN cl.blocks_fr IS NOT NULL THEN 'FR' ELSE '-' END as has_fr,
  CASE WHEN cl.blocks_ru IS NOT NULL THEN 'RU' ELSE '-' END as has_ru,
  CASE WHEN cl.blocks_en IS NOT NULL THEN 'EN' ELSE '-' END as has_en
FROM course_lessons cl
JOIN courses c ON c.id = cl.course_id
WHERE c.level_id = (SELECT id FROM course_levels WHERE slug = 'debutant')
ORDER BY c.slug, c.lang;
```

## 📝 Notes importantes

1. **Ne JAMAIS créer** `blocks_ru` pour le cours de russe
2. **Ne JAMAIS créer** `blocks_fr` pour le cours de français
3. Les colonnes `blocks_` non utilisées doivent rester `NULL`
4. Un anglophone peut apprendre les deux langues (FR et RU)
5. Les titres doivent être clairs sur la langue enseignée
