// pages/api/cv/test-extract.js - API DE TEST SANS ERREUR
import pdf from 'pdf-parse';
import fs from 'fs/promises';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    // Test avec un fichier PDF local
    const pdfBuffer = await fs.readFile('./public/sample-cv.pdf');
    
    const data = await pdf(pdfBuffer);
    
    console.log('✅ PDF extrait avec pdf-parse - SUCCÈS');

    res.status(200).json({
      success: true,
      message: 'Extraction PDF réussie avec pdf-parse',
      numpages: data.numpages,
      textPreview: data.text.substring(0, 300) + '...',
      textLength: data.text.length
    });

  } catch (error) {
    console.error('❌ Erreur avec pdf-parse:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur extraction PDF',
      details: error.message
    });
  }
}
