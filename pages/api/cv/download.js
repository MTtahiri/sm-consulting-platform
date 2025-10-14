// pages/api/cv/download.js
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import Airtable from 'airtable';

// Fonction pour nettoyer le texte des caractères non supportés
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\n/g, ' ') // Remplace les sauts de ligne par des espaces
    .replace(/\r/g, ' ') // Remplace les retours chariot
    .replace(/[→⬤●•★☆♥♦♣♠♪♫☀☁☂☃☄]/g, '-') // Remplace les caractères spéciaux
    .replace(/[”“„«»]/g, '"') // Remplace les guillemets spéciaux
    .replace(/[‘’´`]/g, "'") // Remplace les apostrophes
    .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Supprime les accents
}

function wrapText(text, font, fontSize, maxWidth) {
  const clean = cleanText(text);
  if (!clean) return [''];
  const words = clean.split(' ').filter(word => word.length > 0);
  if (words.length === 0) return [''];
  
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine + ' ' + word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    if (width < maxWidth) {
      currentLine = testLine;
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
      titre: cleanText(fields.poste) || 'Consultant SM Consulting',
      competences: fields.competences ? 
        fields.competences.split(',').map(c => cleanText(c.trim())).filter(c => c.length > 0) : 
        ['Competences a definir'],
      experience: cleanText(fields.experience_detail) || 'Experience non precisee',
      formations: cleanText(fields.formations) || 'Formation non precisee',
      langues: cleanText(fields.langues) || 'Francais',
      description: cleanText(fields.description) || 'Consultant experimente disponible pour vos missions.',
      projets: cleanText(fields.projets) || 'Projets non precises',
      certifications: fields.certifications ? 
        fields.certifications.split(',').map(c => cleanText(c.trim())).filter(c => c.length > 0) : [],
      localisation: 'Ile-de-France',
      disponibilite: fields.statut === 'Nouveau' ? 'Disponible immediatement' : 
        (cleanText(fields.statut) || 'Disponible')
    };

    // Création du PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Polices
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Couleurs SM Consulting
    const primaryColor = rgb(0.1, 0.3, 0.6);
    const secondaryColor = rgb(0.7, 0.7, 0.7);

    let yPosition = height - 50;

    // En-tête SM Consulting
    page.drawText('SM CONSULTING', {
      x: 50, y: yPosition, font: fontBold, size: 20, color: primaryColor
    });
    yPosition -= 25;

    // Numéro candidat
    page.drawText(cvData.candidateNumber, {
      x: 50, y: yPosition, font: font, size: 12, color: secondaryColor
    });
    yPosition -= 40;

    // Ligne de séparation
    page.drawLine({
      start: { x: 50, y: yPosition }, end: { x: width - 50, y: yPosition },
      thickness: 2, color: primaryColor
    });
    yPosition -= 40;

    // Titre du poste
    page.drawText(cvData.titre.toUpperCase(), {
      x: 50, y: yPosition, font: fontBold, size: 16, color: rgb(0, 0, 0)
    });
    yPosition -= 25;

    // Localisation et disponibilité
    page.drawText('Localisation: ' + cvData.localisation + ' | Disponibilite: ' + cvData.disponibilite, {
      x: 50, y: yPosition, font: font, size: 10, color: secondaryColor
    });
    yPosition -= 40;

    // Section Résumé Professionnel
    page.drawText('RESUME PROFESSIONNEL', {
      x: 50, y: yPosition, font: fontBold, size: 12, color: primaryColor
    });
    yPosition -= 20;

    const descriptionLines = wrapText(cvData.description, font, 10, width - 100);
    descriptionLines.forEach(line => {
      if (yPosition > 50) {
        page.drawText(line, { x: 50, y: yPosition, font: font, size: 10 });
        yPosition -= 15;
      }
    });
    yPosition -= 20;

    // Section Compétences Techniques
    if (cvData.competences.length > 0) {
      page.drawText('COMPETENCES TECHNIQUES', {
        x: 50, y: yPosition, font: fontBold, size: 12, color: primaryColor
      });
      yPosition -= 20;

      cvData.competences.forEach(competence => {
        if (yPosition > 50 && competence) {
          page.drawText('- ' + competence, { x: 60, y: yPosition, font: font, size: 10 });
          yPosition -= 15;
        }
      });
      yPosition -= 20;
    }

    // Section Expérience
    if (cvData.experience && cvData.experience !== 'Experience non precisee') {
      page.drawText('EXPERIENCE PROFESSIONNELLE', {
        x: 50, y: yPosition, font: fontBold, size: 12, color: primaryColor
      });
      yPosition -= 20;

      const experienceLines = wrapText(cvData.experience, font, 10, width - 100);
      experienceLines.forEach(line => {
        if (yPosition > 50) {
          page.drawText(line, { x: 50, y: yPosition, font: font, size: 10 });
          yPosition -= 15;
        }
      });
      yPosition -= 20;
    }

    // Section Projets
    if (cvData.projets && cvData.projets !== 'Projets non precises') {
      page.drawText('PROJETS REALISES', {
        x: 50, y: yPosition, font: fontBold, size: 12, color: primaryColor
      });
      yPosition -= 20;

      const projetsLines = wrapText(cvData.projets, font, 10, width - 100);
      projetsLines.forEach(line => {
        if (yPosition > 50) {
          page.drawText(line, { x: 50, y: yPosition, font: font, size: 10 });
          yPosition -= 15;
        }
      });
      yPosition -= 20;
    }

    // Section Formations
    if (cvData.formations && cvData.formations !== 'Formation non precisee') {
      page.drawText('FORMATION', {
        x: 50, y: yPosition, font: fontBold, size: 12, color: primaryColor
      });
      yPosition -= 20;

      const formationsLines = wrapText(cvData.formations, font, 10, width - 100);
      formationsLines.forEach(line => {
        if (yPosition > 50) {
          page.drawText(line, { x: 50, y: yPosition, font: font, size: 10 });
          yPosition -= 15;
        }
      });
      yPosition -= 20;
    }

    // Section Langues
    if (cvData.langues && cvData.langues !== 'Francais') {
      page.drawText('LANGUES', {
        x: 50, y: yPosition, font: fontBold, size: 12, color: primaryColor
      });
      yPosition -= 20;

      const languesLines = wrapText(cvData.langues, font, 10, width - 100);
      languesLines.forEach(line => {
        if (yPosition > 50) {
          page.drawText(line, { x: 50, y: yPosition, font: font, size: 10 });
          yPosition -= 15;
        }
      });
      yPosition -= 20;
    }

    // Section Certifications
    if (cvData.certifications.length > 0) {
      page.drawText('CERTIFICATIONS', {
        x: 50, y: yPosition, font: fontBold, size: 12, color: primaryColor
      });
      yPosition -= 20;

      cvData.certifications.forEach(certification => {
        if (yPosition > 50 && certification) {
          page.drawText('- ' + certification, { x: 60, y: yPosition, font: font, size: 10 });
          yPosition -= 15;
        }
      });
      yPosition -= 20;
    }

    // Pied de page
    page.drawText('CV genere par SM Consulting - www.smconsulting.com', {
      x: 50, y: 30, font: font, size: 8, color: secondaryColor
    });

    // Génération du PDF
    const pdfBytes = await pdfDoc.save();

    // Retour DIRECT du PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="CV_SM_Consulting.pdf"');
    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error('❌ Erreur génération PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la génération du PDF: ' + error.message
    });
  }
}
