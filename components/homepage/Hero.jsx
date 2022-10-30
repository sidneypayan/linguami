import Image from 'next/image'
import Link from 'next/link'
import styles from '../../styles/Hero.module.css'

const Hero = () => {
	return (
		<div className='white-wrapper'>
			<div className={styles.container}>
				<div className={styles.textContainer}>
					<h2 className={styles.title}>
						Linguami <br />
						<span className={styles.subtitleLargeScreen}>
							bien plus qu&apos;un site de langue
						</span>
					</h2>
					<p className={styles.subtitle}>
						Apprenez une langue moderne et parlée par les locuteurs natifs.{' '}
						<br />
						<span className={styles.subtitleLargeScreen}>
							Découvrez une culture et rejoignez une communauté basée sur
							l&apos;entraide et l&apos;amitié entre les peuples.
						</span>
					</p>
					<Link href='/materials'>
						<button className={`${styles.btn} mainBtn`}>Commencez !</button>
					</Link>
				</div>
				<div className={styles.imgContainer}>
					<Image
						className={styles.img}
						src='/img/bear.png'
						alt='bear'
						width={300}
						height={300}
						objectFit='contain'
					/>
				</div>
			</div>
			<div className={`${styles.wave} + ${styles.subtitleLargeScreen}`}>
				<svg
					data-name='Layer 1'
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 1200 120'
					preserveAspectRatio='none'>
					<path
						d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z'
						className={styles.shapeFill}></path>
				</svg>
			</div>
		</div>
	)
}

export default Hero
