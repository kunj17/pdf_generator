// // ===== updateStatus.js =====
// // Usage: node updateStatus.js <familyId> <uniqueId> <name>

// const fs = require('fs');
// const path = require('path');
// const crypto = require('crypto');

// const args = process.argv.slice(2);
// const familyId = args[0];
// const uniqueId = args[1];
// const name = args[2];
// const parentEmail = process.env.PARENT_EMAIL || null;

// const ledgerPath = path.join(__dirname, 'ready', 'pdf_status.json');
// const pdfFile = `Waiver_${uniqueId}.pdf`;

// let data = {};

// try {
//   if (fs.existsSync(ledgerPath)) {
//     const content = fs.readFileSync(ledgerPath, 'utf-8');
//     data = JSON.parse(content);
//   } else {
//     data = { families: {} };
//   }
// } catch (err) {
//   console.error("Failed to read existing ledger", err);
//   process.exit(1);
// }

// // Initialize family block if missing
// if (!data.families[familyId]) {
//   data.families[familyId] = {
//     parent_email: parentEmail,
//     members: [],
//     emailed: false,
//     last_sent_fingerprint: null
//   };
// } else if (!data.families[familyId].parent_email && parentEmail) {
//   data.families[familyId].parent_email = parentEmail;
// }

// const family = data.families[familyId];
// const members = family.members;

// // Update or insert member
// const existing = members.find(m => m.pdf === pdfFile);
// if (!existing) {
//   members.push({ name, pdf: pdfFile, status: 'ready' });
// } else {
//   existing.status = 'ready';
// }

// // Compute new fingerprint based on current state
// function computeFingerprint(email, members) {
//   const key = email + '|' + members.map(m => m.name).sort().join('|');
//   return crypto.createHash('md5').update(key).digest('hex');
// }

// const newFingerprint = computeFingerprint(family.parent_email, members);

// // Check if fingerprint changed
// if (family.last_sent_fingerprint !== newFingerprint) {
//   console.log(`🆕 Fingerprint changed. Marking ${familyId} for re-email.`);
//   family.emailed = false;
//   family.last_sent_fingerprint = newFingerprint;
// } else {
//   console.log(`➖ No fingerprint change. ${familyId} remains emailed=${family.emailed}`);
// }

// // Write final result
// fs.writeFileSync(ledgerPath, JSON.stringify(data, null, 2));
// console.log(`✅ Updated ledger with ${pdfFile}`);




// ===== updateQueueStatus.js =====
// Usage: node updateQueueStatus.js <familyId> <parentEmail> '<memberJsonArrayString>'

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const familyId = args[0];
const parentEmail = args[1];
const memberJsonString = args[2];

const members = JSON.parse(memberJsonString);
const now = new Date().toISOString();

const queuePath = path.join(__dirname, 'queue', 'ready_to_email.json');

// Load queue
let data = { families: {} };
if (fs.existsSync(queuePath)) {
  try {
    data = JSON.parse(fs.readFileSync(queuePath, 'utf-8'));
  } catch (e) {
    console.error("❌ Could not parse queue file.");
    process.exit(1);
  }
}

// Add or update entry
data.families[familyId] = {
  parent_email: parentEmail,
  members,
  timestamp: now
};

// Save file
fs.writeFileSync(queuePath, JSON.stringify(data, null, 2));
console.log(`✅ Added/updated ${familyId} in ready_to_email.json`);
