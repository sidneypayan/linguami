import { Loader2 } from 'lucide-react'

export default function Loading() {
	return (
		<div className="max-w-7xl mx-auto px-4">
			<div className="flex items-center justify-center min-h-[70vh]">
				<Loader2 className="h-16 w-16 text-indigo-500 animate-spin" />
			</div>
		</div>
	)
}
