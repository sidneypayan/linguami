# Configuration des Emails Multilingues - Linguami

Ce guide explique comment configurer et utiliser le système d'emails multilingues avec Supabase Edge Functions et Resend.

## 🎯 Vue d'ensemble

Le système envoie automatiquement des emails dans la langue de l'interface de l'utilisateur (FR, EN, RU) pour:
- ✅ Confirmation d'inscription
- 🔐 Réinitialisation de mot de passe

## 📦 Installation

### 1. Installer Supabase CLI

```bash
npm install -g supabase
```

### 2. Se connecter à Supabase

```bash
supabase login
```

### 3. Lier votre projet

```bash
cd D:/linguami
supabase link --project-ref YOUR_PROJECT_REF
```

Pour trouver votre `PROJECT_REF`:
- Allez sur [app.supabase.com](https://app.supabase.com)
- Ouvrez votre projet Linguami
- L'URL ressemble à: `https://app.supabase.com/project/ABC123` → `ABC123` est votre ref

## 🔑 Configuration Resend

### 1. Créer un compte Resend

1. Allez sur [resend.com](https://resend.com)
2. Créez un compte gratuit (3000 emails/mois)
3. Vérifiez votre email

### 2. Configurer votre domaine

**Option A - Domaine personnalisé (Recommandé pour la production):**
1. Dans Resend Dashboard → Domains → Add Domain
2. Entrez `linguami.com` (ou votre domaine)
3. Ajoutez les enregistrements DNS fournis:
   - SPF, DKIM, DMARC records
4. Attendez la vérification (quelques minutes à quelques heures)

**Option B - Domaine de test (Pour le développement):**
Resend fournit automatiquement `onboarding@resend.dev` pour les tests.

### 3. Générer une clé API

1. Resend Dashboard → API Keys → Create API Key
2. Nom: "Linguami Production" (ou "Linguami Dev")
3. Permission: "Sending access"
4. Domaine: "All domains" ou sélectionner votre domaine
5. Copiez la clé (commence par `re_...`)

## 🚀 Déploiement des Edge Functions

### 1. Configurer les secrets

```bash
# Ajouter votre clé Resend
supabase secrets set RESEND_API_KEY=re_votre_clé_ici

# Vérifier les secrets configurés
supabase secrets list
```

### 2. Déployer les fonctions

```bash
# Déployer toutes les fonctions
supabase functions deploy send-confirmation-email
supabase functions deploy send-reset-password-email
```

Vous devriez voir:
```
✓ Deployed Function send-confirmation-email
✓ Deployed Function send-reset-password-email
```

### 3. Vérifier le déploiement

Allez dans Supabase Dashboard → Edge Functions. Vous devriez voir vos 2 fonctions.

## ⚙️ Configuration Supabase Auth

### Désactiver les emails automatiques

1. Supabase Dashboard → Authentication → Email Templates
2. Pour chaque template (Confirm signup, Reset password):
   - **Ne pas** modifier les templates ici
   - Les emails seront envoyés par nos Edge Functions

### Configurer les URLs de redirection

Dans Supabase Dashboard → Authentication → URL Configuration:

**Site URL:**
```
https://linguami.com
```

**Redirect URLs (un par ligne):**
```
http://localhost:3000/auth/callback
https://linguami.com/auth/callback
https://www.linguami.com/auth/callback
```

## 🔌 Intégration dans le code

Le système est déjà intégré ! Voici comment il fonctionne:

### Service d'email (`lib/emailService.js`)

```javascript
import { sendConfirmationEmail, getEmailLanguage } from '@/lib/emailService'

// Dans votre composant
const router = useRouter()
const language = getEmailLanguage(router.locale) // 'fr', 'en', ou 'ru'

// Envoyer l'email de confirmation
await sendConfirmationEmail(email, confirmationUrl, language)
```

### Utilisation dans UserContext

Le contexte utilisateur détecte automatiquement la langue:

```javascript
// context/user.js (déjà implémenté)
const language = getEmailLanguage(router.locale)
await sendConfirmationEmail(userEmail, confirmationUrl, language)
```

## 🧪 Tests

### Test local

```bash
# Démarrer Supabase localement
supabase start

# Dans un autre terminal, servir les fonctions
supabase functions serve

# Tester l'envoi
curl -i --location --request POST 'http://localhost:54321/functions/v1/send-confirmation-email' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "email":"test@example.com",
    "confirmationUrl":"https://linguami.com/auth/callback?token=test",
    "language":"fr"
  }'
```

### Test en production

1. Créez un nouveau compte sur votre site
2. Vérifiez que l'email arrive dans la bonne langue
3. Cliquez sur le lien de confirmation
4. Vérifiez la redirection

## 📧 Templates personnalisés

Les templates sont dans:
- `supabase/functions/send-confirmation-email/index.ts`
- `supabase/functions/send-reset-password-email/index.ts`

Pour modifier un template:
1. Éditez le HTML dans le fichier
2. Redéployez: `supabase functions deploy nom-de-la-fonction`

## 🐛 Dépannage

### Les emails n'arrivent pas

**Vérifier les logs:**
```bash
supabase functions logs send-confirmation-email
```

**Vérifier Resend Dashboard:**
- Emails → Voir tous les envois et erreurs

**Vérifications communes:**
1. ✅ Clé API Resend correctement configurée
2. ✅ Domaine vérifié dans Resend
3. ✅ Edge Functions déployées
4. ✅ URLs de redirection configurées dans Supabase

### Erreur "RESEND_API_KEY not configured"

```bash
# Vérifier les secrets
supabase secrets list

# Si absent, ajouter
supabase secrets set RESEND_API_KEY=re_votre_clé
```

### Emails en spam

1. Configurez SPF, DKIM, DMARC dans Resend
2. Ajoutez une adresse de réponse valide
3. Évitez les mots-clés spam dans le contenu

### Erreur CORS

Si vous obtenez une erreur CORS, vérifiez que:
1. L'URL de callback est dans les Redirect URLs
2. Le domaine est autorisé dans Supabase

## 📊 Monitoring

### Resend Dashboard
- Statistiques d'envoi
- Taux d'ouverture (si activé)
- Erreurs de livraison

### Supabase Logs
```bash
# Voir les logs en temps réel
supabase functions logs send-confirmation-email --follow

# Logs d'une période spécifique
supabase functions logs send-confirmation-email --since 1h
```

## 🔒 Sécurité

### Bonnes pratiques
- ✅ Les clés API sont stockées comme secrets Supabase
- ✅ Les templates ne permettent pas l'injection HTML
- ✅ CORS configuré pour votre domaine uniquement (en production)
- ✅ Vérification du domaine via Resend

### Limitations
- 3000 emails/mois sur le plan gratuit Resend
- Pas de pièces jointes (non nécessaire pour ce cas)

## 📈 Prochaines étapes

1. **Monitoring avancé**: Configurer des alertes Resend
2. **Analytics**: Suivre les taux d'ouverture
3. **Templates additionnels**: Emails de bienvenue, notifications
4. **A/B Testing**: Tester différentes formulations

## 🆘 Support

- [Documentation Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Documentation Resend](https://resend.com/docs)
- [Support Resend](https://resend.com/support)
