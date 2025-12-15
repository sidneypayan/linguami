'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { X, Save, Code, Eye } from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUpdateLessonMetadata, useUpdateLessonContent } from '@/lib/admin-client'
import JSONBlocksEditor from './JSONBlocksEditor'
import VisualBlocksEditor from './VisualBlocksEditor'
import { getLessonWithContent } from '@/app/actions/courses'
import { getStaticLevelById } from '@/lib/method-levels'

const EditLessonModal = ({ lesson, targetLanguage, levelId, onClose }) => {
	const t = useTranslations('admin')
	const [activeTab, setActiveTab] = useState('metadata')
	const [contentLanguage, setContentLanguage] = useState('fr')
	const [editorMode, setEditorMode] = useState('visual') // 'visual' or 'json'
	const [metadataForm, setMetadataForm] = useState({})
	const [contentData, setContentData] = useState(null)
	const [loadingContent, setLoadingContent] = useState(false)

	const updateMetadataMutation = useUpdateLessonMetadata()
	const updateContentMutation = useUpdateLessonContent()

	// Get level slug
	const getLevelSlug = () => {
		const level = getStaticLevelById(levelId)
		return level ? level.slug : 'beginner'
	}

	// Load lesson content when switching to content tab
	useEffect(() => {
		if (activeTab === 'content' && !contentData && !loadingContent) {
			setLoadingContent(true)
			getLessonWithContent(lesson.id, getLevelSlug(), targetLanguage).then(result => {
				if (result.success) {
					setContentData({
						objectives_fr: result.lesson.objectives_fr,
						objectives_ru: result.lesson.objectives_ru,
						objectives_en: result.lesson.objectives_en,
						blocks_fr: result.lesson.blocks_fr,
						blocks_ru: result.lesson.blocks_ru,
						blocks_en: result.lesson.blocks_en,
					})
				}
				setLoadingContent(false)
			})
		}
	}, [activeTab, contentData, loadingContent, lesson.id, targetLanguage, levelId])

	// Initialize metadata form
	useEffect(() => {
		setMetadataForm({
			title_fr: lesson.title_fr,
			title_ru: lesson.title_ru,
			title_en: lesson.title_en,
			order_index: lesson.order_index,
			estimated_minutes: lesson.estimated_minutes || '',
			is_published: lesson.is_published,
			is_free: lesson.is_free,
		})
	}, [lesson])

	const handleSaveMetadata = () => {
		updateMetadataMutation.mutate({
			lessonId: lesson.id,
			metadataData: {
				...metadataForm,
				course_id: lesson.course_id,
				slug: lesson.slug,
			}
		}, {
			onSuccess: () => onClose()
		})
	}

	const handleSaveContent = () => {
		updateContentMutation.mutate({
			lessonSlug: lesson.slug,
			levelSlug: getLevelSlug(),
			learningLang: targetLanguage,
			contentData,
		}, {
			onSuccess: () => onClose()
		})
	}

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<div className="flex items-center justify-between">
						<DialogTitle>Modifier la leçon: {lesson.title_fr || lesson.title_en}</DialogTitle>
						{activeTab === 'content' && (
							<div className="flex items-center gap-2">
								<Button
									size="sm"
									variant={editorMode === 'visual' ? 'default' : 'outline'}
									onClick={() => setEditorMode('visual')}
								>
									<Eye className="w-4 h-4 mr-1.5" />
									Visuel
								</Button>
								<Button
									size="sm"
									variant={editorMode === 'json' ? 'default' : 'outline'}
									onClick={() => setEditorMode('json')}
								>
									<Code className="w-4 h-4 mr-1.5" />
									JSON
								</Button>
							</div>
						)}
					</div>
				</DialogHeader>

				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="metadata">Métadonnées</TabsTrigger>
						<TabsTrigger value="content">Contenu</TabsTrigger>
					</TabsList>

					{/* Metadata Tab */}
					<TabsContent value="metadata" className="space-y-4">
						<div className="grid grid-cols-3 gap-4">
							<div>
								<Label htmlFor="meta_title_fr">Title (French)</Label>
								<Input
									id="meta_title_fr"
									value={metadataForm.title_fr || ''}
									onChange={(e) => setMetadataForm({...metadataForm, title_fr: e.target.value})}
								/>
							</div>
							<div>
								<Label htmlFor="meta_title_ru">Title (Russian)</Label>
								<Input
									id="meta_title_ru"
									value={metadataForm.title_ru || ''}
									onChange={(e) => setMetadataForm({...metadataForm, title_ru: e.target.value})}
								/>
							</div>
							<div>
								<Label htmlFor="meta_title_en">Title (English)</Label>
								<Input
									id="meta_title_en"
									value={metadataForm.title_en || ''}
									onChange={(e) => setMetadataForm({...metadataForm, title_en: e.target.value})}
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="meta_order">Order Index</Label>
								<Input
									id="meta_order"
									type="number"
									value={metadataForm.order_index || 0}
									onChange={(e) => setMetadataForm({...metadataForm, order_index: parseInt(e.target.value)})}
								/>
							</div>
							<div>
								<Label htmlFor="meta_minutes">Estimated Minutes</Label>
								<Input
									id="meta_minutes"
									type="number"
									value={metadataForm.estimated_minutes || ''}
									onChange={(e) => setMetadataForm({...metadataForm, estimated_minutes: parseInt(e.target.value) || null})}
								/>
							</div>
						</div>

						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								<Switch
									checked={metadataForm.is_published || false}
									onCheckedChange={(checked) => setMetadataForm({...metadataForm, is_published: checked})}
								/>
								<Label>Published</Label>
							</div>

							<div className="flex items-center gap-2">
								<Switch
									checked={metadataForm.is_free || false}
									onCheckedChange={(checked) => setMetadataForm({...metadataForm, is_free: checked})}
								/>
								<Label>Free</Label>
							</div>
						</div>

						<div className="flex justify-end gap-2 pt-4">
							<Button variant="outline" onClick={onClose}>Cancel</Button>
							<Button onClick={handleSaveMetadata} disabled={updateMetadataMutation.isPending}>
								<Save className="w-4 h-4 mr-2" />
								Save Metadata
							</Button>
						</div>
					</TabsContent>

					{/* Content Tab */}
					<TabsContent value="content">
						{loadingContent ? (
							<div className="text-center py-8">Chargement du contenu...</div>
						) : contentData ? (
							<>
								{/* Language Selector */}
								<div className="mb-4">
									<Tabs value={contentLanguage} onValueChange={setContentLanguage}>
										<TabsList className="grid w-full grid-cols-3">
											<TabsTrigger value="fr">🇫🇷 Français</TabsTrigger>
											<TabsTrigger value="ru">🇷🇺 Русский</TabsTrigger>
											<TabsTrigger value="en">🇬🇧 English</TabsTrigger>
										</TabsList>
									</Tabs>
								</div>

								{/* Editor (Visual or JSON) */}
								{editorMode === 'visual' ? (
									<VisualBlocksEditor
										contentData={contentData}
										onChange={setContentData}
										language={contentLanguage}
									/>
								) : (
									<JSONBlocksEditor
										contentData={contentData}
										onChange={setContentData}
									/>
								)}

								<div className="flex justify-end gap-2 pt-4">
									<Button variant="outline" onClick={onClose}>Annuler</Button>
									<Button onClick={handleSaveContent} disabled={updateContentMutation.isPending}>
										<Save className="w-4 h-4 mr-2" />
										Enregistrer le contenu
									</Button>
								</div>
							</>
						) : (
							<div className="text-center py-8 text-slate-500">
								Échec du chargement du contenu
							</div>
						)}
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}

export default EditLessonModal
