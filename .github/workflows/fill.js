// ===== fill.js =====
// Usage: node fill.js <name> <initials> <isMinor> <uniqueId>

const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

async function run() {
  const [nameArg, initialsArg, isMinorArg, uniqueId] = process.argv.slice(2);

  const name = nameArg || 'John Doe';
  const initials = initialsArg || 'JD';
  const isMinor = isMinorArg === 'true';
  const outputFileName = `Waiver_${uniqueId}.pdf`;

  const inputPath = path.join(__dirname, 'pdf-template', 'Walkathon_fillable.pdf');
  const outputPath = path.join(__dirname, 'filled', outputFileName);

  if (!fs.existsSync(inputPath)) {
    console.error('❌ Template PDF not found:', inputPath);
    process.exit(1);
  }

  const existingPdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();

  // Fill fields
  const fullName = isMinor ? `${name} (Minor)` : name;
  form.getTextField('text_1dphn').setText(fullName);
  form.getTextField('text_2rdqb').setText(initials);
  form.getTextField('text_3vtax').setText('Dallas');
  form.getTextField('text_4eufu').setText('Southwest');

  form.flatten(); // lock fields

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`✅ PDF generated: ${outputPath}`);
}

run();
