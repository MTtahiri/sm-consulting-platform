import Airtable from 'airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { prenom, nom, email, telephone, entreprise_actuelle } = req.body;

    // Validation des champs requis
    if (!prenom || !nom || !email || !telephone) {
      return res.status(400).json({
        success: false,
        error: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.AIRTABLE_BASE_ID);

    // Créer l'enregistrement dans Airtable
    const records = await base('Coaptation').create([
      {
        fields: {
          prenom,
          nom,
          email,
          telephone,
          entreprise_actuelle: entreprise_actuelle || '',
          statut: 'Nouveau',
          source: 'Site Web',
          notes: 'Inscription via formulaire coaptation'
        }
      }
    ]);

    console.log('✅ Nouveau coaptant enregistré:', email);

    res.status(200).json({
      success: true,
      message: '🎉 Votre inscription a été enregistrée ! Nous vous contacterons rapidement.',
      recordId: records[0].getId()
    });

  } catch (error) {
    console.error('❌ Erreur inscription coaptation:', error);

    // Gestion spécifique des erreurs Airtable
    if (error.error === 'DUPLICATE_RECORDS') {
      return res.status(400).json({
        success: false,
        error: 'Cette adresse email est déjà inscrite'
      });
    }

    res.status(500).json({
      success: false,
      error: "Erreur lors de l'inscription. Veuillez réessayer."
    });
  }
}
