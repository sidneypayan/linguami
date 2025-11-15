import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'ru', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'as-needed'
});
