export default function MainTitleBlock({ text }) {
	return (
		<h1
			className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent py-2 leading-tight"
			style={{ paddingTop: '0.5rem', paddingBottom: '0.25rem' }}>
			{text}
		</h1>
	)
}
