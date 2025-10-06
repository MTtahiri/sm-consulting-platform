// simple-server.js - SERVEUR ES MODULE
import express from "express";
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Route santé
app.get("/health", (req, res) => {
  console.log("✅ Health check appelé");
  res.json({ 
    status: "OK", 
    service: "SM Consulting Sync",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Route sync simulée
app.post("/sync-cv-drive", (req, res) => {
  console.log("🔄 Sync simulée");
  res.json({
    success: true,
    message: "Sync simulation réussie!",
    steps: [
      "1. Serveur Render opérationnel",
      "2. Variables environnement chargées", 
      "3. Prêt pour la vraie synchronisation"
    ],
    env_check: {
      has_google_email: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      has_google_key: !!process.env.GOOGLE_PRIVATE_KEY,
      has_drive_folder: !!process.env.DRIVE_FOLDER_ID,
      has_sheet_id: !!process.env.GOOGLE_SHEET_ID
    },
    timestamp: new Date().toISOString()
  });
});

// Démarrer
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
