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
} from '@mui/material'
import { primaryButton, secondaryButton } from '../../utils/buttonStyles'

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
			<Container
				maxWidth='md'
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					margin: '10rem auto',
				}}>
				<Box
					component='img'
					width={200}
					height={200}
					sx={{ borderRadius: '50%' }}
					src={img}
					alt='teacher'
				/>
				<Typography
					color='clrPrimary3'
					variant='body1'
					m={2}
					sx={{ fontWeight: '600' }}>
					{t('contact')}
				</Typography>
				<Stack direction='row' gap={2} m={2} sx={{ fontSize: '1.5rem' }}>
					<Button
						sx={primaryButton}
						href={t('skype')}
						variant='contained'
						startIcon={<FaSkype />}>
						Skype
					</Button>
					<Button
						sx={secondaryButton}
						href={t('mail')}
						variant='contained'
						startIcon={<FaEnvelope />}>
						Mail
					</Button>
				</Stack>

				<Typography m={2} variant='h3' align='center'>
					{t('title')}
				</Typography>
				{lang === 'fr' && (
					<Typography m={2} variant='h5' color='clrPrimary3' align='center'>
						Professeure de l&apos;Alliance française <br /> diplômée de
						l&apos;université de Moscou
					</Typography>
				)}
				<Typography
					sx={{
						width: {
							xs: '100%',
							sm: '75%',
						},
					}}
					variant='subtitle1'
					mt={4}
					mb={8}
					textAlign='center'
					color='clrGrey3'>
					{t('text')}
				</Typography>

				{lang === 'fr' && (
					<>
						<Typography variant='h4' mt={2} mb={4}>
							L&apos;avis des élèves
						</Typography>

						<Stack
							gap={4}
							sx={{
								flexDirection: {
									xs: 'column',
									md: 'row',
								},
							}}>
							<Card>
								<CardContent>
									<Typography variant='h4' align='center' m={2}>
										David
									</Typography>
									<Typography variant='body1' color='clrGrey3' align='center'>
										Natacha se donne beaucoup de mal pour préparer le cours
										suivant en fonction du besoin du moment. Les moyens pour
										apprendre sont sur mesure. Super ambiance. J&apos;attends
										chaque cours avec impatience
									</Typography>
									{/* <Image
						className={styles.avisImg}
						width={75}
						height={75}
						src='/img/avis1.png'
						alt='student one'
					/> */}
								</CardContent>
							</Card>
							<Card>
								<CardContent>
									<Typography variant='h4' align='center' m={2}>
										Carole
									</Typography>
									<Typography variant='body1' color='clrGrey3' align='center'>
										Je suis très satisfaite du cours. Natalia est attentive aux
										différents besoins des élèves, gentille et agréable.
										L&apos;apprentissage est rapide et facile grâce à sa
										pedagogie. Autres points forts, la flexibilité pour les
										horaires et le bon matériel didactique (livres, audios) mis
										à disposition
									</Typography>
									{/* <Image
						className={styles.avisImg}
						width={75}
						height={75}
						src='/img/avis2.png'
						alt='student two'
					/> */}
								</CardContent>
							</Card>
							<Card>
								<CardContent>
									<Typography variant='h4' align='center' m={2}>
										Daniel
									</Typography>
									<Typography variant='body1' color='clrGrey3' align='center'>
										Depuis 1 an j&apos;apprends le Russe avec Natacha et je suis
										très satisfait de ma professeure, je progresse facilement et
										j&apos;ai pu commencer quelques dialogues lors de 2 voyages
										à Saint Petersbourg. Sa méthode d&apos;apprentissage est
										facile et complète
									</Typography>
									{/* <Image
						className={styles.avisImg}
						width={75}
						height={75}
						src='/img/avis3.png'
						alt='student three'
					/> */}
								</CardContent>
							</Card>
						</Stack>
					</>
				)}
			</Container>
		</>
	)
}

export default Teacher
