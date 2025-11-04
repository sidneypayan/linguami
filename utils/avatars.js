// Numéro de version pour forcer le rechargement des avatars (incrémenter quand les images changent)
const AVATAR_VERSION = '2'

// Liste complète des avatars disponibles
export const AVATARS = [
	{
		id: 'avatar1',
		name: 'Nain',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}dwarf_male.webp?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar2',
		name: 'Naine',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}dwarf_female.webp?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar3',
		name: 'Elfe',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}elf_male.webp?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar4',
		name: 'Elfe',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}elf_female.webp?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar5',
		name: 'Mort-vivant',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}undead_male.webp?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar6',
		name: 'Morte-vivante',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}undead_female.webp?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar7',
		name: 'Tauren',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}tauren_female.webp?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar8',
		name: 'Tauren',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}tauren_male.webp?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar9',
		name: 'Gnome',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}gnome_male.webp?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar10',
		name: 'Gnome',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}gnome_female.webp?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar11',
		name: 'Magicienne',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}wizard_female.webp?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar12',
		name: 'Magicien',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}wizard_male.webp?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar13',
		name: 'Orc',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}orc_male.webp?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar14',
		name: 'Orque',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}orc_female.webp?v=${AVATAR_VERSION}`,
	},
]

// Fonction helper pour obtenir l'URL d'un avatar par son ID
export const getAvatarUrl = avatarId => {
	const avatar = AVATARS.find(a => a.id === avatarId)
	return avatar ? avatar.url : null
}

// Fonction helper pour obtenir la couleur de bordure d'un avatar
export const getAvatarBorderColor = avatarId => {
	const colorMap = {
		avatar1: '#f97316', // Orange pour nain
		avatar2: '#ea580c', // Orange foncé pour naine
		avatar3: '#3b82f6', // Bleu pour elfe mâle
		avatar4: '#2563eb', // Bleu foncé pour elfe femelle
		avatar5: '#6b7280', // Gris pour mort-vivant
		avatar6: '#4b5563', // Gris foncé pour morte-vivante
		avatar7: '#f59e0b', // Ambre pour tauren femelle
		avatar8: '#d97706', // Ambre foncé pour tauren mâle
		avatar9: '#ec4899', // Rose pour gnome mâle
		avatar10: '#db2777', // Rose foncé pour gnome femelle
		avatar11: '#8b5cf6', // Violet pour magicienne
		avatar12: '#7c3aed', // Violet foncé pour magicien
		avatar13: '#10b981', // Vert pour orc mâle
		avatar14: '#059669', // Vert foncé pour orc femelle
	}
	return colorMap[avatarId] || '#8b5cf6'
}
