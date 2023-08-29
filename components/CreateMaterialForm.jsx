import { Box, Button } from '@mui/material'
import { FormRow, FormRowSelect } from '.'
import { allSections } from '../data/sections'
import { lang, level } from '../utils/constants'
import { Image, AudioFile } from '@mui/icons-material'

const CreateMaterialForm = ({ formData, handleChange }) => {
	return (
		<>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(3,1fr)',
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
				<FormRowSelect
					label='Section'
					value={formData.section ?? ''}
					handleChange={handleChange}
					name='section'
					list={allSections}
				/>
				<FormRowSelect
					label='Level'
					value={formData.level ?? ''}
					handleChange={handleChange}
					name='level'
					list={level}
				/>
			</Box>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(1fr)',
					mb: 1,
				}}>
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
					gridTemplateColumns: 'repeat(3,1fr)',
					gap: 1,
					mb: 1,
				}}>
				{/* <FormRow
					label='Image'
					value={formData.img ?? ''}
					handleChange={handleChange}
					name='img'
				/> */}
				<Button component='label' variant='outlined' startIcon={<Image />}>
					Ajouter une image
					<input name='img' hidden type='file' />
				</Button>
				<Button component='label' variant='outlined' startIcon={<AudioFile />}>
					Ajouter un audio
					<input name='audio' hidden type='file' />
				</Button>

				{/* <FormRow
					label='Audio'
					value={formData.audio ?? ''}
					handleChange={handleChange}
					name='audio'
				/> */}

				<FormRow
					label='Video'
					value={formData.video ?? ''}
					handleChange={handleChange}
					name='video'
				/>
			</Box>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(2,1fr)',
					gap: 1,
					mb: 1,
				}}>
				<FormRow
					label='Book Name'
					value={formData.book_name ?? ''}
					handleChange={handleChange}
					name='book_name'
				/>
				<FormRow
					label='Book Chapter'
					value={formData.book_chapter ?? ''}
					handleChange={handleChange}
					name='book_chapter'
				/>
			</Box>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(2,1fr)',
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
				<FormRow
					label='Body accents'
					value={formData.body_accents ?? ''}
					handleChange={handleChange}
					name='body_accents'
					multiline={true}
				/>
			</Box>
		</>
	)
}

export default CreateMaterialForm
