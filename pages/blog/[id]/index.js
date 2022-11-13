import styles from '../../../styles/blog/Post.module.css'
import { supabase } from '../../../lib/supabase'
import { useEffect, useState } from 'react'
import { editContent } from '../../../features/createContent/createContentSlice'
import { useDispatch } from 'react-redux'
import { useUserContext } from '../../../context/user'
import Head from 'next/head'
import Image from 'next/image'
import { Button } from '@mui/material'
import { toggleContentType } from '../../../features/createContent/createContentSlice'
import { useRouter } from 'next/router'

const Post = ({ post }) => {
	const dispatch = useDispatch()
	const [singlePost, setSinglePost] = useState(null)
	const { isUserAdmin } = useUserContext()
	const router = useRouter()

	const handleEditContent = () => {
		dispatch(toggleContentType('posts'))
		dispatch(editContent({ id: post.id, contentType: 'posts' }))
		router.push('/admin/create')
	}

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
					<div className={styles.imgContainer}>
						<Image
							layout='fill'
							objectFit='cover'
							quality={100}
							src={process.env.NEXT_PUBLIC_SUPABASE_IMAGE + post.img}
							alt={post.title}
						/>
					</div>
					{isUserAdmin && (
						<Button
							onClick={handleEditContent}
							variant='contained'
							sx={{ marginBottom: '2rem' }}>
							Edit post
						</Button>
					)}
					<p dangerouslySetInnerHTML={{ __html: post.body }}></p>
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
