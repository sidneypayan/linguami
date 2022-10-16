import styles from '../../styles/blog/Posts.module.css'
import Image from 'next/image'
import Link from 'next/link'

const BlogCard = ({ post }) => {
	return (
		<div className={styles.blogCardContainer}>
			<div className={styles.blogCardImg}>
				<Link href={`/blog/${post.id}`}>
					<div className={styles.imgContainer}>
						<Image
							layout='fill'
							objectFit='cover'
							quality={100}
							src={`https://linguami.s3.eu-west-3.amazonaws.com/images/${post.img}`}
							alt={post.title}
						/>
					</div>
				</Link>
			</div>
			<div className={styles.blogCardText}>
				<Link href={`/blog/${post.id}`}>
					<h2 className={styles.title}>{post.title}</h2>
				</Link>

				<div className={styles.blogCardContent}>
					<div className={styles.metaBox}>20-04-2021</div>
					<p
						dangerouslySetInnerHTML={{
							__html: post.content.slice(0, 240) + '...',
						}}></p>
					<Link href={`/blog/${post.id}`}>
						<button className={styles.blogCardBtn}>Lire plus &rarr;</button>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default BlogCard
