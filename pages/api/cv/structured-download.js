// pages/api/cv/structured-download.js
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import Airtable from 'airtable';

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// PARSER INTELLIGENT - Détecte automatiquement la structure
function intelligentExperienceParser(experienceText) {
  if (!experienceText) return [];
  
  const experiences = [];
  const lines = experienceText.split('\n').filter(line => line.trim().length > 0);
  
  let currentExp = {};
  let inDescription = false;
  
  lines.forEach(line => {
    const cleanLine = line.trim();
    
    // Détection d'une nouvelle expérience (pattern: "Poste — Entreprise" ou "Entreprise - Poste")
    if (cleanLine.match(/[-–—]|chez|at|chez\s/i) || cleanLine.match(/\d{4}\s*[-–—]\s*\d{4}/)) {
      // Si on a déjà une expérience en cours, on la sauvegarde
      if (currentExp.poste || currentExp.entreprise) {
        experiences.push({...currentExp});
        currentExp = {};
        inDescription = false;
      }
      
      // Extraction entreprise et poste
      const parts = cleanLine.split(/[-–—]|chez|at/).map(p => p.trim()).filter(p => p);
      if (parts.length >= 2) {
        currentExp.poste = cleanText(parts[0]);
        currentExp.entreprise = cleanText(parts[1]);
      } else {
        currentExp.poste = cleanText(cleanLine);
      }
    }
    // Détection de période (pattern: "MM/AAAA - MM/AAAA" ou "AAAA - AAAA")
    else if (cleanLine.match(/\b(\d{1,2}\/\d{4}|\d{4})\s*[-–—]\s*(\d{1,2}\/\d{4}|\d{4}|[Pp]résent|[Aa]ujourd'hui|[Nn]ow)\b/)) {
      currentExp.periode = cleanText(cleanLine);
    }
    // Détection de description (lignes avec tirets ou puces)
    else if (cleanLine.match(/^[•\-*]\s/) || cleanLine.match(/^\d+\./) || inDescription) {
      if (!currentExp.description) currentExp.description = '';
      currentExp.description += cleanLine.replace(/^[•\-*]\s*/, '') + ' ';
      inDescription = true;
    }
    // Détection de technologies (mots clés techniques)
    else if (cleanLine.match(/\b(Power BI|SQL|Python|React|Node\.js|AWS|Azure|Docker|Kubernetes|Java|C#|\.NET)\b/i)) {
      if (!currentExp.technologies) currentExp.technologies = '';
      currentExp.technologies += cleanLine + ' ';
    }
    // Ligne de texte normale - considérée comme description
    else if (cleanLine.length > 10 && !cleanLine.match(/^\s*$/)) {
      if (!currentExp.description) currentExp.description = '';
      currentExp.description += cleanLine + ' ';
      inDescription = true;
    }
  });
  
  // Ajouter la dernière expérience
  if (currentExp.poste || currentExp.entreprise) {
    experiences.push(currentExp);
  }
  
  return experiences;
}

// PARSER pour les formations
function intelligentFormationParser(formationText) {
  if (!formationText) return [];
  
  const formations = [];
  const lines = formationText.split('\n').filter(line => line.trim().length > 0);
  
  let currentFormation = {};
  
  lines.forEach(line => {
    const cleanLine = line.trim();
    
    // Détection diplôme et établissement
    if (cleanLine.match(/[A-Za-z]+\s*[-–—]\s*[A-Za-z]/) || cleanLine.match(/\b(Université|École|Master|Bachelor|Licence|Diplôme)\b/i)) {
      if (currentFormation.diplome) {
        formations.push({...currentFormation});
        currentFormation = {};
      }
      
      const parts = cleanLine.split(/[-–—]/).map(p => p.trim()).filter(p => p);
      if (parts.length >= 2) {
        currentFormation.diplome = cleanText(parts[0]);
        currentFormation.etablissement = cleanText(parts[1]);
      } else {
        currentFormation.diplome = cleanText(cleanLine);
      }
    }
    // Détection année
    else if (cleanLine.match(/\b(20\d{2}|\d{4})\b/)) {
      currentFormation.annee = cleanText(cleanLine);
    }
  });
  
  if (currentFormation.diplome) {
    formations.push(currentFormation);
  }
  
  return formations;
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

    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.AIRTABLE_BASE_ID);

    const record = await base('Table 1').find(candidateId);
    const fields = record.fields;

    // PARSING INTELLIGENT des données existantes
    const experiences = intelligentExperienceParser(fields.experience_detail);
    const formations = intelligentFormationParser(fields.formations);
    const competences = fields.competences ? 
      fields.competences.split(',').map(c => cleanText(c.trim())).filter(c => c.length > 0) : [];

    const cvData = {
      candidateNumber: 'Candidat #' + record.id.slice(-3).toUpperCase(),
      titre: cleanText(fields.poste) || 'Consultant SM Consulting',
      competences: competences,
      experiences: experiences,
      formations: formations,
      langues: cleanText(fields.langues) || 'Francais',
      description: cleanText(fields.description) || 'Consultant experimente disponible pour vos missions.',
      projets: cleanText(fields.projets) || '',
      certifications: fields.certifications ? 
        fields.certifications.split(',').map(c => cleanText(c.trim())).filter(c => c.length > 0) : [],
      localisation: 'Ile-de-France',
      disponibilite: fields.statut === 'Nouveau' ? 'Disponible immediatement' : 
        (cleanText(fields.statut) || 'Disponible')
    };

    console.log('📊 Experiences structurees:', experiences.length);
    console.log('📊 Formations structurees:', formations.length);

    // CRÉATION PDF AVEC STRUCTURE INTELLIGENTE
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const primaryColor = rgb(0.1, 0.3, 0.6);
    const secondaryColor = rgb(0.7, 0.7, 0.7);

    let yPosition = height - 50;

    // En-tête SM Consulting
    page.drawText('SM CONSULTING', {
      x: 50, y: yPosition, font: fontBold, size: 20, color: primaryColor
    });
    yPosition -= 25;

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

    // Titre et informations
    page.drawText(cvData.titre.toUpperCase(), {
      x: 50, y: yPosition, font: fontBold, size: 16, color: rgb(0, 0, 0)
    });
    yPosition -= 25;

    page.drawText('Localisation: ' + cvData.localisation + ' | Disponibilite: ' + cvData.disponibilite, {
      x: 50, y: yPosition, font: font, size: 10, color: secondaryColor
    });
    yPosition -= 40;

    // Résumé professionnel
    page.drawText('PROFIL PROFESSIONNEL', {
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

    // EXPÉRIENCES STRUCTURÉES
    if (cvData.experiences.length > 0) {
      page.drawText('EXPERIENCES PROFESSIONNELLES', {
        x: 50, y: yPosition, font: fontBold, size: 12, color: primaryColor
      });
      yPosition -= 25;

      cvData.experiences.forEach((exp, index) => {
        // En-tête expérience
        if (yPosition > 50) {
          const headerText = exp.entreprise ? 
            `${exp.poste || 'Poste'} - ${exp.entreprise}` : 
            exp.poste || 'Experience professionnelle';
          
          page.drawText(headerText, {
            x: 50, y: yPosition, font: fontBold, size: 10
          });
          yPosition -= 12;
        }

        // Période
        if (exp.periode && yPosition > 50) {
          page.drawText(exp.periode, {
            x: 50, y: yPosition, font: font, size: 9, color: secondaryColor
          });
          yPosition -= 15;
        }

        // Description
        if (exp.description && yPosition > 50) {
          const descLines = wrapText(exp.description, font, 9, width - 100);
          descLines.forEach(line => {
            if (yPosition > 50) {
              page.drawText('• ' + line, { x: 55, y: yPosition, font: font, size: 9 });
              yPosition -= 12;
            }
          });
        }
        
        // Technologies
        if (exp.technologies && yPosition > 50) {
          page.drawText('Technologies: ' + exp.technologies, {
            x: 55, y: yPosition, font: font, size: 8, color: secondaryColor
          });
          yPosition -= 10;
        }
        
        yPosition -= 8; // Espace entre expériences
      });
      yPosition -= 10;
    }

    // Compétences en 2 colonnes
    if (cvData.competences.length > 0) {
      page.drawText('COMPETENCES TECHNIQUES', {
        x: 50, y: yPosition, font: fontBold, size: 12, color: primaryColor
      });
      yPosition -= 20;

      const midPoint = width / 2;
      let leftY = yPosition;
      let rightY = yPosition;

      cvData.competences.forEach((competence, index) => {
        if (index % 2 === 0 && leftY > 50) {
          page.drawText('• ' + competence, { x: 60, y: leftY, font: font, size: 10 });
          leftY -= 14;
        } else if (rightY > 50) {
          page.drawText('• ' + competence, { x: midPoint + 10, y: rightY, font: font, size: 10 });
          rightY -= 14;
        }
      });
      
      yPosition = Math.min(leftY, rightY) - 20;
    }

    // Génération PDF
    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="CV_Structure_SM_Consulting.pdf"');
    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error('❌ Erreur génération PDF structuré:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur génération PDF: ' + error.message
    });
  }
}
