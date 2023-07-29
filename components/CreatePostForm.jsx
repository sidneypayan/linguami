import { Box } from '@mui/material'

import { FormRow, FormRowSelect } from '../components'
import { lang } from '../utils/constants'

const CreatePostForm = ({ formData, handleChange, value }) => {
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
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(1, 1fr)',
					gap: 1,
					mb: 1,
				}}>
				<FormRow
					label='Body'
					value={formData.body ?? ''}
					handleChange={handleChange}
					name='body'
					multiline={true}
				/>
			</Box>
		</>
	)
}

export default CreatePostForm
