import styles from '../../styles/Footer.module.css'
import Image from 'next/image'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'

const Footer = () => {
	const { t, lang } = useTranslation()

	return (
		<div className='white-wrapper'>
			<footer className={styles.container}>
				<div className={styles.socialsContainer}>
					<div className={styles.iconsContainer}>
						<div>
							<Link href='https://www.facebook.com/linguami/' target='_blank'>
								<Image
									layout='fixed'
									src='/img/icon-fb.png'
									alt='facebook'
									width={32}
									height={32}
								/>
							</Link>
						</div>
						<div>
							<Link href='https://twitter.com/linguami/' target='_blank'>
								<Image
									layout='fixed'
									src='/img/icon-twitter.png'
									alt='twitter'
									width={32}
									height={32}
								/>
							</Link>
						</div>
						<div>
							<Link
								href='https://www.youtube.com/channel/UCVtNeYVhksLsMqYmCCAFFIg/'
								target='_blank'>
								<Image
									layout='fixed'
									src='/img/icon-youtube.png'
									alt='youtube'
									width={32}
									height={32}
								/>
							</Link>
						</div>
					</div>
				</div>

				<div className={styles.copyrightContainer}>
					<p>Copyright &copy; 2022 Linguami. All rights reserved.</p>
				</div>

				<div className={styles.linksContainer}>
					<ul>
						{/* <li>
							<Link>A propos de nous</Link>
						</li> */}
						<li>
							<Link href='https://paypal.me/linguami' target='_blank'>
								{t('common:support')}
							</Link>
						</li>
						<li>
							<Link href='mailto:contact@linguami.com?Subject=Contact%20from%20linguami'>
								{t('common:contact')}
							</Link>
						</li>
					</ul>
				</div>
			</footer>
		</div>
	)
}

export default Footer
