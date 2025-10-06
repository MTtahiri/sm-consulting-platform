// pages/api/debug-simple.js - API SANS VARIABLES
export default function handler(req, res) {
  console.log("🔧 Debug Simple API appelée");
  
  // Cette API n'utilise AUCUNE variable d'environnement
  res.status(200).json({
    success: true,
    message: "Debug API sans variables d'environnement",
    method: req.method,
    timestamp: new Date().toISOString(),
    environment: {
      node_env: process.env.NODE_ENV || "non défini",
      has_sheets_id: !!process.env.GOOGLE_SHEETS_ID,
      has_sheets_email: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      has_sheets_key: !!process.env.GOOGLE_SHEETS_PRIVATE_KEY,
      has_cron_secret: !!process.env.CRON_SECRET
    }
  });
}
