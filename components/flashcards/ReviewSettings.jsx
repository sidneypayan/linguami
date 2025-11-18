/**
 * Review settings panel component
 * Allows user to adjust cards limit
 */

import { useTranslations } from 'next-intl'
import styles from '@/styles/FlashCards.module.css'

export function ReviewSettings({ cardsLimit, onUpdateLimit, onClose }) {
	const t = useTranslations('words')

	const handleLimitClick = (limit) => {
		onUpdateLimit(limit)
		onClose()
	}

	return (
		<div className={styles.settingsPanel}>
			<h4 className={styles.settingsPanelTitle}>{t('settings_title')}</h4>
			<div className={styles.limitOptions}>
				{[10, 20, 30, 50, 100].map(limit => (
					<button
						key={limit}
						className={`${styles.limitOption} ${cardsLimit === limit ? styles.limitOptionActive : ''}`}
						onClick={() => handleLimitClick(limit)}>
						{limit}
					</button>
				))}
				<button
					className={`${styles.limitOption} ${cardsLimit === 9999 ? styles.limitOptionActive : ''}`}
					onClick={() => handleLimitClick(9999)}>
					{t('settings_all')}
				</button>
			</div>
		</div>
	)
}
