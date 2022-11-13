import { TextField } from '@mui/material'

const FormRow = ({ handleChange, label, value, name }) => {
	return (
		<TextField
			label={label}
			variant='outlined'
			value={value}
			onChange={handleChange}
			name={name}
			sx={{ backgroundColor: 'white' }}
		/>
	)
}

export default FormRow
