import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default async function handler(req, res) {
  try {
    // Récupérer les données depuis la requête POST (body JSON)
    const consultant = req.body;

    if (!consultant) {
      return res.status(400).json({ error: 'Aucune donnée consultant fournie' });
    }

    const pdfBytes = await generateCvPdf(consultant);

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=CV_${consultant.titre || 'consultant'}.pdf`,
      'Content-Length': pdfBytes.length,
    });
    res.end(Buffer.from(pdfBytes));

  } catch (error) {
    console.error('Erreur génération PDF:', error);
    res.status(500).json({ error: 'Erreur interne serveur' });
  }
}

async function generateCvPdf(consultant) {
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([595, 842]); // format A4

  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const blueColor = rgb(0.1, 0.4, 0.7);

  let y = height - 50;

  page.drawText('SMConsulting', {
    x: 50,
    y,
    size: 24,
    font: fontBold,
    color: blueColor,
  });

  y -= 30;

  page.drawText(`Poste cible : ${consultant.titre || 'Consultant Anonyme'}`, {
    x: 50,
    y,
    size: 14,
    font,
  });

  y -= 20;

  page.drawText(`Expérience : ${consultant.annees_experience || ''} ans`, {
    x: 50,
    y,
    size: 12,
    font
  });

  y -= 20;

  page.drawText(`Disponibilité : ${consultant.disponibilite || 'Immédiate'}`, {
    x: 50,
    y,
    size: 12,
    font
  });

  y -= 40;

  page.drawText('Compétences principales :', {
    x: 50,
    y,
    size: 14,
    font: fontBold,
    color: blueColor,
  });

  y -= 20;

  const competences = consultant.competences
    ? consultant.competences.split(',').map(s => s.trim())
    : [];

  const lineHeight = 15;
  competences.forEach(comp => {
    if (comp && y > 40) { // gérer page break si nécessaire (simplifié ici)
      page.drawText(`• ${comp}`, { x: 60, y, size: 12, font });
      y -= lineHeight;
    }
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
