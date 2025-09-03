import useTranslation from 'next-translate/useTranslation'
import MaterialsCarousel from '../../components/materials/MaterialsCarousel'
import { materials_ru, materials_fr } from '../../utils/constants'
import Head from 'next/head'
import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

const Material = () => {
	const { t, lang } = useTranslation('materials')
	const [materials, setMaterials] = useState([])
	const [text, setText] = useState([])
	const [video, setVideo] = useState([])
	const [music, setMusic] = useState([])

	useEffect(() => {
		if (lang === 'fr') setMaterials(materials_ru)
		if (lang === 'ru') setMaterials(materials_fr)
		setText(materials.filter(material => material.category === 'text & audio'))
		setVideo(materials.filter(material => material.category === 'video'))
		setMusic(materials.filter(material => material.category === 'music'))
	}, [lang, materials])

	return (
		<>
			<Head>
				<title>{`${t('pagetitle')} | Linguami`}</title>
				<meta name='description' content={t('description')} />
			</Head>

			<Box maxWidth='85%' width='1000px' sx={{ margin: '10rem auto' }}>
				<Typography variant='h5' mb={1} mt={2} sx={{ fontWeight: '500' }}>
					{t('text')}
				</Typography>
				<MaterialsCarousel materials={text} />
				<Typography variant='h5' mb={1} mt={2} sx={{ fontWeight: '500' }}>
					{t('video')}
				</Typography>
				<MaterialsCarousel materials={video} />
				<Typography variant='h5' mb={1} mt={2} sx={{ fontWeight: '500' }}>
					{t('music')}
				</Typography>
				<MaterialsCarousel materials={music} />
			</Box>
		</>
	)
}

export default Material
