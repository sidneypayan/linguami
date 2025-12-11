'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Hero from './Hero'
import MultimediaCard from './MultimediaCard'
import BentoGrid from './BentoGrid'
import HowItWorks from './HowItWorks'
import FAQ from './FAQ'
import FinalCTA from './FinalCTA'
import OnboardingModal from '@/components/onboarding/OnboardingModal'
import { Link, useRouter } from '@/i18n/navigation'
import { getUIImageUrl } from '@/utils/mediaUrls'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useThemeMode } from '@/context/ThemeContext'
import { useUserContext } from '@/context/user'
import toast from '@/utils/toast'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

// Composant séparé pour gérer le hover dynamique sur desktop
const DesktopMultimediaCard = ({ icon, index, isDark }) => {
	const [isHovered, setIsHovered] = useState(false)

	const centerIndex = 2
	const distance = Math.abs(index - centerIndex)
	const baseScale = 1 + (0.15 - distance * 0.05)
	const baseTranslateZ = 80 - distance * 25
	const baseZIndex = 15 - distance * 2
	const shadowIntensity = 0.45 - distance * 0.1

	const scale = isHovered ? baseScale * 1.08 : baseScale
	const translateZ = isHovered ? baseTranslateZ + 30 : baseTranslateZ
	const translateY = isHovered ? -12 : 0
	const zIndex = isHovered ? 100 : baseZIndex
	const shadow = isDark
		? (isHovered ? '0 20px 40px rgba(0, 0, 0, 0.4)' : `0 ${4 + baseTranslateZ * 0.3}px ${15 + baseTranslateZ * 0.8}px rgba(0, 0, 0, 0.3)`)
		: (isHovered ? '0 20px 60px rgba(139, 92, 246, 0.6), 0 0 40px rgba(6, 182, 212, 0.4)' : `0 ${4 + baseTranslateZ * 0.3}px ${15 + baseTranslateZ * 0.8}px rgba(139, 92, 246, ${shadowIntensity})`)

	return (
		<Link
			href={icon.link}
			className="flex justify-center h-full"
			style={{ marginLeft: index === 0 ? '0' : '-18px', zIndex }}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div
				className="h-full w-[210px]"
				style={{
					transform: `scale(${scale}) translateZ(${translateZ}px) translateY(${translateY}px)`,
					transformStyle: 'preserve-3d',
					transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
					boxShadow: shadow,
					borderRadius: '16px',
				}}
			>
				<div
					className={cn(
						"h-full flex flex-col items-center gap-2 text-center rounded-2xl overflow-hidden",
						"border-2 border-transparent cursor-pointer relative",
						"[background-origin:border-box] [background-clip:padding-box,border-box]",
						isDark
							? "bg-gradient-to-br from-slate-800/[0.98] to-slate-900/95 [background-image:linear-gradient(rgba(30,41,59,1),rgba(30,41,59,1)),linear-gradient(135deg,rgba(139,92,246,0.5),rgba(6,182,212,0.5),rgba(139,92,246,0.5))]"
							: "bg-gradient-to-br from-white/[0.98] to-violet-50/95 [background-image:linear-gradient(white,white),linear-gradient(135deg,rgba(139,92,246,0.4),rgba(6,182,212,0.4),rgba(139,92,246,0.4))]"
					)}
				>
					{/* Shine effect */}
					<div
						className="absolute inset-0 pointer-events-none transition-transform duration-500"
						style={{
							background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
							transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
						}}
					/>

					<div className="flex flex-col items-center gap-2 px-5 py-4 h-full">
						{/* Image container */}
						<div className="relative w-[95px] h-[95px] flex-shrink-0">
							{/* Animated blur background - only in light mode */}
							<div
								className={cn(
									"absolute w-[120%] h-[120%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl blur-[35px] animate-pulse-slow",
									isDark && "hidden"
								)}
								style={{
									background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)',
								}}
							/>

							{/* Outer frame */}
							<div
								className="absolute w-full h-full rounded-xl transition-all duration-400"
								style={{
									background: isDark
										? 'linear-gradient(135deg, rgba(100, 100, 120, 0.3) 0%, rgba(80, 80, 100, 0.2) 100%)'
										: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
									border: '3px solid rgba(255, 255, 255, 0.2)',
									backdropFilter: 'blur(10px)',
									boxShadow: isDark
										? '0 0 20px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05), 0 6px 24px rgba(0, 0, 0, 0.3)'
										: '0 0 30px rgba(139, 92, 246, 0.5), inset 0 0 30px rgba(6, 182, 212, 0.2), 0 6px 24px rgba(0, 0, 0, 0.2)',
									transform: isHovered ? 'translate(-3px, -3px) rotate(-2deg)' : 'none',
								}}
							>
								<div
									className="absolute -inset-[3px] rounded-xl p-[3px] opacity-60"
									style={{
										background: 'linear-gradient(135deg, #8b5cf6, #06b6d4, #8b5cf6)',
										WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
										WebkitMaskComposite: 'xor',
										maskComposite: 'exclude',
									}}
								/>
							</div>

							{/* Image */}
							<div
								className={cn(
									"relative w-[90%] h-[90%] top-1/2 left-1/2 rounded-lg overflow-hidden z-10 transition-all duration-400",
									isDark ? "bg-slate-700" : "bg-white"
								)}
								style={{
									transform: isHovered
										? 'translate(-47%, -47%) rotate(2deg)'
										: 'translate(-50%, -50%)',
								}}
							>
								<img
									src={icon.img}
									alt={icon.title}
									className="w-full h-full object-cover drop-shadow-[0_10px_30px_rgba(139,92,246,0.4)]"
								/>
							</div>
						</div>

						{/* Title */}
						<h6
							className={cn(
								"text-[1rem] font-extrabold uppercase tracking-wide relative",
								"bg-clip-text text-transparent",
								isDark
									? "bg-gradient-to-br from-violet-300 via-violet-400 to-cyan-400"
									: "bg-gradient-to-br from-indigo-950 via-violet-500 to-cyan-500"
							)}
						>
							{icon.title}
							<span
								className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/5 h-px"
								style={{
									background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)',
								}}
							/>
						</h6>

						{/* Decorative separator */}
						<div className="flex items-center justify-center gap-2 my-1">
							<span
								className="w-5 h-px"
								style={{ background: 'linear-gradient(to right, transparent, rgba(139, 92, 246, 0.6))' }}
							/>
							<span
								className="w-1.5 h-1.5 rounded-full animate-glow"
								style={{
									background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
									boxShadow: '0 0 8px rgba(139, 92, 246, 0.6)',
								}}
							/>
							<span
								className="w-5 h-px"
								style={{ background: 'linear-gradient(to left, transparent, rgba(6, 182, 212, 0.6))' }}
							/>
						</div>

						{/* Description */}
						<p className={cn(
							"relative font-medium text-[0.82rem] leading-relaxed italic px-1 flex-1",
							isDark ? "text-slate-300" : "text-slate-600"
						)}>
							<span className="absolute -left-1 -top-2 text-xl font-serif text-violet-500/30">&ldquo;</span>
							{icon.subtitle}
							<span className="absolute -right-1 -bottom-1 text-xl font-serif text-cyan-500/30">&rdquo;</span>
						</p>
					</div>
				</div>
			</div>
		</Link>
	)
}

