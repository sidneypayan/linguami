export const metadata = {
	title: 'Linguami',
	description: 'Apprenez le français et le russe',
	charset: 'utf-8',
}

export default function RootLayout({ children }) {
	return (
		<html lang="fr">
			<body suppressHydrationWarning={true}>{children}</body>
		</html>
	)
}
