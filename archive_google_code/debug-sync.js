// pages/api/debug-sync.js - Version debug sans auth
const { google } = require('googleapis');
const pdfParse = require('pdf-parse');

module.exports = async function handler(req, res) {
  try {
    console.log('🔧 DEBUG - Test connexion Google APIs');
    
    // Test authentification Google
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n')
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly']
    });

    const authClient = await auth.getClient();
    
    // Test Drive
    const drive = google.drive({ version: 'v3', auth: authClient });
    const driveResponse = await drive.files.list({
      q: "'1KJclnM06u9k6ZTOqkHzSsJvduQEkvmGq' in parents and mimeType='application/pdf'",
      fields: 'files(id, name)',
      pageSize: 3
    });

    // Test variables d'environnement (sans afficher les valeurs sensibles)
    const envVars = {
      GOOGLE_SHEETS_CLIENT_EMAIL: process.env.GOOGLE_SHEETS_CLIENT_EMAIL ? '✅ Configuré' : '❌ Manquant',
      GOOGLE_SHEETS_PRIVATE_KEY: process.env.GOOGLE_SHEETS_PRIVATE_KEY ? '✅ Configuré' : '❌ Manquant', 
      GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID ? '✅ Configuré' : '❌ Manquant',
      CRON_SECRET: process.env.CRON_SECRET ? '✅ Configuré' : '❌ Manquant'
    };

    res.status(200).json({
      success: true,
      message: 'Debug info',
      environment_variables: envVars,
      drive_files: driveResponse.data.files,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Debug error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      step: 'Erreur connexion Google APIs'
    });
  }
}
