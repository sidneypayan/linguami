import dynamic from 'next/dynamic'
import { useState } from 'react'
const ReactQuill = dynamic(import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

const TextEditor = ({ value, setValue }) => {
	const toolbarOptions = [
		['bold', 'italic', 'underline'], // toggled buttons
		['blockquote'],

		[{ header: 1 }, { header: 2 }], // custom button values
		[{ list: 'ordered' }, { list: 'bullet' }],
		// [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
		[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
		// [{ direction: 'rtl' }], // text direction

		// [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
		[{ header: [1, 2, 3, 4, 5, 6, false] }],

		[{ color: [] }, { background: [] }], // dropdown with defaults from theme
		// [{ font: [] }],
		[{ align: [] }],
		['link', 'image'],

		['clean'], // remove formatting button
	]

	const modules = {
		toolbar: toolbarOptions,
	}

	const formats = [
		'header',
		'bold',
		'italic',
		'underline',
		'strike',
		'blockquote',
		'list',
		'bullet',
		'indent',
		'link',
		'image',
	]

	return (
		<ReactQuill
			style={{
				flexBasis: '100%',
				height: '500px',
				backgroundColor: 'white',
			}}
			theme='snow'
			value={value}
			onChange={setValue}
			modules={modules}
			formats={formats}
		/>
	)
}

export default TextEditor
