import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  // Get the requested locale from the [locale] segment
  let locale = await requestLocale;

  // Validate and fallback to default if invalid or missing (e.g., for 404 page)
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  try {
    return {
      locale,
      messages: (await import(`../messages/${locale}.json`)).default
    };
  } catch (error) {
    // Fallback for pages without locale (like 404)
    return {
      locale: routing.defaultLocale,
      messages: {}
    };
  }
});
