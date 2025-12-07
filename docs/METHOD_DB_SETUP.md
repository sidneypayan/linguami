# Configuration DB pour Method Pages

## Problème résolu

Quand vous travaillez sur le contenu des cours (JSONB dans `course_lessons`), vous deviez :
1. ❌ Modifier en DB dev
2. ❌ Dupliquer manuellement vers DB prod
3. ❌ Ou faire des syncs réguliers

## Solution

Les pages `/method` et enfants utilisent **la DB PROD même en local** pour éviter la duplication de contenu.

## Configuration

### 1. Ajouter les credentials prod dans `.env.local`

```bash
# Copier depuis .env.production
NEXT_PUBLIC_SUPABASE_PROD_URL=https://votre-projet-prod.supabase.co
NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY=eyJ...
```

### 2. Vérifier que ça fonctionne

En local, ouvrez la console :
```
🎓 Method pages using: PROD DB
```

## Protection des utilisateurs

### Option 1 : Utiliser `is_published` (déjà en place)

**En développement local :**
```javascript
// Afficher TOUTES les leçons (y compris brouillons)
const { data } = await supabase
  .from('course_lessons')
  .select('*')
  // PAS de filtre is_published = true
```

**En production :**
```javascript
// Afficher SEULEMENT les leçons publiées
const { data } = await supabase
  .from('course_lessons')
  .select('*')
  .eq('is_published', true)  // ← Protection
```

### Option 2 : Utiliser un flag d'environnement

```javascript
const showUnpublished = process.env.NODE_ENV === 'development'

const { data } = await supabase
  .from('course_lessons')
  .select('*')
  .eq('is_published', showUnpublished ? undefined : true)
```

## Workflow recommandé

1. **Créer une leçon en local** → `is_published = false`
2. **Modifier le contenu JSONB** → Visible seulement en local
3. **Tester en local** → Pas d'impact sur les users prod
4. **Publier** → `is_published = true` → Visible en prod

## Sécurités

✅ **Authentification séparée** : Les users de dev ne voient pas les users de prod
✅ **Progression séparée** : `user_course_progress` reste en DB dev
✅ **Lecture seule recommandée** : Modifier seulement les leçons, pas les autres tables

## ⚠️ Précautions

- ❌ Ne JAMAIS supprimer de leçons publiées en prod via local
- ❌ Ne pas modifier les users/auth en DB prod
- ✅ Toujours tester avec `is_published = false` d'abord
- ✅ Faire des backups avant modifications importantes

## Commandes utiles

```bash
# Vérifier quelle DB est utilisée
grep SUPABASE_PROD .env.local

# Lister les leçons non publiées (en cours de dev)
psql $PROD_URL -c "SELECT id, slug, title_fr FROM course_lessons WHERE is_published = false"

# Publier une leçon
psql $PROD_URL -c "UPDATE course_lessons SET is_published = true WHERE slug = 'ma-lecon'"
```

## Rollback vers DB dev

Si vous voulez revenir à l'ancien système (DB dev séparée), supprimez simplement les variables :

```bash
# Dans .env.local
# NEXT_PUBLIC_SUPABASE_PROD_URL=  ← Commenter ou supprimer
# NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY=  ← Commenter ou supprimer
```

Le système rebasculera automatiquement sur la DB dev.
