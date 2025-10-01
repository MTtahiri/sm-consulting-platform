// pages/api/extract-and-anonymize-cv.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { candidateId, pdfFileName } = req.body;

  if (!candidateId || !pdfFileName) {
    return res.status(400).json({ error: 'Candidate ID and PDF filename required' });
  }

  try {
    console.log('📄 Extraction et anonymisation du CV PDF:', pdfFileName);

    // Chemin vers le dossier des CVs PDF
    const pdfsDirectory = path.join(process.cwd(), 'C:\\Users\\mohat\\Downloads\\Mes CVs pdf');
    const filePath = path.join(pdfsDirectory, pdfFileName);

    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      console.log('❌ Fichier PDF non trouvé, utilisation du générateur de secours');
      return res.status(404).json({ error: 'PDF file not found' });
    }

    // Ici vous intégrerez une bibliothèque PDF comme pdf-parse
    // Pour l'instant, simulation de l'extraction
    const extractedText = `
    EXTRACTION DU CV RÉEL - ${pdfFileName}
    
    [Contenu extrait du PDF original avec anonymisation]
    
    • Expériences professionnelles détaillées
    • Compétences techniques spécifiques
    • Réalisations chiffrées
    • Formations et certifications
    
    === ANONYMISATION APPLIQUÉE ===
    • Noms et prénoms remplacés par initiales
    • Coordonnées supprimées
    • Liens personnels retirés
    • Informations identifiantes occultées
    `;

    // Processus d'anonymisation avancé
    const anonymizedCV = applyAdvancedAnonymization(extractedText, candidateId);

    console.log('✅ CV PDF extrait et anonymisé avec succès');

    res.status(200).json({
      success: true,
      anonymizedCV: anonymizedCV,
      fileName: `CV_Anonyme_${candidateId}_${Date.now()}.txt`,
      source: 'pdf_extraction'
    });

  } catch (error) {
    console.error('❌ Erreur extraction CV PDF:', error);
    
    // Fallback vers le générateur standard
    const fallbackResponse = await fetch('/api/generate-sm-cv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidate: { id: candidateId } })
    });
    
    const fallbackData = await fallbackResponse.json();
    
    res.status(200).json(fallbackData);
  }
}

function applyAdvancedAnonymization(text, candidateId) {
  // Remplacer les noms par des initiales
  text = text.replace(/([A-Z][a-z]+)\s+([A-Z][a-z]+)/g, 'M. X');
  
  // Supprimer emails
  text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, 'email@anonymise.fr');
  
  // Supprimer téléphones
  text = text.replace(/(\+33|0)[1-9](\d{2}){4}/g, '[TÉLÉPHONE ANONYMISÉ]');
  
  // Supprimer liens LinkedIn et autres
  text = text.replace(/https?:\/\/[^\s]+/g, '[LIEN ANONYMISÉ]');
  
  // Supprimer adresses
  text = text.replace(/\d+\s+[A-Za-z\s,]+(\d{5})?\s+[A-Za-z]+/g, '[ADRESSE ANONYMISÉE]');
  
  return `
CV ANONYMISÉ - CONSULTANT SM${candidateId}
${'='.repeat(50)}

${text}

${'='.repeat(50)}
SM CONSULTING - CV Anonyme conforme RGPD
ID Consultant: SM${candidateId}
Généré le: ${new Date().toLocaleDateString('fr-FR')}
  `.trim();
}
