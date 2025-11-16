const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../components/homepage/index.js')
let content = fs.readFileSync(filePath, 'utf8')

// 1. Remplacer les imports Swiper par Embla
content = content.replace(
	/import { Swiper, SwiperSlide } from 'swiper\/react'\nimport { Navigation, Pagination, Autoplay } from 'swiper'\nimport 'swiper\/css'\nimport 'swiper\/css\/navigation'\nimport 'swiper\/css\/pagination'/,
	`import useEmblaCarousel from 'embla-carousel-react'\nimport Autoplay from 'embla-carousel-autoplay'\nimport { useCallback, useEffect, useState as useStateEmbla } from 'react'`
)

// 2. Ajouter le hook Embla dans le composant
// Trouver la ligne avec const [isMounted, setIsMounted] et ajouter après
content = content.replace(
	/(const \[isMounted, setIsMounted\] = useState\(false\))/,
	`$1\n\n\t// Embla Carousel setup\n\tconst [emblaRef, emblaApi] = useEmblaCarousel(\n\t\t{\n\t\t\tloop: false,\n\t\t\talign: 'start',\n\t\t\tskipSnaps: false,\n\t\t},\n\t\tisMounted ? [Autoplay({ delay: 4000, stopOnInteraction: false })] : []\n\t)\n\n\tconst [canScrollPrev, setCanScrollPrev] = useStateEmbla(false)\n\tconst [canScrollNext, setCanScrollNext] = useStateEmbla(true)\n\n\tconst scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])\n\tconst scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])\n\n\tconst onSelect = useCallback(() => {\n\t\tif (!emblaApi) return\n\t\tsetCanScrollPrev(emblaApi.canScrollPrev())\n\t\tsetCanScrollNext(emblaApi.canScrollNext())\n\t}, [emblaApi])\n\n\tuseEffect(() => {\n\t\tif (!emblaApi) return\n\t\tonSelect()\n\t\temblaApi.on('select', onSelect)\n\t\temblaApi.on('reInit', onSelect)\n\t}, [emblaApi, onSelect])`
)

// 3. Remplacer le Swiper JSX par Embla (c'est la partie complexe)
// On va chercher depuis <Swiper jusqu'à </Swiper> et le remplacer
const swiperRegex = /<Swiper[^>]*>[\s\S]*?<\/Swiper>/
const swiperMatch = content.match(swiperRegex)

