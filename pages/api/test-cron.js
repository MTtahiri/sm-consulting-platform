// pages/api/test-cron.js
export default function handler(req, res) {
  const authHeader = req.headers.authorization;
  
  if (authHeader !== \Bearer \\) {
    return res.status(401).json({ error: 'Token invalide' });
  }
  
  res.status(200).json({ 
    success: true, 
    message: 'Token CRON valide!',
    timestamp: new Date().toISOString()
  });
}
