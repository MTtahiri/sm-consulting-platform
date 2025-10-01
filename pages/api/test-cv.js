import fs from 'fs';
import path from 'path';

function testDirectoryWritable(dir) {
  try {
    fs.accessSync(dir, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function generateRecommendations(filesDetails, uploadDir) {
  // Exemple: retourner un tableau vide ou une recommandation simple
  return [];
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const uploadDir = './public/uploads/cv';

    if (!fs.existsSync(uploadDir)) {
      return res.status(404).json({
        error: 'Dossier uploads/cv non trouvé',
        message: "Le dossier de stockage des CVs n'existe pas",
        action: 'Créer le dossier: mkdir -p public/uploads/cv',
      });
    }

    const files = fs.readdirSync(uploadDir);
    const cvFiles = files.filter(file =>
      ['.pdf', '.doc', '.docx'].includes(path.extname(file).toLowerCase())
    );

    const filesDetails = cvFiles.map(fileName => {
      const filePath = path.join(uploadDir, fileName);
      const stats = fs.statSync(filePath);

      return {
        fileName,
        size: stats.size,
        sizeFormatted: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
        uploadDate: stats.birthtime,
        lastModified: stats.mtime,
        extension: path.extname(fileName),
        accessible: true,
      };
    });

    const totalSize = filesDetails.reduce((acc, file) => acc + file.size, 0);
    const avgSize = filesDetails.length > 0 ? totalSize / filesDetails.length : 0;

    const testResults = {
      success: true,
      timestamp: new Date().toISOString(),
      uploadDirectory: uploadDir,
      directoryExists: true,
      stats: {
        totalFiles: cvFiles.length,
        totalSize,
        totalSizeFormatted: `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
        averageSize: `${(avgSize / 1024 / 1024).toFixed(2)} MB`,
        oldestFile: filesDetails.length > 0 ?
          filesDetails.reduce((oldest, file) =>
            file.uploadDate < oldest.uploadDate ? file : oldest
          ) : null,
        newestFile: filesDetails.length > 0 ?
          filesDetails.reduce((newest, file) =>
            file.uploadDate > newest.uploadDate ? file : newest
          ) : null,
      },
      files: filesDetails.slice(0, 10),
      filesByExtension: {
        pdf: cvFiles.filter(f => f.toLowerCase().endsWith('.pdf')).length,
        doc: cvFiles.filter(f => f.toLowerCase().endsWith('.doc')).length,
        docx: cvFiles.filter(f => f.toLowerCase().endsWith('.docx')).length,
      },
      tests: {
        directoryWritable: testDirectoryWritable(uploadDir),
        sampleUploadPath: path.join(uploadDir, `test_${Date.now()}.txt`),
        maxFileSizeAllowed: '10MB',
        allowedExtensions: ['.pdf', '.doc', '.docx'],
      },
      recommendations: generateRecommendations(filesDetails, uploadDir),
    };

    return res.status(200).json(testResults);

  } catch (error) {
    console.error('❌ Erreur test CV:', error);
    return res.status(500).json({ error: 'Erreur serveur interne' });
  }
}
