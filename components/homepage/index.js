import Image from 'next/image'
import styles from '../../styles/Homepage.module.css'
import Hero from './Hero'
import Link from 'next/link'
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Divider,
	styled,
	Typography,
} from '@mui/material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Stack } from '@mui/system'

const StyledStack = styled(Stack)(({ theme }) => ({
	justifyContent: 'space-between',
	gap: '2rem',
	[theme.breakpoints.up('md')]: {
		flexDirection: 'row',
	},
	[theme.breakpoints.down('md')]: {
		justifyContent: 'center',
		alignItems: 'center',
	},
}))

const Homepage = () => {
	return (
		<>
			<Hero />
			<div className={styles.container}>
				<h3 className='headline'>Apprentissage multisupport</h3>
				<div className={styles.ressourceContainer}>
					<div className={styles.ressourceItem}>
						<Image
							layout='fixed'
							src='/img/video.png'
							alt='video'
							width={100}
							height={100}
						/>
						<h4>Video</h4>
						<p>
							Extraits de films, bandes-annonces, clips musicaux, découvrez nos
							ressources vidéos pour apprendre tout en vous divertissant.
						</p>
					</div>

					<div className={styles.ressourceItem}>
						<Image
							layout='fixed'
							src='/img/audio.png'
							alt='audio'
							width={100}
							height={100}
						/>
						<h4>Audio</h4>
						<p>
							Dialogues, chansons, audiobooks, évadez-vous avec nos contenus
							audio.
						</p>
					</div>
					<div className={styles.ressourceItem}>
						<Image
							layout='fixed'
							src='/img/text.png'
							alt='text'
							width={100}
							height={100}
						/>
						<h4>Textes</h4>
						<p>
							Découvrez nos textes sur la culture, les mythes et légendes,
							plongez vous dans des histoires toutes plus passionantes les unes
							que les autres.
						</p>
					</div>
				</div>

				<div className={styles.hrSmall}></div>

				<div className={`${styles.ctaContainer} + ${styles.ctaContainerWhite}`}>
					<div className={styles.ctaContainerText}>
						{/* <div className={styles.hr}></div> */}
						<h3 className='headline'>Apprendre avec un locuteur natif</h3>
						<p>
							Prenez des cours à distance avec un professeur diplômé et
							bénéfissiez d&apos;un apprentissage personnalisé.
						</p>
						<Link href='/teacher'>
							<button className={`${styles.btn} mainBtn`}>Commencez !</button>
						</Link>
					</div>
					<div className={styles.imgContainer}>
						<Image
							src='/img/teacher.png'
							alt='teacher'
							width={175}
							height={175}
						/>
					</div>
				</div>

				<div className={styles.ctaContainer}>
					<div className={styles.imgContainer}>
						<Image
							src='/img/translator.png'
							alt='translate'
							width={175}
							height={175}
						/>
					</div>

					<div className={styles.ctaContainerText}>
						{/* <div className={styles.hr}></div> */}
						<h3 className='headline'>Outlil de traduction intégré</h3>
						<p>
							Inscrivez-vous et traduisez n&apos;importe quel mot de
							n&apos;importe quel texte
						</p>
						<Link href='/register'>
							<button className={`${styles.btn} mainBtn`}>
								S&apos;inscrire
							</button>
						</Link>
					</div>
				</div>
				<div className='hr'></div>
				<h2 className='headline'>Comment utiliser le système de traduction</h2>
				<div className='wrapper-small'>
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls='panel1a-content'
							id='panel1a-header'>
							<Typography variant='h6'>
								Traduire les mots des materiels
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<StyledStack>
								<Typography maxWidth='350px' textAlign='left' mt={5}>
									Traduisez n&apos;importe quel mot d&apos;un simple clique
								</Typography>
								<Divider orientation='vertical'></Divider>
								<Box
									margin='0'
									component='img'
									maxHeight='250px'
									alt='comment traduire'
									src='/img/translation.gif'
								/>
							</StyledStack>
						</AccordionDetails>
					</Accordion>
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls='panel1a-content'
							id='panel1a-header'>
							<Typography variant='h6'>
								Ajouter une traduction à son dictionnaire
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<StyledStack>
								<Typography maxWidth='350px' textAlign='left' mt={5}>
									Ajouter une traduction à son dictionnaire personnel est tout
									aussi simple
								</Typography>
								<Box
									margin='0'
									component='img'
									maxHeight='250px'
									alt='comment traduire'
									src='/img/add_translation.gif'
								/>
							</StyledStack>
						</AccordionDetails>
					</Accordion>
				</div>
			</div>
		</>
	)
}

export default Homepage
