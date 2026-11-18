const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Remove type="module" from script tag
html = html.replace(
  '<script type="module" crossorigin src="/assets/',
  '<script crossorigin src="/assets/'
);

fs.writeFileSync(htmlPath, html);
console.log('Fixed index.html - removed type="module"');
