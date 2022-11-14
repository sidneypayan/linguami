import dynamic from 'next/dynamic'
const ReactQuill = dynamic(import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

const TextEditor = ({ setValue, value }) => {
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
			value={value}
			onChange={setValue}
			modules={modules}
			formats={formats}
		/>
	)
}

export default TextEditor
