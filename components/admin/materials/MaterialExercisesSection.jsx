'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Plus, Edit, Trash2, GraduationCap, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getMaterialExercises, deleteExercise } from '@/app/actions/admin/materials'
import { toast } from 'sonner'

const MaterialExercisesSection = ({ materialId }) => {
	const router = useRouter()
	const locale = useLocale()
	const [exercises, setExercises] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		loadExercises()
	}, [materialId])

	const loadExercises = async () => {
		try {
			const data = await getMaterialExercises(materialId)
			setExercises(data)
		} catch (error) {
			console.error('Error loading exercises:', error)
			toast.error('Failed to load exercises')
		} finally {
			setIsLoading(false)
		}
	}

	const handleDelete = async (exerciseId) => {
		if (!confirm('Are you sure you want to delete this exercise?')) return

		try {
			await deleteExercise(exerciseId)
			toast.success('Exercise deleted successfully')
			setExercises(exercises.filter(ex => ex.id !== exerciseId))
		} catch (error) {
			console.error('Error deleting exercise:', error)
			toast.error('Failed to delete exercise')
		}
	}

	const getTypeLabel = (type) => {
		const labels = {
			'mcq': 'Multiple Choice',
			'fill_in_blank': 'Fill in Blank',
			'drag_and_drop': 'Drag & Drop'
		}
		return labels[type] || type
	}

	const getTypeBadgeColor = (type) => {
		const colors = {
			'mcq': 'bg-emerald-100 text-emerald-700 border-emerald-200',
			'fill_in_blank': 'bg-violet-100 text-violet-700 border-violet-200',
			'drag_and_drop': 'bg-amber-100 text-amber-700 border-amber-200'
		}
		return colors[type] || 'bg-slate-100 text-slate-700 border-slate-200'
	}

	const getLevelBadgeColor = (level) => {
		const colors = {
			'beginner': 'bg-green-100 text-green-700',
			'A1': 'bg-green-100 text-green-700',
			'A2': 'bg-green-100 text-green-700',
			'intermediate': 'bg-yellow-100 text-yellow-700',
			'B1': 'bg-yellow-100 text-yellow-700',
			'B2': 'bg-yellow-100 text-yellow-700',
			'advanced': 'bg-red-100 text-red-700',
			'C1': 'bg-red-100 text-red-700',
			'C2': 'bg-red-100 text-red-700'
		}
		return colors[level] || 'bg-slate-100 text-slate-700'
	}

	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-sm">
			{/* Header */}
			<div className="border-b border-slate-200 p-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-indigo-100 rounded-lg">
							<GraduationCap className="w-5 h-5 text-indigo-600" />
						</div>
						<div>
							<h2 className="text-lg font-semibold text-slate-900">
								Exercises ({exercises.length})
							</h2>
							<p className="text-sm text-slate-500">Practice exercises for this material</p>
						</div>
					</div>

					{/* Create Buttons */}
					<div className="flex gap-2">
						<Button
							size="sm"
							onClick={() => router.push(`/${locale}/admin/exercises/create-mcq?parent_type=material&parent_id=${materialId}`)}
							className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-white border-0"
						>
							<Plus className="w-4 h-4 mr-1.5" />
							MCQ
						</Button>
						<Button
							size="sm"
							onClick={() => router.push(`/${locale}/admin/exercises/create-fitb?parent_type=material&parent_id=${materialId}`)}
							className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:opacity-90 text-white border-0"
						>
							<Plus className="w-4 h-4 mr-1.5" />
			Fill-in-Blank
						</Button>
						<Button
							size="sm"
							onClick={() => router.push(`/${locale}/admin/exercises/create-drag-drop?parent_type=material&parent_id=${materialId}`)}
							className="bg-gradient-to-r from-amber-500 to-red-500 hover:opacity-90 text-white border-0"
						>
							<Plus className="w-4 h-4 mr-1.5" />
							Drag & Drop
						</Button>
					</div>
				</div>
			</div>

			{/* Exercises List */}
			<div className="p-6">
				{isLoading ? (
					<div className="text-center py-8 text-slate-500">Loading exercises...</div>
				) : exercises.length === 0 ? (
					<div className="text-center py-12">
						<AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
						<p className="text-slate-500 mb-4">No exercises yet</p>
						<p className="text-sm text-slate-400">Create your first exercise using the buttons above</p>
					</div>
				) : (
					<div className="space-y-3">
						{exercises.map((exercise) => (
							<div
								key={exercise.id}
								className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-all duration-200"
							>
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 flex-wrap mb-2">
											<h3 className="font-semibold text-slate-900">
												{exercise.title || `Exercise #${exercise.id}`}
											</h3>
											<Badge className={`${getTypeBadgeColor(exercise.type)} border`}>
												{getTypeLabel(exercise.type)}
											</Badge>
											{exercise.level && (
												<Badge className={getLevelBadgeColor(exercise.level)}>
													{exercise.level.toUpperCase()}
												</Badge>
											)}
											{exercise.lang && (
												<Badge variant="outline">
													{exercise.lang.toUpperCase()}
												</Badge>
											)}
										</div>

										<div className="flex items-center gap-4 text-sm text-slate-500">
											<span>ID: {exercise.id}</span>
											{exercise.data?.questions && (
												<>
													<span className="text-slate-300">•</span>
													<span>{exercise.data.questions.length} question(s)</span>
												</>
											)}
											{exercise.xp_reward && (
												<>
													<span className="text-slate-300">•</span>
													<span>{exercise.xp_reward} XP</span>
												</>
											)}
										</div>
									</div>

									<div className="flex items-center gap-2 flex-shrink-0">
										<Button
											size="sm"
											variant="outline"
											onClick={() => router.push(`/${locale}/admin/exercises/edit/${exercise.id}`)}
											className="border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
										>
											<Edit className="w-4 h-4 mr-1.5" />
											Edit
										</Button>
										<Button
											size="sm"
											variant="outline"
											onClick={() => handleDelete(exercise.id)}
											className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default MaterialExercisesSection
