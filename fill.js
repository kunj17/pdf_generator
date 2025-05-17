// ===== fill.js =====
// Usage: node fill.js "Name" "Initials" "is_minor" "unique_id"

const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

// CLI arguments
const [,, NAME, INITIALS, IS_MINOR, UNIQUE_ID] = process.argv;

if (!NAME || !INITIALS || !UNIQUE_ID) {
  console.error('❌ Missing required arguments');
  process.exit(1);
}

// Constants
const INPUT_PDF_PATH = path.join(__dirname, 'pdf-template', 'Walkathon_fillable.pdf');
const OUTPUT_DIR = path.join(__dirname, 'filled');
const OUTPUT_FILE = path.join(OUTPUT_DIR, `Waiver_${UNIQUE_ID}.pdf`);
const WALK_CENTER = 'Dallas';
const REGION = 'Southwest';

async function run() {
  try {
    // Load input PDF
    const existingPdfBytes = fs.readFileSync(INPUT_PDF_PATH);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    // Fill fields
    form.getTextField('text_1dphn').setText(IS_MINOR === 'true' ? `${NAME} (Minor)` : NAME);
    form.getTextField('text_2rdqb').setText(INITIALS);
    form.getTextField('text_3vtax').setText(WALK_CENTER);
    form.getTextField('text_4eufu').setText(REGION);

    // Flatten form and save
    form.flatten();
    const pdfBytes = await pdfDoc.save();

    // Ensure output folder exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, pdfBytes);
    console.log(`✅ PDF saved to ${OUTPUT_FILE}`);
  } catch (err) {
    console.error(`❌ Error in fill.js: ${err.message}`);
    process.exit(1);
  }
}

run();
