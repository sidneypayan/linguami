const fs = require('fs');

// Toutes les traductions complètes
const translatedDialogues = require('./dialogues-to-translate-backup.json');

// Traductions (je les ajoute manuellement)
const translations = {
  69: {
    title_fr: "Où se trouve la banque ?",
    content_fr: "— Bonjour, mademoiselle, savez-vous où se trouve la banque la plus proche ?\n— Oui, bien sûr. Vous voyez la boulangerie en face ?\n— Oui, je la vois.\n— Allez tout droit dans cette rue, puis tournez à gauche. Là vous verrez un magasin de sport. Continuez à marcher 200 mètres. La banque se trouve là.\n— Merci. Donc je vais tout droit jusqu'à la boulangerie, puis je tourne à droite.\n— Non, vous tournez à gauche.\n— Ah oui, je tourne à gauche et je continue à marcher 200 mètres après le magasin de sport.\n— Oui, c'est ça.\n— Et vous savez où je peux trouver un supermarché ?\n— Il y a un supermarché là-bas, juste à côté de la banque.\n— Très bien, merci beaucoup.\n— De rien, bonne journée.\n— Merci, à vous aussi."
  },
  123: {
    title_fr: "A la banque",
    content_fr: "— Bonjour ! Comment puis-je vous aider ?\n— Je voudrais ouvrir un compte d'épargne. Quel taux d'intérêt proposez-vous ?\n— Le taux dépend des conditions de l'épargne. Le taux le plus élevé est pour un compte qu'on ne peut ni alimenter ni retirer. Un peu moins pour un compte que vous pouvez alimenter, mais dont vous ne pouvez pas retirer d'argent. Le taux le plus bas est pour un compte que vous pouvez alimenter et retirer quand vous en avez besoin. Quelle option vous convient ?\n— Je veux alimenter régulièrement le compte et retirer de l'argent quand j'en ai besoin. Donc, la dernière option.\n— Donc, nous ouvrons le compte \"Confort\". Votre passeport, s'il vous plaît.\n— Tenez.\n— Voici votre contrat, signez ici et ici. Cet exemplaire est pour vous.\n— C'est fait. Et j'aimerais aussi obtenir une carte de crédit. Que pouvez-vous me proposer ?\n— Je peux vous proposer une multicarte avec une limite de crédit de 500 000 roubles. Taux de crédit 20%. Période sans intérêts 50 jours. Il y a aussi un système de Cash Back qui vous rembourse 2% sur tous les achats payés avec la carte.\n— Combien coûte la gestion de la carte ?\n— La gestion est gratuite.\n— Très bien, ça me convient. Faites-la.\n— Signez le contrat ici et ici. Cet exemplaire est pour vous. Puis-je encore vous aider ?\n— Non, merci. Je n'ai besoin de rien d'autre.\n— Au revoir, bonne journée et revenez nous voir.\n— Au revoir."
  },
  124: {
    title_fr: "A la caisse du cinéma",
    content_fr: "— Bonjour, deux billets pour \"Ballerine\" à 12h30.\n— Bonjour, choisissez le rang et les places.\n— Septième rang, places 25 et 26, s'il vous plaît.\n— Ça fait 360 roubles.\n— Tenez, 500.\n— Vous n'auriez pas 10 roubles ?\n— Si, bien sûr, voilà.\n— Merci, votre monnaie, 150 roubles. Vos billets, salle trois, la séance commence à 12h30.\n— Merci. Et dites-moi, où sont les toilettes ?\n— Allez au bout de ce couloir, puis tournez à droite.\n— Merci, au revoir.\n— Au revoir."
  },
  125: {
    title_fr: "Au magasin de chaussures",
    content_fr: "— Bonjour, je peux vous aider ?\n— Bonjour, je voudrais acheter des chaussures d'été.\n— Les chaussures d'été sont au fond du magasin, à droite.\n— Ah, merci, je vois maintenant.\n— Si vous avez besoin d'aide, n'hésitez pas.\n— D'accord.\n— Dites-moi, avez-vous ces sandales blanches en taille 37 ?\n— Non, malheureusement, il ne reste que du 35. Mais il y a le même modèle en bleu clair.\n— Oui, elles sont jolies aussi. J'aimerais les essayer.\n— Vous pouvez vous asseoir ici, je vais vous les apporter.\n— Oui, je les aime bien, et elles sont très confortables.\n— Nous avons une promotion en ce moment, 50% de réduction sur la deuxième paire de chaussures d'été.\n— Merci, avez-vous des chaussures classiques noires ?\n— Oui, il y a ce modèle à talons aiguilles, et celui-ci à petits talons.\n— Oui, j'aime bien celles à petits talons.\n— Tenez, voilà votre taille.\n— Oui, elles vont très bien au pied. Je les prends.\n— Très bien. Si vous voulez regarder un nouveau sac pour aller avec vos nouvelles chaussures, nous avons un rayon sacs là-bas.\n— Oui, merci, je voulais justement demander. Pouvez-vous me montrer ce petit sac noir là-bas ?\n— Bon choix, il va parfaitement avec les chaussures.\n— Oui, je l'aime bien aussi, je le prends. C'est tout ce dont j'avais besoin.\n— Très bien. Passez à la caisse, je vais apporter vos achats.\n— Merci. Combien je vous dois ?\n— Au total, avec la réduction, 7 500 roubles.\n— Tenez.\n— Merci pour votre achat, revenez nous voir.\n— Au revoir.\n— Au revoir."
  }
};

// Appliquer les traductions
translatedDialogues.forEach(dialogue => {
  if (translations[dialogue.original_id]) {
    dialogue.title_fr = translations[dialogue.original_id].title_fr;
    dialogue.content_fr = translations[dialogue.original_id].content_fr;
  }
});

fs.writeFileSync('D:/linguami/scripts/dialogues-to-translate.json', JSON.stringify(translatedDialogues, null, 2));
console.log(`✓ ${Object.keys(translations).length} dialogues traduits écrits dans le fichier`);
