'use client'

import {
	Container,
	Stack,
	Card,
	Typography,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Divider,
	Button,
} from '@mui/material'
import { CheckCircle } from '@mui/icons-material'

export default function PremiumClient({ translations, jsonLd }) {
	const pricingCards = [
		{
			duration: '1 mois',
			price: '6€',
			priceId: 'price_G0FvDp6vZvdwRZ',
		},
		{
			duration: '3 mois',
			price: '15€',
			priceId: 'price_3MonthsId', // Update with actual price ID
		},
	]

	const premiumFeatures = [
		translations.feature_unlimited_translation,
		translations.feature_unlimited_dictionary,
		translations.feature_flashcards,
	]

	const supportFeatures = [
		translations.support_content_creation,
		translations.support_interactive_activities,
		translations.support_hosting_costs,
		translations.support_appreciation,
	]

	return (
		<>
			{jsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			)}
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
				{pricingCards.map((card, index) => (
					<Card
						key={index}
						sx={{
							padding: '1rem',
							maxWidth: '350px',
							margin: '0 auto',
							textAlign: 'center',
						}}>
						<Stack
							padding='0 1rem'
							direction='row'
							justifyContent='space-between'>
							<Typography variant='h5' component='h2' mb={3}>
								{card.duration}
							</Typography>
							<Typography variant='h5' component='h2' mb={3}>
								{card.price}
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
							aria-label='features'>
							{premiumFeatures.map((feature, featureIndex) => (
								<ListItem key={featureIndex} disablePadding>
									<ListItemIcon>
										<CheckCircle sx={{ color: '#1e6091' }} />
									</ListItemIcon>
									<ListItemText primary={feature} />
								</ListItem>
							))}
						</List>
						{index === 0 && (
							<form action='/create-checkout-session' method='POST'>
								<input type='hidden' name='priceId' value={card.priceId} />
								<Button
									type='submit'
									variant='contained'
									size='large'
									sx={{ backgroundColor: '#1e6091', margin: '1rem' }}>
									Choisir
								</Button>
							</form>
						)}
						{index === 1 && (
							<Button
								variant='contained'
								size='large'
								sx={{ backgroundColor: '#1e6091', margin: '1rem' }}>
								Choisir
							</Button>
						)}
					</Card>
				))}
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
					aria-label='support'>
					{supportFeatures.map((feature, index) => (
						<ListItem key={index} disablePadding>
							<ListItemIcon>
								<CheckCircle sx={{ color: '#1e6091' }} />
							</ListItemIcon>
							<ListItemText primary={feature} />
						</ListItem>
					))}
				</List>
			</Card>
		</Container>
		</>
	)
}
