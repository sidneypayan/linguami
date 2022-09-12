import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import styles from '../../styles/Pagination.module.css'

const Pagination = () => {
	return (
		<div className={styles.container}>
			<button className={styles.arrowBtn}>
				<FontAwesomeIcon icon={faArrowLeft} />
			</button>
			<button>1</button>
			<button>2</button>
			<button>3</button>
			<button className={styles.arrowBtn}>
				<FontAwesomeIcon icon={faArrowRight} />
			</button>
		</div>
	)
}

export default Pagination