// Mobile Carousel component with navigation buttons
const MobileCarousel = ({ multimedia, isDark, isMounted }) => {
	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			loop: false,
			align: 'start',
			skipSnaps: false,
		},
		isMounted ? [Autoplay({ delay: 4000, stopOnInteraction: false })] : []
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

	return (
		<div className="block lg:hidden mb-12">
			<div ref={emblaRef} className="overflow-hidden">
				<div className="flex gap-4 sm:gap-5 md:gap-6 px-6 sm:px-4 pt-4 pb-[60px]">
					{multimedia.map((icon, index) => (
						<div
							key={index}
							className="flex-[0_0_70%] sm:flex-[0_0_calc(50%-10px)] md:flex-[0_0_calc(33.333%-16px)] min-w-0 flex justify-center"
						>
							<MultimediaCard
								img={icon.img}
								title={icon.title}
								subtitle={icon.subtitle}
								subtitleMobile={icon.subtitleMobile}
								link={icon.link}
							/>
						</div>
					))}
				</div>
			</div>

			{/* Pagination dots */}
			<div className="flex justify-center gap-2 mt-6 mb-4">
				{multimedia.map((_, index) => (
					<button
						key={index}
						onClick={() => scrollTo(index)}
						className={cn(
							"h-2.5 rounded-full transition-all duration-300 cursor-pointer",
							selectedIndex === index
								? "w-6 bg-gradient-to-r from-violet-500 to-cyan-500 shadow-[0_2px_8px_rgba(139,92,246,0.4)]"
								: "w-2.5 bg-violet-500/30 hover:bg-violet-500/50"
						)}
					/>
				))}
			</div>

			{/* Navigation buttons */}
			<div className="flex justify-center gap-4 mt-2">
				<Button
					variant="outline"
					size="icon"
					onClick={scrollPrev}
					disabled={!canScrollPrev}
					className={cn(
						"w-12 h-12 rounded-full",
						"bg-gradient-to-br from-violet-500/15 to-cyan-500/10",
						"border-2 border-violet-500/30",
						"hover:from-violet-500/25 hover:to-cyan-500/20",
						"hover:scale-110 hover:shadow-[0_4px_15px_rgba(139,92,246,0.4)]",
						"transition-all duration-300",
						"disabled:opacity-30"
					)}
				>
					<ChevronLeft className="w-5 h-5 text-violet-500" />
				</Button>
				<Button
					variant="outline"
					size="icon"
					onClick={scrollNext}
					disabled={!canScrollNext}
					className={cn(
						"w-12 h-12 rounded-full",
						"bg-gradient-to-br from-violet-500/15 to-cyan-500/10",
						"border-2 border-violet-500/30",
						"hover:from-violet-500/25 hover:to-cyan-500/20",
						"hover:scale-110 hover:shadow-[0_4px_15px_rgba(139,92,246,0.4)]",
						"transition-all duration-300",
						"disabled:opacity-30"
					)}
				>
					<ChevronRight className="w-5 h-5 text-violet-500" />
				</Button>
			</div>
		</div>
	)
}

