# Supabase Edge Functions - Linguami

Ce dossier contient les Edge Functions Supabase pour gérer l'envoi d'emails multilingues.

## 📋 Fonctions disponibles

### 1. `send-confirmation-email`
Envoie un email de confirmation d'inscription dans la langue de l'utilisateur.

**Paramètres:**
- `email` (string, requis): L'adresse email du destinataire
- `confirmationUrl` (string, requis): L'URL de confirmation générée par Supabase
- `language` (string, optionnel): Code langue ('fr', 'en', 'ru'). Défaut: 'fr'

**Exemple:**
```javascript
const response = await fetch('https://your-project.supabase.co/functions/v1/send-confirmation-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    confirmationUrl: 'https://linguami.com/auth/callback?token=...',
    language: 'fr'
  })
})
```

### 2. `send-reset-password-email`
Envoie un email de réinitialisation de mot de passe dans la langue de l'utilisateur.

**Paramètres:**
- `email` (string, requis): L'adresse email du destinataire
- `resetUrl` (string, requis): L'URL de réinitialisation générée par Supabase
- `language` (string, optionnel): Code langue ('fr', 'en', 'ru'). Défaut: 'fr'

## 🚀 Déploiement

### Prérequis
1. Installer Supabase CLI: `npm install -g supabase`
2. Se connecter: `supabase login`
3. Lier votre projet: `supabase link --project-ref YOUR_PROJECT_REF`

### Déployer les fonctions

```bash
# Déployer toutes les fonctions
supabase functions deploy

# Ou déployer une fonction spécifique
supabase functions deploy send-confirmation-email
supabase functions deploy send-reset-password-email
```

### Variables d'environnement

Les Edge Functions ont besoin de ces variables (à configurer dans le Dashboard Supabase):

```bash
# Dans Supabase Dashboard → Project Settings → Edge Functions → Secrets
RESEND_API_KEY=re_your_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

Pour les définir via CLI:
```bash
supabase secrets set RESEND_API_KEY=re_your_api_key_here
```

## 🔧 Configuration Resend

1. Créer un compte sur [Resend](https://resend.com) (gratuit jusqu'à 3000 emails/mois)
2. Vérifier votre domaine dans Resend Dashboard
3. Générer une clé API
4. Ajouter la clé dans les secrets Supabase

### Configuration du domaine email

Par défaut, les emails sont envoyés depuis `noreply@linguami.com`. Pour changer:

Modifier dans les fichiers `index.ts`:
```typescript
from: 'Linguami <noreply@votre-domaine.com>',
```

## 🧪 Test en local

```bash
# Démarrer Supabase localement
supabase start

# Servir les fonctions localement
supabase functions serve

# Tester avec curl
curl -i --location --request POST 'http://localhost:54321/functions/v1/send-confirmation-email' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"email":"test@example.com","confirmationUrl":"https://example.com/confirm","language":"fr"}'
```

## 📝 Intégration dans l'application

Utiliser le service `lib/emailService.js`:

```javascript
import { sendConfirmationEmail, getEmailLanguage } from '@/lib/emailService'
import { useRouter } from 'next/router'

const router = useRouter()
const language = getEmailLanguage(router.locale)

await sendConfirmationEmail(
  'user@example.com',
  confirmationUrl,
  language
)
```

## 🔐 Sécurité

- Les fonctions utilisent CORS pour autoriser tous les domaines (`*`)
- Les templates sont stockés directement dans le code (pas de dépendances externes)
- L'authentification se fait via le token Supabase
- Les secrets sont gérés via Supabase Vault

## 📚 Resources

- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Resend Documentation](https://resend.com/docs)
- [Deno Documentation](https://deno.land/manual)
