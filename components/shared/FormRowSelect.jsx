import { MenuItem, TextField } from '@mui/material'

const FormRowSelect = ({ handleChange, label, value, name, list, fullWidth = true }) => {
	return (
		<TextField
			select
			label={label}
			value={value}
			onChange={handleChange}
			name={name}
			fullWidth={fullWidth}
			sx={{ backgroundColor: 'white' }}>
			{list.map(value => (
				<MenuItem key={value} value={value}>
					{value}
				</MenuItem>
			))}
		</TextField>
	)
}

export default FormRowSelect
