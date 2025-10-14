import Airtable from 'airtable';

export default async function handler(req, res) {
  try {
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.AIRTABLE_BASE_ID);

    const records = await base('Projets')
      .select({
        sort: [{ field: 'date_debut', direction: 'desc' }],
        maxRecords: 50
      })
      .firstPage();

    const projets = records.map(record => ({
      id: record.getId(),
      titre: record.get('titre') || '',
      client: record.get('client') || '',
      description: record.get('description') || '',
      technologies: record.get('technologies') || '',
      duree: record.get('duree') || '',
      budget: record.get('budget') || '',
      statut: record.get('statut') || '',
      date_debut: record.get('date_debut') || ''
    }));

    res.status(200).json({
      success: true,
      projets: projets,
      total: projets.length
    });

  } catch (error) {
    console.error('Erreur liste projets:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
