const fs = require('fs');

const translations = {
  fr: {
    admin_only_error: "Cette section est réservée aux administrateurs uniquement.",
    vip_only_error: "Cette section est réservée aux membres VIP et administrateurs."
  },
  en: {
    admin_only_error: "This section is reserved for administrators only.",
    vip_only_error: "This section is reserved for VIP members and administrators."
  },
  ru: {
    admin_only_error: "Этот раздел доступен только администраторам.",
    vip_only_error: "Этот раздел доступен только VIP-членам и администраторам."
  }
};

['fr', 'en', 'ru'].forEach(lang => {
  const filePath = `C:/Users/Sidney/Documents/linguami/messages/${lang}.json`;
  let content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);

  // Add error messages to home section
  if (data.home) {
    data.home.admin_only_error = translations[lang].admin_only_error;
    data.home.vip_only_error = translations[lang].vip_only_error;
  }

  // Write back with proper formatting
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`✅ Added access error translations to ${lang}.json`);
});

console.log('✅ All translations added successfully');
