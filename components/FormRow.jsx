import { TextField } from '@mui/material'

const FormRow = ({ handleChange, label, value, name, multiline = false, rows = 4, placeholder, type = 'text', fullWidth = true }) => {
	return (
		<TextField
			label={label}
			variant='outlined'
			value={value}
			onChange={handleChange}
			name={name}
			type={type}
			placeholder={placeholder}
			fullWidth={fullWidth}
			sx={{ backgroundColor: 'white' }}
			multiline={multiline}
			rows={multiline ? rows : undefined}
		/>
	)
}

export default FormRow
