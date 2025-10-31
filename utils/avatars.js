// Liste complète des avatars disponibles
export const AVATARS = [
	{
		id: 'avatar1',
		name: 'Nain',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}dwarf_male.png`,
	},
	{
		id: 'avatar2',
		name: 'Naine',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}dwarf_female.png`,
	},
	{
		id: 'avatar3',
		name: 'Elfe',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}elf_male.png`,
	},
	{
		id: 'avatar4',
		name: 'Elfe',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}elf_female.png`,
	},
	{
		id: 'avatar5',
		name: 'Mort-vivant',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}undead_male.png`,
	},
	{
		id: 'avatar6',
		name: 'Morte-vivante',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}undead_female.png`,
	},
	{
		id: 'avatar7',
		name: 'Tauren',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}tauren_female.png`,
	},
	{
		id: 'avatar8',
		name: 'Tauren',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}tauren_male.png`,
	},
	{
		id: 'avatar9',
		name: 'Gnome',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}gnome_male.png`,
	},
	{
		id: 'avatar10',
		name: 'Gnome',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}gnome_female.png`,
	},
	{
		id: 'avatar11',
		name: 'Magicienne',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}wizard_female.png`,
	},
	{
		id: 'avatar12',
		name: 'Magicien',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}wizard_male.png`,
	},
	{
		id: 'avatar13',
		name: 'Orc',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}orc_male.png`,
	},
	{
		id: 'avatar14',
		name: 'Orque',
		url: `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}orc_female.png`,
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