// Section separator - elegant subtle animation
const SectionSeparator = () => {
	return (
		<div className="flex items-center justify-center my-16 md:my-20 relative">
			{/* Left line */}
			<div
				className="flex-1 h-0.5 max-w-[30%] md:max-w-[40%]"
				style={{
					background: 'linear-gradient(to right, transparent, rgba(139, 92, 246, 0.3) 50%, rgba(139, 92, 246, 0.6))',
				}}
			/>

			{/* Central decorative element */}
			<div className="mx-6 w-[50px] md:w-[70px] h-[50px] md:h-[70px] relative flex items-center justify-center">
				{/* Inner gradient circle with scale pulse */}
				<div
					className="w-[70%] h-[70%] rounded-full relative animate-[scalePulse_4s_ease-in-out_infinite]"
					style={{
						background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
					}}
				>
					{/* Inner shine */}
					<div
						className="absolute inset-1 rounded-full"
						style={{
							background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%)',
						}}
					/>
				</div>
			</div>

			{/* Right line */}
			<div
				className="flex-1 h-0.5 max-w-[30%] md:max-w-[40%]"
				style={{
					background: 'linear-gradient(to left, transparent, rgba(6, 182, 212, 0.3) 50%, rgba(6, 182, 212, 0.6))',
				}}
			/>
		</div>
	)
}

