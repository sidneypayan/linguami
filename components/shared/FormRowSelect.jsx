import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const FormRowSelect = ({ handleChange, label, value, name, list, fullWidth = true }) => {
	const onValueChange = (newValue) => {
		// Simulate event object for compatibility with existing handlers
		handleChange({
			target: {
				name,
				value: newValue
			}
		})
	}

	return (
		<div className={cn('space-y-2', fullWidth ? 'w-full' : 'w-auto')}>
			{label && (
				<Label htmlFor={name} className="text-sm font-medium">
					{label}
				</Label>
			)}
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger 
					id={name}
					className="bg-white dark:bg-slate-900"
				>
					<SelectValue placeholder={label} />
				</SelectTrigger>
				<SelectContent>
					{list.map((item) => (
						<SelectItem key={item} value={item}>
							{item}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}

export default FormRowSelect
