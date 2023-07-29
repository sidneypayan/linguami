import useTranslation from 'next-translate/useTranslation'
import BlogCard from '../../components/blog/BlogCard'
import Head from 'next/head'
import { sortPostsByDate } from '../../utils/helpers'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Container } from '@mui/material'

const Blog = ({ posts }) => {
	const { t, lang } = useTranslation('blog')

	return (
		<>
			<Head>
				<title>{`${t('pagetitle')} | Linguami`}</title>
				<meta name='description' content={t('description')} />
			</Head>
			<Container
				sx={{
					margin: {
						xs: '5rem auto',
						md: '10rem auto',
					},
				}}>
				{posts.map((post, index) => (
					<BlogCard key={index} post={post} />
				))}
			</Container>
		</>
	)
}

export const getStaticProps = async () => {
	const files = fs.readdirSync(path.join('posts'))

	const posts = files.map(filename => {
		const slug = filename.replace('.mdx', '')

		const markdownWithMeta = fs.readFileSync(
			path.join('posts', filename),
			'utf-8'
		)

		const { data: frontmatter } = matter(markdownWithMeta)

		return { slug, frontmatter }
	})

	return {
		props: {
			posts: posts.sort(sortPostsByDate),
		},
	}
}

export default Blog
