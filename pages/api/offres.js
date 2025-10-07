// pages/api/offres.js - VERSION AVEC DEBUG COMPLET
export default async function handler(req, res) {
  console.log("🎯 API offres appelée - Méthode:", req.method);
  
  // Vérifier que c'est une requête GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    console.log("🔄 Début traitement API offres");
    
    // Données d'exemple garanties
    const offresExemple = [
      {
        id: "1",
        titre: "Développeur Fullstack React/Node.js",
        entreprise: "TechInnov",
        type: "CDI",
        experience: "3+ ans",
        technologies: ["React", "Node.js", "TypeScript", "MongoDB"],
        localisation: "Paris",
        date: "2025-01-15",
        description: "Rejoignez notre équipe pour développer des applications web innovantes.",
        urgent: false,
        statut: "active"
      },
      {
        id: "2", 
        titre: "Data Scientist Senior",
        entreprise: "DataCorp",
        type: "CDI",
        experience: "5+ ans",
        technologies: ["Python", "TensorFlow", "SQL", "PyTorch"],
        localisation: "Lyon/Télétravail",
        date: "2025-01-10",
        description: "Créez des modèles de machine learning pour nos clients.",
        urgent: true,
        statut: "active"
      }
    ];

    console.log("✅ Préparation réponse avec", offresExemple.length, "offres");

    // Réponse JSON explicite
    const response = {
      success: true,
      count: offresExemple.length,
      offres: offresExemple,
      timestamp: new Date().toISOString()
    };

    // Headers explicites pour JSON
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    
    console.log("📤 Envoi réponse JSON");
    res.status(200).json(response);

  } catch (error) {
    console.error("💥 ERREUR CRITIQUE API offres:", error);
    
    // Réponse d'erreur en JSON
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({
      success: false,
      error: "Erreur interne du serveur",
      message: error.message,
      code: "API_OFFRES_ERROR"
    });
  }
}
