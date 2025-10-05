// scripts/cv-sync.js - Synchronisation CV avec GitHub Actions
const { google } = require('googleapis');
const pdfParse = require('pdf-parse');

async function main() {
  console.log('🚀 CV Sync via GitHub Actions - Démarrage');
  
  try {
    // Authentification Google
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n')
      },
      scopes: [
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/spreadsheets'
      ]
    });

    const authClient = await auth.getClient();
    
    // Drive - Lister les CV
    const drive = google.drive({ version: 'v3', auth: authClient });
    const driveResponse = await drive.files.list({
      q: "'***REMOVED***' in parents and mimeType='application/pdf' and trashed=false",
      fields: 'files(id, name, mimeType, modifiedTime)',
      orderBy: 'modifiedTime desc'
    });

    const files = driveResponse.data.files || [];
    console.log(`📁 ${files.length} fichiers CV trouvés`);

    // Sheets - Préparer l'insertion
    const sheets = google.sheets({ version: 'v4', auth: authClient });
    
    const results = {
      processed: 0,
      added: 0,
      errors: 0
    };

    // Traiter chaque fichier
    for (const file of files.slice(0, 5)) { // Limiter pour le test
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

        // Extraire les informations basiques
        const skills = extractSkills(text);
        const experience = extractExperience(text);
        const name = extractName(file.name);

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
          spreadsheetId: '***REMOVED***',
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
    console.log('🎉 Synchronisation terminée avec succès!');

  } catch (error) {
    console.error('💥 ERREUR CRITIQUE:', error);
    process.exit(1);
  }
}

// Fonctions d'extraction
function extractSkills(text) {
  const skills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'AWS', 'Docker'];
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
