import { PDFDocument } from 'pdf-lib';

const fileInput = document.getElementById('file-input');
const pdfCanvas = document.getElementById('pdf-canvas');
const ctx = pdfCanvas.getContext('2d');

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);

  const viewport = page.getViewport({ scale: 1.5 });
  pdfCanvas.width = viewport.width;
  pdfCanvas.height = viewport.height;

  const renderContext = {
    canvasContext: ctx,
    viewport: viewport
  };

  await page.render(renderContext).promise;
});
