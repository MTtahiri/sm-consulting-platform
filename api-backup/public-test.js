// pages/api/public-test.js - Test public sans auth
const { google } = require('googleapis');

export default async function handler(req, res) {
  // Désactiver CORS pour les tests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('🔧 TEST PUBLIC - Vérification configuration Vercel');
    
    // Test des variables d'environnement (sans afficher les valeurs sensibles)
    const envStatus = {
      GOOGLE_SHEETS_CLIENT_EMAIL: process.env.GOOGLE_SHEETS_CLIENT_EMAIL ? '✅ PRÉSENT' : '❌ ABSENT',
      GOOGLE_SHEETS_PRIVATE_KEY: process.env.GOOGLE_SHEETS_PRIVATE_KEY ? '✅ PRÉSENT' : '❌ ABSENT',
      GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID ? '✅ PRÉSENT' : '❌ ABSENT', 
      DRIVE_FOLDER_ID: process.env.DRIVE_FOLDER_ID ? '✅ PRÉSENT' : '❌ ABSENT',
      CRON_SECRET: process.env.CRON_SECRET ? '✅ PRÉSENT' : '❌ ABSENT'
    };

    // Essayer la connexion Google seulement si les credentials sont présents
    let googleTest = { status: 'NON TESTÉ', error: null };
    
    if (process.env.GOOGLE_SHEETS_CLIENT_EMAIL && process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
      try {
        const auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n')
          },
          scopes: ['https://www.googleapis.com/auth/drive.readonly']
        });

        const authClient = await auth.getClient();
        const drive = google.drive({ version: 'v3', auth: authClient });
        
        // Test rapide Drive
        await drive.files.list({
          q: "mimeType='application/pdf'",
          pageSize: 1
        });
        
        googleTest.status = '✅ CONNEXION RÉUSSIE';
      } catch (error) {
        googleTest.status = '❌ ERREUR CONNEXION';
        googleTest.error = error.message;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Test public de configuration',
      environment_status: envStatus,
      google_connection: googleTest,
      timestamp: new Date().toISOString(),
      instructions: 'Si CRON_SECRET est ABSENT, ajoutez-le dans Vercel Dashboard'
    });

  } catch (error) {
    console.error('❌ Erreur test public:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      environment_check: {
        GOOGLE_SHEETS_CLIENT_EMAIL: process.env.GOOGLE_SHEETS_CLIENT_EMAIL ? 'PRÉSENT' : 'ABSENT',
        CRON_SECRET: process.env.CRON_SECRET ? 'PRÉSENT' : 'ABSENT'
      }
    });
  }
}
