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
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					color: 'white',
					boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
					transition: 'all 0.3s ease',
					touchAction: 'manipulation',
					WebkitTapHighlightColor: 'transparent',
					'&:hover': {
						background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
						transform: 'translateY(-50%) scale(1.1)',
						boxShadow: '0 6px 25px rgba(102, 126, 234, 0.6)',
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
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					color: 'white',
					boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
					transition: 'all 0.3s ease',
					touchAction: 'manipulation',
					WebkitTapHighlightColor: 'transparent',
					'&:hover': {
						background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
						transform: 'translateY(-50%) scale(1.1)',
						boxShadow: '0 6px 25px rgba(102, 126, 234, 0.6)',
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
					background: #667eea;
					opacity: 0.3;
					transition: all 0.3s ease;
				}
				.swiper-pagination-bullet-active {
					opacity: 1;
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					transform: scale(1.2);
				}
			`}</style>
		</Box>
	)
}

// Mémoïser le composant pour éviter re-renders du carousel
export default React.memo(MaterialsCarousel)
