// pages/api/get-pdf.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let { filename } = req.query;

  if (!filename) {
    return res.status(400).json({ error: 'Filename required' });
  }

  // Décoder le nom de fichier URL
  filename = decodeURIComponent(filename);

  console.log('🔍 Recherche du fichier décodé:', filename);

  try {
    const cvDirectory = 'C:/Users/mohat/Downloads/Mes CVs pdf';
    const filePath = path.join(cvDirectory, filename);

    console.log('📁 Chemin complet:', filePath);

    if (!fs.existsSync(filePath)) {
      console.error('❌ Fichier non trouvé:', filePath);
      return res.status(404).json({ 
        error: 'Fichier non trouvé',
        requested: filename
      });
    }

    const stats = fs.statSync(filePath);
    console.log('✅ Fichier trouvé - Taille:', stats.size, 'bytes');

    const fileBuffer = fs.readFileSync(filePath);

    // Utiliser un nom de fichier safe pour les headers
    const safeFilename = 'cv_consultant.pdf';
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);
    res.setHeader('Content-Length', fileBuffer.length);
    res.setHeader('Cache-Control', 'no-cache');

    console.log('📤 Envoi du PDF réussi');

    res.send(fileBuffer);

  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ 
      error: 'Erreur lecture fichier',
      details: error.message
    });
  }
}
