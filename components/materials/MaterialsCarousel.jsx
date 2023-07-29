import MaterialsCard from './MaterialsCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper'

const MaterialsCarousel = ({ materials }) => {


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
			{materials.map((material, index) => (
				<SwiperSlide key={index}>
					<MaterialsCard material={material} />
				</SwiperSlide>
			))}
		</Swiper>
	)
}

export default MaterialsCarousel
