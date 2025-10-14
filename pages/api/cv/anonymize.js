// pages/api/cv/anonymize.js
import pdf from 'pdf-parse';

// Fonctions d'anonymisation
function anonymizeText(text) {
  let anonymized = text;
  
  // Anonymiser emails
  anonymized = anonymized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');
  
  // Anonymiser téléphones français
  anonymized = anonymized.replace(/(?:\+33|0)[1-9](?:\d{2}){4}/g, '[TÉLÉPHONE]');
  
  // Anonymiser noms propres (basique)
  const commonNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau'];
  commonNames.forEach(name => {
    const regex = new RegExp(`\\b${name}\\b`, 'gi');
    anonymized = anonymized.replace(regex, '[NOM]');
  });
  
  return anonymized;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { pdfUrl } = req.body;

    if (!pdfUrl) {
      return res.status(400).json({ error: 'URL PDF manquante' });
    }

    console.log('📥 Extraction PDF depuis:', pdfUrl);

    // Pour l'instant, test avec fichier local
    // À remplacer par téléchargement MEGA plus tard
    const fs = await import('fs');
    const pdfBuffer = fs.readFileSync('./public/sample-cv.pdf');
    
    const data = await pdf(pdfBuffer);
    const textAnonymized = anonymizeText(data.text);

    console.log('✅ PDF anonymisé avec succès');

    res.status(200).json({
      success: true,
      originalLength: data.text.length,
      anonymizedLength: textAnonymized.length,
      numpages: data.numpages,
      text: textAnonymized,
      preview: textAnonymized.substring(0, 500) + '...'
    });

  } catch (error) {
    console.error('❌ Erreur anonymisation PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'anonymisation du PDF',
      details: error.message
    });
  }
}
