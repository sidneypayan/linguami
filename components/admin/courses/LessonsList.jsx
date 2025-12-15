'use client'

import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Edit, GripVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useToggleLessonPublication, useReorderLessons } from '@/lib/admin-client'
import EditLessonModal from './EditLessonModal'

const LessonsList = ({ courseId, lessons, targetLanguage, levelId }) => {
	const locale = useLocale()
	const t = useTranslations('admin')
	const [editingLesson, setEditingLesson] = useState(null)
	const [orderedLessons, setOrderedLessons] = useState(lessons)

	const togglePublicationMutation = useToggleLessonPublication()
	const reorderMutation = useReorderLessons()

	// Helper to get localized field
	const getLocalizedField = (obj, fieldPrefix) => {
		const fieldName = `${fieldPrefix}_${locale}`
		return obj[fieldName] || obj[`${fieldPrefix}_en`]
	}

	// Update orderedLessons when lessons prop changes
	useEffect(() => {
		setOrderedLessons(lessons)
	}, [lessons])

	const handleDragStart = (e, index) => {
		e.dataTransfer.effectAllowed = 'move'
		e.dataTransfer.setData('text/html', index.toString())
	}

	const handleDragOver = (e) => {
		e.preventDefault()
	}

	const handleDrop = (e, dropIndex) => {
		e.preventDefault()
		const dragIndex = parseInt(e.dataTransfer.getData('text/html'))

		if (dragIndex === dropIndex) return

		const newOrder = [...orderedLessons]
		const [removed] = newOrder.splice(dragIndex, 1)
		newOrder.splice(dropIndex, 0, removed)

		// Update order_index for all
		const updates = newOrder.map((lesson, idx) => ({
			id: lesson.id,
			order_index: idx
		}))

		setOrderedLessons(newOrder)
		reorderMutation.mutate({ courseId, lessonOrderUpdates: updates })
	}

	if (orderedLessons.length === 0) {
		return (
			<div className="text-center py-8 text-slate-500">
				<p>{t('lessons')} (0)</p>
			</div>
		)
	}

	return (
		<div>
			<div className="space-y-3">
				{orderedLessons.map((lesson, index) => (
					<div
						key={lesson.id}
						draggable
						onDragStart={(e) => handleDragStart(e, index)}
						onDragOver={handleDragOver}
						onDrop={(e) => handleDrop(e, index)}
						className="group flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-move"
					>
						<GripVertical className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />

						<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-bold text-sm">
							{lesson.order_index}
						</div>

						<div className="flex-1 min-w-0">
							<div className="font-semibold text-slate-900 text-base truncate">
								{getLocalizedField(lesson, 'title')}
							</div>
							<div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
								<span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{lesson.slug}</span>
								<span>•</span>
								<span>{lesson.estimated_minutes || '?'} {t('min')}</span>
							</div>
						</div>

						<div className="flex items-center gap-2 flex-shrink-0">
							<Badge variant={lesson.is_published ? 'success' : 'default'} className="text-xs">
								{lesson.is_published ? t('published') : t('draft')}
							</Badge>
							{lesson.is_free && (
								<Badge variant="primary" className="text-xs">
									{t('free')}
								</Badge>
							)}
						</div>

						<div className="flex items-center gap-2 flex-shrink-0">
							<Switch
								checked={lesson.is_published}
								onCheckedChange={(checked) => {
									togglePublicationMutation.mutate({ lessonId: lesson.id, isPublished: checked })
								}}
							/>

							<Button
								size="sm"
								onClick={(e) => {
									e.stopPropagation()
									setEditingLesson(lesson)
								}}
								className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-white border-0 shadow-sm"
							>
								<Edit className="w-4 h-4 mr-1.5" />
								{t('edit')}
							</Button>
						</div>
					</div>
				))}
			</div>

			{editingLesson && (
				<EditLessonModal
					lesson={editingLesson}
					targetLanguage={targetLanguage}
					levelId={levelId}
					onClose={() => setEditingLesson(null)}
				/>
			)}
		</div>
	)
}

export default LessonsList
