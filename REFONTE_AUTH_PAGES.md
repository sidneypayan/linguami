# Refonte des pages d'authentification

## 📋 Résumé des changements

Les pages d'authentification ont été séparées et redessinées pour suivre l'identité visuelle de Linguami.

### Avant
- ❌ Une seule page `/signin` avec toggle entre connexion et inscription
- ❌ Formulaire d'inscription très long (7 champs + avatar)
- ❌ Mauvais SEO (URL non sémantique)
- ❌ Impossible de partager un lien direct d'inscription

### Après
- ✅ Deux pages séparées : `/login` et `/signup`
- ✅ URLs sémantiques et SEO-friendly
- ✅ Design moderne suivant l'identité Linguami
- ✅ Composants réutilisables
- ✅ Rétrocompatibilité avec `/signin` (redirection automatique)

---

## 📁 Nouveaux fichiers créés

### Pages
- `pages/login.js` - Page de connexion simplifiée
- `pages/signup.js` - Page d'inscription complète avec onboarding
- `pages/signin.js` - Page de redirection pour compatibilité

### Composants partagés
- `components/auth/AuthLayout.jsx` - Layout commun pour auth pages
- `components/auth/OAuthButtons.jsx` - Boutons OAuth (Google, Facebook)
- `components/auth/FlagIcons.jsx` - Composants drapeaux pour sélection de langue

### Migrations SQL
- `database/applied/2025/migration_fix_language_constraints.sql` - Correction des contraintes de langue (en, fr, ru)
- `database/applied/2025/migration_update_avatar_ids.sql` - Extension de la contrainte avatar_id (14 avatars)

---

## 🎨 Design

### Identité visuelle respectée
- **Gradients principaux** : Violet (#667eea) → Mauve (#764ba2)
- **Gradients secondaires** : Violet (#8b5cf6) → Cyan (#06b6d4)
- **Font** : Poppins
- **Effets** : Animations fluides, glassmorphism, ombres portées

### Améliorations UX
- Logo cliquable pour retour à l'accueil
- Transitions et animations fluides
- Sélecteur d'avatar avec Collapse animation
- Indicateur de force du mot de passe en temps réel
- Validation des champs en temps réel
- Responsive design (mobile-first)

---

## 🔄 Redirections et compatibilité

| Ancienne route | Nouvelle route |
|----------------|----------------|
| `/signin` | → `/login` |
| `/signin?mode=signup` | → `/signup` |

Tous les liens internes ont été mis à jour :
- ✅ Navbar (mobile et desktop)
- ✅ Footer
- ✅ BottomNav
- ✅ Dictionary
- ✅ Material Translation
- ✅ Update Password

---

## 🗄️ Migrations à appliquer

### 1. Correction des contraintes de langue

```bash
# Via l'interface Supabase SQL Editor
# Copiez et exécutez : database/applied/2025/migration_fix_language_constraints.sql
```

Cette migration :
- ✅ Migre les données existantes (`'english'` → `'en'`, etc.)
- ✅ Met à jour les contraintes pour accepter les codes courts

### 2. Extension des avatars

```bash
# Via l'interface Supabase SQL Editor
# Copiez et exécutez : database/applied/2025/migration_update_avatar_ids.sql
```

Cette migration :
- ✅ Étend la contrainte de 10 à 14 avatars disponibles

---

## ✅ Tests à effectuer

### 1. Test de connexion
1. Naviguez vers `http://localhost:3000/login`
2. Entrez vos identifiants
3. Vérifiez la redirection vers `/`
4. Vérifiez que l'utilisateur est bien connecté

### 2. Test d'inscription
1. Naviguez vers `http://localhost:3000/signup`
2. Remplissez tous les champs requis :
   - Pseudo (min 3 caractères)
   - Email
   - Mot de passe (avec validation)
   - Langue parlée
   - Langue d'apprentissage (filtrée)
   - Niveau de langue
   - Avatar
3. Vérifiez les validations :
   - ✅ Indicateur de force du mot de passe
   - ✅ Vérification de l'unicité du pseudo
   - ✅ Impossibilité de choisir la même langue parlée et d'apprentissage
4. Soumettez le formulaire
5. Vérifiez la création du compte dans Supabase

### 3. Test de rétrocompatibilité
1. Naviguez vers `http://localhost:3000/signin`
   - Doit rediriger vers `/login`
2. Naviguez vers `http://localhost:3000/signin?mode=signup`
   - Doit rediriger vers `/signup`

### 4. Test des OAuth
1. Cliquez sur le bouton Google
2. Vérifiez la redirection vers Google OAuth
3. Idem pour Facebook

### 5. Test responsive
1. Testez sur mobile (DevTools)
2. Testez sur tablette
3. Testez sur desktop
4. Vérifiez que le design est adaptatif

---

## 🐛 Dépannage

### Erreur "Database error saving new user"
- ✅ Vérifiez que les migrations SQL ont été appliquées
- ✅ Vérifiez que les contraintes acceptent bien `'en'`, `'fr'`, `'ru'`

### Erreur "check constraint violated"
- ✅ Vérifiez la contrainte `check_avatar_id` (doit accepter 14 avatars)
- ✅ Vérifiez les contraintes de langue

### Le sélecteur d'avatar ne s'affiche pas
- ✅ Vérifiez que `NEXT_PUBLIC_SUPABASE_IMAGE` est défini dans `.env.local`
- ✅ Vérifiez que les images d'avatar existent dans le bucket Supabase

---

## 📝 Notes

- L'ancienne page `pages/signin.js` a été sauvegardée dans `pages/signin.js.backup`
- La nouvelle page `pages/signin.js` est une simple redirection
- Tous les composants utilisent Material-UI v5
- Les traductions utilisent next-translate

---

## 🚀 Prochaines étapes (optionnel)

1. **Onboarding multi-étapes** : Diviser le formulaire d'inscription en plusieurs étapes
2. **Validation côté serveur** : Ajouter une validation supplémentaire dans l'API
3. **Tests E2E** : Ajouter des tests Cypress/Playwright
4. **Analytics** : Tracker les conversions signup/login
5. **A/B Testing** : Tester différentes variantes du design
