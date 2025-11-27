'use client'

import MaterialsCard from './MaterialsCard'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

const MaterialsGrid = ({ materials }) => {
	const t = useTranslations('materials')
	const { isDark } = useThemeMode()

	if (!materials || materials.length === 0) {
		return (
			<div className="py-8 text-center">
				<p
					className={cn(
						'text-lg font-semibold',
						isDark ? 'text-slate-400' : 'text-slate-500'
					)}
				>
					{t('noMaterialsFound')}
				</p>
			</div>
		)
	}

	return (
		<div
			className={cn(
				'grid gap-3 sm:gap-5 md:gap-6 mb-8',
				'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
				'-mx-1 sm:mx-0'
			)}
		>
			{materials.map((material, index) => (
				<div
					key={`${material.section}-${index}`}
					className="flex animate-[fadeInUp_0.5s_ease-out_both]"
					style={{ animationDelay: `${index * 0.05}s` }}
				>
					<MaterialsCard material={material} />
				</div>
			))}
		</div>
	)
}

export default MaterialsGrid
