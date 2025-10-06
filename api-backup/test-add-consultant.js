import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('📥 Données reçues:', JSON.stringify(req.body, null, 2));

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    // STRUCTURE EXACTE de vos colonnes
    const rowData = [
      '', // id
      'Test Titre', // titre
      'Test Compétences', // competences
      '5', // annees_experience
      'Test Expérience', // experience_resume
      'Test Formation', // formation
      'Test Secteur', // secteur_recherche
      'Test Mobilité', // mobilite
      'test.pdf', // lien_cv
      'Test Spécialité', // specialite
      'Expert', // niveau_expertise
      'React,Node', // technologies_cles
      'IT', // secteurs_experience
      'Leadership', // soft_skills
      '100K€', // realisations_chiffrees
      'Oui', // teletravail
      'France', // mobilite_geographique
      '500', // tjm_min
      '800', // tjm_max
      'Immédiate', // disponibilite
      '10' // projets_realises
    ];

    console.log('📤 Envoi vers Google Sheets:', rowData);

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:U',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData],
      },
    });

    console.log('✅ Succès:', response.data);

    res.status(200).json({ 
      success: true, 
      message: 'TEST - Consultant ajouté avec succès',
      data: response.data
    });

  } catch (error) {
    console.error('❌ Erreur détaillée:', error);
    res.status(500).json({ 
      error: 'Erreur TEST',
      details: error.message 
    });
  }
}
