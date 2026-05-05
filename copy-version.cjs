// Copy version.json to public/version.json after incrementing, so the game can fetch it
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'version.json');
const dest = path.join(__dirname, 'public', 'version.json');

fs.copyFileSync(src, dest);
console.log('Copied version.json to public/version.json');
