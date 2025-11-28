'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useUserContext } from '@/context/user'
import { useThemeMode } from '@/context/ThemeContext'
import { getUIImageUrl } from '@/utils/mediaUrls'
import { cn } from '@/lib/utils'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import {
	Mail,
	MessageSquare,
	Quote,
	ChevronLeft,
	ChevronRight,
	Sparkles,
	Star,
	GraduationCap,
	Users,
	Clock,
	Globe,
} from 'lucide-react'

// ============================================
// ORNATE FRAME COMPONENT (Fantasy Style)
// ============================================
const OrnateFrame = ({ children, className, isDark, allowOverflow = false }) => {
	return (
		<div className={cn(
			'relative rounded-2xl',
			allowOverflow ? 'overflow-visible' : 'overflow-hidden',
			'border-2',
			isDark ? 'border-violet-500/20 bg-slate-900/80' : 'border-violet-600/10 bg-white/90',
			'shadow-lg',
			isDark ? 'shadow-black/20' : 'shadow-slate-200/50',
			className
		)}>
			{/* Corner decorations */}
			<div className={cn(
				'absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 rounded-tl-2xl',
				isDark ? 'border-violet-400/30' : 'border-violet-500/20'
			)} />
			<div className={cn(
				'absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 rounded-tr-2xl',
				isDark ? 'border-violet-400/30' : 'border-violet-500/20'
			)} />
			<div className={cn(
				'absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 rounded-bl-2xl',
				isDark ? 'border-violet-400/30' : 'border-violet-500/20'
			)} />
			<div className={cn(
				'absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 rounded-br-2xl',
				isDark ? 'border-violet-400/30' : 'border-violet-500/20'
			)} />
			{children}
		</div>
	)
}

// ============================================
// FEATURE CARD COMPONENT
// ============================================
const FeatureCard = ({ icon: Icon, title, description, isDark, color = 'violet' }) => {
	const colorClasses = {
		violet: {
			icon: 'from-violet-500 to-purple-600',
			shadow: 'shadow-violet-500/30',
		},
		cyan: {
			icon: 'from-cyan-500 to-teal-600',
			shadow: 'shadow-cyan-500/30',
		},
		amber: {
			icon: 'from-amber-500 to-orange-600',
			shadow: 'shadow-amber-500/30',
		},
		emerald: {
			icon: 'from-emerald-500 to-green-600',
			shadow: 'shadow-emerald-500/30',
		},
	}

	const colors = colorClasses[color]

	return (
		<div className={cn(
			'p-6 rounded-xl text-center',
			'border transition-all duration-300',
			isDark
				? 'bg-slate-800/50 border-slate-700/50 hover:border-violet-500/30'
				: 'bg-white/80 border-slate-200 hover:border-violet-400/50',
			'hover:transform hover:-translate-y-1'
		)}>
			<div className={cn(
				'w-14 h-14 mx-auto mb-4 rounded-xl',
				'bg-gradient-to-br flex items-center justify-center',
				'shadow-lg',
				colors.icon,
				colors.shadow
			)}>
				<Icon className="w-7 h-7 text-white" />
			</div>
			<h3 className={cn(
				'font-bold text-lg mb-2',
				isDark ? 'text-slate-100' : 'text-slate-800'
			)}>
				{title}
			</h3>
			<p className={cn(
				'text-sm',
				isDark ? 'text-slate-400' : 'text-slate-600'
			)}>
				{description}
			</p>
		</div>
	)
}

