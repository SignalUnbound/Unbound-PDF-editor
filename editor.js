const uploadInput = document.getElementById('pdf-upload');
const textInput = document.getElementById('text-input');
const addTextBtn = document.getElementById('add-text-btn');
const downloadBtn = document.getElementById('download-btn');
const controls = document.getElementById('editor-controls');
const canvas = document.getElementById('pdf-canvas');

let pdfDoc = null;
let pdfBytes = null;
let page = null;

uploadInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const arrayBuffer = await file.arrayBuffer();
  pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
  page = pdfDoc.getPages()[0];
  controls.hidden = false;

  renderPlaceholder();
});

addTextBtn.addEventListener('click', async () => {
  const text = textInput.value.trim();
  if (!text || !pdfDoc || !page) return;

  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

  page.drawText(text, {
    x: 50,
    y: height - 100,
    size: 24,
    font,
    color: PDFLib.rgb(0, 0, 0)
  });

  renderPlaceholder();
});

downloadBtn.addEventListener('click', async () => {
  if (!pdfDoc) return;
  const modifiedBytes = await pdfDoc.save();
  const blob = new Blob([modifiedBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'edited.pdf';
  link.click();
});

function renderPlaceholder() {
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  canvas.width = 400;
  canvas.height = 100;
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#333';
  ctx.font = '20px sans-serif';
  ctx.fillText('PDF loaded. Ready to add text.', 10, 50);
}

