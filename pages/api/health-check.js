// pages/api/health-check.js
export default function handler(req, res) {
  console.log('Health check called');
  res.status(200).json({ 
    status: 'healthy',
    message: 'API is working',
    timestamp: new Date().toISOString(),
    environment: {
      has_google_email: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      has_cron_secret: !!process.env.CRON_SECRET,
      has_drive_folder: !!process.env.DRIVE_FOLDER_ID
    }
  });
}