// ============================================
// REVIEW CARD COMPONENT
// ============================================
const ReviewCard = ({ name, text, isDark }) => {
	return (
		<OrnateFrame
			isDark={isDark}
			allowOverflow={true}
			className={cn(
				'h-full transition-all duration-300',
				'hover:transform hover:-translate-y-2',
				isDark ? 'hover:shadow-violet-500/20' : 'hover:shadow-violet-400/30'
			)}
		>
			{/* Quote icon */}
			<div className={cn(
				'absolute -top-4 left-6',
				'w-10 h-10 rounded-full',
				'bg-gradient-to-br from-violet-500 to-cyan-500',
				'flex items-center justify-center',
				'shadow-lg shadow-violet-500/30',
				'border-2',
				isDark ? 'border-slate-900' : 'border-white'
			)}>
				<Quote className="w-5 h-5 text-white" />
			</div>

			<div className="p-6 pt-8">
				{/* Stars */}
				<div className="flex justify-center gap-1 mb-4">
					{[...Array(5)].map((_, i) => (
						<Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
					))}
				</div>

				{/* Name */}
				<h4 className={cn(
					'text-xl font-bold text-center mb-4',
					isDark ? 'text-slate-100' : 'text-slate-800'
				)}>
					{name}
				</h4>

				{/* Review text */}
				<p className={cn(
					'text-sm leading-relaxed text-center',
					isDark ? 'text-slate-400' : 'text-slate-600'
				)}>
					{text}
				</p>
			</div>
		</OrnateFrame>
	)
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function TeacherClient() {
	const t = useTranslations('teacher')
	const locale = useLocale()
	const { userLearningLanguage } = useUserContext()
	const { isDark } = useThemeMode()

	// Determine learning language (fallback if not set)
	const learningLang = userLearningLanguage || (locale === 'ru' ? 'fr' : 'ru')

	// If user learns Russian -> Natacha, if French -> Sidney
	const isLearningRussian = learningLang === 'ru'
	const teacherName = isLearningRussian ? 'Natacha' : 'Sidney'
	const img = isLearningRussian
		? getUIImageUrl('elf_female.webp')
		: getUIImageUrl('elf_male.webp')

	// Embla Carousel setup
	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			loop: true,
			align: 'start',
			skipSnaps: false,
		},
		[Autoplay({ delay: 5000, stopOnInteraction: false })]
	)

	const [canScrollPrev, setCanScrollPrev] = useState(false)
	const [canScrollNext, setCanScrollNext] = useState(true)
	const [selectedIndex, setSelectedIndex] = useState(0)

	const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
	const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
	const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

	const onSelect = useCallback(() => {
		if (!emblaApi) return
		setCanScrollPrev(emblaApi.canScrollPrev())
		setCanScrollNext(emblaApi.canScrollNext())
		setSelectedIndex(emblaApi.selectedScrollSnap())
	}, [emblaApi])

	useEffect(() => {
		if (!emblaApi) return
		onSelect()
		emblaApi.on('select', onSelect)
		emblaApi.on('reInit', onSelect)
	}, [emblaApi, onSelect])

	const reviews = [
		{
			name: 'David',
			text: "Natacha se donne beaucoup de mal pour preparer le cours suivant en fonction du besoin du moment. Les moyens pour apprendre sont sur mesure. Super ambiance. J'attends chaque cours avec impatience",
		},
		{
			name: 'Carole',
			text: "Je suis tres satisfaite du cours. Natalia est attentive aux differents besoins des eleves, gentille et agreable. L'apprentissage est rapide et facile grace a sa pedagogie. Autres points forts, la flexibilite pour les horaires et le bon materiel didactique mis a disposition",
		},
		{
			name: 'Daniel',
			text: "Depuis 1 an j'apprends le Russe avec Natacha et je suis tres satisfait de ma professeure, je progresse facilement et j'ai pu commencer quelques dialogues lors de 2 voyages a Saint Petersbourg. Sa methode d'apprentissage est facile et complete",
		},
	]

	const features = [
		{
			icon: GraduationCap,
			title: t('featurePersonalized'),
			description: t('featurePersonalizedDesc'),
			color: 'violet',
		},
		{
			icon: Clock,
			title: t('featureFlexible'),
			description: t('featureFlexibleDesc'),
			color: 'cyan',
		},
		{
			icon: Users,
			title: t('featureExperience'),
			description: t('featureExperienceDesc'),
			color: 'amber',
		},
		{
			icon: Globe,
			title: t('featureOnline'),
			description: t('featureOnlineDesc'),
			color: 'emerald',
		},
	]

	return (
		<div className={cn(
			'min-h-screen',
			isDark
				? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-violet-950/30 to-slate-950'
				: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-50 via-slate-50 to-white'
		)}>
			{/* ============================================ */}
			{/* HERO SECTION */}
			{/* ============================================ */}
			<section className="relative pt-28 md:pt-32 pb-20 md:pb-28 overflow-hidden">
				{/* Animated background orbs */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className={cn(
						'absolute top-20 left-1/4 w-72 h-72 rounded-full blur-3xl',
						isDark ? 'bg-violet-600/20' : 'bg-violet-400/30'
					)} />
					<div className={cn(
						'absolute bottom-20 right-1/4 w-96 h-96 rounded-full blur-3xl',
						isDark ? 'bg-cyan-600/20' : 'bg-cyan-400/20'
					)} />
				</div>

				<div className="relative max-w-4xl mx-auto px-4 text-center">
					{/* Teacher avatar with fantasy frame */}
					<div className="relative inline-block mb-8">
						{/* Glowing ring animation */}
						<div className={cn(
							'absolute inset-0 rounded-full',
							'bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500',
							'animate-spin-slow opacity-50 blur-sm',
							'scale-110'
						)}
						style={{ animationDuration: '8s' }}
						/>
						{/* Pulse effect */}
						<div className={cn(
							'absolute inset-0 rounded-full',
							'bg-gradient-to-r from-violet-500/50 to-cyan-500/50',
							'animate-pulse scale-125'
						)} />
						{/* Avatar container */}
						<div className={cn(
							'relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden',
							'border-4',
							isDark ? 'border-violet-400/50' : 'border-white',
							'shadow-2xl',
							isDark ? 'shadow-violet-500/30' : 'shadow-violet-400/40'
						)}>
							<img
								src={img}
								alt={teacherName}
								className="w-full h-full object-cover"
							/>
						</div>
					</div>

					{/* Title */}
					<h1 className={cn(
						'text-4xl md:text-5xl lg:text-6xl font-black mb-4',
						'bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-500',
						'bg-clip-text text-transparent'
					)}>
						{t(isLearningRussian ? 'titleRussian' : 'titleFrench')}
					</h1>

					{/* Subtitle */}
					<p className={cn(
						'text-lg md:text-xl mb-8 max-w-2xl mx-auto',
						isDark ? 'text-slate-300' : 'text-slate-600'
					)}>
						{t(isLearningRussian ? 'subtitleRussian' : 'subtitleFrench')}
					</p>

					{/* Contact label */}
					<p className={cn(
						'text-sm font-semibold mb-4 uppercase tracking-wider',
						isDark ? 'text-violet-400' : 'text-violet-600'
					)}>
						{t(isLearningRussian ? 'contactRussian' : 'contactFrench')}
					</p>

					{/* Contact buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href={t(isLearningRussian ? 'teamsRussian' : 'teamsFrench')}
							className={cn(
								'inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl',
								'font-bold text-lg',
								'bg-gradient-to-r from-violet-600 to-purple-600',
								'text-white shadow-lg shadow-violet-500/30',
								'hover:shadow-xl hover:shadow-violet-500/40',
								'hover:scale-105 transition-all duration-300',
								'border-2 border-violet-400/30'
							)}
						>
							<MessageSquare className="w-5 h-5" />
							Teams
						</a>
						<a
							href={t(isLearningRussian ? 'mailRussian' : 'mailFrench')}
							className={cn(
								'inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl',
								'font-bold text-lg',
								'border-2 transition-all duration-300',
								isDark
									? 'border-slate-600 text-slate-200 hover:bg-slate-800 hover:border-violet-500/50'
									: 'border-slate-300 text-slate-700 hover:bg-white hover:border-violet-400',
								'hover:scale-105'
							)}
						>
							<Mail className="w-5 h-5" />
							Email
						</a>
					</div>
				</div>
			</section>

			{/* ============================================ */}
			{/* FEATURES SECTION */}
			{/* ============================================ */}
			<section className="py-16 md:py-20 px-4">
				<div className="max-w-5xl mx-auto">
					<div className="text-center mb-12">
						<h2 className={cn(
							'text-3xl md:text-4xl font-black mb-4',
							isDark ? 'text-slate-100' : 'text-slate-800'
						)}>
							{t('featuresTitle')}
						</h2>
						<p className={cn(
							'text-lg',
							isDark ? 'text-slate-400' : 'text-slate-600'
						)}>
							{t('featuresSubtitle')}
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{features.map((feature, index) => (
							<FeatureCard
								key={index}
								icon={feature.icon}
								title={feature.title}
								description={feature.description}
								isDark={isDark}
								color={feature.color}
							/>
						))}
					</div>
				</div>
			</section>

			{/* ============================================ */}
			{/* ABOUT SECTION */}
			{/* ============================================ */}
			<section className="py-10 md:py-20 px-4">
				<div className="max-w-3xl mx-auto">
					{/* Mobile: no frame */}
					<div className="md:hidden text-center px-2">
						<div className={cn(
							'w-14 h-14 mx-auto mb-4 rounded-full',
							'bg-gradient-to-br from-violet-500 to-cyan-500',
							'flex items-center justify-center',
							'shadow-lg shadow-violet-500/30'
						)}>
							<GraduationCap className="w-7 h-7 text-white" />
						</div>
						<h2 className={cn(
							'text-xl font-bold mb-4',
							isDark ? 'text-slate-100' : 'text-slate-800'
						)}>
							{t(isLearningRussian ? 'aboutTitleRussian' : 'aboutTitleFrench')}
						</h2>
						<p className={cn(
							'text-sm leading-relaxed',
							isDark ? 'text-slate-300' : 'text-slate-600'
						)}>
							{t(isLearningRussian ? 'textRussian' : 'textFrench')}
						</p>
					</div>

					{/* Desktop: with OrnateFrame */}
					<div className="hidden md:block">
						<OrnateFrame isDark={isDark} className="p-8 md:p-12">
							<div className="text-center">
								<div className={cn(
									'w-16 h-16 mx-auto mb-6 rounded-full',
									'bg-gradient-to-br from-violet-500 to-cyan-500',
									'flex items-center justify-center',
									'shadow-lg shadow-violet-500/30'
								)}>
									<GraduationCap className="w-8 h-8 text-white" />
								</div>
								<h2 className={cn(
									'text-2xl md:text-3xl font-bold mb-6',
									isDark ? 'text-slate-100' : 'text-slate-800'
								)}>
									{t(isLearningRussian ? 'aboutTitleRussian' : 'aboutTitleFrench')}
								</h2>
								<p className={cn(
									'text-base md:text-lg leading-relaxed',
									isDark ? 'text-slate-300' : 'text-slate-600'
								)}>
									{t(isLearningRussian ? 'textRussian' : 'textFrench')}
								</p>
							</div>
						</OrnateFrame>
					</div>
				</div>
			</section>

			{/* ============================================ */}
			{/* REVIEWS SECTION (Only for Russian) */}
			{/* ============================================ */}
			{isLearningRussian && (
				<section className="py-16 md:py-20 px-4">
					<div className="max-w-5xl mx-auto">
						{/* Section header */}
						<div className="text-center mb-12">
							<div className="flex items-center justify-center gap-2 mb-4">
								<Star className={cn(
									'w-6 h-6',
									isDark ? 'text-amber-400' : 'text-amber-500'
								)} />
								<h2 className={cn(
									'text-3xl md:text-4xl font-black',
									'bg-gradient-to-r from-violet-500 to-cyan-500',
									'bg-clip-text text-transparent'
								)}>
									{t('reviewsTitle')}
								</h2>
								<Star className={cn(
									'w-6 h-6',
									isDark ? 'text-amber-400' : 'text-amber-500'
								)} />
							</div>
							<p className={cn(
								'text-lg',
								isDark ? 'text-slate-400' : 'text-slate-600'
							)}>
								{t('reviewsSubtitle')}
							</p>
						</div>

						{/* Carousel */}
						<div className="relative">
							<div ref={emblaRef} className="overflow-hidden">
								<div className="flex gap-6 pt-6">
									{reviews.map((review, index) => (
										<div
											key={index}
											className="flex-[0_0_100%] min-w-0 md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
										>
											<ReviewCard
												name={review.name}
												text={review.text}
												isDark={isDark}
											/>
										</div>
									))}
								</div>
							</div>

							{/* Navigation buttons */}
							<div className="flex items-center justify-center gap-4 mt-8">
								<button
									onClick={scrollPrev}
									disabled={!canScrollPrev}
									className={cn(
										'w-12 h-12 rounded-full',
										'flex items-center justify-center',
										'border-2 transition-all duration-300',
										isDark
											? 'bg-slate-800/80 border-violet-500/30 hover:border-violet-400'
											: 'bg-white/80 border-violet-300 hover:border-violet-500',
										'shadow-lg backdrop-blur-sm',
										'hover:scale-110',
										'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100'
									)}
								>
									<ChevronLeft className={cn(
										'w-6 h-6',
										isDark ? 'text-violet-400' : 'text-violet-600'
									)} />
								</button>
								<button
									onClick={scrollNext}
									disabled={!canScrollNext}
									className={cn(
										'w-12 h-12 rounded-full',
										'flex items-center justify-center',
										'border-2 transition-all duration-300',
										isDark
											? 'bg-slate-800/80 border-violet-500/30 hover:border-violet-400'
											: 'bg-white/80 border-violet-300 hover:border-violet-500',
										'shadow-lg backdrop-blur-sm',
										'hover:scale-110',
										'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100'
									)}
								>
									<ChevronRight className={cn(
										'w-6 h-6',
										isDark ? 'text-violet-400' : 'text-violet-600'
									)} />
								</button>
							</div>
						</div>

						{/* Pagination dots */}
						<div className="flex justify-center gap-2 mt-8">
							{reviews.map((_, index) => (
								<button
									key={index}
									onClick={() => scrollTo(index)}
									className={cn(
										'h-2.5 rounded-full transition-all duration-300',
										selectedIndex === index
											? 'w-8 bg-gradient-to-r from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/30'
											: cn(
												'w-2.5',
												isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-300 hover:bg-slate-400'
											)
									)}
								/>
							))}
						</div>
					</div>
				</section>
			)}

			{/* ============================================ */}
			{/* CTA SECTION */}
			{/* ============================================ */}
			<section className="py-16 md:py-20 px-4">
				<div className="max-w-2xl mx-auto text-center">
					<OrnateFrame isDark={isDark} className="p-8 md:p-12">
						<Sparkles className={cn(
							'w-12 h-12 mx-auto mb-6',
							isDark ? 'text-amber-400' : 'text-amber-500'
						)} />
						<h2 className={cn(
							'text-2xl md:text-3xl font-black mb-4',
							isDark ? 'text-slate-100' : 'text-slate-800'
						)}>
							{t('ctaTitle')}
						</h2>
						<p className={cn(
							'text-lg mb-8',
							isDark ? 'text-slate-400' : 'text-slate-600'
						)}>
							{t('ctaDescription')}
						</p>
						<a
							href={t(isLearningRussian ? 'mailRussian' : 'mailFrench')}
							className={cn(
								'inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl',
								'font-bold text-lg',
								'bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600',
								'text-white shadow-lg shadow-violet-500/30',
								'hover:shadow-xl hover:shadow-violet-500/40',
								'hover:scale-105 transition-all duration-300',
								'border-2 border-violet-400/30'
							)}
						>
							<Mail className="w-5 h-5" />
							{t('ctaButton')}
						</a>
					</OrnateFrame>
				</div>
			</section>
		</div>
	)
}
