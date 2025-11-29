'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({ error, reset }) {
	useEffect(() => {
		// Log the error to Sentry
		Sentry.captureException(error)
	}, [error])

	return (
		<html>
			<body>
				<div className="max-w-md mx-auto py-16 px-4">
					<div className="flex flex-col items-center gap-6 text-center">
						<h1 className="text-2xl font-bold">
							Oops! Something went wrong
						</h1>
						<p className="text-gray-600">
							We have been notified and are working on it.
						</p>
						<button
							onClick={() => reset()}
							className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors">
							Try again
						</button>
					</div>
				</div>
			</body>
		</html>
	)
}
