'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

/**
 * Simple JSON editor for standalone lesson blocks
 */
const StandaloneJSONEditor = ({ blocks, onChange }) => {
	const [jsonValue, setJsonValue] = useState(JSON.stringify(blocks, null, 2))
	const [error, setError] = useState(null)

	const handleChange = (value) => {
		setJsonValue(value)

		// Try to parse JSON
		try {
			const parsed = JSON.parse(value)
			setError(null)
			onChange(parsed)
		} catch (err) {
			setError(err.message)
		}
	}

	return (
		<div className="space-y-4">
			{error && (
				<div className="flex items-start gap-2 p-3 rounded-lg border border-red-200 bg-red-50 text-red-900">
					<AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
					<div className="text-sm">
						<strong>Invalid JSON:</strong> {error}
					</div>
				</div>
			)}

			{!error && (
				<div className="flex items-start gap-2 p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900">
					<CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-600" />
					<div className="text-sm">
						Valid JSON
					</div>
				</div>
			)}

			<div className="relative">
				<Textarea
					value={jsonValue}
					onChange={(e) => handleChange(e.target.value)}
					rows={25}
					className={`font-mono text-sm ${error ? 'border-red-500' : 'border-slate-300'}`}
					placeholder="Enter blocks JSON here..."
				/>
				<div className="absolute bottom-2 right-2 text-xs text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
					{jsonValue.split('\n').length} lines
				</div>
			</div>

			<div className="text-sm text-slate-600 space-y-1">
				<p className="font-semibold">Tips:</p>
				<ul className="list-disc list-inside space-y-1 text-xs">
					<li>Make sure to use valid JSON syntax</li>
					<li>Common block types: title, subtitle, paragraph, conjugationTable, alphabetGrid</li>
					<li>Use double quotes for strings, not single quotes</li>
					<li>Arrays use square brackets [], objects use curly braces {}</li>
				</ul>
			</div>
		</div>
	)
}

export default StandaloneJSONEditor
