// pages/api/diagnostic-pdf.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cvDirectory = 'C:/Users/mohat/Downloads/Mes CVs pdf';
    
    // Vérifier si le dossier existe
    const directoryExists = fs.existsSync(cvDirectory);
    
    // Lister les fichiers PDF disponibles
    let files = [];
    if (directoryExists) {
      try {
        files = fs.readdirSync(cvDirectory)
          .filter(file => file.toLowerCase().endsWith('.pdf'))
          .slice(0, 10); // Premier 10 fichiers
      } catch (readError) {
        console.error('❌ Erreur lecture dossier:', readError);
      }
    }

    // Tester l'accès à un fichier spécifique
    let fileTest = {};
    if (files.length > 0) {
      const testFilePath = path.join(cvDirectory, files[0]);
      try {
        const stats = fs.statSync(testFilePath);
        fileTest = {
          exists: true,
          size: stats.size,
          path: testFilePath
        };
      } catch (fileError) {
        fileTest = {
          exists: false,
          error: fileError.message
        };
      }
    }

    res.status(200).json({
      directory: {
        path: cvDirectory,
        exists: directoryExists,
        fileCount: files.length
      },
      files: files,
      fileTest: fileTest,
      permissions: {
        cwd: process.cwd(),
        platform: process.platform
      }
    });

  } catch (error) {
    console.error('❌ Erreur diagnostic:', error);
    res.status(500).json({ 
      error: 'Erreur diagnostic',
      details: error.message 
    });
  }
}
