const fs = require('fs');
const path = './public/assets/index-Dqw2FXdk.js';

let content = fs.readFileSync(path, 'utf8');

// 1. Force mobile DPR to 0.75
content = content.replace(/const dpr = window\.devicePixelRatio/g, 'const dpr = env.phone ? 0.75 : window.devicePixelRatio');

// 2. Disable texture resolution reduction by making replace a no-op
// We use a valid assignment expression 'ne[_] = ne[_]' to avoid breaking minified comma-separated sequences
content = content.replace(/ne\[_\] = ne\[_\]\.replace\("textures-o", `textures-\${textureScale}`\)/g, 'ne[_] = ne[_]');
content = content.replace(/ne\[_\] = ne\[_\]\.replace\("spritesheets-o", `spritesheets-\${textureScale}`\)/g, 'ne[_] = ne[_]');

// Handle the $1 variant if it exists
content = content.replace(/ne\[_\] = ne\[_\]\.replace\("textures-o", `textures-\${textureScale\$1}`\)/g, 'ne[_] = ne[_]');
content = content.replace(/ne\[_\] = ne\[_\]\.replace\("spritesheets-o", `textures-\${textureScale\$1}`\)/g, 'ne[_] = ne[_]');

// 3. Exclude ending.mp4 on mobile
content = content.replace(/v_ending: "(\/assets\/videos\/ending\.mp4)"/g,
    'v_ending: env.phone ? "" : "$1"');

fs.writeFileSync(path, content);
console.log('SUCCESS: Applied expression-safe Lo-Fi overrides.');
