export const metadata = {
	title: 'Linguami',
	description: 'Apprenez le français et le russe avec des méthodes interactives',
}

export default function RootLayout({ children }) {
	return (
		<html lang="fr">
			<body>{children}</body>
		</html>
	)
}
