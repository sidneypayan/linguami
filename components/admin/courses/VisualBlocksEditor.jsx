'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Plus, Trash2, ChevronUp, ChevronDown, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

const BLOCK_TYPES = [
	{ value: 'dialogue', label: 'Dialogue', icon: '💬', color: 'bg-blue-100 text-blue-700' },
	{ value: 'grammar', label: 'Grammaire', icon: '📖', color: 'bg-green-100 text-green-700' },
	{ value: 'vocabulary', label: 'Vocabulaire', icon: '📚', color: 'bg-purple-100 text-purple-700' },
	{ value: 'culture', label: 'Culture', icon: '🌍', color: 'bg-orange-100 text-orange-700' },
	{ value: 'tip', label: 'Astuce', icon: '💡', color: 'bg-yellow-100 text-yellow-700' },
	{ value: 'summary', label: 'Résumé', icon: '✅', color: 'bg-emerald-100 text-emerald-700' },
	{ value: 'exerciseInline', label: 'Exercice', icon: '✏️', color: 'bg-pink-100 text-pink-700' },
	{ value: 'exerciseLink', label: 'Lien Exercice', icon: '🔗', color: 'bg-indigo-100 text-indigo-700' },
]

const ObjectivesEditor = ({ objectives, onChange }) => {
	const t = useTranslations('admin')

	const addObjective = () => {
		onChange([...objectives, ''])
	}

	const removeObjective = (index) => {
		onChange(objectives.filter((_, i) => i !== index))
	}

	const updateObjective = (index, value) => {
		const updated = [...objectives]
		updated[index] = value
		onChange(updated)
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<Label className="text-base font-semibold">Objectifs de la leçon</Label>
				<Button size="sm" onClick={addObjective} variant="outline">
					<Plus className="w-4 h-4 mr-1.5" />
					Ajouter
				</Button>
			</div>

			<div className="space-y-2">
				{objectives.length === 0 && (
					<p className="text-sm text-slate-500 text-center py-4">Aucun objectif. Cliquez sur "Ajouter" pour commencer.</p>
				)}
				{objectives.map((obj, index) => (
					<div key={index} className="flex items-center gap-2">
						<Input
							value={obj}
							onChange={(e) => updateObjective(index, e.target.value)}
							placeholder="Ex: Savoir se présenter en français"
							className="flex-1"
						/>
						<Button
							size="sm"
							variant="ghost"
							onClick={() => removeObjective(index)}
							className="text-red-500 hover:text-red-700"
						>
							<Trash2 className="w-4 h-4" />
						</Button>
					</div>
				))}
			</div>
		</div>
	)
}

