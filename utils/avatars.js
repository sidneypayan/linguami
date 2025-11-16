import { getUIImageUrl } from './mediaUrls'

// Numéro de version pour forcer le rechargement des avatars (incrémenter quand les images changent)
const AVATAR_VERSION = '3'

// Liste complète des avatars disponibles
// Note: les noms sont des clés de traduction (voir messages/*.json, namespace "register")
export const AVATARS = [
	{
		id: 'avatar1',
		nameKey: 'avatarDwarfMale',
		url: `${getUIImageUrl('dwarf_male.webp')}?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar2',
		nameKey: 'avatarDwarfFemale',
		url: `${getUIImageUrl('dwarf_female.webp')}?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar3',
		nameKey: 'avatarElfMale',
		url: `${getUIImageUrl('elf_male.webp')}?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar4',
		nameKey: 'avatarElfFemale',
		url: `${getUIImageUrl('elf_female.webp')}?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar5',
		nameKey: 'avatarUndeadMale',
		url: `${getUIImageUrl('undead_male.webp')}?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar6',
		nameKey: 'avatarUndeadFemale',
		url: `${getUIImageUrl('undead_female.webp')}?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar7',
		nameKey: 'avatarTaurenFemale',
		url: `${getUIImageUrl('tauren_female.webp')}?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar8',
		nameKey: 'avatarTaurenMale',
		url: `${getUIImageUrl('tauren_male.webp')}?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar9',
		nameKey: 'avatarGnomeMale',
		url: `${getUIImageUrl('gnome_male.webp')}?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar10',
		nameKey: 'avatarGnomeFemale',
		url: `${getUIImageUrl('gnome_female.webp')}?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar11',
		nameKey: 'avatarHumanFemale',
		url: `${getUIImageUrl('human_female.webp')}?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar12',
		nameKey: 'avatarHumanMale',
		url: `${getUIImageUrl('human_male.webp')}?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar13',
		nameKey: 'avatarOrcMale',
		url: `${getUIImageUrl('orc_male.webp')}?v=${AVATAR_VERSION}`,
	},
	{
		id: 'avatar14',
		nameKey: 'avatarOrcFemale',
		url: `${getUIImageUrl('orc_female.webp')}?v=${AVATAR_VERSION}`,
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
		avatar11: '#8b5cf6', // Violet pour humaine
		avatar12: '#7c3aed', // Violet foncé pour humain
		avatar13: '#10b981', // Vert pour orc mâle
		avatar14: '#059669', // Vert foncé pour orc femelle
	}
	return colorMap[avatarId] || '#8b5cf6'
}
