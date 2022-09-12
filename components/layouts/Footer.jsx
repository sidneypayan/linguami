import styles from '../../styles/Footer.module.css'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
	return (
		<div className='white-wrapper'>
			<footer className={styles.container}>
				<div className={styles.socialsContainer}>
					<div className={styles.iconsContainer}>
						<div>
							<Link href='https://www.facebook.com/linguami/' target='_blank'>
								<Image
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
						<li>
							<Link href='<?php $root_path ?>/donate'>A propos de nous</Link>
						</li>
						<li>
							<Link href='https://paypal.me/linguami' target='_blank'>
								Nous soutenir
							</Link>
						</li>
						<li>
							<Link href='<?php $root_path ?>/contact'>Nous contacter</Link>
						</li>
					</ul>
				</div>
			</footer>
		</div>
	)
}

export default Footer
