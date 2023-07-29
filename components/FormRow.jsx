import { TextField } from '@mui/material'

const FormRow = ({ handleChange, label, value, name, multiline = false }) => {
	return (
		<TextField
			label={label}
			variant='outlined'
			value={value}
			onChange={handleChange}
			name={name}
			sx={{ backgroundColor: 'white' }}
			multiline={multiline}
			rows={20}
		/>
	)
}

export default FormRow
