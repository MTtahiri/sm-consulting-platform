import Airtable from 'airtable';

export default async function handler(req, res) {
  // Extraire l'ID depuis l'URL (ex: /api/offres/rec123456)
  const id = req.url.split('/').pop();
  
  console.log('📥 API offres/id - ID:', id, 'Méthode:', req.method);

  // SUPPRESSION D'OFFRE
  if (req.method === 'DELETE') {
    try {
      const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
        .base(process.env.AIRTABLE_BASE_ID);

      await base('Offres').destroy(id);

      res.status(200).json({
        success: true,
        message: 'Offre supprimée avec succès'
      });

    } catch (error) {
      console.error('Erreur suppression offre:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // MISE À JOUR STATUT
  else if (req.method === 'PATCH') {
    try {
      const { statut } = req.body;
      
      const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
        .base(process.env.AIRTABLE_BASE_ID);

      await base('Offres').update(id, {
        'statut': statut
      });

      res.status(200).json({
        success: true,
        message: 'Statut mis à jour'
      });

    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // MÉTHODE NON AUTORISÉE
  else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
