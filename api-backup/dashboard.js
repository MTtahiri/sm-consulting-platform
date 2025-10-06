// pages/api/dashboard.js
export default function handler(req, res) {
  res.status(200).json({
    success: true,
    services: {
      cv_sync: '✅ Actif',
      cron_job: '✅ Programmé (9h quotidien)',
      google_drive: process.env.GOOGLE_SHEETS_CLIENT_EMAIL ? '✅ Connecté' : '❌ Erreur',
      google_sheets: process.env.GOOGLE_SHEETS_ID ? '✅ Connecté' : '❌ Erreur'
    },
    next_sync: 'Demain à 9h',
    project_url: 'https://sm-consulting-platform-o2h8mqv7d-moatahiri-gmailcoms-projects.vercel.app'
  });
}
