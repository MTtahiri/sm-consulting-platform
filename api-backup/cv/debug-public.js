// pages/api/cv/debug-public.js - API PUBLIQUE POUR TEST
export default function handler(req, res) {
  console.log("🔧 Debug Public API appelée");
  
  res.status(200).json({
    success: true,
    message: "API publique fonctionnelle",
    environment: {
      has_cron_secret: !!process.env.CRON_SECRET,
      cron_secret_length: process.env.CRON_SECRET ? process.env.CRON_SECRET.length : 0,
      has_drive_folder: !!process.env.DRIVE_FOLDER_ID,
      has_google_email: !!(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_SHEETS_CLIENT_EMAIL),
      has_google_key: !!(process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_SHEETS_PRIVATE_KEY)
    },
    timestamp: new Date().toISOString()
  });
}
