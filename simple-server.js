// simple-server.js - SERVEUR NATIF SANS EXPRESS
const http = require("http");
const PORT = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
  console.log(`📨 Requête reçue: ${req.method} ${req.url}`);
  
  // Configurer les headers CORS
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.url === "/health" && req.method === "GET") {
    const response = {
      status: "OK",
      service: "SM Consulting Sync - NATIVE",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development"
    };
    res.writeHead(200);
    res.end(JSON.stringify(response));
    return;
  }
  
  if (req.url === "/sync-cv-drive" && req.method === "POST") {
    const response = {
      success: true,
      message: "Serveur natif opérationnel!",
      steps: ["1. ✅ Serveur HTTP natif démarré", "2. ✅ Prêt pour Express"],
      timestamp: new Date().toISOString(),
      env_check: {
        has_google_email: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        has_google_key: !!process.env.GOOGLE_PRIVATE_KEY,
        has_drive_folder: !!process.env.DRIVE_FOLDER_ID,
        has_sheet_id: !!process.env.GOOGLE_SHEET_ID
      }
    };
    res.writeHead(200);
    res.end(JSON.stringify(response));
    return;
  }
  
  // Route par défaut
  res.writeHead(404);
  res.end(JSON.stringify({ error: "Route non trouvée", path: req.url }));
});

server.listen(PORT, () => {
  console.log(`🚀 Serveur NATIF démarré sur le port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🔄 Sync: POST http://localhost:${PORT}/sync-cv-drive`);
});
// FORCE NEW DEPLOYMENT - Serveur opérationnel
