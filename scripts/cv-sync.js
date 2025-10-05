// scripts/cv-sync.js - Version corrigée pour GitHub Actions
const { google } = require('googleapis');
const pdfParse = require('pdf-parse');

async function main() {
  console.log('🚀 CV Sync via GitHub Actions - Démarrage');
  
  try {
    // Log des variables d'environnement (sans valeurs sensibles)
    console.log('🔍 Variables disponibles:', {
      GOOGLE_SHEETS_CLIENT_EMAIL: process.env.GOOGLE_SHEETS_CLIENT_EMAIL ? 'PRÉSENT' : 'ABSENT',
      GOOGLE_SHEETS_PRIVATE_KEY: process.env.GOOGLE_SHEETS_PRIVATE_KEY ? 'PRÉSENT' : 'ABSENT',
      GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID ? 'PRÉSENT' : 'ABSENT',
      DRIVE_FOLDER_ID: process.env.DRIVE_FOLDER_ID ? 'PRÉSENT' : 'ABSENT'
    });

    // Vérification des variables requises
    if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL || !process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
      throw new Error('Variables Google manquantes');
    }

    // Nettoyer la clé privée (supprimer les \n si présents)
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n');
    
    console.log('🔐 Format clé privée:', privateKey.includes('\n') ? 'Avec retours à la ligne' : 'Sur une ligne');

    // Authentification Google
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: privateKey
      },
      scopes: [
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/spreadsheets'
      ]
    });

    console.log('🔗 Tentative de connexion Google...');
    const authClient = await auth.getClient();
    console.log('✅ Connexion Google réussie');
    
    // Drive - Lister les CV
    const drive = google.drive({ version: 'v3', auth: authClient });
    const driveResponse = await drive.files.list({
      q: "'***REMOVED***' in parents and mimeType='application/pdf' and trashed=false",
      fields: 'files(id, name, mimeType, modifiedTime)',
      orderBy: 'modifiedTime desc',
      pageSize: 5
    });

    const files = driveResponse.data.files || [];
    console.log(`📁 ${files.length} fichiers CV trouvés dans Drive`);

    if (files.length === 0) {
      console.log('ℹ️  Aucun fichier PDF trouvé dans le dossier Drive');
      return;
    }

    // Sheets - Préparer l'insertion
    const sheets = google.sheets({ version: 'v4', auth: authClient });
    
    const results = {
      processed: 0,
      added: 0,
      errors: 0
    };

    // Traiter chaque fichier
    for (const file of files) {
      try {
        console.log(`\n📄 Traitement: ${file.name}`);
        
        // Télécharger le PDF
        const fileResponse = await drive.files.get({
          fileId: file.id,
          alt: 'media'
        }, { responseType: 'arraybuffer' });

        const buffer = Buffer.from(fileResponse.data);
        
        // Parser le PDF
        const pdfData = await pdfParse(buffer);
        const text = pdfData.text;

        if (!text || text.trim().length === 0) {
          console.log('⚠️  Aucun texte extrait du PDF');
          continue;
        }

        // Extraire les informations basiques
        const skills = extractSkills(text);
        const experience = extractExperience(text);
        const name = extractName(file.name);

        console.log(`📊 Infos extraites: ${name}, ${experience}, ${skills.length} compétences`);

        // Préparer les données pour Sheets
        const rowData = [
          `CV_${name}_${Date.now()}`,
          name,
          'Consultant IT', // Rôle par défaut
          experience,
          skills.join(', '),
          'À valider',
          file.name,
          new Date().toISOString().split('T')[0]
        ];

        // Insérer dans Google Sheets
        await sheets.spreadsheets.values.append({
          spreadsheetId: process.env.GOOGLE_SHEETS_ID || '***REMOVED***',
          range: 'consultants!A:H',
          valueInputOption: 'RAW',
          resource: { values: [rowData] }
        });

        console.log(`✅ Consultant ajouté: ${name}`);
        results.added++;
        results.processed++;

      } catch (error) {
        console.error(`❌ Erreur avec ${file.name}:`, error.message);
        results.errors++;
      }
    }

    console.log('\n📊 RÉSULTATS FINAUX:');
    console.log(`   Traités: ${results.processed}`);
    console.log(`   Ajoutés: ${results.added}`);
    console.log(`   Erreurs: ${results.errors}`);
    
    if (results.added > 0) {
      console.log('🎉 Synchronisation terminée avec succès!');
    } else {
      console.log('ℹ️  Aucun nouveau consultant ajouté');
    }

  } catch (error) {
    console.error('💥 ERREUR CRITIQUE:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Fonctions d'extraction
function extractSkills(text) {
  const skills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB'];
  return skills.filter(skill => text.toLowerCase().includes(skill.toLowerCase()));
}

function extractExperience(text) {
  const match = text.match(/(\d+)\+?\s*(ans|années|years)/i);
  return match ? match[0] : 'Expérience à déterminer';
}

function extractName(filename) {
  const name = filename.replace(/\.pdf|\.docx|\.doc|cv|resume/gi, '').trim();
  return name && name.length > 2 ? name.split(/[_\-\s]/)[0] : 'Consultant';
}

// Exécuter le script
main();
