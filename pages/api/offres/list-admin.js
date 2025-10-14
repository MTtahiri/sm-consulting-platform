import Airtable from 'airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
      .base(process.env.AIRTABLE_BASE_ID);

    // Récupérer TOUTES les offres pour l'admin
    const records = await base('Offres')
      .select({
        sort: [{ field: 'date_publication', direction: 'desc' }],
        maxRecords: 100
      })
      .firstPage();

    console.log('📋 API list-admin -', records.length, 'offres trouvées');

    const offres = records.map(record => ({
      id: record.getId(),
      titre: record.get('titre') || '',
      entreprise: record.get('entreprise') || '',
      localisation: record.get('localisation') || '',
      type_contrat: record.get('type_contrat') || '',
      salaire: record.get('salaire') || '',
      description: record.get('description') || '',
      competences_requises: record.get('competences_requises') || '',
      statut: record.get('statut') || 'Ouverte',
      date_publication: record.get('date_publication') || ''
    }));

    res.status(200).json({
      success: true,
      offres: offres,
      total: offres.length
    });

  } catch (error) {
    console.error('❌ Erreur liste offres admin:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
