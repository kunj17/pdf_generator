const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function run() {
  const inputPath = './pdf-template/Walkathon_fillable.pdf';
  const name = process.env.NAME || 'Placeholder';
  const initials = process.env.INITIALS || 'XX';
  const isMinor = process.env.IS_MINOR === 'true';
  const uniqueId = process.env.UNIQUE_ID || Date.now().toString();
  const outputPath = `./filled/Waiver_${uniqueId}.pdf`;

  const existingPdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();

  form.getTextField('text_1dphn').setText(isMinor ? `${name} (Minor)` : name);
  form.getTextField('text_2rdqb').setText(initials);
  form.getTextField('text_3vtax').setText('Dallas');
  form.getTextField('text_4eufu').setText('Southwest');

  form.flatten();
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  console.log(`✅ PDF saved: ${outputPath}`);
}

run();
