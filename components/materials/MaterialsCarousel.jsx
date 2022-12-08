import MaterialsCard from './MaterialsCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { useSwiper } from 'swiper/react'
import { Button } from '@mui/material'
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'
import { Navigation } from 'swiper'

const MaterialsCarousel = ({ materials }) => {
	const SwiperButtonPrev = () => {
		const swiper = useSwiper()
		return (
			<Button
				sx={{
					color: '#fff',
					position: 'absolute',
					top: 0,
					zIndex: '1',
					height: '180px',
					backgroundColor: 'rgba(33, 33, 33, 0.3)',
					borderTopRightRadius: 0,
					borderBottomRightRadius: 0,
				}}
				onClick={() => swiper.slidePrev()}>
				<ArrowBackIos />
			</Button>
		)
	}
	const SwiperButtonNext = () => {
		const swiper = useSwiper()
		return (
			<Button
				sx={{
					color: '#fff',
					position: 'absolute',
					top: 0,
					right: 0,
					zIndex: '1',
					height: '180px',
					backgroundColor: 'rgba(33, 33, 33, 0.3)',
					borderTopLeftRadius: 0,
					borderBottomLeftRadius: 0,
				}}
				onClick={() => swiper.slideNext()}>
				<ArrowForwardIos />
			</Button>
		)
	}

	return (
		<Swiper
			spaceBetween={10}
			slidesPerView={1.5}
			modules={[Navigation]}
			navigation
			breakpoints={{
				600: {
					slidesPerView: 3,
				},
				950: {
					slidesPerView: 4,
				},
			}}>
			{/* <SwiperButtonPrev />
			<SwiperButtonNext /> */}
			{materials.map((material, index) => (
				<SwiperSlide key={index}>
					<MaterialsCard material={material} />
				</SwiperSlide>
			))}
		</Swiper>
	)
}

export default MaterialsCarousel
