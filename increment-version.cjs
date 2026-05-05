// increment-version.js
// Increments the iteration in version.json, resets if revision/implementation changes
const fs = require('fs');
const path = require('path');

const versionPath = path.join(__dirname, 'version.json');
let version = JSON.parse(fs.readFileSync(versionPath, 'utf8'));

// Store previous version for comparison (optional, could be enhanced)
const prevPath = path.join(__dirname, 'version.prev.json');
let prev = null;
if (fs.existsSync(prevPath)) {
  prev = JSON.parse(fs.readFileSync(prevPath, 'utf8'));
}

// If revision or implementation changed, reset iteration
if (prev && (prev.revision !== version.revision || prev.implementation !== version.implementation)) {
  version.iteration = 1;
} else {
  version.iteration = (version.iteration || 0) + 1;
}

// Save current as previous for next run
fs.writeFileSync(prevPath, JSON.stringify(version, null, 2));
// Save updated version
fs.writeFileSync(versionPath, JSON.stringify(version, null, 2));

// Print version string for logging
const versionString = `${version.stage}.${version.revision}.${version.implementation}_${String(version.iteration).padStart(3, '0')}`;
console.log('Current Version:', versionString);
