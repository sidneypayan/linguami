import styles from '../../styles/blog/Post.module.css'
import Head from 'next/head'
import Image from 'next/image'
import matter from 'gray-matter'
import { marked } from 'marked'
import fs from 'fs'
import path from 'path'

const Post = ({ frontmatter: { title, date, img }, slug, content }) => {
	// if (!content || !title || !date || !img || !slug) {
	// 	return <h1>Loading...</h1>
	// }

	return (
		<>
			<Head>
				<title>{title}</title>
				{/* <meta name='description' content={description} /> */}
			</Head>
			<div className={styles.container}>
				<h1>{title}</h1>
				<div className={styles.imgContainer}>
					<Image
						layout='fill'
						objectFit='cover'
						quality={100}
						src={process.env.NEXT_PUBLIC_SUPABASE_IMAGE + img}
						alt={title}
					/>
				</div>
				<p>{date}</p>
				<p
					style={{ lineHeight: '2rem' }}
					dangerouslySetInnerHTML={{ __html: marked(content) }}></p>
			</div>
		</>
	)
}

export async function getStaticPaths() {
	const files = fs.readdirSync(path.join('posts'))

	const paths = files.map(filename => ({
		params: {
			slug: filename.replace('.mdx', ''),
		},
	}))

	return {
		paths,
		fallback: false,
	}
}

export async function getStaticProps({ params: { slug } }) {
	const markdownWithMeta = fs.readFileSync(
		path.join('posts', slug + '.mdx'),
		'utf-8'
	)

	const { data: frontmatter, content } = matter(markdownWithMeta)

	return {
		props: {
			frontmatter,
			slug,
			content,
		},
	}
}
export default Post
