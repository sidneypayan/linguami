import Image from 'next/image'

const TranslationLoader = () => {
	return (
		<div className='translationLoader'>
			<Image src='/img/loader.gif' width={50} height={50} alt='loader'></Image>
		</div>
	)
}

export default TranslationLoader
