// pages/api/cv/sync-drive.js - API DE SYNCHRONISATION
export default async function handler(req, res) {
  console.log("✅ API sync-drive appelée - Méthode:", req.method);
  
  if (req.method !== "POST") {
    return res.status(405).json({ 
      error: "Method Not Allowed", 
      allowed: "POST",
      received: req.method 
    });
  }

  // Vérification sécurité
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.CRON_SECRET;
  
  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    return res.status(401).json({ 
      error: "Unauthorized",
      message: "Token CRON manquant ou invalide"
    });
  }

  // SIMULATION SUCCÈS
  console.log("✅ Synchronisation démarrée...");
  
  res.status(200).json({
    success: true,
    message: "Endpoint de synchronisation opérationnel!",
    action: "Scan Drive → Google Sheets",
    timestamp: new Date().toISOString(),
    next_step: "Ajouter la logique de scan Drive"
  });
}
