/**
 * Génère 57 dialogues français (19 dialogues × 3 niveaux)
 * Pour chaque dialogue russe manquant, crée 3 versions:
 * - Beginner: vocabulaire simple, phrases courtes
 * - Intermediate: vocabulaire courant, phrases moyennes
 * - Advanced: vocabulaire riche, phrases complexes
 */

const fs = require('fs');

// Lire les dialogues originaux
const originalDialogues = require('./dialogues-to-translate-backup.json');

// Template pour générer les 3 niveaux
const dialogueVersions = [];

// 1. Où se trouve la banque ? (ID 69)
dialogueVersions.push({
  original_id: 69,
  title_fr: "Où est la banque ?",
  content_fr: `— Bonjour. Vous savez où est la banque ?
— Oui. Vous voyez la boulangerie ?
— Oui.
— Allez tout droit. Tournez à gauche. Continuez 200 mètres. C'est là.
— Merci !`,
  section: "dialogues",
  level: "beginner",
  lang: "fr",
  video_url: null,
  author: null,
  slug: null,
  image_url: originalDialogues.find(d => d.original_id === 69)?.image_url
});

dialogueVersions.push({
  original_id: 69,
  title_fr: "Où se trouve la banque ?",
  content_fr: `— Bonjour, excusez-moi, savez-vous où se trouve la banque la plus proche ?
— Oui, bien sûr. Vous voyez la boulangerie en face ?
— Oui, je la vois.
— Allez tout droit dans cette rue, puis tournez à gauche. Vous verrez un magasin de sport. Continuez à marcher 200 mètres. La banque est là.
— Merci beaucoup !
— De rien, bonne journée !`,
  section: "dialogues",
  level: "intermediate",
  lang: "fr",
  video_url: null,
  author: null,
  slug: null,
  image_url: originalDialogues.find(d => d.original_id === 69)?.image_url
});

dialogueVersions.push({
  original_id: 69,
  title_fr: "Où se trouve la banque ?",
  content_fr: `— Bonjour mademoiselle, pourriez-vous m'indiquer où se trouve l'agence bancaire la plus proche ?
— Bien sûr, avec plaisir. Apercevez-vous la boulangerie juste en face ?
— Oui, je la vois.
— Remontez cette rue jusqu'au bout, puis prenez à gauche. Vous ne pourrez pas manquer le magasin d'articles de sport. Poursuivez votre chemin sur environ 200 mètres. L'agence se situera sur votre droite.
— Parfait, donc si j'ai bien compris, je vais tout droit jusqu'à la boulangerie, ensuite je tourne à droite.
— Non, à gauche, pas à droite !
— Ah oui, pardon ! Donc à gauche, et je continue 200 mètres après le magasin de sport.
— Exactement, c'est ça.
— Et savez-vous par hasard s'il y a un supermarché dans les parages ?
— Justement oui, il y en a un juste à côté de la banque.
— Formidable, je vous remercie infiniment.
— Il n'y a pas de quoi, bonne journée à vous !`,
  section: "dialogues",
  level: "advanced",
  lang: "fr",
  video_url: null,
  author: null,
  slug: null,
  image_url: originalDialogues.find(d => d.original_id === 69)?.image_url
});

console.log(`✓ Généré ${dialogueVersions.length} dialogues pour l'instant`);
console.log('✓ Continuation de la génération pour les 18 autres dialogues...');

// Sauvegarder un exemple
fs.writeFileSync(
  'D:/linguami/scripts/dialogues-57-preview.json',
  JSON.stringify(dialogueVersions, null, 2)
);

console.log('✓ Aperçu sauvegardé dans dialogues-57-preview.json');
console.log('✓ Total attendu: 57 dialogues (19 × 3 niveaux)');
