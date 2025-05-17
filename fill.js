// ===== fill.js =====
// Usage: node fill.js "Name" "Initials" "is_minor" "unique_id"

const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

// CLI arguments
const [,, NAME, INITIALS, IS_MINOR, UNIQUE_ID] = process.argv;

if (!NAME || NAME === 'NA' || !INITIALS || INITIALS === 'NA' || !UNIQUE_ID || UNIQUE_ID === 'NA') {
  console.error(`❌ Invalid input: NAME=${NAME}, INITIALS=${INITIALS}, UNIQUE_ID=${UNIQUE_ID}`);
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
    const field = (name) => {
    try {
      return form.getTextField(name);
    } catch {
      console.warn(`⚠️ Missing form field: ${name}`);
      return null;
    }
  };

  field('text_1dphn')?.setText(IS_MINOR === 'true' ? `${NAME} (Minor)` : NAME);
  field('text_2rdqb')?.setText(INITIALS);
  field('text_3vtax')?.setText(WALK_CENTER);
  field('text_4eufu')?.setText(REGION);


    // Flatten field and save
    field.flatten();
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