if (swiperMatch) {
	const emblaReplacement = `<Box ref={emblaRef} sx={{ overflow: 'hidden' }}>
						<Box
							sx={{
								display: 'flex',
								gap: { xs: '20px', sm: '20px', md: '24px' },
								px: 2,
								pb: '60px',
								'& > *': {
									flex: '0 0 100%',
									minWidth: 0,
									'@media (min-width: 600px)': {
										flex: '0 0 calc(50% - 10px)',
									},
									'@media (min-width: 900px)': {
										flex: '0 0 calc(33.333% - 16px)',
									},
								},
							}}>
							{multimedia.map((icon, index) => (
								<Box key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
									<Link href={icon.link} style={{ textDecoration: 'none', display: 'block', width: '100%', maxWidth: '220px' }}>
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												gap: 2,
												textAlign: 'center',
												p: { xs: 2.5, sm: 3.5 },
												height: '100%',
												minHeight: { xs: '280px', sm: '320px' },
												borderRadius: 4,
												background: isDark ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)' : 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 248, 255, 0.95) 100%)',
												border: '2px solid transparent',
												backgroundImage: isDark ? 'linear-gradient(rgba(30, 41, 59, 1), rgba(30, 41, 59, 1)), linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(6, 182, 212, 0.5), rgba(139, 92, 246, 0.5))' : 'linear-gradient(white, white), linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(6, 182, 212, 0.4), rgba(139, 92, 246, 0.4))',
												backgroundOrigin: 'border-box',
												backgroundClip: 'padding-box, border-box',
												boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
												transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
												cursor: 'pointer',
												position: 'relative',
												overflow: 'hidden',
												'&::before': {
													content: '""',
													position: 'absolute',
													top: 0,
													left: '-100%',
													width: '100%',
													height: '100%',
													background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
													transition: 'left 0.5s ease',
												},
												'&:hover': {
													transform: 'translateY(-8px) scale(1.02)',
													boxShadow: '0 12px 40px rgba(139, 92, 246, 0.45), 0 0 20px rgba(6, 182, 212, 0.25)',
													borderColor: 'rgba(139, 92, 246, 0.5)',
													'&::before': {
														left: '100%',
													},
													'& .outer-frame': {
														transform: 'translate(-3px, -3px) rotate(-2deg)',
													},
													'& .icon-container': {
														transform: 'translate(-47%, -47%) rotate(2deg)',
													},
												},
											}}>
											<Box
												sx={{
													position: 'relative',
													width: { xs: 100, sm: 120 },
													height: { xs: 100, sm: 120 },
												}}>
												{/* Cercle de fond animé blur */}
												<Box
													sx={{
														position: 'absolute',
														width: '120%',
														height: '120%',
														top: '50%',
														left: '50%',
														transform: 'translate(-50%, -50%)',
														background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)',
														borderRadius: 4,
														filter: 'blur(40px)',
														animation: 'pulse 3s ease-in-out infinite',
														'@keyframes pulse': {
															'0%, 100%': {
																opacity: 0.5,
																transform: 'translate(-50%, -50%) scale(1)',
															},
															'50%': {
																opacity: 0.8,
																transform: 'translate(-50%, -50%) scale(1.1)',
															},
														},
													}}
												/>

												{/* Cadre stylisé avec glassmorphism */}
												<Box
													className="outer-frame"
													sx={{
														position: 'absolute',
														width: '100%',
														height: '100%',
														borderRadius: 3,
														background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
														border: '3px solid rgba(255, 255, 255, 0.2)',
														backdropFilter: 'blur(10px)',
														boxShadow: \`
															0 0 30px rgba(139, 92, 246, 0.5),
															inset 0 0 30px rgba(6, 182, 212, 0.2),
															0 6px 24px rgba(0, 0, 0, 0.2)
														\`,
														transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
														'&::before': {
															content: '""',
															position: 'absolute',
															inset: '-3px',
															borderRadius: 3,
															padding: '3px',
															background: 'linear-gradient(135deg, #8b5cf6, #06b6d4, #8b5cf6)',
															WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
															WebkitMaskComposite: 'xor',
															maskComposite: 'exclude',
															opacity: 0.6,
														},
													}}
												/>

												{/* Conteneur de l'image avec overflow hidden */}
												<Box
													className="icon-container"
													sx={{
														position: 'relative',
														width: '90%',
														height: '90%',
														top: '50%',
														left: '50%',
														transform: 'translate(-50%, -50%)',
														borderRadius: 2.5,
														overflow: 'hidden',
														zIndex: 2,
														transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
													}}>
													<Box
														component='img'
														src={icon.img}
														alt={icon.title}
														sx={{
															width: '100%',
															height: '100%',
															objectFit: 'cover',
															filter: 'drop-shadow(0 10px 30px rgba(139, 92, 246, 0.4))',
														}}
													/>

													{/* Overlay pour masquer le logo Gemini en bas à droite */}
													<Box
														sx={{
															position: 'absolute',
															bottom: 0,
															right: 0,
															width: '40%',
															height: '25%',
															background: 'linear-gradient(135deg, transparent 0%, rgba(139, 92, 246, 0.15) 40%)',
															zIndex: 3,
														}}
													/>
												</Box>
											</Box>
											<Box sx={{ width: '100%', px: 1 }}>
												{/* Titre avec effet heroic fantasy */}
												<Typography
													variant='h6'
													sx={{
														fontSize: { xs: '1.1rem', sm: '1.15rem' },
														fontWeight: 800,
														background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 50%, #06b6d4 100%)',
														backgroundSize: '200% 200%',
														WebkitBackgroundClip: 'text',
														WebkitTextFillColor: 'transparent',
														backgroundClip: 'text',
														textTransform: 'uppercase',
														letterSpacing: '0.5px',
														mb: 1,
														textShadow: '0 2px 4px rgba(139, 92, 246, 0.2)',
														position: 'relative',
														'&::after': {
															content: '""',
															position: 'absolute',
															bottom: -4,
															left: '50%',
															transform: 'translateX(-50%)',
															width: '60%',
															height: '1px',
															background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)',
														},
													}}>
													{icon.title}
												</Typography>

												{/* Séparateur décoratif */}
												<Box
													sx={{
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														gap: 1,
														my: 1.5,
													}}>
													<Box
														sx={{
															width: '20px',
															height: '1px',
															background: 'linear-gradient(to right, transparent, rgba(139, 92, 246, 0.6))',
														}}
													/>
													<Box
														sx={{
															width: '6px',
															height: '6px',
															borderRadius: '50%',
															background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
															boxShadow: '0 0 8px rgba(139, 92, 246, 0.6)',
														}}
													/>
													<Box
														sx={{
															width: '20px',
															height: '1px',
															background: 'linear-gradient(to left, transparent, rgba(6, 182, 212, 0.6))',
														}}
													/>
												</Box>

												{/* Description avec style parchemin */}
												<>
													<Typography
														variant='body2'
														sx={{
															display: { xs: 'block', sm: 'none' },
															color: isDark ? '#cbd5e1' : '#475569',
															fontWeight: 500,
															fontSize: '0.8rem',
															lineHeight: 1.6,
															fontStyle: 'italic',
															px: 0.5,
															textAlign: 'center',
															position: 'relative',
															'&::before': {
																content: '"\u201C"',
																position: 'absolute',
																left: -4,
																top: -8,
																fontSize: '1.5rem',
																color: 'rgba(139, 92, 246, 0.3)',
																fontFamily: 'Georgia, serif',
															},
															'&::after': {
																content: '"\u201D"',
																position: 'absolute',
																right: -4,
																bottom: -8,
																fontSize: '1.5rem',
																color: 'rgba(6, 182, 212, 0.3)',
																fontFamily: 'Georgia, serif',
															},
														}}>
														{icon.subtitleMobile}
													</Typography>
													<Typography
														variant='body2'
														sx={{
															display: { xs: 'none', sm: 'block' },
															color: isDark ? '#cbd5e1' : '#475569',
															fontWeight: 500,
															fontSize: '0.85rem',
															lineHeight: 1.6,
															fontStyle: 'italic',
															px: 0.5,
															textAlign: 'center',
															position: 'relative',
															'&::before': {
																content: '"\u201C"',
																position: 'absolute',
																left: -4,
																top: -8,
																fontSize: '1.5rem',
																color: 'rgba(139, 92, 246, 0.3)',
																fontFamily: 'Georgia, serif',
															},
															'&::after': {
																content: '"\u201D"',
																position: 'absolute',
																right: -4,
																bottom: -8,
																fontSize: '1.5rem',
																color: 'rgba(6, 182, 212, 0.3)',
																fontFamily: 'Georgia, serif',
															},
														}}>
														{icon.subtitle}
													</Typography>
												</>
											</Box>
										</Box>
									</Link>
								</Box>
							))}
						</Box>
					</Box>`

	content = content.replace(swiperRegex, emblaReplacement)
}

// 4. Mettre à jour les boutons de navigation
content = content.replace(
	/className="swiper-button-prev-custom"/g,
	'onClick={scrollPrev}\n\t\t\t\t\t\tdisabled={!canScrollPrev}'
)

content = content.replace(
	/className="swiper-button-next-custom"/g,
	'onClick={scrollNext}\n\t\t\t\t\t\tdisabled={!canScrollNext}'
)

// 5. Mettre à jour le style des boutons disabled
content = content.replace(
	/'&\.swiper-button-disabled': {\s*opacity: 0\.3,\s*},/g,
	"'&.Mui-disabled': {\n\t\t\t\t\t\t\topacity: 0.3,\n\t\t\t\t\t\t},"
)

fs.writeFileSync(filePath, content, 'utf8')
console.log('✅ Homepage carousel migré vers Embla')
