import dynamic from 'next/dynamic'
import { useState } from 'react'
const ReactQuill = dynamic(import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

const TextEditor = () => {
	const [value, setValue] = useState('')

	const modules = {
		toolbar: [
			[{ header: [1, 2, false] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[
				{ list: 'ordered' },
				{ list: 'bullet' },
				{ indent: '-1' },
				{ indent: '+1' },
			],
			['link', 'image'],
		],
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
			editorValue={value}
			onChange={setValue}
			modules={modules}
			formats={formats}
		/>
	)
}

export default TextEditor
