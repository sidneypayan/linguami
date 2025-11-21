// This file configures the initialization of Sentry for edge features (middleware, edge functions, and edge routes).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
	dsn: 'https://d73669ee3513c9eb63b2eb049bbc0e7e@o4510401511948288.ingest.de.sentry.io/4510401514111056',

	// Adjust this value in production, or use tracesSampler for greater control
	tracesSampleRate: 1.0,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,
})
