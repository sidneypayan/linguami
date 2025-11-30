'use client'

import { CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

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
			priceId: 'price_3MonthsId',
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
			<div className="max-w-[800px] mx-auto pt-24 md:pt-28 mb-20 px-4">
				<h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
					Nos offres premium
				</h1>
				<Separator className="mb-16" />

				<div className="flex flex-col sm:flex-row gap-8">
					{pricingCards.map((card, index) => (
						<Card
							key={index}
							className="max-w-[350px] mx-auto text-center flex-1">
							<CardHeader className="pb-2">
								<div className="flex justify-between items-center px-2">
									<CardTitle className="text-xl">{card.duration}</CardTitle>
									<span className="text-xl font-semibold">{card.price}</span>
								</div>
							</CardHeader>
							<Separator />
							<CardContent className="pt-4">
								<ul className="space-y-3 mb-6">
									{premiumFeatures.map((feature, featureIndex) => (
										<li key={featureIndex} className="flex items-center gap-3">
											<CheckCircle className="h-5 w-5 text-[#1e6091] flex-shrink-0" />
											<span className="text-left">{feature}</span>
										</li>
									))}
								</ul>

								{index === 0 && (
									<form action='/create-checkout-session' method='POST'>
										<input type='hidden' name='priceId' value={card.priceId} />
										<Button
											type='submit'
											size="lg"
											className="bg-[#1e6091] hover:bg-[#1a5580] text-white">
											Choisir
										</Button>
									</form>
								)}
								{index === 1 && (
									<Button
										size="lg"
										className="bg-[#1e6091] hover:bg-[#1a5580] text-white">
										Choisir
									</Button>
								)}
							</CardContent>
						</Card>
					))}
				</div>

				<Card className="mt-20">
					<CardHeader>
						<CardTitle className="text-center text-2xl">
							Grace a votre soutien nous pouvons :
						</CardTitle>
					</CardHeader>
					<Separator />
					<CardContent className="pt-6">
						<ul className="space-y-3">
							{supportFeatures.map((feature, index) => (
								<li key={index} className="flex items-center gap-3">
									<CheckCircle className="h-5 w-5 text-[#1e6091] flex-shrink-0" />
									<span>{feature}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>
		</>
	)
}
