import { useSelector } from 'react-redux'
import styles from '../../styles/BookMenu.module.css'
import Link from 'next/link'

const BookMenu = () => {
	const { chapters } = useSelector(store => store.materials)
	console.log(chapters)

	return (
		<div className={styles.container}>
			<ul className={styles.chaptersContainer}>
				{chapters &&
					chapters.map(chapter => (
						<Link key={chapter.id} href={`/materials/book/${chapter.id}`}>
							<a>
								<li>{chapter.title}</li>
							</a>
						</Link>
					))}
			</ul>
		</div>
	)
}

export default BookMenu
