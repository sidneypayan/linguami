import {
	Container,
	Stack,
	Card,
	Typography,
	styled,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Divider,
	Button,
} from '@mui/material'

import { CheckCircle } from '@mui/icons-material'

const Premium = () => {
	const StyledCard = styled(Card)({
		padding: '1rem',
		maxWidth: '350px',
		margin: '0 auto',
		textAlign: 'center',
	})

	return (
		<Container sx={{ margin: '5rem auto', maxWidth: '100%', width: '800px' }}>
			<Typography variant='h3' component='h1' textAlign='center' mb={5}>
				Nos offres premium
			</Typography>
			<Divider sx={{ marginBottom: '4rem' }} />
			<Stack
				gap={5}
				sx={{
					flexDirection: {
						sm: 'row',
					},
				}}>
				<StyledCard>
					<Stack
						padding='0 1rem'
						direction='row'
						justifyContent='space-between'>
						<Typography variant='h5' component='h2' mb={3}>
							1 mois
						</Typography>
						<Typography variant='h5' component='h2' mb={3}>
							6€
						</Typography>
					</Stack>
					<Divider />
					<List
						sx={{
							marginTop: '1rem',
							width: '100%',
							maxWidth: 360,
							bgcolor: 'background.paper',
						}}
						aria-label='contacts'>
						<ListItem disablePadding>
							<ListItemIcon>
								<CheckCircle sx={{ color: '#1e6091' }} />
							</ListItemIcon>
							<ListItemText primary='Traduction de mots illimitée' />
						</ListItem>
						<ListItem disablePadding>
							<ListItemIcon>
								<CheckCircle sx={{ color: '#1e6091' }} />
							</ListItemIcon>
							<ListItemText primary='Ajout de mot illimité à votre ditionnaire personnel' />
						</ListItem>
						<ListItem disablePadding>
							<ListItemIcon>
								<CheckCircle sx={{ color: '#1e6091' }} />
							</ListItemIcon>
							<ListItemText primary='Système de flashcards pour réviser votre vocabulaire' />
						</ListItem>
					</List>
					<form action='/create-checkout-session' method='POST'>
						<input type='hidden' name='priceId' value='price_G0FvDp6vZvdwRZ' />
						{/* <button type="submit">Checkout</button> */}
						<Button
							variant='contained'
							size='large'
							sx={{ backgroundColor: '#1e6091', margin: '1rem' }}>
							Choisir
						</Button>
					</form>
				</StyledCard>
				<StyledCard>
					<Stack
						padding='0 1rem'
						direction='row'
						justifyContent='space-between'>
						<Typography variant='h5' component='h2' mb={3}>
							3 mois
						</Typography>
						<Typography variant='h5' component='h2' mb={3}>
							15€
						</Typography>
					</Stack>
					<Divider />
					<List
						sx={{
							marginTop: '1rem',
							width: '100%',
							maxWidth: 360,
							bgcolor: 'background.paper',
						}}
						aria-label='contacts'>
						<ListItem disablePadding>
							<ListItemIcon>
								<CheckCircle sx={{ color: '#1e6091' }} />
							</ListItemIcon>
							<ListItemText primary='Traduction de mots illimitée' />
						</ListItem>
						<ListItem disablePadding>
							<ListItemIcon>
								<CheckCircle sx={{ color: '#1e6091' }} />
							</ListItemIcon>
							<ListItemText primary='Ajout de mot illimité à votre ditionnaire personnel' />
						</ListItem>
						<ListItem disablePadding>
							<ListItemIcon>
								<CheckCircle sx={{ color: '#1e6091' }} />
							</ListItemIcon>
							<ListItemText primary='Système de flashcards pour réviser votre vocabulaire' />
						</ListItem>
					</List>
					<Button
						variant='contained'
						size='large'
						sx={{ backgroundColor: '#1e6091', margin: '1rem' }}>
						Choisir
					</Button>
				</StyledCard>
			</Stack>

			<Card
				sx={{
					padding: '1rem',
					marginTop: '5rem',
				}}>
				<Typography textAlign='center' variant='h4' mb={3}>
					Grâce à votre soutien nous pouvons :
				</Typography>
				<Divider />
				<List
					sx={{
						marginTop: '1rem',
						bgcolor: 'background.paper',
					}}
					aria-label='contacts'>
					<ListItem disablePadding>
						<ListItemIcon>
							<CheckCircle sx={{ color: '#1e6091' }} />
						</ListItemIcon>
						<ListItemText primary='Consacrer plus de temps à la création de contenus pour le site' />
					</ListItem>
					<ListItem disablePadding>
						<ListItemIcon>
							<CheckCircle sx={{ color: '#1e6091' }} />
						</ListItemIcon>
						<ListItemText primary="Consacrer plus de temps au développement d'activités intéractives pour apprendre les mots ou pour tester vos connaissances" />
					</ListItem>
					<ListItem disablePadding>
						<ListItemIcon>
							<CheckCircle sx={{ color: '#1e6091' }} />
						</ListItemIcon>
						<ListItemText primary="Financer une partie des coûts d'hébergement du site et de l'utilisation de services payants comme le traducteur, le serveur etc" />
					</ListItem>
					<ListItem disablePadding>
						<ListItemIcon>
							<CheckCircle sx={{ color: '#1e6091' }} />
						</ListItemIcon>
						<ListItemText primary="Nous réjouir de voir que vous appréciez notre travail et qu'il vous est utile." />
					</ListItem>
				</List>
			</Card>
		</Container>
	)
}

export default Premium
