const fs = require('fs');
const path = require('path');

const translations = {
  fr: "Cliquez sur une lettre pour entendre sa prononciation",
  en: "Click on a letter to hear its pronunciation",
  ru: "Нажмите на букву, чтобы услышать её произношение"
};

['fr', 'en', 'ru'].forEach(lang => {
  const filePath = path.join(__dirname, '..', 'messages', `${lang}.json`);

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    // Add translation to lessons section
    if (!data.lessons) {
      data.lessons = {};
    }

    data.lessons.alphabet_click_to_hear = translations[lang];

    // Write back with proper formatting
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

    console.log(`✅ ${lang}.json updated`);
  } catch (error) {
    console.error(`❌ Error updating ${lang}.json:`, error.message);
  }
});

console.log('\n✅ All translation files updated!');
