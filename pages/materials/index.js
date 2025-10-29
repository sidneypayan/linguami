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

			<Box
				maxWidth='85%'
				width='1200px'
				sx={{
					margin: { xs: '6rem auto 2rem', sm: '8rem auto 3rem', md: '10rem auto' },
					px: { xs: 2, sm: 3 },
				}}>
				{/* Section Textes et Audio */}
				<Box id='texts' sx={{ scrollMarginTop: '100px' }}>
					<Typography
						variant='h4'
						mb={3}
						mt={2}
						sx={{
							fontWeight: 700,
							fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							position: 'relative',
							display: 'inline-block',
							'&::after': {
								content: '""',
								position: 'absolute',
								bottom: '-8px',
								left: 0,
								width: '60px',
								height: '4px',
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								borderRadius: '2px',
							},
						}}>
						{t('text')}
					</Typography>
					<MaterialsCarousel materials={text} />
				</Box>

				{/* Section Vidéos */}
				<Box id='videos' sx={{ scrollMarginTop: '100px' }}>
					<Typography
						variant='h4'
						mb={3}
						mt={6}
						sx={{
							fontWeight: 700,
							fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							position: 'relative',
							display: 'inline-block',
							'&::after': {
								content: '""',
								position: 'absolute',
								bottom: '-8px',
								left: 0,
								width: '60px',
								height: '4px',
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								borderRadius: '2px',
							},
						}}>
						{t('video')}
					</Typography>
					<MaterialsCarousel materials={video} />
				</Box>

				{/* Section Musique */}
				<Box id='audio' sx={{ scrollMarginTop: '100px' }}>
					<Typography
						variant='h4'
						mb={3}
						mt={6}
						sx={{
							fontWeight: 700,
							fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							position: 'relative',
							display: 'inline-block',
							'&::after': {
								content: '""',
								position: 'absolute',
								bottom: '-8px',
								left: 0,
								width: '60px',
								height: '4px',
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								borderRadius: '2px',
							},
						}}>
						{t('music')}
					</Typography>
					<MaterialsCarousel materials={music} />
				</Box>
			</Box>
		</>
	)
}

export default Material
