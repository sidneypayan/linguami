'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { CheckCircle, XCircle, Home, Loader2 } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { verifyEmail } from '@/lib/emailVerification'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function VerifyEmail() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const t = useTranslations('register')
	const [status, setStatus] = useState('loading')
	const [error, setError] = useState('')

	useEffect(() => {
		const token = searchParams.get('token')

		if (!token) {
			setStatus('error')
			setError(t('tokenMissing') || 'Missing token')
			return
		}

		const verify = async () => {
			const result = await verifyEmail(token)

			if (result.success) {
				setStatus('success')
				setTimeout(() => {
					router.push('/')
				}, 3000)
			} else {
				setStatus('error')
				setError(result.error || t('verificationFailed') || 'Verification failed')
			}
		}

		verify()
	}, [searchParams, router, t])

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center py-8">
			<div className="relative z-10 w-full max-w-md mx-auto px-4">
				<Card className="p-6 sm:p-10 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.3)] bg-white text-center">
					{status === 'loading' && (
						<>
							<Loader2 className="h-20 w-20 text-indigo-500 mx-auto mb-6 animate-spin" />
							<h2 className="text-xl font-semibold text-slate-800">
								{t('verifying') || 'Verifying...'}
							</h2>
						</>
					)}

					{status === 'success' && (
						<>
							<CheckCircle className="h-24 w-24 text-emerald-500 mx-auto mb-6" />
							<h1 className="text-2xl sm:text-3xl font-extrabold mb-3 bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
								{t('emailVerified') || 'Email Verified!'}
							</h1>
							<p className="text-slate-500 mb-8">
								{t('emailVerifiedMessage') || 'Your email has been successfully verified. Redirecting...'}
							</p>
							<Link href="/">
								<Button
									className={cn(
										'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500',
										'px-8 py-3 rounded-xl font-semibold'
									)}>
									<Home className="h-5 w-5 mr-2" />
									{t('goHome') || 'Go Home'}
								</Button>
							</Link>
						</>
					)}

					{status === 'error' && (
						<>
							<XCircle className="h-24 w-24 text-red-500 mx-auto mb-6" />
							<h1 className="text-2xl sm:text-3xl font-extrabold mb-3 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
								{t('verificationFailed') || 'Verification Failed'}
							</h1>
							<p className="text-slate-600 mb-2">{error}</p>
							<p className="text-slate-400 text-sm mb-8">
								{t('tokenExpiredMessage') || 'The link may have expired. You can request a new one from your profile.'}
							</p>
							<Link href="/">
								<Button
									variant="outline"
									className="border-indigo-500 text-indigo-500 hover:bg-indigo-500/5 px-8 py-3 rounded-xl font-semibold">
									<Home className="h-5 w-5 mr-2" />
									{t('goHome') || 'Go Home'}
								</Button>
							</Link>
						</>
					)}
				</Card>
			</div>
		</div>
	)
}
