// simple-server.js - SERVEUR COMMONJS CORRECT
const express = require("express");
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

// Route sync
app.post("/sync-cv-drive", (req, res) => {
  console.log("🔄 Sync simulée");
  res.json({
    success: true,
    message: "Sync simulation réussie!",
    steps: ["Serveur opérationnel"],
    timestamp: new Date().toISOString()
  });
});

// Démarrer
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
