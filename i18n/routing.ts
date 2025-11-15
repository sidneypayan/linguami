import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'ru', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'always', // Toujours afficher la locale dans l'URL (même /fr)
  localeDetection: false // Désactiver la détection automatique (pas de Accept-Language)
});
