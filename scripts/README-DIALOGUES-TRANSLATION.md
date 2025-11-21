# 🔄 Traduction des dialogues RU → FR (Production)

## 📊 État actuel

**Production DB:**
- 🇷🇺 Dialogues russes: **24**
- 🇫🇷 Dialogues français: **7**
- ❌ Manquants en français: **19**

## 🔄 Processus de traduction

### ✅ Étape 1: Identification (FAIT)

```bash
node scripts/prepare-dialogues-translation.js
```

**Résultat:** Fichier `dialogues-to-translate.json` créé avec **19 dialogues** à traduire.

### 📝 Étape 2: Traduction (À FAIRE)

Ouvrir `scripts/dialogues-to-translate.json` et remplir pour chaque dialogue :
- `title_fr` : Titre en français
- `content_fr` : Contenu traduit en français

**Structure du fichier:**
```json
{
  "original_title_ru": "Где находится банк?",
  "original_content_ru": "— Добрый день...",
  "title_fr": "",        ← REMPLIR ICI
  "content_fr": "",      ← REMPLIR ICI
  "level": "beginner"
}
```

### 🚀 Étape 3: Insertion (À FAIRE)

Une fois TOUTES les traductions complétées:

```bash
node scripts/insert-dialogues-translated.js
```

**Ce script va:**
1. ✅ Vérifier que toutes les traductions sont complètes
2. 🔄 Générer les slugs automatiquement
3. ⏱️ Attendre 5 secondes (temps pour annuler avec Ctrl+C)
4. 💾 Insérer les 19 nouveaux dialogues français dans la **DB de production**

## 📋 Liste des 19 dialogues à traduire

1. **Где находится банк?** (beginner) - 637 chars
2. **В банке** (intermediate) - 1273 chars
3. **В кассе кинотеатра** (beginner) - 444 chars
4. **В обувном магазине** (beginner) - 1337 chars
5. **В магазине одежды** (beginner) - 1182 chars
6. **На рынке** (beginner) - 853 chars
7. **В продуктовом магазине** (beginner) - 645 chars
8. **В магазине канцтоваров** (beginner) - 711 chars
9. **В ресторане** (beginner) - 1191 chars
10. **Времена года** (beginner) - 1070 chars
11. **В кафе** (beginner) - 878 chars
12. **В магазине электроники** (beginner) - 1187 chars
13. **В цветочном магазине** (beginner) - 1001 chars
14. **Любимое блюдо** (intermediate) - 947 chars
15. **В автобусе** (intermediate) - 894 chars
16. **В аптеке** (intermediate) - 950 chars
17. **В книжном магазине** (beginner) - 1241 chars
18. **Семья** (beginner) - 772 chars
19. **У доктора** (intermediate) - 1160 chars

**Total:** ~19,000 caractères à traduire

## ⚠️ Important

- ✅ Scripts configurés pour **DB de production** (`.env.production`)
- ✅ Les images/vidéos restent les mêmes que les dialogues russes
- ✅ Les slugs sont générés automatiquement depuis `title_fr`
- ✅ Validation automatique avant insertion
- ✅ Délai de sécurité de 5 secondes avant insertion

## 🛡️ Sécurité

Le script d'insertion:
- Vérifie que TOUS les champs sont remplis
- Affiche un aperçu complet avant insertion
- Attend 5 secondes (annulation possible avec Ctrl+C)
- Insère les dialogues un par un
- Affiche les erreurs en cas de problème
- Compte les succès/échecs

## 📁 Fichiers générés

- `dialogues-to-translate.json` - Template pour traduction
- `.env.production` - Credentials production (⚠️ ne pas commiter)
