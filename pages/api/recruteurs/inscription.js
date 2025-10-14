// pages/api/recruteurs/inscription.js
import Airtable from 'airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { company, name, email, phone, position, hiringNeeds, message } = req.body;

    // Validation des champs obligatoires
    if (!company || !name || !email || !position || !hiringNeeds) {
      return res.status(400).json({ 
        error: 'Entreprise, nom, email, poste et besoins sont obligatoires' 
      });
    }

    // Configuration Airtable
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.AIRTABLE_BASE_ID);

    const recordData = {
      'company': company,
      'name': name,
      'email': email,
      'phone': phone || '',
      'position': position,
      'hiringNeeds': hiringNeeds,
      'message': message || '',
      // 'date_inscription' sera auto-rempli par Airtable
    };

    const records = await base('Recruteurs').create([
      { fields: recordData }
    ]);

    res.status(200).json({
      success: true,
      message: '✅ Inscription recruteur enregistrée avec succès!',
      record: {
        id: records[0].getId(),
        fields: records[0].fields
      }
    });

  } catch (error) {
    console.error('❌ Erreur inscription recruteur:', error);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}