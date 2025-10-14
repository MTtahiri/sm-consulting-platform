// pages/api/cv/generate-pdf.js
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import Airtable from 'airtable';

function wrapText(text, font, fontSize, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = font.widthOfTextAtSize(currentLine + ' ' + word, fontSize);
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { candidateId } = req.body;

    // Récupération des données Airtable
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.AIRTABLE_BASE_ID);

    const record = await base('Table 1').find(candidateId);
    const fields = record.fields;

    const cvData = {
      candidateNumber: 'Candidat #' + record.id.slice(-3).toUpperCase(),
      titre: fields.poste || 'Consultant SM Consulting',
      competences: fields.competences ? fields.competences.split(',').map(c => c.trim()) : ['Compétences à définir'],
      experience: fields.experience_detail || 'Expérience non précisée',
      formations: fields.formations || 'Formation non précisée',
      langues: fields.langues || 'Français',
      description: fields.description || 'Consultant expérimenté disponible pour vos missions.',
      projets: fields.projets || 'Projets non précisés',
      certifications: fields.certifications ? fields.certifications.split(',').map(c => c.trim()) : [],
      localisation: 'Île-de-France',
      disponibilite: fields.statut === 'Nouveau' ? 'Disponible immédiatement' : (fields.statut || 'Disponible')
    };

    // Création du PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Polices
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Couleurs SM Consulting
    const primaryColor = rgb(0.1, 0.3, 0.6); // Bleu SM Consulting
    const secondaryColor = rgb(0.7, 0.7, 0.7); // Gris

    let yPosition = height - 50;

    // En-tête SM Consulting
    page.drawText('SM CONSULTING', {
      x: 50,
      y: yPosition,
      font: fontBold,
      size: 20,
      color: primaryColor
    });
    yPosition -= 25;

    // Numéro candidat
    page.drawText(cvData.candidateNumber, {
      x: 50,
      y: yPosition,
      font: font,
      size: 12,
      color: secondaryColor
    });
    yPosition -= 40;

    // Ligne de séparation
    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 2,
      color: primaryColor
    });
    yPosition -= 40;

    // Titre du poste
    page.drawText(cvData.titre.toUpperCase(), {
      x: 50,
      y: yPosition,
      font: fontBold,
      size: 16,
      color: rgb(0, 0, 0)
    });
    yPosition -= 25;

    // Localisation et disponibilité
    page.drawText('📍 ' + cvData.localisation + ' | 🚀 ' + cvData.disponibilite, {
      x: 50,
      y: yPosition,
      font: font,
      size: 10,
      color: secondaryColor
    });
    yPosition -= 40;

    // Section Résumé Professionnel
    page.drawText('RÉSUMÉ PROFESSIONNEL', {
      x: 50,
      y: yPosition,
      font: fontBold,
      size: 12,
      color: primaryColor
    });
    yPosition -= 20;

    const descriptionLines = wrapText(cvData.description, font, 10, width - 100);
    descriptionLines.forEach(line => {
      if (yPosition > 50) {
        page.drawText(line, { x: 50, y: yPosition, font: font, size: 10, color: rgb(0, 0, 0) });
        yPosition -= 15;
      }
    });
    yPosition -= 20;

    // Section Compétences Techniques
    page.drawText('COMPÉTENCES TECHNIQUES', {
      x: 50,
      y: yPosition,
      font: fontBold,
      size: 12,
      color: primaryColor
    });
    yPosition -= 20;

    cvData.competences.forEach(competence => {
      if (yPosition > 50) {
        page.drawText('• ' + competence, { x: 60, y: yPosition, font: font, size: 10, color: rgb(0, 0, 0) });
        yPosition -= 15;
      }
    });
    yPosition -= 20;

    // Section Expérience
    page.drawText('EXPÉRIENCE PROFESSIONNELLE', {
      x: 50,
      y: yPosition,
      font: fontBold,
      size: 12,
      color: primaryColor
    });
    yPosition -= 20;

    const experienceLines = wrapText(cvData.experience, font, 10, width - 100);
    experienceLines.forEach(line => {
      if (yPosition > 50) {
        page.drawText(line, { x: 50, y: yPosition, font: font, size: 10, color: rgb(0, 0, 0) });
        yPosition -= 15;
      }
    });
    yPosition -= 20;

    // Pied de page
    page.drawText('CV généré par SM Consulting - www.smconsulting.com', {
      x: 50,
      y: 30,
      font: font,
      size: 8,
      color: secondaryColor
    });

    // Génération du PDF
    const pdfBytes = await pdfDoc.save();

    // Retour en base64 pour téléchargement
    const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      success: true,
      pdf: pdfBase64,
      filename: 'CV_' + cvData.candidateNumber.replace(' ', '_') + '_SM_Consulting.pdf',
      message: 'PDF généré avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur génération PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la génération du PDF'
    });
  }
}
