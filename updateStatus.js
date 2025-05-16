// ===== updateStatus.js =====
// Usage: node updateStatus.js <familyId> <uniqueId> <name>

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const familyId = args[0];
const uniqueId = args[1];
const name = args[2];

const ledgerPath = path.join(__dirname, 'ready', 'pdf_status.json');
const pdfFile = `Waiver_${uniqueId}.pdf`;

let data = {};

try {
  if (fs.existsSync(ledgerPath)) {
    const content = fs.readFileSync(ledgerPath, 'utf-8');
    data = JSON.parse(content);
  } else {
    data = { families: {} };
  }
} catch (err) {
  console.error("Failed to read existing ledger", err);
  process.exit(1);
}

if (!data.families[familyId]) {
  data.families[familyId] = {
    parent_email: null, // Optional: can be filled in another pass
    members: [],
    emailed: false
  };
}

const members = data.families[familyId].members;

// Check if already exists
const existing = members.find(m => m.pdf === pdfFile);
if (!existing) {
  members.push({ name, pdf: pdfFile, status: 'ready' });
} else {
  existing.status = 'ready';
}

fs.writeFileSync(ledgerPath, JSON.stringify(data, null, 2));
console.log(`✅ Updated ledger with ${pdfFile}`);
