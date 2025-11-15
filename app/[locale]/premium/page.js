'use client'

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
import { useTranslations, useLocale } from 'next-intl'
import SEO from '@/components/SEO'
import { CheckCircle } from '@mui/icons-material'

const Premium = () => {
	const t = useTranslations('premium')
	const locale = useLocale()

	// Mots-clés SEO par langue
	const keywordsByLang = {
		fr: 'premium linguami, abonnement linguami, dictionnaire illimité, flashcards, traduction russe, apprendre russe premium',
		ru: 'премиум linguami, подписка linguami, неограниченный словарь, флэш-карты, перевод французский',
		en: 'linguami premium, premium subscription, unlimited dictionary, flashcards, language learning premium, russian french premium'
	}

	// JSON-LD pour Product/Offer
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: 'Linguami Premium',
		description: t('description'),
		brand: {
			'@type': 'Brand',
			name: 'Linguami'
		},
		offers: [
			{
				'@type': 'Offer',
				name: '1 Month Premium',
				price: '6.00',
				priceCurrency: 'EUR',
				availability: 'https://schema.org/InStock',
				url: `https://www.linguami.com${locale === 'fr' ? '' : `/${locale}`}/premium`,
				priceValidUntil: '2026-12-31'
			},
			{
				'@type': 'Offer',
				name: '3 Months Premium',
				price: '15.00',
				priceCurrency: 'EUR',
				availability: 'https://schema.org/InStock',
				url: `https://www.linguami.com${locale === 'fr' ? '' : `/${locale}`}/premium`,
				priceValidUntil: '2026-12-31'
			}
		]
	}
	const StyledCard = styled(Card)({
		padding: '1rem',
		maxWidth: '350px',
		margin: '0 auto',
		textAlign: 'center',
	})

	return (
		<>
			<SEO
				title={`${t('pagetitle')} | Linguami`}
				description={t('description')}
				path='/premium'
				keywords={keywordsByLang[locale]}
				jsonLd={jsonLd}
			/>
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
							<ListItemText primary={t('feature_unlimited_translation')} />
						</ListItem>
						<ListItem disablePadding>
							<ListItemIcon>
								<CheckCircle sx={{ color: '#1e6091' }} />
							</ListItemIcon>
							<ListItemText primary={t('feature_unlimited_dictionary')} />
						</ListItem>
						<ListItem disablePadding>
							<ListItemIcon>
								<CheckCircle sx={{ color: '#1e6091' }} />
							</ListItemIcon>
							<ListItemText primary={t('feature_flashcards')} />
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
							<ListItemText primary={t('feature_unlimited_translation')} />
						</ListItem>
						<ListItem disablePadding>
							<ListItemIcon>
								<CheckCircle sx={{ color: '#1e6091' }} />
							</ListItemIcon>
							<ListItemText primary={t('feature_unlimited_dictionary')} />
						</ListItem>
						<ListItem disablePadding>
							<ListItemIcon>
								<CheckCircle sx={{ color: '#1e6091' }} />
							</ListItemIcon>
							<ListItemText primary={t('feature_flashcards')} />
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
						<ListItemText primary={t('support_content_creation')} />
					</ListItem>
					<ListItem disablePadding>
						<ListItemIcon>
							<CheckCircle sx={{ color: '#1e6091' }} />
						</ListItemIcon>
						<ListItemText primary={t('support_interactive_activities')} />
					</ListItem>
					<ListItem disablePadding>
						<ListItemIcon>
							<CheckCircle sx={{ color: '#1e6091' }} />
						</ListItemIcon>
						<ListItemText primary={t('support_hosting_costs')} />
					</ListItem>
					<ListItem disablePadding>
						<ListItemIcon>
							<CheckCircle sx={{ color: '#1e6091' }} />
						</ListItemIcon>
						<ListItemText primary={t('support_appreciation')} />
					</ListItem>
				</List>
			</Card>
		</Container>
		</>
	)
}

export default Premium
