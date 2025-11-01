import React, { useState } from 'react'
import MaterialsCard from './MaterialsCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, EffectCoverflow, Navigation } from 'swiper'
import { Box, IconButton } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'
import 'swiper/css/navigation'

const MaterialsCarousel = ({ materials }) => {
	const [swiperInstance, setSwiperInstance] = useState(null)

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
		<Box sx={{ position: 'relative', px: { xs: 0, sm: 2 }, py: 2, overflow: 'visible' }}>
			{/* Previous button - desktop only */}
			<IconButton
				onClick={handlePrev}
				sx={{
					display: { xs: 'none', lg: 'flex' },
					position: 'absolute',
					left: { lg: '-20px', xl: '-30px' },
					top: '50%',
					transform: 'translateY(-50%)',
					zIndex: 10,
					width: { lg: '50px', xl: '60px' },
					height: { lg: '50px', xl: '60px' },
					background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
					color: 'white',
					boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
					transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
					'&:hover': {
						background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
						transform: 'translateY(-50%) scale(1.1)',
						boxShadow: '0 6px 25px rgba(139, 92, 246, 0.6)',
					},
				}}>
				<ChevronLeft sx={{ fontSize: { lg: '1.8rem', xl: '2rem' } }} />
			</IconButton>

			{/* Next button - desktop only */}
			<IconButton
				onClick={handleNext}
				sx={{
					display: { xs: 'none', lg: 'flex' },
					position: 'absolute',
					right: { lg: '-20px', xl: '-30px' },
					top: '50%',
					transform: 'translateY(-50%)',
					zIndex: 10,
					width: { lg: '50px', xl: '60px' },
					height: { lg: '50px', xl: '60px' },
					background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
					color: 'white',
					boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
					transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
					'&:hover': {
						background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
						transform: 'translateY(-50%) scale(1.1)',
						boxShadow: '0 6px 25px rgba(139, 92, 246, 0.6)',
					},
				}}>
				<ChevronRight sx={{ fontSize: { lg: '1.8rem', xl: '2rem' } }} />
			</IconButton>

			<Swiper
				onSwiper={setSwiperInstance}
				spaceBetween={20}
				slidesPerView={1.5}
				modules={[Pagination, EffectCoverflow, Navigation]}
				speed={600}
				effect='slide'
				grabCursor={true}
				centeredSlides={false}
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
