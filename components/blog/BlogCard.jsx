import styles from '../../styles/blog/Posts.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const BlogCard = ({ post }) => {
	return (
		<div className={styles.blogCardContainer}>
			<div className={styles.blogCardImg}>
				<Link href={`/blog/${post.slug}`}>
					<div className={styles.imgContainer}>
						<Image
							fill
							style={{ objectFit: 'cover' }}
							sizes={100}
							quality={100}
							src={
								process.env.NEXT_PUBLIC_SUPABASE_IMAGE + post.frontmatter.img
							}
							alt={post.frontmatter.title}
						/>
					</div>
				</Link>
			</div>
			<div className={styles.blogCardText}>
				<Link href={`/blog/${post.slug}`}>
					<h2 className={styles.title}>{post.frontmatter.title}</h2>
				</Link>

				<div className={styles.blogCardContent}>
					<div className={styles.metaBox}>{post.frontmatter.date}</div>
					<p>{post.frontmatter.excerpt}</p>
					{/* <p
							dangerouslySetInnerHTML={{
								__html: post.body.slice(0, 240) + '...',
							}}></p> */}
					<Link href={`/blog/${post.slug}`}>
						<button className={styles.blogCardBtn}>Lire plus &rarr;</button>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default BlogCard
