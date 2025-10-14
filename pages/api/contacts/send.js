// pages/api/contacts/send.js
import Airtable from 'airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { nom, email, telephone, company, sujet, message, source } = req.body;

    // Validation des champs obligatoires
    if (!nom || !email || !sujet || !message) {
      return res.status(400).json({ 
        error: 'Nom, email, sujet et message sont obligatoires' 
      });
    }

    // Configuration Airtable
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.AIRTABLE_BASE_ID);

    const recordData = {
      'nom': nom,
      'email': email,
      'telephone': telephone || '',
      'company': company || '',
      'sujet': sujet,
      'message': message,
      'source': source || 'page_contact'
    };

    const records = await base('Contacts').create([
      { fields: recordData }
    ]);

    res.status(200).json({
      success: true,
      message: '✅ Message envoyé avec succès!',
      record: {
        id: records[0].getId(),
        fields: records[0].fields
      }
    });

  } catch (error) {
    console.error('❌ Erreur envoi contact:', error);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}