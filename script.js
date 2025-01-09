const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const { createCanvas } = require('canvas');

async function textToImage(guestName) {
  const canvas = createCanvas(500, 100);
  const ctx = canvas.getContext('2d');

  ctx.font = '30px Noto Serif Gujarati';
  ctx.fillStyle = 'red'; 
  ctx.textBaseline = 'top';
  ctx.fillText(guestName, 0, 0);

  const imageBuffer = canvas.toBuffer('image/png');
  return imageBuffer;
}

async function addImageToPDF(imageBuffer, guestName) {
  try {
    const existingPdfBytes = fs.readFileSync('Binder2.pdf');
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const image = await pdfDoc.embedPng(imageBuffer);

    const pages = pdfDoc.getPages();
    const page = pages[1];

    const imageWidth = 200;
    const imageHeight = 50;
    const xPos = 140; 
    const yPos = 465; 

    page.drawImage(image, {
      x: xPos,
      y: yPos,
      width: imageWidth,
      height: imageHeight,
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(`${guestName}.pdf`, pdfBytes);

  } catch (err) {
    console.error('Error adding image to PDF:', err);
  }
}

let names = ["ભદ્રેશ જાંજમેરા"];

for (let i = 0; i < names.length; i++) {
  textToImage(names[i]).then((imageBuffer) => {
    addImageToPDF(imageBuffer, names[i]);
  });
}
