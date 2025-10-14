export default async function handler(req, res) {
  console.log("🚀 API appelée, méthode:", req.method);
  
  // Répondre immédiatement pour tester
  return res.status(200).json({
    success: true,
    message: "API fonctionne!",
    method: req.method
  });
}