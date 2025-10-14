// pages/api/candidates/import-existing.js
import Airtable from 'airtable';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const backupPath = 'D:\\Backup_CVs';
    
    // Vérifier si le dossier existe
    if (!fs.existsSync(backupPath)) {
      return res.status(404).json({
        success: false,
        error: `Dossier non trouvé: ${backupPath}`
      });
    }

    // Lister les fichiers PDF
    const files = fs.readdirSync(backupPath)
      .filter(file => file.toLowerCase().endsWith('.pdf'))
      .slice(0, 50); // Limiter pour le test

    console.log(`📁 ${files.length} fichiers PDF trouvés`);

    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.AIRTABLE_BASE_ID);

    const importedCandidates = [];

    for (const file of files) {
      try {
        // Extraire le nom du fichier (sans extension)
        const fileName = path.parse(file).name;
        
        // Tentative d'extraire prénom et nom du nom de fichier
        const nameParts = fileName.split(/[_\-\s]/);
        const prenom = nameParts[0] || 'Candidat';
        const nom = nameParts.slice(1).join(' ') || 'Inconnu';

        const recordData = {
          'prenom': prenom,
          'nom': nom,
          'email': `${prenom.toLowerCase()}.${nom.toLowerCase()}@email.com`,
          'cv_file_path': `D:\\Backup_CVs\\${file}`,
          'statut': 'Importé',
          'competences': 'À analyser',
          'source': 'import_backup'
        };

        const records = await base('Consultants').create([
          { fields: recordData }
        ]);

        importedCandidates.push({
          file: file,
          recordId: records[0].getId(),
          name: `${prenom} ${nom}`
        });

        console.log(`✅ Importé: ${prenom} ${nom}`);

      } catch (error) {
        console.error(`❌ Erreur sur ${file}:`, error.message);
      }
    }

    res.status(200).json({
      success: true,
      message: `🎉 ${importedCandidates.length} candidats importés avec succès!`,
      imported: importedCandidates,
      totalFiles: files.length
    });

  } catch (error) {
    console.error('❌ Erreur import:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}