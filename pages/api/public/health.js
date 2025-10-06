// pages/api/public/health.js - API PUBLIQUE
export default function handler(req, res) {
  res.status(200).json({
    status: "ok", 
    message: "Public health API working!",
    timestamp: new Date().toISOString(),
    path: "/api/public/health"
  });
}
