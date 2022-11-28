import styles from '../../styles/blog/Posts.module.css'
import BlogCard from '../../components/blog/BlogCard'
import { supabase } from '../../lib/supabase'
import Head from 'next/head'

const Blog = ({ posts }) => {
	return (
		<>
			<Head>
				<title>Blog | Linguami</title>
				<meta
					name='description'
					content="Retrouvez des articles sur la langue, l'histoire et la culture russe. En complément de nos matériels d'apprentissage, nous rédigeons régulièrement des articles afin de vous immerger dans le monde russe et ses particularités."
				/>
			</Head>
			<div className={styles.container}>
				{posts.map((post, index) => (
					<BlogCard key={index} post={post} />
				))}
			</div>
		</>
	)
}

export const getStaticProps = async () => {
	const { data: posts, error } = await supabase
		.from('posts')
		.select('*')
		.eq('lang', 'ru')
		.order('id', { ascending: false })

	return {
		props: {
			posts,
		},
		revalidate: 60,
	}
}

export default Blog
