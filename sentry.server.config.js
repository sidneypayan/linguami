// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
	dsn: 'https://d73669ee3513c9eb63b2eb049bbc0e7e@o4510401511948288.ingest.de.sentry.io/4510401514111056',

	// Adjust this value in production, or use tracesSampler for greater control
	tracesSampleRate: 1.0,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,
})
