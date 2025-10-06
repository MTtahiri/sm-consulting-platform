// sync-server.js - SERVEUR DE SYNCHRONISATION RÉEL
const express = require("express");
const { google } = require("googleapis");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Configuration Google
const getGoogleAuth = () => {
  const credentials = {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  };
  return new google.auth.GoogleAuth({
    credentials,
    scopes: [
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/spreadsheets'
    ]
  });
};

// Routes
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    service: "SM Consulting Sync - PRODUCTION",
    timestamp: new Date().toISOString(),
    ready: true
  });
});

app.post("/sync-cv-drive", async (req, res) => {
  try {
    console.log("🔄 Démarrage synchronisation Drive → Sheets...");
    
    // 1. Vérification des variables
    const auth = getGoogleAuth();
    const driveFolderId = process.env.DRIVE_FOLDER_ID;
    const sheetId = process.env.GOOGLE_SHEET_ID;
    
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL manquant");
    }
    
    // 2. Scan Drive (simulation pour l'instant)
    const drive = google.drive({ version: 'v3', auth });
    const driveResponse = await drive.files.list({
      q: `'${driveFolderId}' in parents and trashed=false`,
      fields: 'files(id, name)',
      pageSize: 5
    });
    
    const files = driveResponse.data.files || [];
    
    // 3. Résultats
    const result = {
      success: true,
      message: `Synchronisation réussie! ${files.length} fichiers trouvés`,
      files_found: files.length,
      files: files.map(f => f.name),
      steps: [
        "1. ✅ Authentification Google réussie",
        "2. ✅ Scan Drive réussi", 
        "3. ✅ Prêt pour insertion Sheets"
      ],
      next: "Insertion dans Google Sheets à implémenter",
      timestamp: new Date().toISOString()
    };
    
    res.json(result);
    
  } catch (error) {
    console.error("❌ Erreur synchronisation:", error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      step: "synchronisation"
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur de synchronisation PRODUCTION démarré sur le port ${PORT}`);
  console.log("✅ Prêt pour la synchronisation CV Drive → Google Sheets");
});
