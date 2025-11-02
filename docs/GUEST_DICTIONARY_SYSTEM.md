# Système de Dictionnaire Gratuit pour Invités

## 📋 Vue d'ensemble

Les utilisateurs non connectés peuvent désormais :
- ✅ **Traduire autant de mots qu'ils veulent** (illimité)
- ✅ **Sauvegarder jusqu'à 20 mots** dans leur dictionnaire personnel
- ✅ **Réviser leurs mots avec les flashcards** (système SRS complet)
- ✅ **Ajouter des mots manuellement** via le formulaire
- ⛔ Au **21ème mot**, ils doivent s'inscrire pour continuer

---

## 🎯 Fonctionnalités

### Pour les Invités (Non connectés)

| Fonctionnalité | Limite | Stockage |
|----------------|--------|----------|
| Consulter des traductions | ♾️ Illimité | N/A |
| Sauvegarder des mots | 20 max | localStorage |
| Réviser avec flashcards | ♾️ Illimité | localStorage (SRS) |
| Ajouter manuellement | 20 max | localStorage |
| Supprimer des mots | ✅ Oui | localStorage |

### Pour les Utilisateurs Connectés

| Fonctionnalité | Limite | Stockage |
|----------------|--------|----------|
| Tout | ♾️ Illimité | Supabase |

---

## 📁 Fichiers Créés/Modifiés

### Nouveaux fichiers

1. **`utils/guestDictionary.js`**
   - Gestionnaire localStorage pour les mots des invités
   - Fonctions : `addGuestWord`, `deleteGuestWord`, `getGuestWords`, etc.
   - Limite : 20 mots max

2. **`docs/GUEST_DICTIONARY_SYSTEM.md`** (ce fichier)
   - Documentation complète du système

### Fichiers modifiés

1. **`pages/api/translations/translate.js`**
   - Simplifié : traductions gratuites illimitées
   - Suppression du tracking par IP

2. **`features/words/wordsSlice.js`**
   - Nettoyage : retrait des champs de limite de traductions
   - Simplification de `translateWord`

3. **`components/material/Translation.jsx`**
   - Ajout de la logique d'ajout de mots pour invités
   - Affichage du compteur de mots sauvegardés (X/20)
   - Blocage au 21ème mot avec message d'inscription
   - Traductions cliquables pour les ajouter

4. **`components/material/Words.jsx`**
   - Nettoyage : retrait de `isAuthenticated`

5. **`pages/dictionary/index.js`**
   - Affichage des mots invités depuis localStorage
   - Gestion de la suppression pour invités
   - Badge de compteur (X/20 mots gratuits)
   - Messages adaptés pour invités

6. **`components/games/Flashcards.jsx`**
   - Support des mots invités
   - Mise à jour SRS dans localStorage
   - Révision complète pour invités

---

## 🚀 Comment Tester

### Test 1 : Consulter des traductions (illimité)

1. **Ouvrez l'application sans vous connecter**
2. **Allez sur un matériel** (ex: un livre, une vidéo)
3. **Cliquez sur des mots** → popup de traduction s'affiche
4. ✅ **Aucune limite** : vous pouvez cliquer sur autant de mots que vous voulez

---

### Test 2 : Sauvegarder des mots (max 20)

1. **Cliquez sur un mot** pour voir sa traduction
2. **Cliquez sur une des définitions** dans la popup
3. ✅ Toast "Mot ajouté au dictionnaire"
4. **Badge affiché** : "1/20 mots sauvegardés • 19 restants"
5. **Répétez** jusqu'à 20 mots

---

### Test 3 : Vérifier le dictionnaire

1. **Allez sur `/dictionary`**
2. ✅ Vous voyez vos 20 mots sauvegardés
3. ✅ Badge en haut à droite : "X/20 mots gratuits"
4. ✅ Vous pouvez **supprimer** des mots (icône poubelle)

---

### Test 4 : Bloquer au 21ème mot

1. **Sauvegardez 20 mots** (via traductions ou ajout manuel)
2. **Essayez d'ajouter un 21ème mot**
3. ✅ Popup affiche : "Limite de 20 mots atteinte !"
4. ✅ Bouton "Créer un compte gratuit"
5. ✅ Les traductions sont **toujours consultables** (bouton désactivé)

---

### Test 5 : Réviser avec flashcards

1. **Allez sur `/dictionary`** (avec vos mots sauvegardés)
2. **Cliquez sur "Réviser avec flashcards"**
3. ✅ Les flashcards fonctionnent normalement
4. ✅ Le système SRS enregistre vos révisions dans localStorage
5. **Fermez et rouvrez** l'application
6. ✅ Vos progrès sont conservés

---

### Test 6 : Ajouter manuellement

1. **Allez sur `/dictionary`**
2. **Cliquez sur "Ajouter un mot"**
3. **Remplissez le formulaire**
4. ✅ Le mot est ajouté (compte dans la limite de 20)
5. ✅ Compteur mis à jour

---

### Test 7 : Vérifier localStorage

Ouvrez la console (F12) :

```javascript
// Voir tous les mots sauvegardés
JSON.parse(localStorage.getItem('guest_dictionary_words'))

// Compter les mots
JSON.parse(localStorage.getItem('guest_dictionary_words')).length

// Effacer le dictionnaire (pour retester)
localStorage.removeItem('guest_dictionary_words')
```

---

