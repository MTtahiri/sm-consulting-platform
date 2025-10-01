// pages/api/serve-pdf.js
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
    // Chemin vers le dossier des CVs
    const cvDirectory = 'C:/Users/mohat/Downloads/Mes CVs pdf';
    const filePath = path.join(cvDirectory, filename);

    // Vérifier que le fichier existe
    if (!fs.existsSync(filePath)) {
      console.error('❌ Fichier non trouvé:', filePath);
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }

    // Lire le fichier PDF
    const fileBuffer = fs.readFileSync(filePath);

    // Définir les headers pour un PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('Content-Length', fileBuffer.length);

    // Envoyer le fichier
    res.send(fileBuffer);

    console.log('✅ PDF servi:', filename);

  } catch (error) {
    console.error('❌ Erreur service PDF:', error);
    res.status(500).json({ error: 'Erreur lors de la lecture du fichier' });
  }
}