const Homepage = ({ translations, jsonLd }) => {
	const { isDark } = useThemeMode()
	const { isUserLoggedIn } = useUserContext()
	const router = useRouter()
	const searchParams = useSearchParams()
	const [isMounted, setIsMounted] = useState(false)
	const [showOnboardingModal, setShowOnboardingModal] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	// Check for onboarding param after signup
	useEffect(() => {
		if (searchParams.get('onboarding') === 'true' && isUserLoggedIn) {
			setShowOnboardingModal(true)
			// Clean up URL without triggering navigation
			window.history.replaceState({}, '', window.location.pathname)
		}
	}, [searchParams, isUserLoggedIn])

	// Check for access error params
	useEffect(() => {
		const error = searchParams.get('error')
		if (error === 'admin_only') {
			toast.error(translations.admin_only_error || 'Cette section est réservée aux administrateurs.')
			// Clean up URL
			window.history.replaceState({}, '', window.location.pathname)
		} else if (error === 'vip_only') {
			toast.error(translations.vip_only_error || 'Cette section est réservée aux membres VIP et administrateurs.')
			// Clean up URL
			window.history.replaceState({}, '', window.location.pathname)
		}
	}, [searchParams, translations])

	const handleOnboardingClose = () => {
		setShowOnboardingModal(false)
	}

	const handleChooseBeginner = () => {
		router.push('/method/beginner')
	}

	const handleChooseExplore = () => {
		// Just close the modal, user stays on homepage
		setShowOnboardingModal(false)
	}

	const multimedia = useMemo(() => [
		{
			img: getUIImageUrl('video-mini.webp'),
			title: translations.video,
			subtitle: translations.videosubtitle,
			subtitleMobile: translations.videosubtitleMobile,
			link: '/materials#videos',
		},
		{
			img: getUIImageUrl('audio-mini.webp'),
			title: translations.audio,
			subtitle: translations.audiosubtitle,
			subtitleMobile: translations.audiosubtitleMobile,
			link: '/materials#audio',
		},
		{
			img: getUIImageUrl('text-mini.webp'),
			title: translations.text,
			subtitle: translations.textsubtitle,
			subtitleMobile: translations.textsubtitleMobile,
			link: '/materials#texts',
		},
		{
			img: getUIImageUrl('dictionary-mini.webp'),
			title: translations.dictionary,
			subtitle: translations.dictionarysubtitle,
			subtitleMobile: translations.dictionarysubtitleMobile,
			link: '/dictionary',
		},
		{
			img: getUIImageUrl('flashcards-mini.webp'),
			title: translations.flashcards,
			subtitle: translations.flashcardssubtitle,
			subtitleMobile: translations.flashcardssubtitleMobile,
			link: '/dictionary',
		},
	], [translations])

	// Bento items for the tools section
	const bentoItems = useMemo(() => [
		{
			title: translations.translator,
			subtitle: translations.translatorsubtitle,
			imageSrc: getUIImageUrl('translator.webp'),
			imageAlt: 'translator',
			href: '/materials',
		},
		{
			title: translations.dictionary,
			subtitle: translations.giftranslatorsubtitle,
			imageSrc: getUIImageUrl('dictionary.webp'),
			imageAlt: 'dictionary',
			href: '/dictionary',
		},
		{
			title: translations.flashcards,
			subtitle: translations.gifflashcardssubtitle,
			imageSrc: getUIImageUrl('flashcards.webp'),
			imageAlt: 'flashcards',
			href: '/dictionary',
		},
		{
			title: translations.teacher,
			subtitle: translations.teachersubtitle,
			imageSrc: getUIImageUrl('teacher.webp'),
			imageAlt: 'teacher',
			href: '/teacher',
		},
	], [translations])

	return (
		<>
			{/* JSON-LD structured data */}
			{jsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			)}

			{/* Hero Section with background for diagonal cut */}
			<div className={cn(isDark ? "bg-slate-900" : "bg-white")}>
				<Hero />
			</div>

			{/* Main content wrapper */}
			<div className={cn(
				"relative overflow-hidden",
				isDark ? "bg-slate-900" : "bg-white"
			)}>
				{/* Background gradient effects */}
				<div
					className="absolute inset-0 pointer-events-none"
					style={{
						backgroundImage: `
							radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.03) 0%, transparent 50%),
							radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.03) 0%, transparent 50%)
						`,
					}}
				/>

				<div className="relative z-10 max-w-[1350px] mx-auto my-8 md:my-20 px-1 md:px-6">

					{/* Section Multimedia Learning - TES CARTES ORIGINALES */}
					<div className="relative pb-8 md:pb-16">
						{/* Background glow - hidden on mobile/tablet when carousel is shown */}
						<div
							className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[150%] rounded-full blur-[40px] pointer-events-none"
							style={{
								background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
							}}
						/>

						<div className="relative z-10">
							{/* Section Title */}
							<h2
								className="text-center text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3rem] font-extrabold mb-4 md:mb-6 px-4 sm:px-6 tracking-tight animate-gradient-shift leading-[1.3]"
								style={{
									background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 50%, #06b6d4 100%)',
									backgroundSize: '200% 200%',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									backgroundClip: 'text',
								}}
							>
								{translations.multimedia}
							</h2>

							{/* Section Subtitle */}
							<p className={cn(
								"text-center text-[0.95rem] sm:text-[1.05rem] md:text-lg mb-12 md:mb-16 px-4 sm:px-6 max-w-[700px] mx-auto font-medium leading-relaxed tracking-wide",
								isDark ? "text-slate-300" : "text-slate-500"
							)}>
								{translations.discoverResources}
							</p>

							{/* Carousel for mobile and tablet */}
							<MobileCarousel multimedia={multimedia} isDark={isDark} isMounted={isMounted} />

							{/* Grid for desktop */}
							<div
								className="hidden lg:grid grid-cols-5 items-stretch mx-auto mt-16 max-w-[1100px]"
								style={{ perspective: '2000px', perspectiveOrigin: 'center center' }}
							>
								{multimedia.map((icon, index) => (
									<DesktopMultimediaCard
										key={index}
										icon={icon}
										index={index}
										isDark={isDark}
									/>
								))}
							</div>
						</div>
					</div>

					<SectionSeparator />

					{/* How It Works Section */}
					<HowItWorks translations={translations} />

					<SectionSeparator />

					{/* Tools Bento Grid */}
					<section className="py-8 md:py-16">
						{/* Section Header */}
						<div className="text-center mb-12 md:mb-16">
							<h2
								className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 tracking-tight"
								style={{
									background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 50%, #06b6d4 100%)',
									backgroundSize: '200% 200%',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									backgroundClip: 'text',
								}}
							>
								{translations.learning_tools_title}
							</h2>
							<p className={cn(
								"text-base md:text-lg max-w-2xl mx-auto px-4",
								isDark ? "text-slate-400" : "text-slate-500"
							)}>
								{translations.learning_tools_subtitle}
							</p>
						</div>

						{/* Bento Grid */}
						<BentoGrid items={bentoItems} translations={translations} />
					</section>

					<SectionSeparator />

					{/* FAQ Section */}
					<FAQ translations={translations} />

					{/* Final CTA Section */}
					<FinalCTA translations={translations} />
				</div>
			</div>

			{/* Onboarding Modal - shown after signup */}
			<OnboardingModal
				open={showOnboardingModal}
				onClose={handleOnboardingClose}
				onChooseBeginner={handleChooseBeginner}
				onChooseExplore={handleChooseExplore}
			/>
		</>
	)
}

export default Homepage
