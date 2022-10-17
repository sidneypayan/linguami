import styles from '../../styles/blog/Posts.module.css'
import BlogCard from '../../components/blog/BlogCard'
import { supabase } from '../../lib/supabase'

const Blog = ({ posts }) => {
	return (
		<div className={styles.container}>
			{posts.map((post, index) => (
				<BlogCard key={index} post={post} />
			))}
		</div>
	)
}

export const getServerSideProps = async () => {
	const { data: posts, error } = await supabase
		.from('posts')
		.select('*')
		.eq('lang', 'ru')
		.order('id', { ascending: false })

	return {
		props: {
			posts,
		},
	}
}

export default Blog