## 🔍 Architecture

### Stockage des Mots Invités

**Structure dans localStorage** (`guest_dictionary_words`) :

```json
[
  {
    "id": "guest_1704123456789_abc123",
    "word_ru": "привет",
    "word_fr": "bonjour",
    "word_en": null,
    "word_sentence": "Привет, как дела?",
    "word_lang": "ru",
    "material_id": "some-material-id",
    "created_at": "2025-01-02T10:30:00.000Z",
    "updated_at": "2025-01-02T10:30:00.000Z",
    "card_state": "new",
    "ease_factor": 2.5,
    "interval": 0,
    "learning_step": null,
    "next_review_date": null,
    "last_review_date": null,
    "reviews_count": 0,
    "lapses": 0,
    "is_suspended": false
  }
]
```

---

## 🛡️ Sécurité

### Peut-on contourner la limite ?

**Oui, techniquement** (localStorage est côté client) :

```javascript
// Un utilisateur peut effacer localStorage
localStorage.removeItem('guest_dictionary_words')
```

**Mais ce n'est pas grave car :**
1. L'utilisateur perd tous ses mots sauvegardés
2. Il doit recommencer à zéro
3. L'objectif est d'encourager l'inscription, pas de bloquer totalement

---

## 💡 Avantages du Système

### Pour les Utilisateurs

- ✅ **Essai complet gratuit** : 20 mots + flashcards
- ✅ **Aucune inscription forcée** pour tester
- ✅ **Traductions illimitées** pour explorer le contenu
- ✅ **Expérience fluide** : pas de popup "créez un compte" à chaque traduction

### Pour le Business

- ✅ **Conversion naturelle** : les utilisateurs voient la valeur avant de s'inscrire
- ✅ **Moins de friction** : pas de barrière à l'entrée
- ✅ **Engagement accru** : les utilisateurs testent vraiment l'app
- ✅ **Meilleure rétention** : inscription motivée par le besoin réel

---

## 📊 Analytics Suggérées

Pour comprendre le comportement des utilisateurs :

```javascript
// À implémenter (optionnel)
- Nombre moyen de mots sauvegardés avant inscription
- Taux de conversion (invités atteignant 20 mots → inscrits)
- Nombre de révisions flashcards en mode invité
- Temps moyen avant première inscription
```

---

## 🔄 Migration vers Compte Utilisateur

### Futur : Migrer les mots invités lors de l'inscription

**Fonction suggérée** (à implémenter plus tard) :

```javascript
async function migrateGuestWords(userId) {
  const guestWords = exportGuestWords() // depuis guestDictionary.js

  // Ajouter chaque mot à Supabase avec le userId
  for (const word of guestWords) {
    await supabase.from('user_words').insert({
      ...word,
      user_id: userId
    })
  }

  // Effacer localStorage
  clearGuestWords()
}
```

---

## 🎨 Messages Clés

### Dans Translation.jsx (invités)

- **Badge** : "X/20 mots sauvegardés • Y restants"
- **Info** : "💡 Cliquez sur une traduction pour l'ajouter à votre dictionnaire (X emplacements restants)"
- **Limite atteinte** : "Limite de 20 mots atteinte ! Créez un compte pour continuer."

### Dans Dictionary (invités sans mots)

- **Titre** : "Testez gratuitement avec 20 mots !"
- **Description** : "Vous pouvez sauvegarder jusqu'à 20 mots gratuitement et les réviser avec les flashcards. Créez un compte pour un accès illimité !"

### Dans Dictionary (invités avec mots)

- **Badge** : "X/20 mots gratuits" (rouge si 20/20, bleu sinon)

---

## 🐛 Debugging

### Problème : Les mots ne s'affichent pas

```javascript
// Console
console.log(JSON.parse(localStorage.getItem('guest_dictionary_words')))

// Vérifier la langue d'apprentissage
console.log(document.querySelector('[data-learning-language]'))
```

### Problème : Le compteur ne se met pas à jour

Rafraîchir la page ou vérifier la console pour les erreurs.

### Problème : Les flashcards ne fonctionnent pas

Vérifier que les mots ont bien tous les champs SRS :
- `card_state`
- `ease_factor`
- `interval`
- etc.

---

## ✅ Checklist de Test Complet

- [ ] Traductions illimitées pour invités
- [ ] Ajout de 1er mot → toast + compteur affiché
- [ ] Ajout de 20ème mot → compteur à 20/20
- [ ] Tentative d'ajout 21ème mot → blocage + message
- [ ] Dictionnaire affiche les 20 mots
- [ ] Suppression d'un mot fonctionne
- [ ] Flashcards fonctionnent avec mots invités
- [ ] Progression SRS sauvegardée dans localStorage
- [ ] Ajout manuel via formulaire compte dans la limite
- [ ] Badge de compteur visible et correct
- [ ] Messages adaptés selon statut (invité vs connecté)

---

## 🔮 Améliorations Futures

- [ ] Migration automatique des mots lors de l'inscription
- [ ] Analytics du comportement des invités
- [ ] A/B test : 20 mots vs 10 mots vs 30 mots
- [ ] Export des mots en CSV pour invités
- [ ] Suggestion "Créez un compte" au 15ème mot (avant limite)

---

**Créé le :** 2025-01-02
**Version :** 2.0
**Auteur :** Claude Code
**Statut :** ✅ Prêt pour production
