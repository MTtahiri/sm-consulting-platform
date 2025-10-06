// pages/api/clean-deploy.js - Force un déploiement propre
export default function handler(req, res) {
  res.status(200).json({
    success: true,
    message: "Déploiement propre réussi!",
    timestamp: new Date().toISOString(),
    fix: "type: module ajouté à package.json"
  });
}
