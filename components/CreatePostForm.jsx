import { Box } from '@mui/material'
import { FormRow, FormRowSelect, TextEditor } from '../components'
import { lang } from '../utils/constants'

const CreatePostForm = ({ formData, handleChange, setBodyValue }) => {
	return (
		<>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(2,1fr)',
					gap: 1,
					mb: 1,
				}}>
				<FormRowSelect
					label='Lang'
					value={formData.lang ?? ''}
					handleChange={handleChange}
					name='lang'
					list={lang}
				/>
				<FormRow
					label='Title'
					value={formData.title ?? ''}
					handleChange={handleChange}
					name='title'
				/>
			</Box>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(2, 1fr)',
					gap: 1,
					mb: 1,
				}}>
				<FormRow
					label='Description'
					value={formData.description ?? ''}
					handleChange={handleChange}
					name='description'
				/>
				<FormRow
					label='img'
					value={formData.img ?? ''}
					handleChange={handleChange}
					name='img'
				/>
			</Box>

			<Box>
				<TextEditor value={formData.body ?? ''} setValue={setBodyValue} />
			</Box>
		</>
	)
}

export default CreatePostForm
