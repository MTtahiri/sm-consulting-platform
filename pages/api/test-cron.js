// pages/api/test-cron.js - Version corrigée
export default function handler(req, res) {
  const authHeader = req.headers.authorization;

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Token invalide' });
  }

  res.status(200).json({ 
    success: true, 
    message: 'Cron test OK',
    timestamp: new Date().toISOString()
  });
}
