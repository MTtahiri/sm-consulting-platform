export default async function handler(req, res) {
  console.log("🔧 TEST API appelée");
  
  try {
    // Retourner un simple JSON de test
    res.status(200).json({ 
      success: true, 
      message: "API test fonctionnelle",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ Erreur test:", error);
    res.status(500).json({ error: error.message });
  }
}
