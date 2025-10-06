// pages/api/recent-activity.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ici vous pouvez connecter à votre Google Sheets "Activité"
    // ou générer depuis les données candidates existantes
    
    const recentActivity = [
      {
        id: 1,
        type: 'sync_completed',
        message: 'Synchronisation Google Sheets terminée',
        timestamp: new Date().toISOString(),
        icon: '🔄'
      }
    ];

    res.status(200).json(recentActivity);
  } catch (error) {
    console.error('Erreur API recent-activity:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}