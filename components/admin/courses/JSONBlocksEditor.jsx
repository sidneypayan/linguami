'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle } from 'lucide-react'

const JSONBlocksEditor = ({ contentData, onChange }) => {
	const [activeLanguage, setActiveLanguage] = useState('fr')
	const [validationErrors, setValidationErrors] = useState({})

	const handleJSONChange = (field, value) => {
		try {
			const parsed = JSON.parse(value)
			setValidationErrors({...validationErrors, [field]: null})
			onChange({
				...contentData,
				[field]: parsed
			})
		} catch (err) {
			setValidationErrors({...validationErrors, [field]: err.message})
		}
	}

	const renderJSONField = (field, label) => {
		const hasError = validationErrors[field]

		return (
			<div>
				<div className="flex items-center justify-between mb-2">
					<Label>{label}</Label>
					{hasError ? (
						<div className="flex items-center gap-1 text-red-500 text-xs">
							<AlertCircle className="w-3 h-3" />
							Invalid JSON
						</div>
					) : (
						<div className="flex items-center gap-1 text-green-500 text-xs">
							<CheckCircle className="w-3 h-3" />
							Valid
						</div>
					)}
				</div>
				<Textarea
					value={JSON.stringify(contentData[field], null, 2)}
					onChange={(e) => handleJSONChange(field, e.target.value)}
					rows={15}
					className={`font-mono text-sm ${hasError ? 'border-red-500' : ''}`}
				/>
				{hasError && (
					<p className="text-xs text-red-500 mt-1">{hasError}</p>
				)}
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<Tabs value={activeLanguage} onValueChange={setActiveLanguage}>
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="fr">French</TabsTrigger>
					<TabsTrigger value="ru">Russian</TabsTrigger>
					<TabsTrigger value="en">English</TabsTrigger>
				</TabsList>

				<TabsContent value="fr" className="space-y-4">
					{renderJSONField('objectives_fr', 'Objectives (French)')}
					{renderJSONField('blocks_fr', 'Blocks (French)')}
				</TabsContent>

				<TabsContent value="ru" className="space-y-4">
					{renderJSONField('objectives_ru', 'Objectives (Russian)')}
					{renderJSONField('blocks_ru', 'Blocks (Russian)')}
				</TabsContent>

				<TabsContent value="en" className="space-y-4">
					{renderJSONField('objectives_en', 'Objectives (English)')}
					{renderJSONField('blocks_en', 'Blocks (English)')}
				</TabsContent>
			</Tabs>

			<div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm">
				<p className="font-medium text-blue-900 mb-2">JSON Editing Tips:</p>
				<ul className="list-disc list-inside space-y-1 text-blue-800">
					<li>Edit JSON directly - validation happens in real-time</li>
					<li>objectives_* must be arrays of strings</li>
					<li>blocks_* must be arrays of block objects</li>
					<li>See docs/guides/COURSE_BLOCKS_STRUCTURE.md for block schemas</li>
				</ul>
			</div>
		</div>
	)
}

export default JSONBlocksEditor
