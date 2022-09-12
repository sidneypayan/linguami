import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import styles from '../../styles/Pagination.module.css'

const Pagination = () => {
	return (
		<div className={styles.container}>
			<button className='btn'>
				<FontAwesomeIcon icon={faArrowLeft} />
			</button>
			<button className='btn'>1</button>
			<button className='btn'>2</button>
			<button className='btn'>3</button>
			<button className='btn'>
				<FontAwesomeIcon icon={faArrowRight} />
			</button>
		</div>
	)
}

export default Pagination
