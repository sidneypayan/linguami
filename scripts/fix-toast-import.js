const fs = require('fs');

const homepagePath = 'C:/Users/Sidney/Documents/linguami/components/homepage/index.js';
let content = fs.readFileSync(homepagePath, 'utf8');

// Replace react-toastify import with custom toast utility
content = content.replace(
  /import { toast } from 'react-toastify'/,
  "import toast from '@/utils/toast'"
);

fs.writeFileSync(homepagePath, content, 'utf8');
console.log('✅ Fixed toast import to use custom toast utility');
