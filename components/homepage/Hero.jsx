import Image from 'next/image'
import Link from 'next/link'
import styles from '../../styles/Hero.module.css'

const Hero = () => {
	return (
		<div className='white-wrapper'>
			<div className={styles.container}>
				<div className={styles.textContainer}>
					<h2 className={styles.title}>
						Linguami, <br />
						bien plus qu&apos;un site de langue !
					</h2>
					<p className={styles.subtitle}>
						Apprenez une langue moderne et parlée par les locuteurs natifs.
						Découvrez une culture et rejoignez une communauté basée sur
						l&apos;entraide et l&apos;amitié entre les peuples.
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
		</div>
	)
}

export default Hero
