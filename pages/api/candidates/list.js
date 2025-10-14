// pages/api/candidates/list.js - AVEC LE BON NOM DE TABLE
import Airtable from 'airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    console.log('🔑 Connexion Airtable avec table: Table 1');

    const base = new Airtable({ 
      apiKey: process.env.AIRTABLE_API_KEY 
    }).base(process.env.AIRTABLE_BASE_ID);

    const records = await base('Table 1').select({
      sort: [{ field: 'date_ajout', direction: 'desc' }]
    }).firstPage();

    console.log('📊 ' + records.length + ' candidats récupérés depuis Airtable');

    const candidatsAnonymes = records.map((record, index) => {
      const fields = record.fields;
      
      return {
        id: record.id,
        titre: fields.poste || `Candidat #${String(index + 1).padStart(3, '0')}`,
        localisation: "Île-de-France", // Par défaut
        type_contrat: "Freelance", // Par défaut
        experience: "3+ ans", // Par défaut
        disponibilite: fields.statut === 'Nouveau' ? 'Disponible' : (fields.statut || 'Disponible'),
        description: `Profil ${fields.poste || 'consultant'} avec compétences en ${fields.competences || 'développement'}`,
        competences_cles: fields.competences ? 
          fields.competences.split(',').map(c => c.trim()).slice(0, 8) : 
          ['Compétences à définir']
      };
    });

    res.status(200).json({
      success: true,
      count: candidatsAnonymes.length,
      candidats: candidatsAnonymes
    });

  } catch (error) {
    console.error('❌ Erreur API candidats:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des candidats',
      details: error.message
    });
  }
}
