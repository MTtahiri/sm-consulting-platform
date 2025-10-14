// scripts/test-auth.js - Test d'authentification basique
const { google } = require('googleapis');

async function main() {
  console.log('🧪 TEST AUTHENTIFICATION BASIQUE');
  
  try {
    // Vérifier les variables
    console.log('🔍 Variables:', {
      hasEmail: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      hasKey: !!process.env.GOOGLE_SHEETS_PRIVATE_KEY,
      keyLength: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.length
    });

    if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL || !process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
      throw new Error('Variables manquantes');
    }

    // Nettoyer la clé
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n');
    console.log('🔐 Clé nettoyée, longueur:', privateKey.length);

    // Test auth simple
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: privateKey
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly']
    });

    console.log('🔗 Tentative de connexion...');
    const client = await auth.getClient();
    console.log('✅ Auth réussie!');

    // Test Drive simple
    const drive = google.drive({ version: 'v3', auth: client });
    const response = await drive.files.list({
      q: "mimeType='application/pdf'",
      pageSize: 1
    });

    console.log('✅ Drive accessible!');
    console.log('📊 Fichiers trouvés:', response.data.files.length);

  } catch (error) {
    console.error('💥 ERREUR:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

main();
