// pages/api/sync-simple.js - Version ultra-simple
const { google } = require('googleapis');

module.exports = async function handler(req, res) {
  console.log('🔧 API ultra-simple appelée');
  
  try {
    // Test basique des variables d'environnement
    console.log('🔍 Test variables env...');
    
    if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL) {
      throw new Error('GOOGLE_SHEETS_CLIENT_EMAIL manquant');
    }
    if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
      throw new Error('GOOGLE_SHEETS_PRIVATE_KEY manquant');
    }

    // Test authentification Google simple
    console.log('🔗 Test auth Google...');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n')
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly']
    });

    const authClient = await auth.getClient();
    console.log('✅ Auth Google réussie');

    // Test Drive simple
    console.log('📁 Test Drive...');
    const drive = google.drive({ version: 'v3', auth: authClient });
    const response = await drive.files.list({
      q: "mimeType='application/pdf'",
      pageSize: 1
    });

    console.log('✅ Test Drive réussi');

    res.status(200).json({
      success: true,
      message: 'API ultra-simple fonctionne',
      files_count: response.data.files.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erreur détaillée:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      step: 'Erreur dans API ultra-simple'
    });
  }
}
