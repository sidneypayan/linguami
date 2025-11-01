import React from 'react'
import MaterialsCard from './MaterialsCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, EffectCoverflow } from 'swiper'
import { Box, IconButton } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

const MaterialsCarousel = ({ materials }) => {
	const [swiperInstance, setSwiperInstance] = React.useState(null)

	const handlePrev = () => {
		if (swiperInstance) {
			swiperInstance.slidePrev()
		}
	}

	const handleNext = () => {
		if (swiperInstance) {
			swiperInstance.slideNext()
		}
	}

	return (
		<Box sx={{ position: 'relative', px: { xs: 0, sm: 6 }, py: 2, overflow: 'visible' }}>
			{/* Bouton précédent */}
			<IconButton
				onClick={handlePrev}
				sx={{
					position: 'absolute',
					left: { xs: '-10px', sm: '-20px' },
					top: '50%',
					transform: 'translateY(-50%)',
					zIndex: 10,
					width: { xs: '40px', sm: '50px' },
					height: { xs: '40px', sm: '50px' },
					background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(6, 182, 212, 0.95) 100%)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(139, 92, 246, 0.3)',
					color: 'white',
					boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
					transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
					touchAction: 'manipulation',
					WebkitTapHighlightColor: 'transparent',
					'&:hover': {
						background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)',
						transform: 'translateY(-50%) scale(1.15)',
						boxShadow: '0 8px 30px rgba(139, 92, 246, 0.6)',
						borderColor: 'rgba(139, 92, 246, 0.5)',
					},
					'&:active': {
						transform: 'translateY(-50%) scale(0.95)',
					},
				}}>
				<ChevronLeft sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />
			</IconButton>

			{/* Bouton suivant */}
			<IconButton
				onClick={handleNext}
				sx={{
					position: 'absolute',
					right: { xs: '-10px', sm: '-20px' },
					top: '50%',
					transform: 'translateY(-50%)',
					zIndex: 10,
					width: { xs: '40px', sm: '50px' },
					height: { xs: '40px', sm: '50px' },
					background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(6, 182, 212, 0.95) 100%)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(139, 92, 246, 0.3)',
					color: 'white',
					boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
					transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
					touchAction: 'manipulation',
					WebkitTapHighlightColor: 'transparent',
					'&:hover': {
						background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)',
						transform: 'translateY(-50%) scale(1.15)',
						boxShadow: '0 8px 30px rgba(139, 92, 246, 0.6)',
						borderColor: 'rgba(139, 92, 246, 0.5)',
					},
					'&:active': {
						transform: 'translateY(-50%) scale(0.95)',
					},
				}}>
				<ChevronRight sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />
			</IconButton>

			<Swiper
				spaceBetween={20}
				slidesPerView={1.5}
				modules={[Navigation, Pagination, EffectCoverflow]}
				speed={600}
				effect='slide'
				grabCursor={true}
				centeredSlides={false}
				onSwiper={setSwiperInstance}
				pagination={{
					clickable: true,
					dynamicBullets: true,
				}}
				breakpoints={{
					600: {
						slidesPerView: 2.5,
						spaceBetween: 20,
					},
					900: {
						slidesPerView: 3.5,
						spaceBetween: 25,
					},
					1200: {
						slidesPerView: 4,
						spaceBetween: 30,
					},
				}}
				style={{
					paddingTop: '8px',
					paddingBottom: '40px',
				}}>
				{materials.map((material, index) => (
					<SwiperSlide
						key={index}
						style={{
							transition: 'all 0.3s ease',
						}}>
						<MaterialsCard material={material} />
					</SwiperSlide>
				))}
			</Swiper>

			<style jsx global>{`
				.swiper {
					overflow-x: hidden !important;
					overflow-y: visible !important;
				}
				.swiper-wrapper {
					padding-top: 8px;
				}
				.swiper-pagination {
					bottom: 10px !important;
				}
				.swiper-pagination-bullet {
					width: 10px;
					height: 10px;
					background: #8b5cf6;
					opacity: 0.3;
					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
					border: 1px solid rgba(139, 92, 246, 0.4);
				}
				.swiper-pagination-bullet-active {
					opacity: 1;
					background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
					transform: scale(1.3);
					box-shadow: 0 2px 8px rgba(139, 92, 246, 0.5);
					border-color: rgba(139, 92, 246, 0.6);
				}
			`}</style>
		</Box>
	)
}

// Mémoïser le composant pour éviter re-renders du carousel
export default React.memo(MaterialsCarousel)
