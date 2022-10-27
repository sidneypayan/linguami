import styles from '../../../styles/blog/Post.module.css'
import { supabase } from '../../../lib/supabase'
import { useEffect, useState } from 'react'
import Head from 'next/head'

const Post = ({ post }) => {
	const [singlePost, setSinglePost] = useState(null)

	useEffect(() => {
		setSinglePost(post)
	}, [post])

	return (
		singlePost && (
			<>
				<Head>
					<title>{post.title}</title>
					<meta name='description' content={post.description} />
				</Head>
				<div className={styles.container}>
					<h1>{post.title}</h1>
					<p dangerouslySetInnerHTML={{ __html: post.content }}></p>
				</div>
			</>
		)
	)
}

export const getStaticProps = async ({ params }) => {
	const { data: post, error } = await supabase
		.from('posts')
		.select('*')
		.eq('lang', 'ru')
		.eq('id', params.id)
		.single()

	return {
		props: {
			post,
		},
		revalidate: 60,
	}
}

export const getStaticPaths = async () => {
	const { data: posts, error } = await supabase
		.from('posts')
		.select('*')
		.eq('lang', 'ru')

	const paths = posts.map(post => ({
		params: { id: post.id.toString() },
	}))

	return {
		paths,
		fallback: 'blocking',
	}
}

export default Post
