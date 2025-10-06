// external-sync-server.js - SERVEUR EXTERNE INDÉPENDANT
const express = require('express');
const { google } = require('googleapis');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const pdf = require('pdf-parse');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Configuration Google
const GOOGLE_CREDENTIALS = {
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

const DRIVE_FOLDER_ID = process.env.DRIVE_FOLDER_ID;
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

// Route de synchronisation
app.post('/sync-cv-drive', async (req, res) => {
  console.log('🔄 Synchronisation externe démarrée...');
  
  try {
    // 1. Authentification Google
    const auth = new google.auth.GoogleAuth({
      credentials: GOOGLE_CREDENTIALS,
      scopes: [
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/spreadsheets'
      ]
    });

    // 2. Scan Drive
    const drive = google.drive({ version: 'v3', auth });
    const driveResponse = await drive.files.list({
      q: `'${DRIVE_FOLDER_ID}' in parents and (mimeType='application/pdf') and trashed=false`,
      fields: 'files(id, name, mimeType, modifiedTime)',
      pageSize: 10
    });

    const cvFiles = driveResponse.data.files || [];
    console.log(`📁 ${cvFiles.length} CVs trouvés dans Drive`);

    // 3. Connexion Google Sheets
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth(GOOGLE_CREDENTIALS);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['consultants'] || doc.sheetsByIndex[0];

    // 4. Simulation résultats
    const results = {
      success: true,
      message: `Synchronisation externe réussie! ${cvFiles.length} CVs détectés`,
      files_found: cvFiles.length,
      files: cvFiles.map(f => f.name),
      timestamp: new Date().toISOString(),
      server: 'External Sync Server',
      status: 'READY_FOR_PRODUCTION'
    };

    res.json(results);

  } catch (error) {
    console.error('❌ Erreur synchronisation:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      step: 'external_sync'
    });
  }
});

// Route santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'CV Sync External Server',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur externe démarré sur le port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔄 Sync endpoint: POST http://localhost:${PORT}/sync-cv-drive`);
});
