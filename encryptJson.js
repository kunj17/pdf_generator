// ===== encryptJson.js =====
// Usage: node encryptJson.js

const fs = require('fs');
const path = require('path');

const passphrase = process.env.LEDGER_PASSPHRASE || 'wa1k4th0n_secret_2025';
const inputPath = path.join(__dirname, 'ready', 'pdf_status.json');
const outputPath = path.join(__dirname, 'ready', 'pdf_status.json.enc');

if (!fs.existsSync(inputPath)) {
  console.error('❌ Input file not found:', inputPath);
  process.exit(1);
}

const xorEncrypt = (input, key) => {
  const inputBytes = Buffer.from(input, 'utf8');
  const keyBytes = Buffer.from(key, 'utf8');
  const result = inputBytes.map((byte, i) => byte ^ keyBytes[i % keyBytes.length]);
  return Buffer.from(result).toString('base64');
};

try {
  const json = fs.readFileSync(inputPath, 'utf8');
  const encrypted = xorEncrypt(json, passphrase);
  fs.writeFileSync(outputPath, encrypted, 'utf8');
  console.log(`🔐 Encrypted to: ${outputPath}`);
} catch (err) {
  console.error('❌ Encryption failed:', err.message);
  process.exit(1);
}
