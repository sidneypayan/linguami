import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env.local first, then .env as fallback
dotenv.config({ path: join(__dirname, '..', '.env.local') })
dotenv.config({ path: join(__dirname, '..', '.env') })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createTestBlogPost() {
	console.log('Creating test blog post...')

	const content = `
Le russe est une langue fascinante qui ouvre les portes vers une riche culture et une histoire millénaire. Si vous envisagez d'apprendre le russe, voici quelques raisons convaincantes de vous lancer dans cette aventure linguistique.

## Une langue parlée par des millions

Le russe est la langue maternelle de plus de 150 millions de personnes et la langue seconde de 110 millions supplémentaires. C'est l'une des langues les plus parlées au monde, ce qui en fait un atout précieux pour les affaires, les voyages et les relations internationales.

## Un alphabet unique

L'alphabet cyrillique peut sembler intimidant au début, mais c'est en réalité l'un des aspects les plus gratifiants de l'apprentissage du russe. Une fois maîtrisé, il devient un outil puissant qui vous permettra de lire et d'écrire dans plusieurs langues slaves.

### Les avantages de l'alphabet cyrillique

- **Phonétique**: Contrairement au français ou à l'anglais, le russe est largement phonétique
- **Logique**: Chaque lettre a généralement un son unique
- **Esthétique**: L'écriture cyrillique manuscrite est élégante et artistique

## Une littérature exceptionnelle

La littérature russe est l'une des plus riches au monde. En apprenant le russe, vous pourrez lire dans leur langue originale :

- **Dostoïevski** - Crime et Châtiment, Les Frères Karamazov
- **Tolstoï** - Guerre et Paix, Anna Karénine
- **Tchekhov** - La Dame au petit chien, La Cerisaie
- **Pouchkine** - Eugène Onéguine

\`\`\`javascript
// Le russe dans le code
const greeting = "Привет, мир!" // "Hello, World!"
console.log(greeting)
\`\`\`

## Des opportunités professionnelles

Maîtriser le russe peut ouvrir de nombreuses portes professionnelles :

1. **Commerce international** - La Russie est un partenaire économique majeur
2. **Diplomatie** - Le russe est l'une des six langues officielles de l'ONU
3. **Technologie** - De nombreux développeurs russes excellent dans l'informatique
4. **Traduction** - Une forte demande pour les traducteurs français-russe

> "Apprendre une nouvelle langue, c'est avoir une nouvelle âme." - Proverbe tchèque

## La grammaire russe : un défi stimulant

Certes, la grammaire russe est réputée difficile avec ses six cas grammaticaux, mais c'est précisément ce qui la rend si logique et précise. Une fois les règles comprises, vous pourrez exprimer des nuances subtiles impossibles à traduire directement en français.

## Comment commencer ?

Voici quelques conseils pour démarrer votre apprentissage du russe :

- Commencez par maîtriser l'alphabet cyrillique (1-2 semaines suffisent)
- Apprenez les phrases de base pour la conversation quotidienne
- Immergez-vous dans la musique et les films russes
- Pratiquez régulièrement, même 15 minutes par jour
- Trouvez un partenaire d'échange linguistique

## Conclusion

Apprendre le russe est un voyage enrichissant qui demande du temps et de la persévérance, mais les récompenses sont immenses. Que ce soit pour le plaisir, la culture ou votre carrière, le russe est une langue qui vaut définitivement l'investissement.

Alors, êtes-vous prêt à relever le défi ?
`

	const postData = {
		title: '5 raisons d\'apprendre le russe en 2025',
		slug: '5-raisons-apprendre-russe-2025',
		excerpt: 'Découvrez pourquoi le russe est une langue fascinante à apprendre et comment elle peut enrichir votre vie personnelle et professionnelle.',
		content: content.trim(),
		lang: 'fr',
		img: 'https://linguami-cdn.etreailleurs.workers.dev/images/materials/moscow-red-square.jpg',
		meta_description: 'Découvrez 5 raisons convaincantes d\'apprendre le russe : une langue parlée par des millions, un alphabet unique, une littérature exceptionnelle et de nombreuses opportunités professionnelles.',
		meta_keywords: ['apprendre le russe', 'langue russe', 'alphabet cyrillique', 'littérature russe', 'carrière internationale'],
		is_published: true,
		published_at: new Date().toISOString(),
		author_id: '00000000-0000-0000-0000-000000000000', // Placeholder, will need to update with real admin ID
	}

	try {
		// First, check if we have an admin user
		const { data: adminUser } = await supabase
			.from('users_profile')
			.select('id')
			.eq('role', 'admin')
			.limit(1)
			.single()

		if (adminUser) {
			postData.author_id = adminUser.id
		}

		const { data, error } = await supabase
			.from('blog_posts')
			.insert([postData])
			.select()
			.single()

		if (error) {
			console.error('Error creating blog post:', error)
			return
		}

		console.log('✅ Test blog post created successfully!')
		console.log(`   ID: ${data.id}`)
		console.log(`   Title: ${data.title}`)
		console.log(`   Slug: ${data.slug}`)
		console.log(`   URL: /fr/blog/${data.slug}`)
		console.log('\nYou can now test the blog post page!')
	} catch (error) {
		console.error('Error:', error)
	}
}

createTestBlogPost()
