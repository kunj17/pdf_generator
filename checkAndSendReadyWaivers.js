const GITHUB_LEDGER_URL = 'https://raw.githubusercontent.com/YOUR_USER/YOUR_REPO/main/ready/pdf_status.json.enc';
const GITHUB_FILLED_BASE = 'https://raw.githubusercontent.com/YOUR_USER/YOUR_REPO/main/filled/';
const DECRYPT_WEBHOOK_URL = 'https://your-webhook-url.com/decrypt'; // Replace with your real endpoint
const LEDGER_PASSPHRASE = 'YOUR_LEDGER_PASSPHRASE'; // Store securely using PropertiesService

function checkAndSendReadyWaivers() {
  try {
    const encryptedBlob = UrlFetchApp.fetch(GITHUB_LEDGER_URL).getBlob();
    const decrypted = callDecryptionWebhook(encryptedBlob);
    const ledger = JSON.parse(decrypted);

    for (const [familyId, entry] of Object.entries(ledger.families)) {
      if (entry.emailed) continue;
      if (!entry.parent_email) continue;

      const allReady = entry.members.every(m => m.status === 'ready');
      if (!allReady) continue;

      const pdfs = entry.members.map(m => {
        const url = GITHUB_FILLED_BASE + encodeURIComponent(m.pdf);
        return UrlFetchApp.fetch(url).getBlob().setName(m.pdf);
      });

      MailApp.sendEmail({
        to: entry.parent_email,
        subject: 'Your Walkathon Waiver Forms',
        body: `Dear Participant,\n\nAttached are all the completed waiver forms for your family.\n\nThank you!`,
        attachments: pdfs
      });

      Logger.log(`✅ Emailed: ${entry.parent_email}`);
    }
  } catch (err) {
    Logger.log('❌ Failed to process waiver email check: ' + err.message);
  }
}

function callDecryptionWebhook(blob) {
  const response = UrlFetchApp.fetch(DECRYPT_WEBHOOK_URL, {
    method: 'POST',
    contentType: 'application/octet-stream',
    headers: {
      'X-Passphrase': LEDGER_PASSPHRASE
    },
    payload: blob.getBytes(),
    muteHttpExceptions: true
  });

  if (response.getResponseCode() !== 200) {
    throw new Error(`Decryption failed: ${response.getContentText()}`);
  }

  return response.getContentText(); // decrypted JSON string
}
