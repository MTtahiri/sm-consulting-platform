import Airtable from 'airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { 
      titre, 
      entreprise, 
      localisation, 
      type_contrat, 
      salaire, 
      description, 
      competences_requises 
    } = req.body;

    console.log('📥 Données reçues pour nouvelle offre:', {
      titre, entreprise, localisation, type_contrat
    });

    // Validation des champs requis
    if (!titre || !entreprise || !localisation || !type_contrat || !description || !competences_requises) {
      return res.status(400).json({
        success: false,
        error: 'Tous les champs marqués * sont obligatoires'
      });
    }

    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
      .base(process.env.AIRTABLE_BASE_ID);

    // FORMAT DE DATE CORRECT POUR AIRTABLE
    const aujourdHui = new Date();
    const dateAirtable = aujourdHui.toISOString().split('T')[0]; // Format: "2025-10-12"

    console.log('📅 Date formatée pour Airtable:', dateAirtable);

    // Créer l'offre dans Airtable avec le bon format de date
    const record = await base('Offres').create({
      'titre': titre,
      'entreprise': entreprise,
      'localisation': localisation,
      'type_contrat': type_contrat,
      'salaire': salaire || '',
      'description': description,
      'competences_requises': competences_requises,
      'statut': 'Ouverte',
      'date_publication': dateAirtable  // Format correct pour Airtable
    });

    console.log('✅ Offre créée avec ID:', record.getId());

    res.status(201).json({
      success: true,
      message: 'Offre publiée avec succès',
      recordId: record.getId()
    });

  } catch (error) {
    console.error('❌ Erreur création offre:', error);
    
    // Message d'erreur plus détaillé
    let errorMessage = 'Erreur lors de la création de l\'offre';
    if (error.error === 'INVALID_VALUE_FOR_COLUMN') {
      errorMessage = 'Format de données incorrect pour Airtable';
    } else if (error.message.includes('date_publication')) {
      errorMessage = 'Problème avec le format de date';
    }
    
    res.status(500).json({
      success: false,
      error: errorMessage,
      details: error.message
    });
  }
}
