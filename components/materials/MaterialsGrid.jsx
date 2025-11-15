import { Grid, Box, Typography } from '@mui/material'
import MaterialsCard from './MaterialsCard'
import { useTranslations, useLocale } from 'next-intl'

const MaterialsGrid = ({ materials }) => {
	const t = useTranslations('materials')

	if (!materials || materials.length === 0) {
		return (
			<Box
				sx={{
					py: 8,
					textAlign: 'center',
				}}>
				<Typography
					variant="h6"
					sx={{
						color: '#64748b',
						fontWeight: 600,
					}}>
					{t('noMaterialsFound')}
				</Typography>
			</Box>
		)
	}

	return (
		<Grid
			container
			spacing={{ xs: 2, sm: 2.5, md: 3 }}
			sx={{
				mb: 4,
			}}>
			{materials.map((material, index) => (
				<Grid
					item
					xs={6}
					sm={4}
					md={3}
					lg={2.4}
					xl={2}
					key={`${material.section}-${index}`}
					sx={{
						display: 'flex',
					}}>
					<Box
						sx={{
							width: '100%',
							animation: 'fadeInUp 0.5s ease-out',
							animationDelay: `${index * 0.05}s`,
							animationFillMode: 'both',
							'@keyframes fadeInUp': {
								from: {
									opacity: 0,
									transform: 'translateY(20px)',
								},
								to: {
									opacity: 1,
									transform: 'translateY(0)',
								},
							},
						}}>
						<MaterialsCard material={material} />
					</Box>
				</Grid>
			))}
		</Grid>
	)
}

export default MaterialsGrid
