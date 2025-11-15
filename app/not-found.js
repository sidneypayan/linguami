import Link from 'next/link'

export default function NotFound() {
	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			minHeight: '100vh',
			textAlign: 'center',
			padding: '20px',
			fontFamily: 'system-ui, -apple-system, sans-serif'
		}}>
			<h1 style={{
				fontSize: '6rem',
				fontWeight: 700,
				background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
				backgroundClip: 'text',
				WebkitBackgroundClip: 'text',
				WebkitTextFillColor: 'transparent',
				margin: '0 0 20px 0'
			}}>
				404
			</h1>

			<h2 style={{
				fontSize: '1.5rem',
				fontWeight: 600,
				margin: '0 0 10px 0'
			}}>
				Page non trouvée
			</h2>

			<p style={{
				color: '#666',
				marginBottom: '30px'
			}}>
				La page que vous recherchez n'existe pas ou a été déplacée.
			</p>

			<Link
				href="/"
				style={{
					display: 'inline-block',
					padding: '12px 32px',
					background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
					color: 'white',
					textDecoration: 'none',
					borderRadius: '8px',
					fontWeight: 600
				}}
			>
				Retour à l'accueil
			</Link>
		</div>
	)
}
