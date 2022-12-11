import MaterialsCarousel from '../../components/materials/MaterialsCarousel'
import { materials_ru, materials_fr } from '../../utils/constants'
import Head from 'next/head'
import { Box, Typography } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useState } from 'react'

const Material = () => {
	const { t, lang } = useTranslation()
	const [materials, setMaterials] = useState([])

	useEffect(() => {
		if (lang === 'fr') {
			setMaterials(materials_ru)
		}
		if (lang === 'ru') {
			setMaterials(materials_fr)
		}
	}, [lang])

	const textes = materials.filter(
		material => material.category === 'text & audio'
	)
	const video = materials.filter(material => material.category === 'video')
	const music = materials.filter(material => material.category === 'music')

	return (
		<>
			<Head>
				<title>{`${t('materials:pagetitle')} | Linguami`}</title>
				<meta name='description' content={t('materials:description')} />
			</Head>
			<Box p={5} maxWidth='85%' width='1000px' sx={{ margin: '10rem auto' }}>
				<Typography variant='h5' mb={1} mt={2} sx={{ fontWeight: '500' }}>
					{t('materials:text')}
				</Typography>
				<MaterialsCarousel materials={textes} />
				<Typography variant='h5' mb={1} mt={2} sx={{ fontWeight: '500' }}>
					{t('materials:video')}
				</Typography>
				<MaterialsCarousel materials={video} />
				<Typography variant='h5' mb={1} mt={2} sx={{ fontWeight: '500' }}>
					{t('materials:music')}
				</Typography>
				<MaterialsCarousel materials={music} />
			</Box>
		</>
	)
}

export default Material
