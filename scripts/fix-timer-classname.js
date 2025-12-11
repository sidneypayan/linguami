const fs = require('fs');

const filePath = 'C:/Users/Sidney/Documents/linguami/components/flashcards/FlashcardReviewCard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix the empty className for timer
content = content.replace(
  /<span className=\{\}>/g,
  '<span className={`${styles.timerDisplay} ${remainingTime <= 30 ? styles.timerWarning : \'\'}`}>'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed timerDisplay className');
