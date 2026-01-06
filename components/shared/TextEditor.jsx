'use client'

import dynamic from 'next/dynamic'
import { useThemeMode } from '@/context/ThemeContext'
import remarkBreaks from 'remark-breaks'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

// Dynamic import to avoid SSR issues
const MDEditor = dynamic(
	() => import('@uiw/react-md-editor').then((mod) => mod.default),
	{ ssr: false }
)

/**
 * Markdown editor component for blog posts
 * Uses @uiw/react-md-editor for native Markdown editing with live preview
 *
 * @param {Object} props
 * @param {string} props.value - Markdown content
 * @param {Function} props.setValue - Callback to update markdown content
 * @param {number} props.height - Editor height in pixels (default: 500)
 * @param {string} props.preview - Preview mode: 'live' | 'edit' | 'preview' (default: 'live')
 */
const TextEditor = ({ value, setValue, height = 500, preview = 'live' }) => {
	const { mode } = useThemeMode()

	return (
		<div data-color-mode={mode}>
			<MDEditor
				value={value}
				onChange={setValue}
				height={height}
				preview={preview}
				visibleDragbar={false}
				enableScroll={true}
				textareaProps={{
					placeholder: 'Écrivez votre article en Markdown...',
				}}
				previewOptions={{
					remarkPlugins: [remarkBreaks],
					rehypePlugins: [],
				}}
			/>
		</div>
	)
}

export default TextEditor