const SimpleBlockEditor = ({ block, onChange }) => {
	switch (block.type) {
		case 'tip':
			return (
				<div className="space-y-3">
					<div>
						<Label>Titre</Label>
						<Input
							value={block.title || ''}
							onChange={(e) => onChange({ ...block, title: e.target.value })}
							placeholder="Astuce"
						/>
					</div>
					<div>
						<Label>Contenu</Label>
						<Textarea
							value={block.content || ''}
							onChange={(e) => onChange({ ...block, content: e.target.value })}
							placeholder="Écrivez votre astuce ici..."
							rows={4}
						/>
					</div>
				</div>
			)

		case 'summary':
			return (
				<div className="space-y-3">
					<div>
						<Label>Titre</Label>
						<Input
							value={block.title || ''}
							onChange={(e) => onChange({ ...block, title: e.target.value })}
							placeholder="Récapitulatif"
						/>
					</div>
					<div>
						<Label>Phrases clés (une par ligne)</Label>
						<Textarea
							value={block.keyPhrases?.map(p => `${p.fr} = ${p.ru}`).join('\n') || ''}
							onChange={(e) => {
								const lines = e.target.value.split('\n').filter(l => l.trim())
								const phrases = lines.map(line => {
									const [fr, ru] = line.split('=').map(s => s.trim())
									return { fr: fr || '', ru: ru || '' }
								})
								onChange({ ...block, keyPhrases: phrases })
							}}
							placeholder="Bonjour = Здравствуйте&#10;Merci = Спасибо"
							rows={6}
						/>
					</div>
				</div>
			)

		case 'exerciseInline':
			const questions = block.questions || []

			const addQuestion = () => {
				onChange({
					...block,
					questions: [...questions, { question: '', answer: '', acceptableAnswers: [], hint: '' }]
				})
			}

			const removeQuestion = (index) => {
				onChange({
					...block,
					questions: questions.filter((_, i) => i !== index)
				})
			}

			const updateQuestion = (index, field, value) => {
				const updated = [...questions]
				if (field === 'acceptableAnswers') {
					// Convert comma-separated string to array
					updated[index][field] = value.split(',').map(a => a.trim()).filter(a => a)
				} else {
					updated[index][field] = value
				}
				onChange({ ...block, questions: updated })
			}

			return (
				<div className="space-y-4">
					<div>
						<Label>Titre</Label>
						<Input
							value={block.title || ''}
							onChange={(e) => onChange({ ...block, title: e.target.value })}
							placeholder="Complétez les phrases"
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label>Type d'exercice</Label>
							<Select
								value={block.exerciseType || 'fillInBlank'}
								onValueChange={(value) => onChange({ ...block, exerciseType: value })}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="fillInBlank">À trous (Fill in blank)</SelectItem>
									<SelectItem value="mcq">QCM (Multiple choice)</SelectItem>
									<SelectItem value="trueFalse">Vrai/Faux</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>XP Récompense</Label>
							<Input
								type="number"
								value={block.xpReward || 5}
								onChange={(e) => onChange({ ...block, xpReward: parseInt(e.target.value) || 5 })}
								placeholder="5"
							/>
						</div>
					</div>

					<div className="border-t pt-4">
						<div className="flex items-center justify-between mb-3">
							<Label className="font-semibold">Questions ({questions.length})</Label>
							<Button size="sm" onClick={addQuestion} variant="outline">
								<Plus className="w-4 h-4 mr-1.5" />
								Ajouter une question
							</Button>
						</div>

						<div className="space-y-3">
							{questions.map((question, index) => (
								<div key={index} className="border rounded-lg p-3 bg-green-50">
									<div className="space-y-2">
										<div>
											<Label className="text-xs">Question (utilisez ____ pour le trou)</Label>
											<Textarea
												value={question.question || ''}
												onChange={(e) => updateQuestion(index, 'question', e.target.value)}
												placeholder="Bonjour, je ____ français. (parler)"
												rows={2}
												className="text-sm"
											/>
										</div>
										<div className="grid grid-cols-2 gap-2">
											<div>
												<Label className="text-xs">Réponse correcte</Label>
												<Input
													value={question.answer || ''}
													onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
													placeholder="parle"
													className="h-8"
												/>
											</div>
											<div>
												<Label className="text-xs">Réponses acceptables (virgules)</Label>
												<Input
													value={question.acceptableAnswers?.join(', ') || ''}
													onChange={(e) => updateQuestion(index, 'acceptableAnswers', e.target.value)}
													placeholder="parle, parles"
													className="h-8"
												/>
											</div>
										</div>
										<div className="flex items-end gap-2">
											<div className="flex-1">
												<Label className="text-xs">Indice (optionnel)</Label>
												<Input
													value={question.hint || ''}
													onChange={(e) => updateQuestion(index, 'hint', e.target.value)}
													placeholder="Première personne du singulier"
													className="h-8"
												/>
											</div>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => removeQuestion(index)}
												className="text-red-500 hover:text-red-700 h-8"
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									</div>
								</div>
							))}
							{questions.length === 0 && (
								<p className="text-sm text-slate-500 text-center py-4">
									Aucune question. Cliquez sur "Ajouter une question" pour commencer.
								</p>
							)}
						</div>
					</div>
				</div>
			)

		case 'exerciseLink':
			return (
				<div className="space-y-3">
					<div>
						<Label>IDs des exercices (séparés par des virgules)</Label>
						<Input
							value={block.exerciseIds?.join(', ') || ''}
							onChange={(e) => {
								const ids = e.target.value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
								onChange({ ...block, exerciseIds: ids })
							}}
							placeholder="12, 13, 14"
						/>
					</div>
					<div>
						<Label>Description</Label>
						<Textarea
							value={block.description || ''}
							onChange={(e) => onChange({ ...block, description: e.target.value })}
							placeholder="Testez vos connaissances !"
							rows={2}
						/>
					</div>
				</div>
			)

		case 'grammar':
			const examples = block.examples || []
			const table = block.table || null
			const tableRows = table?.rows || []

			const addExample = () => {
				onChange({
					...block,
					examples: [...examples, { sentence: '', translation: '', highlight: '', note: '' }]
				})
			}

			const removeExample = (index) => {
				onChange({
					...block,
					examples: examples.filter((_, i) => i !== index)
				})
			}

			const updateExample = (index, field, value) => {
				const updated = [...examples]
				updated[index] = { ...updated[index], [field]: value }
				onChange({ ...block, examples: updated })
			}

			const createTable = () => {
				onChange({
					...block,
					table: {
						title: 'Tableau de conjugaison',
						headers: ['Pronom', 'Forme', 'Traduction'],
						rows: [['je', '', '']]
					}
				})
			}

			const removeTable = () => {
				const updated = { ...block }
				delete updated.table
				onChange(updated)
			}

			const updateTableTitle = (value) => {
				onChange({
					...block,
					table: { ...table, title: value }
				})
			}

			const updateTableHeaders = (value) => {
				const headers = value.split(',').map(h => h.trim())
				onChange({
					...block,
					table: { ...table, headers }
				})
			}

			const addTableRow = () => {
				const numCols = table?.headers?.length || 3
				const newRow = Array(numCols).fill('')
				onChange({
					...block,
					table: { ...table, rows: [...tableRows, newRow] }
				})
			}

			const removeTableRow = (index) => {
				onChange({
					...block,
					table: { ...table, rows: tableRows.filter((_, i) => i !== index) }
				})
			}

			const updateTableCell = (rowIndex, colIndex, value) => {
				const updated = [...tableRows]
				updated[rowIndex][colIndex] = value
				onChange({
					...block,
					table: { ...table, rows: updated }
				})
			}

			return (
				<div className="space-y-4">
					<div>
						<Label>Titre</Label>
						<Input
							value={block.title || ''}
							onChange={(e) => onChange({ ...block, title: e.target.value })}
							placeholder="Le présent de l'indicatif"
						/>
					</div>
					<div>
						<Label>Explication</Label>
						<Textarea
							value={block.explanation || ''}
							onChange={(e) => onChange({ ...block, explanation: e.target.value })}
							placeholder="Explication grammaticale..."
							rows={4}
						/>
					</div>

					{/* Examples Section */}
					<div className="border-t pt-4">
						<div className="flex items-center justify-between mb-3">
							<Label className="font-semibold">Exemples ({examples.length})</Label>
							<Button size="sm" onClick={addExample} variant="outline">
								<Plus className="w-4 h-4 mr-1.5" />
								Ajouter un exemple
							</Button>
						</div>

						<div className="space-y-3">
							{examples.map((example, index) => (
								<div key={index} className="border rounded-lg p-3 bg-slate-50">
									<div className="grid grid-cols-2 gap-2 mb-2">
										<div>
											<Label className="text-xs">Phrase</Label>
											<Input
												value={example.sentence || ''}
												onChange={(e) => updateExample(index, 'sentence', e.target.value)}
												placeholder="Je parle français"
												className="h-8"
											/>
										</div>
										<div>
											<Label className="text-xs">Traduction</Label>
											<Input
												value={example.translation || ''}
												onChange={(e) => updateExample(index, 'translation', e.target.value)}
												placeholder="Я говорю по-французски"
												className="h-8"
											/>
										</div>
									</div>
									<div className="flex items-end gap-2">
										<div className="flex-1">
											<Label className="text-xs">Mot surligné</Label>
											<Input
												value={example.highlight || ''}
												onChange={(e) => updateExample(index, 'highlight', e.target.value)}
												placeholder="parle"
												className="h-8"
											/>
										</div>
										<div className="flex-1">
											<Label className="text-xs">Note</Label>
											<Input
												value={example.note || ''}
												onChange={(e) => updateExample(index, 'note', e.target.value)}
												placeholder="Verbe en -er, 1ère personne"
												className="h-8"
											/>
										</div>
										<Button
											size="sm"
											variant="ghost"
											onClick={() => removeExample(index)}
											className="text-red-500 hover:text-red-700 h-8"
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								</div>
							))}
							{examples.length === 0 && (
								<p className="text-sm text-slate-500 text-center py-4">
									Aucun exemple. Cliquez sur "Ajouter un exemple" pour commencer.
								</p>
							)}
						</div>
					</div>

					{/* Table Section */}
					<div className="border-t pt-4">
						<div className="flex items-center justify-between mb-3">
							<Label className="font-semibold">Tableau de conjugaison</Label>
							{!table ? (
								<Button size="sm" onClick={createTable} variant="outline">
									<Plus className="w-4 h-4 mr-1.5" />
									Créer un tableau
								</Button>
							) : (
								<Button size="sm" onClick={removeTable} variant="outline" className="text-red-500">
									<Trash2 className="w-4 h-4 mr-1.5" />
									Supprimer le tableau
								</Button>
							)}
						</div>

						{table ? (
							<div className="space-y-3 bg-purple-50 p-4 rounded-lg border border-purple-200">
								<div>
									<Label className="text-xs">Titre du tableau</Label>
									<Input
										value={table.title || ''}
										onChange={(e) => updateTableTitle(e.target.value)}
										placeholder="Conjugaison du verbe PARLER"
										className="h-8"
									/>
								</div>
								<div>
									<Label className="text-xs">En-têtes (séparés par des virgules)</Label>
									<Input
										value={table.headers?.join(', ') || ''}
										onChange={(e) => updateTableHeaders(e.target.value)}
										placeholder="Pronom, Forme, Traduction"
										className="h-8"
									/>
								</div>

								<div>
									<div className="flex items-center justify-between mb-2">
										<Label className="text-xs font-semibold">Lignes ({tableRows.length})</Label>
										<Button size="sm" onClick={addTableRow} variant="outline">
											<Plus className="w-4 h-4 mr-1.5" />
											Ajouter une ligne
										</Button>
									</div>

									<div className="space-y-2">
										{tableRows.map((row, rowIndex) => (
											<div key={rowIndex} className="flex items-center gap-2">
												{row.map((cell, colIndex) => (
													<Input
														key={colIndex}
														value={cell}
														onChange={(e) => updateTableCell(rowIndex, colIndex, e.target.value)}
														placeholder={table.headers?.[colIndex] || `Col ${colIndex + 1}`}
														className="h-8 text-sm"
													/>
												))}
												<Button
													size="sm"
													variant="ghost"
													onClick={() => removeTableRow(rowIndex)}
													className="text-red-500 hover:text-red-700 h-8 flex-shrink-0"
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										))}
									</div>
								</div>
							</div>
						) : (
							<p className="text-sm text-slate-500 text-center py-4">
								Pas de tableau. Cliquez sur "Créer un tableau" pour ajouter un tableau de conjugaison.
							</p>
						)}
					</div>
				</div>
			)

		case 'vocabulary':
			const words = block.words || []

			const addWord = () => {
				onChange({
					...block,
					words: [...words, { word: '', translation: '', example: '', exampleTranslation: '' }]
				})
			}

			const removeWord = (index) => {
				onChange({
					...block,
					words: words.filter((_, i) => i !== index)
				})
			}

			const updateWord = (index, field, value) => {
				const updated = [...words]
				updated[index] = { ...updated[index], [field]: value }
				onChange({ ...block, words: updated })
			}

			return (
				<div className="space-y-4">
					<div>
						<Label>Titre</Label>
						<Input
							value={block.title || ''}
							onChange={(e) => onChange({ ...block, title: e.target.value })}
							placeholder="Vocabulaire de l'aéroport"
						/>
					</div>
					<div>
						<Label>Catégorie</Label>
						<Input
							value={block.category || ''}
							onChange={(e) => onChange({ ...block, category: e.target.value })}
							placeholder="voyage"
						/>
					</div>

					<div className="border-t pt-4">
						<div className="flex items-center justify-between mb-3">
							<Label className="font-semibold">Mots ({words.length})</Label>
							<Button size="sm" onClick={addWord} variant="outline">
								<Plus className="w-4 h-4 mr-1.5" />
								Ajouter un mot
							</Button>
						</div>

						<div className="space-y-3">
							{words.map((word, index) => (
								<div key={index} className="border rounded-lg p-3 bg-slate-50">
									<div className="grid grid-cols-2 gap-2 mb-2">
										<div>
											<Label className="text-xs">Mot</Label>
											<Input
												value={word.word || ''}
												onChange={(e) => updateWord(index, 'word', e.target.value)}
												placeholder="passeport"
												className="h-8"
											/>
										</div>
										<div>
											<Label className="text-xs">Traduction</Label>
											<Input
												value={word.translation || ''}
												onChange={(e) => updateWord(index, 'translation', e.target.value)}
												placeholder="паспорт"
												className="h-8"
											/>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-2">
										<div>
											<Label className="text-xs">Exemple</Label>
											<Input
												value={word.example || ''}
												onChange={(e) => updateWord(index, 'example', e.target.value)}
												placeholder="Votre passeport, s'il vous plaît"
												className="h-8"
											/>
										</div>
										<div className="flex items-end gap-2">
											<div className="flex-1">
												<Label className="text-xs">Traduction exemple</Label>
												<Input
													value={word.exampleTranslation || ''}
													onChange={(e) => updateWord(index, 'exampleTranslation', e.target.value)}
													placeholder="Ваш паспорт, пожалуйста"
													className="h-8"
												/>
											</div>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => removeWord(index)}
												className="text-red-500 hover:text-red-700 h-8"
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									</div>
								</div>
							))}
							{words.length === 0 && (
								<p className="text-sm text-slate-500 text-center py-4">
									Aucun mot. Cliquez sur "Ajouter un mot" pour commencer.
								</p>
							)}
						</div>
					</div>
				</div>
			)

		case 'dialogue':
			const lines = block.lines || []
			const vocabulary = block.vocabulary || []

			const addLine = () => {
				onChange({
					...block,
					lines: [...lines, { speaker: '', speakerGender: 'male', text: '', translation: '' }]
				})
			}

			const removeLine = (index) => {
				onChange({
					...block,
					lines: lines.filter((_, i) => i !== index)
				})
			}

			const updateLine = (index, field, value) => {
				const updated = [...lines]
				updated[index] = { ...updated[index], [field]: value }
				onChange({ ...block, lines: updated })
			}

			const addVocabWord = () => {
				onChange({
					...block,
					vocabulary: [...vocabulary, { word: '', translation: '', definition: '', example: '' }]
				})
			}

			const removeVocabWord = (index) => {
				onChange({
					...block,
					vocabulary: vocabulary.filter((_, i) => i !== index)
				})
			}

			const updateVocabWord = (index, field, value) => {
				const updated = [...vocabulary]
				updated[index] = { ...updated[index], [field]: value }
				onChange({ ...block, vocabulary: updated })
			}

			return (
				<div className="space-y-4">
					<div>
						<Label>Titre</Label>
						<Input
							value={block.title || ''}
							onChange={(e) => onChange({ ...block, title: e.target.value })}
							placeholder="À l'aéroport"
						/>
					</div>
					<div>
						<Label>URL Audio (dialogue complet)</Label>
						<Input
							value={block.audioUrl || ''}
							onChange={(e) => onChange({ ...block, audioUrl: e.target.value })}
							placeholder="/audio/courses/..."
						/>
					</div>

					{/* Lines Section */}
					<div className="border-t pt-4">
						<div className="flex items-center justify-between mb-3">
							<Label className="font-semibold">Lignes du dialogue ({lines.length})</Label>
							<Button size="sm" onClick={addLine} variant="outline">
								<Plus className="w-4 h-4 mr-1.5" />
								Ajouter une ligne
							</Button>
						</div>

						<div className="space-y-3">
							{lines.map((line, index) => (
								<div key={index} className="border rounded-lg p-3 bg-slate-50">
									<div className="flex items-start gap-2 mb-2">
										<div className="flex-1">
											<Label className="text-xs">Locuteur</Label>
											<Input
												value={line.speaker || ''}
												onChange={(e) => updateLine(index, 'speaker', e.target.value)}
												placeholder="Agent de douane"
												className="h-8"
											/>
										</div>
										<div className="w-32">
											<Label className="text-xs">Genre</Label>
											<Select
												value={line.speakerGender || 'male'}
												onValueChange={(value) => updateLine(index, 'speakerGender', value)}
											>
												<SelectTrigger className="h-8">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="male">Masculin</SelectItem>
													<SelectItem value="female">Féminin</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<Button
											size="sm"
											variant="ghost"
											onClick={() => removeLine(index)}
											className="text-red-500 hover:text-red-700 h-8 mt-5"
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
									<div className="grid grid-cols-2 gap-2">
										<div>
											<Label className="text-xs">Texte</Label>
											<Textarea
												value={line.text || ''}
												onChange={(e) => updateLine(index, 'text', e.target.value)}
												placeholder="Bonjour ! Votre passeport, s'il vous plaît."
												rows={2}
												className="text-sm"
											/>
										</div>
										<div>
											<Label className="text-xs">Traduction</Label>
											<Textarea
												value={line.translation || ''}
												onChange={(e) => updateLine(index, 'translation', e.target.value)}
												placeholder="Здравствуйте! Ваш паспорт, пожалуйста."
												rows={2}
												className="text-sm"
											/>
										</div>
									</div>
								</div>
							))}
							{lines.length === 0 && (
								<p className="text-sm text-slate-500 text-center py-4">
									Aucune ligne. Cliquez sur "Ajouter une ligne" pour commencer.
								</p>
							)}
						</div>
					</div>

					{/* Vocabulary Section */}
					<div className="border-t pt-4">
						<div className="flex items-center justify-between mb-3">
							<Label className="font-semibold">Vocabulaire du dialogue ({vocabulary.length})</Label>
							<Button size="sm" onClick={addVocabWord} variant="outline">
								<Plus className="w-4 h-4 mr-1.5" />
								Ajouter un mot
							</Button>
						</div>

						<div className="space-y-3">
							{vocabulary.map((word, index) => (
								<div key={index} className="border rounded-lg p-3 bg-blue-50">
									<div className="grid grid-cols-2 gap-2 mb-2">
										<div>
											<Label className="text-xs">Mot / Expression</Label>
											<Input
												value={word.word || ''}
												onChange={(e) => updateVocabWord(index, 'word', e.target.value)}
												placeholder="passeport"
												className="h-8"
											/>
										</div>
										<div>
											<Label className="text-xs">Traduction</Label>
											<Input
												value={word.translation || ''}
												onChange={(e) => updateVocabWord(index, 'translation', e.target.value)}
												placeholder="паспорт"
												className="h-8"
											/>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-2">
										<div>
											<Label className="text-xs">Définition</Label>
											<Input
												value={word.definition || ''}
												onChange={(e) => updateVocabWord(index, 'definition', e.target.value)}
												placeholder="Document officiel d'identité"
												className="h-8"
											/>
										</div>
										<div className="flex items-end gap-2">
											<div className="flex-1">
												<Label className="text-xs">Exemple d'utilisation</Label>
												<Input
													value={word.example || ''}
													onChange={(e) => updateVocabWord(index, 'example', e.target.value)}
													placeholder="Je dois renouveler mon passeport"
													className="h-8"
												/>
											</div>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => removeVocabWord(index)}
												className="text-red-500 hover:text-red-700 h-8"
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									</div>
								</div>
							))}
							{vocabulary.length === 0 && (
								<p className="text-sm text-slate-500 text-center py-4">
									Aucun mot de vocabulaire. Cliquez sur "Ajouter un mot" pour commencer.
								</p>
							)}
						</div>
					</div>
				</div>
			)

		case 'conversation':
			const convDialogue = block.dialogue || []
			const convQuestions = block.questions || []

			const addDialogueLine = () => {
				onChange({
					...block,
					dialogue: [...convDialogue, { speaker: '', text: '' }]
				})
			}

			const removeDialogueLine = (index) => {
				onChange({
					...block,
					dialogue: convDialogue.filter((_, i) => i !== index)
				})
			}

			const updateDialogueLine = (index, field, value) => {
				const updated = [...convDialogue]
				updated[index][field] = value
				onChange({ ...block, dialogue: updated })
			}

			const addConvQuestion = () => {
				onChange({
					...block,
					questions: [...convQuestions, { question: '', answer: '' }]
				})
			}

			const removeConvQuestion = (index) => {
				onChange({
					...block,
					questions: convQuestions.filter((_, i) => i !== index)
				})
			}

			const updateConvQuestion = (index, field, value) => {
				const updated = [...convQuestions]
				updated[index][field] = value
				onChange({ ...block, questions: updated })
			}

			return (
				<div className="space-y-4">
					<div>
						<Label>Titre</Label>
						<Input
							value={block.title || ''}
							onChange={(e) => onChange({ ...block, title: e.target.value })}
							placeholder="Au restaurant"
						/>
					</div>
					<div>
						<Label>URL Audio</Label>
						<Input
							value={block.audioUrl || ''}
							onChange={(e) => onChange({ ...block, audioUrl: e.target.value })}
							placeholder="/audio/courses/..."
						/>
					</div>
					<div>
						<Label>Contexte</Label>
						<Textarea
							value={block.context || ''}
							onChange={(e) => onChange({ ...block, context: e.target.value })}
							placeholder="Deux personnes commandent au restaurant"
							rows={2}
						/>
					</div>

					{/* Dialogue Section */}
					<div className="border-t pt-4">
						<div className="flex items-center justify-between mb-3">
							<Label className="font-semibold">Dialogue ({convDialogue.length})</Label>
							<Button size="sm" onClick={addDialogueLine} variant="outline">
								<Plus className="w-4 h-4 mr-1.5" />
								Ajouter une ligne
							</Button>
						</div>

						<div className="space-y-2">
							{convDialogue.map((line, index) => (
								<div key={index} className="flex items-start gap-2">
									<Input
										value={line.speaker || ''}
										onChange={(e) => updateDialogueLine(index, 'speaker', e.target.value)}
										placeholder="Locuteur"
										className="w-32 h-8"
									/>
									<Textarea
										value={line.text || ''}
										onChange={(e) => updateDialogueLine(index, 'text', e.target.value)}
										placeholder="Texte de la réplique"
										rows={1}
										className="flex-1 text-sm"
									/>
									<Button
										size="sm"
										variant="ghost"
										onClick={() => removeDialogueLine(index)}
										className="text-red-500 hover:text-red-700 h-8 flex-shrink-0"
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							))}
							{convDialogue.length === 0 && (
								<p className="text-sm text-slate-500 text-center py-4">
									Aucune ligne. Cliquez sur "Ajouter une ligne" pour commencer.
								</p>
							)}
						</div>
					</div>

					{/* Questions Section */}
					<div className="border-t pt-4">
						<div className="flex items-center justify-between mb-3">
							<Label className="font-semibold">Questions de compréhension ({convQuestions.length})</Label>
							<Button size="sm" onClick={addConvQuestion} variant="outline">
								<Plus className="w-4 h-4 mr-1.5" />
								Ajouter une question
							</Button>
						</div>

						<div className="space-y-2">
							{convQuestions.map((q, index) => (
								<div key={index} className="border rounded-lg p-3 bg-amber-50">
									<div className="space-y-2">
										<div>
											<Label className="text-xs">Question</Label>
											<Input
												value={q.question || ''}
												onChange={(e) => updateConvQuestion(index, 'question', e.target.value)}
												placeholder="Que commande le client ?"
												className="h-8"
											/>
										</div>
										<div className="flex items-end gap-2">
											<div className="flex-1">
												<Label className="text-xs">Réponse</Label>
												<Input
													value={q.answer || ''}
													onChange={(e) => updateConvQuestion(index, 'answer', e.target.value)}
													placeholder="Une pizza margherita"
													className="h-8"
												/>
											</div>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => removeConvQuestion(index)}
												className="text-red-500 hover:text-red-700 h-8"
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									</div>
								</div>
							))}
							{convQuestions.length === 0 && (
								<p className="text-sm text-slate-500 text-center py-4">
									Aucune question. Cliquez sur "Ajouter une question" pour commencer.
								</p>
							)}
						</div>
					</div>
				</div>
			)

		case 'culture':
			return (
				<div className="space-y-3">
					<div>
						<Label>Titre</Label>
						<Input
							value={block.title || ''}
							onChange={(e) => onChange({ ...block, title: e.target.value })}
							placeholder="Le vouvoiement en France"
						/>
					</div>
					<div>
						<Label>Contenu</Label>
						<Textarea
							value={block.content || ''}
							onChange={(e) => onChange({ ...block, content: e.target.value })}
							placeholder="Information culturelle..."
							rows={4}
						/>
					</div>
					<div>
						<Label>Points clés (un par ligne)</Label>
						<Textarea
							value={block.keyPoints?.join('\n') || ''}
							onChange={(e) => {
								const points = e.target.value.split('\n').filter(p => p.trim())
								onChange({ ...block, keyPoints: points })
							}}
							placeholder="Point 1&#10;Point 2&#10;Point 3"
							rows={4}
						/>
					</div>
				</div>
			)

		default:
			return (
				<div className="bg-slate-50 border border-slate-200 rounded p-4 text-sm text-slate-600">
					<p>Type de bloc non supporté en mode simple. Utilisez l'éditeur JSON pour ce type.</p>
				</div>
			)
	}
}

