import Head from 'next/head'
import Image from 'next/image'
import matter from 'gray-matter'
import { marked } from 'marked'
import fs from 'fs'
import path from 'path'
import { Box, Container, Typography } from '@mui/material'

const Post = ({ frontmatter: { title, date, img }, slug, content }) => {
	return (
		<>
			<Head>
				<title>{title}</title>
				{/* <meta name='description' content={description} /> */}
			</Head>
			<Container
				maxWidth='md'
				sx={{
					margin: {
						xs: '6rem auto',
						sm: '10rem auto',
					},
				}}>
				<Typography
					variant='h1'
					align='center'
					sx={{ typography: { xs: 'h2', md: 'h1' } }}>
					{title}
				</Typography>
				<Box
					sx={{
						margin: '4rem auto',
						position: 'relative',
						width: '100%',
						height: '300px',
					}}>
					<Image
						layout='fill'
						objectFit='cover'
						quality={100}
						src={process.env.NEXT_PUBLIC_SUPABASE_IMAGE + img}
						alt={title}
						style={{ borderRadius: '3px' }}
					/>
				</Box>
				<Typography
					variant='subtitle1'
					mb={2}
					color='clrGrey3'
					sx={{ fontWeight: '600' }}>
					{date}
				</Typography>
				<Typography
					sx={{ lineHeight: '2rem' }}
					dangerouslySetInnerHTML={{ __html: marked(content) }}></Typography>
			</Container>
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
