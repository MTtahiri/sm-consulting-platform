import Airtable from 'airtable';
import formidable from 'formidable';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const form = formidable({
      uploadDir: './tmp',
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    if (!files.csv || !files.csv[0]) {
      return res.status(400).json({
        success: false,
        error: 'Aucun fichier CSV fourni'
      });
    }

    const csvFile = files.csv[0];
    const csvContent = fs.readFileSync(csvFile.filepath, 'utf8');

    console.log('📥 Fichier CSV reçu, taille:', csvContent.length, 'caractères');

    // Parser le CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log('📊 Lignes CSV détectées:', records.length);

    if (records.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Le fichier CSV est vide ou mal formaté'
      });
    }

    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
      .base(process.env.AIRTABLE_BASE_ID);

    const importedOffres = [];
    const errors = [];

    // Traiter chaque ligne du CSV
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      
      try {
        // Validation des champs requis
        const requiredFields = ['titre', 'entreprise', 'localisation', 'type_contrat', 'description', 'competences_requises'];
        const missingFields = requiredFields.filter(field => !record[field] || record[field].trim() === '');

        if (missingFields.length > 0) {
          errors.push(`Ligne ${i + 2}: Champs manquants - ${missingFields.join(', ')}`);
          continue;
        }

        // Créer l'offre dans Airtable
        const airtableRecord = await base('Offres').create({
          'titre': record.titre,
          'entreprise': record.entreprise,
          'localisation': record.localisation,
          'type_contrat': record.type_contrat,
          'salaire': record.salaire || '',
          'description': record.description,
          'competences_requises': record.competences_requises,
          'statut': 'Ouverte'
          // date_publication sera auto-remplie
        });

        importedOffres.push({
          titre: record.titre,
          entreprise: record.entreprise,
          recordId: airtableRecord.getId()
        });

        console.log(`✅ Offre importée: ${record.titre}`);

      } catch (error) {
        console.error(`❌ Erreur ligne ${i + 2}:`, error.message);
        errors.push(`Ligne ${i + 2}: ${error.message}`);
      }
    }

    // Nettoyer le fichier temporaire
    try {
      fs.unlinkSync(csvFile.filepath);
    } catch (cleanupError) {
      console.warn('⚠️ Impossible de nettoyer le fichier temporaire:', cleanupError.message);
    }

    res.status(200).json({
      success: true,
      imported: importedOffres.length,
      total: records.length,
      importedOffres: importedOffres,
      errors: errors
    });

  } catch (error) {
    console.error('❌ Erreur import CSV:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
