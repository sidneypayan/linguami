import useTranslation from 'next-translate/useTranslation'
import { FaSkype, FaEnvelope } from 'react-icons/fa'
import Head from 'next/head'
import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	Stack,
	Typography,
	Avatar,
} from '@mui/material'
import { FormatQuote } from '@mui/icons-material'

const Teacher = () => {
	const { t, lang } = useTranslation('teacher')
	const img =
		lang === 'ru'
			? `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/sidney.jpg`
			: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}/natacha.jpg`

	return (
		<>
			<Head>
				<title>{`${t('pagetitle')} | Linguami`}</title>
				<meta name='description' content={t('description')} />
			</Head>

			{/* Hero Section */}
			<Box
				sx={{
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					pt: { xs: 12, sm: 14, md: 16 },
					pb: { xs: 8, sm: 10, md: 12 },
					position: 'relative',
					overflow: 'hidden',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
						pointerEvents: 'none',
					},
					'&::after': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
						pointerEvents: 'none',
					},
				}}>
				<Container
					maxWidth='md'
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						position: 'relative',
						zIndex: 1,
					}}>
					{/* Photo avec effet */}
					<Box
						sx={{
							position: 'relative',
							mb: 4,
						}}>
						<Box
							sx={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								width: { xs: 240, sm: 280 },
								height: { xs: 240, sm: 280 },
								borderRadius: '50%',
								background: 'rgba(255, 255, 255, 0.2)',
								animation: 'pulse 3s ease-in-out infinite',
								'@keyframes pulse': {
									'0%, 100%': {
										transform: 'translate(-50%, -50%) scale(1)',
										opacity: 0.5,
									},
									'50%': {
										transform: 'translate(-50%, -50%) scale(1.1)',
										opacity: 0.3,
									},
								},
							}}
						/>
						<Avatar
							src={img}
							alt='teacher'
							sx={{
								width: { xs: 200, sm: 240 },
								height: { xs: 200, sm: 240 },
								border: '6px solid rgba(255, 255, 255, 0.9)',
								boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
								position: 'relative',
								zIndex: 1,
							}}
						/>
					</Box>

					{/* Titre principal */}
					<Typography
						variant='h3'
						align='center'
						sx={{
							color: 'white',
							fontWeight: 800,
							fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
							mb: 2,
							textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
							px: 2,
						}}>
						{t('title')}
					</Typography>

					{/* Sous-titre pour français */}
					{lang === 'fr' && (
						<Typography
							variant='h6'
							align='center'
							sx={{
								color: 'rgba(255, 255, 255, 0.95)',
								fontWeight: 500,
								fontSize: { xs: '1rem', sm: '1.25rem' },
								mb: 4,
								px: 2,
								lineHeight: 1.6,
							}}>
							Professeure de l&apos;Alliance française <br /> diplômée de
							l&apos;université de Moscou
						</Typography>
					)}

					{/* Label contact */}
					<Typography
						variant='body1'
						sx={{
							color: 'rgba(255, 255, 255, 0.9)',
							fontWeight: 600,
							mb: 3,
							fontSize: { xs: '1rem', sm: '1.125rem' },
						}}>
						{t('contact')}
					</Typography>

					{/* Boutons de contact */}
					<Stack
						direction={{ xs: 'column', sm: 'row' }}
						gap={2}
						sx={{
							width: { xs: '100%', sm: 'auto' },
							px: { xs: 2, sm: 0 },
						}}>
						<Button
							href={t('skype')}
							variant='contained'
							startIcon={<FaSkype />}
							sx={{
								backgroundColor: 'white',
								color: '#667eea',
								fontWeight: 700,
								fontSize: { xs: '1rem', sm: '1.125rem' },
								padding: { xs: '12px 32px', sm: '14px 40px' },
								borderRadius: 3,
								textTransform: 'none',
								boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
								transition: 'all 0.3s ease',
								'&:hover': {
									backgroundColor: 'white',
									transform: 'translateY(-4px)',
									boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
								},
								'&:active': {
									transform: 'translateY(-2px)',
								},
							}}>
							Skype
						</Button>
						<Button
							href={t('mail')}
							variant='outlined'
							startIcon={<FaEnvelope />}
							sx={{
								borderColor: 'white',
								backgroundColor: 'rgba(255, 255, 255, 0.1)',
								backdropFilter: 'blur(10px)',
								color: 'white',
								fontWeight: 700,
								fontSize: { xs: '1rem', sm: '1.125rem' },
								padding: { xs: '12px 32px', sm: '14px 40px' },
								borderRadius: 3,
								borderWidth: 2,
								textTransform: 'none',
								transition: 'all 0.3s ease',
								'&:hover': {
									backgroundColor: 'rgba(255, 255, 255, 0.2)',
									borderColor: 'white',
									borderWidth: 2,
									transform: 'translateY(-4px)',
								},
								'&:active': {
									transform: 'translateY(-2px)',
								},
							}}>
							Mail
						</Button>
					</Stack>
				</Container>
			</Box>

			{/* Section de présentation */}
			<Container
				maxWidth='md'
				sx={{
					py: { xs: 6, sm: 8, md: 10 },
					px: { xs: 2, sm: 3 },
				}}>
				<Typography
					variant='body1'
					sx={{
						fontSize: { xs: '1.0625rem', sm: '1.125rem' },
						lineHeight: 1.8,
						color: '#4a5568',
						textAlign: 'center',
						mb: 6,
					}}>
					{t('text')}
				</Typography>

				{/* Section des avis */}
				{lang === 'fr' && (
					<Box sx={{ mt: { xs: 6, md: 8 } }}>
						<Typography
							variant='h4'
							align='center'
							sx={{
								fontWeight: 700,
								fontSize: { xs: '1.75rem', md: '2rem' },
								mb: 1,
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							}}>
							L&apos;avis des élèves
						</Typography>
						<Typography
							variant='subtitle1'
							align='center'
							sx={{
								color: '#718096',
								mb: 5,
							}}>
							Témoignages de nos apprenants
						</Typography>

						<Stack
							gap={{ xs: 3, md: 4 }}
							sx={{
								flexDirection: {
									xs: 'column',
									lg: 'row',
								},
							}}>
							{[
								{
									name: 'David',
									text: "Natacha se donne beaucoup de mal pour préparer le cours suivant en fonction du besoin du moment. Les moyens pour apprendre sont sur mesure. Super ambiance. J'attends chaque cours avec impatience",
									color: '#667eea',
								},
								{
									name: 'Carole',
									text: "Je suis très satisfaite du cours. Natalia est attentive aux différents besoins des élèves, gentille et agréable. L'apprentissage est rapide et facile grâce à sa pedagogie. Autres points forts, la flexibilité pour les horaires et le bon matériel didactique (livres, audios) mis à disposition",
									color: '#764ba2',
								},
								{
									name: 'Daniel',
									text: "Depuis 1 an j'apprends le Russe avec Natacha et je suis très satisfait de ma professeure, je progresse facilement et j'ai pu commencer quelques dialogues lors de 2 voyages à Saint Petersbourg. Sa méthode d'apprentissage est facile et complète",
									color: '#667eea',
								},
							].map((review, index) => (
								<Card
									key={review.name}
									sx={{
										flex: 1,
										position: 'relative',
										borderRadius: 3,
										overflow: 'visible',
										backgroundColor: 'white',
										boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
										border: '1px solid rgba(102, 126, 234, 0.1)',
										transition: 'all 0.3s ease',
										'&:hover': {
											transform: 'translateY(-8px)',
											boxShadow: '0 12px 32px rgba(102, 126, 234, 0.2)',
											borderColor: 'rgba(102, 126, 234, 0.3)',
										},
									}}>
									<Box
										sx={{
											position: 'absolute',
											top: -20,
											left: 24,
											width: 48,
											height: 48,
											borderRadius: '50%',
											background: `linear-gradient(135deg, ${review.color} 0%, ${review.color}dd 100%)`,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											boxShadow: `0 4px 12px ${review.color}40`,
										}}>
										<FormatQuote sx={{ color: 'white', fontSize: 28 }} />
									</Box>
									<CardContent sx={{ pt: 5, pb: 4, px: 3 }}>
										<Typography
											variant='h5'
											align='center'
											sx={{
												fontWeight: 700,
												mb: 2,
												color: '#2d3748',
												fontSize: { xs: '1.25rem', sm: '1.5rem' },
											}}>
											{review.name}
										</Typography>
										<Typography
											variant='body1'
											sx={{
												color: '#718096',
												lineHeight: 1.7,
												fontSize: { xs: '0.9375rem', sm: '1rem' },
												textAlign: 'center',
											}}>
											{review.text}
										</Typography>
									</CardContent>
								</Card>
							))}
						</Stack>
					</Box>
				)}
			</Container>
		</>
	)
}

export default Teacher
