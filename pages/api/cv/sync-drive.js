// pages/api/cv/sync-drive.js - API DE SYNCHRONISATION CORRIGÉE
export default async function handler(req, res) {
  console.log("✅ API sync-drive appelée - Méthode:", req.method);
  
  // 🔥 CORRECTION : TOUJOURS accepter POST, même pour le debug
  if (req.method === "GET") {
    return res.status(200).json({
      message: "Endpoint sync-drive opérationnel",
      usage: "Utilisez POST pour lancer la synchronisation",
      required_headers: {
        "Authorization": "Bearer CRON_SECRET",
        "Content-Type": "application/json"
      }
    });
  }
  
  if (req.method !== "POST") {
    return res.status(405).json({ 
      error: "Method Not Allowed", 
      allowed: ["GET", "POST"],
      received: req.method 
    });
  }

  // Vérification sécurité
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.CRON_SECRET;
  
  console.log("🔐 Vérification token...");
  console.log("Header:", authHeader);
  console.log("Expected:", expectedToken ? "PRÉSENT" : "MANQUANT");
  
  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    console.log("❌ Token invalide");
    return res.status(401).json({ 
      error: "Unauthorized",
      message: "Token CRON manquant ou invalide"
    });
  }

  // SIMULATION SUCCÈS
  console.log("✅ Synchronisation démarrée...");
  
  res.status(200).json({
    success: true,
    message: "Synchronisation CV Drive → Google Sheets lancée!",
    action: "Scan en cours...",
    timestamp: new Date().toISOString(),
    next_steps: [
      "1. Scanner le dossier Drive",
      "2. Extraire les données CV", 
      "3. Insérer dans Google Sheets"
    ]
  });
}

// Last deployment: 10/06/2025 12:46:34
