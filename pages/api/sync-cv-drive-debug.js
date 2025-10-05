// pages/api/sync-cv-drive-debug.js - Version debug sans auth
const { google } = require('googleapis');
const pdfParse = require('pdf-parse');

const DRIVE_FOLDER_ID = process.env.DRIVE_FOLDER_ID || '***REMOVED***';
const SHEET_ID = process.env.GOOGLE_SHEETS_ID || '***REMOVED***';

module.exports = async function handler(req, res) {
  // BYPASS AUTH POUR DEBUG
  console.log('🔧 DEBUG MODE - Démarrage synchronisation sans auth');
  
  try {
    // Test des variables d'environnement
    console.log('🔍 Variables env:', {
      hasClientEmail: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_SHEETS_PRIVATE_KEY,
      hasSheetId: !!process.env.GOOGLE_SHEETS_ID,
      hasDriveFolder: !!process.env.DRIVE_FOLDER_ID
    });

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
    
    // Test Drive
    const drive = google.drive({ version: 'v3', auth: authClient });
    const driveResponse = await drive.files.list({
      q: `'${DRIVE_FOLDER_ID}' in parents and mimeType='application/pdf' and trashed=false`,
      fields: 'files(id, name)',
      pageSize: 5
    });

    const files = driveResponse.data.files || [];
    
    res.status(200).json({
      success: true,
      debug: true,
      message: 'Debug sync successful',
      environment: {
        GOOGLE_SHEETS_CLIENT_EMAIL: process.env.GOOGLE_SHEETS_CLIENT_EMAIL ? 'PRESENT' : 'MISSING',
        GOOGLE_SHEETS_PRIVATE_KEY: process.env.GOOGLE_SHEETS_PRIVATE_KEY ? 'PRESENT' : 'MISSING',
        DRIVE_FOLDER_ID: process.env.DRIVE_FOLDER_ID ? 'PRESENT' : 'MISSING'
      },
      drive_files: files.map(f => ({ name: f.name, id: f.id })),
      files_count: files.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Debug sync error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      step: 'Debug synchronization failed'
    });
  }
}
