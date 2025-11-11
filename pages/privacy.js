import { Container, Box, Typography, useTheme } from '@mui/material'
import { Shield } from '@mui/icons-material'
import Head from 'next/head'
import Link from 'next/link'

const PrivacyPolicy = () => {
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	const sections = [
		{
			title: '1. Collecte des données',
			content: `Nous collectons les informations suivantes lorsque vous utilisez Linguami :

**Informations de compte :**
- Nom d'utilisateur (pseudo)
- Adresse email
- Photo de profil (si vous vous connectez via Google, Facebook ou Apple)
- Langue parlée et langue d'apprentissage
- Niveau de langue

**Données d'utilisation :**
- Progression dans les leçons et exercices
- Mots ajoutés à votre dictionnaire personnel
- Points XP, niveau et statistiques d'apprentissage
- Temps passé sur la plateforme

**Données techniques :**
- Adresse IP
- Type de navigateur et appareil
- Cookies de session`,
		},
		{
			title: '2. Utilisation des données',
			content: `Nous utilisons vos données pour :

- **Fournir le service** : Gérer votre compte, sauvegarder votre progression
- **Améliorer l'expérience** : Personnaliser votre parcours d'apprentissage
- **Communiquer** : Envoyer des notifications importantes (validation email, réinitialisation mot de passe)
- **Sécurité** : Protéger votre compte et prévenir la fraude
- **Développement** : Améliorer nos fonctionnalités et corriger les bugs

Nous **ne vendons jamais** vos données personnelles à des tiers.`,
		},
		{
			title: '3. Authentification tierce',
			content: `Si vous vous connectez via Google, Facebook ou Apple :

- Nous recevons uniquement votre **nom**, **email** et **photo de profil**
- Nous n'accédons **jamais** à votre compte Google/Facebook/Apple
- Vous pouvez révoquer l'accès à tout moment dans les paramètres de votre compte tiers
- Ces services ont leurs propres politiques de confidentialité que nous vous encourageons à consulter`,
		},
		{
			title: '4. Stockage et sécurité',
			content: `Vos données sont :

- **Chiffrées** lors du transfert (HTTPS/SSL)
- **Stockées** sur des serveurs sécurisés (Supabase - infrastructure AWS)
- **Protégées** par des mots de passe hashés (bcrypt)
- **Sauvegardées** régulièrement pour prévenir la perte de données

Nous conservons vos données tant que votre compte est actif.`,
		},
		{
			title: '5. Vos droits (RGPD)',
			content: `Conformément au RGPD, vous avez le droit de :

- **Accéder** à vos données personnelles
- **Rectifier** des informations incorrectes
- **Supprimer** votre compte et toutes vos données
- **Exporter** vos données (portabilité)
- **Vous opposer** au traitement de vos données
- **Limiter** le traitement de vos données

Pour exercer ces droits, contactez-nous à : **contact@linguami.com**`,
		},
		{
			title: '6. Cookies',
			content: `Nous utilisons des cookies pour :

- **Session** : Maintenir votre connexion
- **Préférences** : Sauvegarder vos choix (thème sombre/clair, langue d'interface)
- **Analytiques** : Google Analytics pour améliorer le site (anonymisé)

Vous pouvez désactiver les cookies dans votre navigateur, mais certaines fonctionnalités pourraient ne plus fonctionner.`,
		},
		{
			title: '7. Partage de données',
			content: `Nous partageons vos données uniquement avec :

- **Supabase** : Hébergement de la base de données (conforme RGPD)
- **Cloudflare** : CDN pour les fichiers média (conforme RGPD)
- **Google Analytics** : Statistiques anonymisées

Nous ne partageons **jamais** vos données avec des annonceurs ou courtiers de données.`,
		},
		{
			title: '8. Protection des mineurs',
			content: `Linguami est accessible aux utilisateurs de **13 ans et plus**.

Si vous avez moins de 16 ans (âge légal dans l'UE), l'accord d'un parent ou tuteur légal est requis. Nous ne collectons pas sciemment de données sur des enfants de moins de 13 ans.`,
		},
		{
			title: '9. Modifications',
			content: `Nous pouvons modifier cette politique de confidentialité. Les changements importants seront notifiés par :

- Email à votre adresse enregistrée
- Notification sur la plateforme
- Mise à jour de la date "Dernière mise à jour" ci-dessous

L'utilisation continue de Linguami après modification implique l'acceptation des nouvelles conditions.`,
		},
		{
			title: '10. Contact',
			content: `Pour toute question concernant cette politique :

**Email :** contact@linguami.com
**Responsable de la protection des données :** Linguami

Nous nous engageons à répondre dans les **30 jours** conformément au RGPD.`,
		},
	]

	return (
		<>
			<Head>
				<title>Politique de confidentialité | Linguami</title>
				<meta
					name="description"
					content="Politique de confidentialité et protection des données personnelles de Linguami. Conforme RGPD."
				/>
			</Head>

			<Box
				sx={{
					minHeight: '100vh',
					pt: { xs: '5rem', md: '6rem' },
					pb: 8,
					background: isDark
						? 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)'
						: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #e0e7ff 100%)',
				}}>
				<Container maxWidth="md">
					{/* Header */}
					<Box
						sx={{
							textAlign: 'center',
							mb: 6,
						}}>
						<Box
							sx={{
								display: 'inline-flex',
								p: 2,
								borderRadius: 3,
								background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
								mb: 3,
							}}>
							<Shield sx={{ fontSize: '3rem', color: '#667eea' }} />
						</Box>

						<Typography
							variant="h2"
							sx={{
								fontWeight: 800,
								fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
								mb: 2,
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
							}}>
							Politique de confidentialité
						</Typography>

						<Typography
							variant="body1"
							sx={{
								color: 'text.secondary',
								fontSize: '1.125rem',
								maxWidth: '600px',
								mx: 'auto',
							}}>
							Comment nous collectons, utilisons et protégeons vos données personnelles
						</Typography>

						<Typography
							variant="caption"
							sx={{
								display: 'block',
								color: 'text.secondary',
								mt: 2,
								fontSize: '0.875rem',
							}}>
							Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</Typography>
					</Box>

					{/* Introduction */}
					<Box
						sx={{
							mb: 6,
							p: 4,
							borderRadius: 3,
							background: isDark
								? 'rgba(139, 92, 246, 0.1)'
								: 'rgba(102, 126, 234, 0.05)',
							border: '1px solid',
							borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(102, 126, 234, 0.2)',
						}}>
						<Typography variant="body1" sx={{ lineHeight: 1.8 }}>
							Chez <strong>Linguami</strong>, nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles.
							Cette politique explique comment nous collectons, utilisons et protégeons vos informations conformément au
							<strong> Règlement Général sur la Protection des Données (RGPD)</strong> de l&apos;Union Européenne.
						</Typography>
					</Box>

					{/* Sections */}
					{sections.map((section, index) => (
						<Box
							key={index}
							sx={{
								mb: 5,
								p: 4,
								borderRadius: 3,
								background: isDark ? 'rgba(30, 41, 59, 0.6)' : 'white',
								border: '1px solid',
								borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
								transition: 'all 0.3s ease',
								'&:hover': {
									transform: 'translateY(-2px)',
									boxShadow: isDark
										? '0 8px 24px rgba(139, 92, 246, 0.2)'
										: '0 8px 24px rgba(0, 0, 0, 0.08)',
								},
							}}>
							<Typography
								variant="h5"
								sx={{
									fontWeight: 700,
									mb: 2,
									color: '#667eea',
									fontSize: { xs: '1.25rem', sm: '1.5rem' },
								}}>
								{section.title}
							</Typography>
							<Typography
								variant="body1"
								sx={{
									lineHeight: 1.8,
									whiteSpace: 'pre-line',
									color: 'text.primary',
								}}>
								{section.content}
							</Typography>
						</Box>
					))}

					{/* Footer CTA */}
					<Box
						sx={{
							mt: 8,
							p: 4,
							borderRadius: 3,
							textAlign: 'center',
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							color: 'white',
						}}>
						<Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
							Des questions sur notre politique de confidentialité ?
						</Typography>
						<Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
							Nous sommes là pour vous aider et répondre à toutes vos préoccupations
						</Typography>
						<Link href="mailto:contact@linguami.com" style={{ textDecoration: 'none' }}>
							<Typography
								sx={{
									color: 'white',
									fontWeight: 600,
									fontSize: '1.125rem',
									textDecoration: 'underline',
									'&:hover': {
										opacity: 0.8,
									},
								}}>
								contact@linguami.com
							</Typography>
						</Link>
					</Box>

					{/* Link to Terms */}
					<Box sx={{ mt: 4, textAlign: 'center' }}>
						<Link href="/terms" style={{ textDecoration: 'none' }}>
							<Typography
								sx={{
									color: '#667eea',
									fontWeight: 600,
									'&:hover': {
										textDecoration: 'underline',
									},
								}}>
								Voir aussi nos Conditions Générales d&apos;Utilisation →
							</Typography>
						</Link>
					</Box>
				</Container>
			</Box>
		</>
	)
}

export default PrivacyPolicy
