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

const Teacher = () => {
	return (
		<>
			<Head>
				<title>Linguami | Cours de russe</title>
				<meta
					name='description'
					content='Nos professeurs de langue russe natifs et diplômés vous proposent des cours de russe personnalisés et adaptés à vos objectifs. Prenez des cours de russe selon vos disponibilités et sans bouger de chez vous grâce à nos cours à distance.'
				/>
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
					src='/img/natacha.jpg'
					alt='teacher'
				/>
				<Typography
					color='clrPrimary3'
					variant='body1'
					m={2}
					sx={{ fontWeight: '600' }}>
					Contacter Natacha
				</Typography>
				<Stack direction='row' gap={1} m={2} sx={{ fontSize: '1.5rem' }}>
					<Button
						sx={{ backgroundColor: 'clrPrimary3' }}
						href='skype:red.fox000?chat'
						variant='contained'
						startIcon={<FaSkype />}>
						Skype
					</Button>
					<Button
						sx={{ backgroundColor: 'clrPrimary3' }}
						href='mailto:redfox000@yandex.ru?Subject=Cours%20de%20russe'
						variant='contained'
						startIcon={<FaEnvelope />}>
						Mail
					</Button>
				</Stack>

				<Typography m={2} variant='h3'>
					Cours de russe par Skype
				</Typography>
				<Typography m={2} variant='h5' color='clrPrimary3'>
					Professeure de l&apos;Alliance française <br /> diplômée de
					l&apos;université de Moscou
				</Typography>
				<Typography
					variant='body1'
					mt={4}
					mb={8}
					textAlign='center'
					color='clrGrey3'>
					Natacha est passionnée par l&apos;apprentissage et l&apos;enseignement
					des langues. Elle vous guidera dans votre apprentissage du russe à
					travers un accompagnement personnalisé. Le russe est une langue
					compliquée, mais son apprentissage peut-être grandement facilité grâce
					à un professeur attentionné qui connaît vos difficultés et suit la
					bonne méthodologie. Grâce à son expérience avec des élèves français,
					elle est familière des difficultés que rencontrent les apprenants
					francophones de la langue russe. Elle parle aussi anglais ce qui lui
					permet de prendre en charge des élèves anglophones si besoin. Natacha
					est la principale rédactrice du contenu de ce site.
				</Typography>

				{/* <hr class="main-hr mt-4"> */}
				<Typography variant='h4' mt={2} mb={4}>
					L&apos;avis des élèves
				</Typography>

				<Stack direction='row' gap={2}>
					<Card sx={{ flex: 1 }}>
						<CardContent>
							<Typography variant='h4' align='center' m={2}>
								David
							</Typography>
							<Typography variant='body1' color='clrGrey3' align='center'>
								Natacha se donne beaucoup de mal pour préparer le cours suivant
								en fonction du besoin du moment. Les moyens pour apprendre sont
								sur mesure. Super ambiance. J&apos;attends chaque cours avec
								impatience
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
					<Card sx={{ flex: 1 }}>
						<CardContent>
							<Typography variant='h4' align='center' m={2}>
								Carole
							</Typography>
							<Typography variant='body1' color='clrGrey3' align='center'>
								Je suis très satisfaite du cours. Natalia est attentive aux
								différents besoins des élèves, gentille et agréable.
								L&apos;apprentissage est rapide et facile grâce à sa pedagogie.
								Autres points forts, la flexibilité pour les horaires et le bon
								matériel didactique (livres, audios) mis à disposition
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
					<Card sx={{ flex: 1 }}>
						<CardContent>
							<Typography variant='h4' align='center' m={2}>
								Daniel
							</Typography>
							<Typography variant='body1' color='clrGrey3' align='center'>
								Depuis 1 an j&apos;apprends le Russe avec Natacha et je suis
								très satisfait de ma professeure, je progresse facilement et
								j&apos;ai pu commencer quelques dialogues lors de 2 voyages à
								Saint Petersbourg. Sa méthode d&apos;apprentissage est facile et
								complète
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
			</Container>
		</>
	)
}

export default Teacher