const VisualBlocksEditor = ({ contentData, onChange, language }) => {
	const t = useTranslations('admin')
	const [expandedBlock, setExpandedBlock] = useState(null)

	const objectivesKey = `objectives_${language}`
	const blocksKey = `blocks_${language}`

	const objectives = contentData[objectivesKey] || []
	const blocks = contentData[blocksKey] || []

	const updateObjectives = (newObjectives) => {
		onChange({
			...contentData,
			[objectivesKey]: newObjectives
		})
	}

	const addBlock = (type) => {
		const newBlock = { type }
		onChange({
			...contentData,
			[blocksKey]: [...blocks, newBlock]
		})
		setExpandedBlock(blocks.length)
	}

	const removeBlock = (index) => {
		onChange({
			...contentData,
			[blocksKey]: blocks.filter((_, i) => i !== index)
		})
		if (expandedBlock === index) setExpandedBlock(null)
	}

	const updateBlock = (index, updatedBlock) => {
		const updated = [...blocks]
		updated[index] = updatedBlock
		onChange({
			...contentData,
			[blocksKey]: updated
		})
	}

	const moveBlock = (index, direction) => {
		if (direction === 'up' && index === 0) return
		if (direction === 'down' && index === blocks.length - 1) return

		const newIndex = direction === 'up' ? index - 1 : index + 1
		const updated = [...blocks]
		const [removed] = updated.splice(index, 1)
		updated.splice(newIndex, 0, removed)

		onChange({
			...contentData,
			[blocksKey]: updated
		})
		setExpandedBlock(newIndex)
	}

	const getBlockTypeInfo = (type) => {
		return BLOCK_TYPES.find(t => t.value === type) || { label: type, icon: '❓', color: 'bg-gray-100 text-gray-700' }
	}

	return (
		<div className="space-y-6">
			{/* Objectives Section */}
			<div className="bg-white rounded-xl border-2 border-indigo-200 p-6">
				<ObjectivesEditor objectives={objectives} onChange={updateObjectives} />
			</div>

			{/* Blocks Section */}
			<div className="bg-white rounded-xl border-2 border-purple-200 p-6">
				<div className="flex items-center justify-between mb-4">
					<Label className="text-base font-semibold">Blocs de contenu ({blocks.length})</Label>
					<Select onValueChange={addBlock}>
						<SelectTrigger className="w-[200px]">
							<SelectValue placeholder="+ Ajouter un bloc" />
						</SelectTrigger>
						<SelectContent>
							{BLOCK_TYPES.map(type => (
								<SelectItem key={type.value} value={type.value}>
									<span className="flex items-center gap-2">
										<span>{type.icon}</span>
										<span>{type.label}</span>
									</span>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-3">
					{blocks.length === 0 && (
						<p className="text-sm text-slate-500 text-center py-8">
							Aucun bloc. Utilisez le menu ci-dessus pour ajouter un bloc.
						</p>
					)}

					{blocks.map((block, index) => {
						const typeInfo = getBlockTypeInfo(block.type)
						const isExpanded = expandedBlock === index

						return (
							<div key={index} className="border-2 border-slate-200 rounded-lg overflow-hidden hover:border-indigo-300 transition-colors">
								{/* Block Header */}
								<div className="flex items-center gap-3 p-3 bg-slate-50">
									<div className="flex items-center gap-2 flex-1 cursor-pointer" onClick={() => setExpandedBlock(isExpanded ? null : index)}>
										<GripVertical className="w-4 h-4 text-slate-400" />
										<Badge className={`${typeInfo.color} border-0`}>
											{typeInfo.icon} {typeInfo.label}
										</Badge>
										<span className="text-sm text-slate-600">
											{block.title || 'Sans titre'}
										</span>
									</div>

									<div className="flex items-center gap-1">
										<Button
											size="sm"
											variant="ghost"
											onClick={() => moveBlock(index, 'up')}
											disabled={index === 0}
										>
											<ChevronUp className="w-4 h-4" />
										</Button>
										<Button
											size="sm"
											variant="ghost"
											onClick={() => moveBlock(index, 'down')}
											disabled={index === blocks.length - 1}
										>
											<ChevronDown className="w-4 h-4" />
										</Button>
										<Button
											size="sm"
											variant="ghost"
											onClick={() => removeBlock(index)}
											className="text-red-500 hover:text-red-700"
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								</div>

								{/* Block Content (Expanded) */}
								{isExpanded && (
									<div className="p-4 border-t bg-white">
										<SimpleBlockEditor
											block={block}
											onChange={(updated) => updateBlock(index, updated)}
										/>
									</div>
								)}
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default VisualBlocksEditor
