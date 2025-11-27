'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowLeft, Info, AlertCircle } from 'lucide-react'
import { useUserContext } from '@/context/user'
import { createBrowserClient } from '@/lib/supabase'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import AdminNavbar from '@/components/admin/AdminNavbar'
import FillInTheBlank from '@/components/exercises/FillInTheBlank'
import MultipleChoice from '@/components/exercises/MultipleChoice'
import DragAndDrop from '@/components/exercises/DragAndDrop'
import { logger } from '@/utils/logger'

const PreviewExercise = () => {
	const router = useRouter()
	const params = useParams()
	const locale = useLocale()
	const id = params.id
	const t = useTranslations('exercises')
	const { isUserAdmin, isBootstrapping } = useUserContext()
	const supabase = createBrowserClient()

	const [exercise, setExercise] = useState(null)
	const [loading, setLoading] = useState(true)

	// Load exercise
	useEffect(() => {
		const loadExercise = async () => {
			if (!id) return

			setLoading(true)
			const { data, error } = await supabase
				.from('exercises')
				.select('*')
				.eq('id', id)
				.single()

			if (error) {
				logger.error('Error loading exercise:', error)
			} else {
				setExercise(data)
			}
			setLoading(false)
		}

		if (isUserAdmin && id) {
			loadExercise()
		}
	}, [id, isUserAdmin])

	// Redirect if not admin
	useEffect(() => {
		if (!isBootstrapping && !isUserAdmin) {
			router.push(`/${locale}`)
		}
	}, [isUserAdmin, isBootstrapping, router, locale])

	// Handle completion (preview mode - no XP awarded)
	const handleComplete = (result) => {
		logger.log('Exercise completed (preview mode):', result)
	}

	// Show nothing while bootstrapping
	if (isBootstrapping) {
		return null
	}

	// Redirect happened or not admin
	if (!isUserAdmin) {
		return null
	}

	if (loading) {
		return <LoadingSpinner />
	}

	if (!exercise) {
		return (
			<>
				<AdminNavbar activePage="exercises" />
				<div className="max-w-4xl mx-auto px-4 pt-16 md:pt-24 pb-8">
					<div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
						<AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
						<p className="text-red-700">{t('exerciseNotFound')}</p>
					</div>
				</div>
			</>
		)
	}

	return (
		<>
			<AdminNavbar activePage="exercises" />

			<div className="max-w-3xl mx-auto px-4 pt-16 md:pt-24 pb-8">
				{/* Header */}
				<div className="flex items-center gap-3 mb-6">
					<button
						onClick={() => router.back()}
						className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
					>
						<ArrowLeft className="w-5 h-5" />
					</button>
					<div>
						<h1 className="text-2xl font-bold text-slate-800">
							{exercise.title}
						</h1>
						<p className="text-sm text-slate-500 mt-0.5">
							{t('previewMode')}
						</p>
					</div>
				</div>

				{/* Info Alert */}
				<div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
					<Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
					<p className="text-blue-700">{t('previewInfo')}</p>
				</div>

				{/* Exercise Component */}
				{exercise.type === 'fill_in_blank' && (
					<FillInTheBlank
						exercise={exercise}
						onComplete={handleComplete}
					/>
				)}
				{exercise.type === 'mcq' && (
					<MultipleChoice
						exercise={exercise}
						onComplete={handleComplete}
					/>
				)}
				{exercise.type === 'drag_and_drop' && (
					<DragAndDrop
						exercise={exercise}
						onComplete={handleComplete}
					/>
				)}
			</div>
		</>
	)
}

export default PreviewExercise
