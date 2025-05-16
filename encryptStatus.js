// ===== encryptStatus.js =====
// Usage: node encryptStatus.js <passphrase>

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const passphrase = process.argv[2];
if (!passphrase) {
  console.error('❌ Please provide the passphrase as the first argument.');
  process.exit(1);
}

const inputFile = path.join(__dirname, 'ready', 'pdf_status.json');
const outputFile = path.join(__dirname, 'ready', 'pdf_status.json.enc');

if (!fs.existsSync(inputFile)) {
  console.error(`❌ File not found: ${inputFile}`);
  process.exit(1);
}

try {
  execSync(`gpg --batch --yes --passphrase ${passphrase} --symmetric --cipher-algo AES256 --output ${outputFile} ${inputFile}`);
  console.log(`🔐 Encrypted ledger saved to ${outputFile}`);
} catch (err) {
  console.error('❌ GPG encryption failed:', err.message);
  process.exit(1);
}
