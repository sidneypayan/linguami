import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Ressources.module.css'

const RessourcesList = () => {
	const ressources = [
		{
			textes: [
				{
					img: '/dialogue.jpg',
					title: 'dialogues',
					text: 'Nos dialogues utilisent des tournures de phrases actuelles dans des situations variées. Ils vous aideront à maîtriser la langue parlée par les Russes au quotidien.',
				},
				{
					img: '/culture_ru.jpg',
					title: 'culture & folklore',
					text: "La culture et le folklore changent d'un pays à l'autre et forgent l'identité des peuples. Dans cette section vous en saurez plus sur les particularités de la culture , du folklore et de l'artisanat russe.",
				},
				{
					img: '/tranche-de-vie.jpg',
					title: 'tranches de vie',
					text: 'Vous trouverez ici de courts récits autobiographiques qui vous apprendrons à parler de vous, de votre entourage, de vos goûts et de vos sentiments.',
				},
				{
					img: '/lieux_ru.jpg',
					title: 'beaux endroits',
					text: 'La Russie est un vaste pays qui compte parmi les plus beaux endroits de la planète. Nous vous emmenons pour une visite passionnante qui vous donnera l’occasion de pratiquer la langue tout en vous émerveillant.',
				},
			],
		},
		{
			videos: [
				{
					img: '/trailers.jpg',
					title: 'bandes annonces',
					text: 'Nos dialogues utilisent des tournures de phrases actuelles dans des situations variées. Ils vous aideront à maîtriser la langue parlée par les Russes au quotidien.',
				},
				{
					img: '/culture_ru.jpg',
					title: 'culture & folklore',
					text: "La culture et le folklore changent d'un pays à l'autre et forgent l'identité des peuples. Dans cette section vous en saurez plus sur les particularités de la culture , du folklore et de l'artisanat russe.",
				},
				{
					img: '/tranche-de-vie.jpg',
					title: 'tranches de vie',
					text: 'Vous trouverez ici de courts récits autobiographiques qui vous apprendrons à parler de vous, de votre entourage, de vos goûts et de vos sentiments.',
				},
				{
					img: '/lieux_ru.jpg',
					title: 'beaux endroits',
					text: 'La Russie est un vaste pays qui compte parmi les plus beaux endroits de la planète. Nous vous emmenons pour une visite passionnante qui vous donnera l’occasion de pratiquer la langue tout en vous émerveillant.',
				},
			],
		},
		{
			audio: [
				{
					img: '/dialogue.jpg',
					title: 'dialogues',
					text: 'Nos dialogues utilisent des tournures de phrases actuelles dans des situations variées. Ils vous aideront à maîtriser la langue parlée par les Russes au quotidien.',
				},
				{
					img: '/culture_ru.jpg',
					title: 'culture & folklore',
					text: "La culture et le folklore changent d'un pays à l'autre et forgent l'identité des peuples. Dans cette section vous en saurez plus sur les particularités de la culture , du folklore et de l'artisanat russe.",
				},
				{
					img: '/tranche-de-vie.jpg',
					title: 'tranches de vie',
					text: 'Vous trouverez ici de courts récits autobiographiques qui vous apprendrons à parler de vous, de votre entourage, de vos goûts et de vos sentiments.',
				},
				{
					img: '/lieux_ru.jpg',
					title: 'beaux endroits',
					text: 'La Russie est un vaste pays qui compte parmi les plus beaux endroits de la planète. Nous vous emmenons pour une visite passionnante qui vous donnera l’occasion de pratiquer la langue tout en vous émerveillant.',
				},
			],
		},
	]

	const items = ressources.map(ressource => {
		for (const [key, value] of Object.entries(ressource)) {
			return (
				<>
					<h3>{key}</h3>
					{value.map((item, index) => {
						return (
							<div key={index}>
								<Image
									src={item.img}
									alt={item.title}
									width={155}
									height={155}
								/>
								<p>{item.text}</p>
							</div>
						)
					})}
				</>
			)
		}
	})

	return <div className={styles.container}>{items}</div>
}

export default RessourcesList
