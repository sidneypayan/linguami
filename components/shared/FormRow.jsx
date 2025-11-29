import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const FormRow = ({ 
	handleChange, 
	label, 
	value, 
	name, 
	multiline = false, 
	rows = 4, 
	placeholder, 
	type = 'text', 
	fullWidth = true 
}) => {
	return (
		<div className={cn('space-y-2', fullWidth ? 'w-full' : 'w-auto')}>
			{label && (
				<Label htmlFor={name} className="text-sm font-medium">
					{label}
				</Label>
			)}
			{multiline ? (
				<Textarea
					id={name}
					name={name}
					value={value}
					onChange={handleChange}
					placeholder={placeholder}
					rows={rows}
					className="bg-white dark:bg-slate-900"
				/>
			) : (
				<Input
					id={name}
					name={name}
					type={type}
					value={value}
					onChange={handleChange}
					placeholder={placeholder}
					className="bg-white dark:bg-slate-900"
				/>
			)}
		</div>
	)
}

export default FormRow
