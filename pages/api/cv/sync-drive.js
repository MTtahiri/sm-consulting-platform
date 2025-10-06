// pages/api/cv/sync-drive.js - VERSION CORRIGÉE
export default async function handler(req, res) {
  console.log("🚀 API sync-drive appelée - Méthode:", req.method);
  
  // ACCEPTER GET pour les tests
  if (req.method === "GET") {
    return res.status(200).json({
      status: "active", 
      message: "CV Sync API is ready",
      usage: "POST avec token d'autorisation",
      timestamp: new Date().toISOString()
    });
  }
  
  // ACCEPTER POST pour la synchronisation
  if (req.method === "POST") {
    console.log("🔐 Vérification token...");
    
    const authHeader = req.headers.authorization;
    const expectedToken = process.env.CRON_SECRET;
    
    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      console.log("❌ Token invalide ou manquant");
      return res.status(401).json({ 
        error: "Unauthorized",
        message: "Token CRON manquant ou invalide"
      });
    }
    
    console.log("✅ Token valide - Démarrage synchronisation...");
    
    // SIMULATION RÉUSSIE
    return res.status(200).json({
      success: true,
      message: "Synchronisation CV Drive → Google Sheets lancée!",
      action: "scan_drive_to_sheets", 
      steps: [
        "1. ✅ Scanner dossier Drive",
        "2. ✅ Extraire données CV",
        "3. ✅ Insérer dans Google Sheets"
      ],
      timestamp: new Date().toISOString(),
      next: "Ajouter la logique réelle de scan"
    });
  }
  
  // Rejeter les autres méthodes
  return res.status(405).json({ 
    error: "Method Not Allowed",
    allowed: ["GET", "POST"],
    received: req.method
  });
}
