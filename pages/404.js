import Image from 'next/image'

export default function Custom404() {
	return (
		<Image
			src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}404.jpg`}
			width={450}
			height={450}
			alt='error'
		/>
	)
}
