// api/airtable.js
export default async function handler(req, res) {
  // Vérifier que la méthode est GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  try {
    // Vérifier que les variables d'environnement sont configurées
    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID || !process.env.AIRTABLE_TABLE_NAME) {
      return res.status(500).json({ 
        error: 'Configuration manquante',
        details: 'Les variables d\'environnement Airtable ne sont pas configurées sur Vercel.'
      });
    }

    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = encodeURIComponent(process.env.AIRTABLE_TABLE_NAME);
    const apiUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;

    // Faire la requête à l'API Airtable
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Vérifier si la réponse est OK
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: 'Erreur Airtable',
        status: response.status,
        details: errorData.error || response.statusText
      });
    }

    // Récupérer les données
    const data = await response.json();
    
    // Retourner les données
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Erreur API Airtable:', error);
    res.status(500).json({ 
      error: 'Erreur interne du serveur',
      details: error.message 
    });
  }
}
