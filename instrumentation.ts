export async function register() {
	if (process.env.NEXT_RUNTIME === 'nodejs') {
		// Server-side initialization
		const Sentry = await import('@sentry/nextjs')

		Sentry.init({
			dsn: 'https://d73669ee3513c9eb63b2eb049bbc0e7e@o4510401511948288.ingest.de.sentry.io/4510401514111056',

			// Adjust this value in production, or use tracesSampler for greater control
			tracesSampleRate: 1.0,

			// Setting this option to true will print useful information to the console while you're setting up Sentry.
			debug: false,
		})
	}

	if (process.env.NEXT_RUNTIME === 'edge') {
		// Edge runtime initialization (middleware)
		const Sentry = await import('@sentry/nextjs')

		Sentry.init({
			dsn: 'https://d73669ee3513c9eb63b2eb049bbc0e7e@o4510401511948288.ingest.de.sentry.io/4510401514111056',

			// Adjust this value in production, or use tracesSampler for greater control
			tracesSampleRate: 1.0,

			// Setting this option to true will print useful information to the console while you're setting up Sentry.
			debug: false,
		})
	}
}

export async function onRequestError(
	err: unknown,
	request: {
		path: string
	},
	context: {
		routerKind: 'Pages Router' | 'App Router'
		routePath: string
		routeType: 'render' | 'route' | 'action' | 'middleware'
	}
) {
	const Sentry = await import('@sentry/nextjs')
	Sentry.captureRequestError(err, request, context)
}
