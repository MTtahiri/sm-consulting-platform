// pages/api/test-sync.js - Version test sans auth
const { google } = require('googleapis');
const pdfParse = require('pdf-parse');

const DRIVE_FOLDER_ID = '1KJclnM06u9k6ZTOqkHzSsJvduQEkvmGq';
const SHEET_ID = '1kHfTgEdYBt8IxSbpTpGUV7wZqgp-61ULr-cauAf5z-o';

module.exports = async function handler(req, res) {
  try {
    console.log('🚀 TEST - Démarrage synchronisation');
    
    // Authentification
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n')
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/spreadsheets']
    });

    const authClient = await auth.getClient();
    const drive = google.drive({ version: 'v3', auth: authClient });

    // Lister les fichiers
    const response = await drive.files.list({
      q: `'${DRIVE_FOLDER_ID}' in parents and mimeType='application/pdf' and trashed=false`,
      fields: 'files(id, name)',
      pageSize: 5
    });

    const files = response.data.files || [];
    
    res.status(200).json({
      success: true,
      message: 'Test réussi - Connexion Google OK',
      files_count: files.length,
      files: files.map(f => ({ name: f.name, id: f.id })),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erreur test:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Vérifiez les variables d environnement Vercel'
    });
  }
}
