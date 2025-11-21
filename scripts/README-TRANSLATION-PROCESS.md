# Processus de traduction des matériaux RU → FR

## 📋 Vue d'ensemble

Ce processus permet de traduire les 14 matériaux russes en français pour avoir le même contenu dans les deux langues.

## 🔄 Étapes

### ✅ Étape 1 : Extraction (FAIT)

```bash
node scripts/prepare-ru-to-fr-translations.js
```

**Résultat :** Fichier `ru-to-fr-translations.json` créé avec 14 matériaux à traduire.

### 📝 Étape 2 : Traduction (À FAIRE)

Ouvrir `scripts/ru-to-fr-translations.json` et remplir les champs :
- `title_fr` : Titre traduit en français
- `content_fr` : Contenu traduit en français

**Exemple :**
```json
{
  "original_title_ru": "В ресторане",
  "original_content_ru": "...",
  "title_fr": "Au restaurant",  ← REMPLIR ICI
  "content_fr": "...",           ← REMPLIR ICI
}
```

### 🚀 Étape 3 : Insertion (À FAIRE)

Une fois toutes les traductions complétées :

```bash
node scripts/insert-translated-materials.js
```

**Ce script va :**
1. Vérifier que toutes les traductions sont complètes
2. Générer les slugs automatiquement
3. Attendre 5 secondes (pour annuler si besoin)
4. Insérer les 14 nouveaux matériaux français dans la DB de production

## 📊 Matériaux à traduire

1. **В ресторане** (dialogues, beginner) - 2230 chars
2. **В аэропорту** (dialogues, intermediate) - 21 chars
3. **Красная площадь** (culture, intermediate) - 74 chars
4. **Эрмитаж** (culture, advanced) - 16 chars
5. **Маленький кот** (short-stories, beginner) - 26 chars
6. **Учим русский** (podcasts, beginner) - 23 chars
7. **Озеро Байкал** (beautiful-places, intermediate) - 15 chars
8. **Карелия** (beautiful-places, advanced) - 23 chars
9. **Илья Муромец** (legends, advanced) - 26 chars
10. **День в Москве** (slices-of-life, intermediate) - 21 chars
11. **Ералаш - Эпизод 1** (eralash, beginner) - 20 chars
12. **Галилео - Наука** (galileo, intermediate) - 16 chars
13. **Маша и Медведь** (cartoons, beginner) - 23 chars
14. **Кино - Группа крови** (rock, intermediate) - 12 chars

## ⚠️ Important

- Les scripts travaillent sur la **BASE DE DONNÉES DE PRODUCTION**
- Les images/vidéos seront les mêmes que les matériaux russes
- Le champ `author_fr` peut être laissé vide ou traduit si nécessaire
- Les slugs seront générés automatiquement à partir des `title_fr`

## 🛡️ Sécurité

Le script d'insertion :
- Vérifie que toutes les traductions sont complètes
- Affiche un aperçu avant insertion
- Attend 5 secondes pour permettre d'annuler (Ctrl+C)
- Insère les matériaux un par un avec gestion d'erreurs
