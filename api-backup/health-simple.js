// pages/api/health-simple.js - API SIMPLE À LA RACINE
export default function handler(req, res) {
  res.status(200).json({
    status: "ok",
    message: "Simple health check working!",
    timestamp: new Date().toISOString(),
    path: "/api/health-simple"
  });
}
