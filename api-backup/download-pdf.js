// pages/api/download-pdf.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename } = req.query;

  if (!filename) {
    return res.status(400).json({ error: 'Filename required' });
  }

  try {
    const cvDirectory = 'C:/Users/mohat/Downloads/Mes CVs pdf';
    const filePath = path.join(cvDirectory, filename);

    console.log('📥 Téléchargement forcé:', filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }

    const fileBuffer = fs.readFileSync(filePath);

    // Forcer le téléchargement
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', fileBuffer.length);
    res.setHeader('Cache-Control', 'no-cache');

    res.send(fileBuffer);

  } catch (error) {
    console.error('❌ Erreur téléchargement:', error);
    res.status(500).json({ error: 'Erreur téléchargement' });
  }
}
