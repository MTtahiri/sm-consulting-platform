import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    // Formatage correct de la clé privée
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
    
    if (!privateKey) {
      return res.status(500).json({ error: 'Clé privée manquante' });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Test de connexion
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'A1:A5', // Petite plage pour tester
    });

    res.status(200).json({ 
      success: true,
      message: '✅ Connexion à Google Sheets réussie!',
      data: response.data.values || []
    });

  } catch (error) {
    console.error('Erreur détaillée:', error);
    
    if (error.code === 403) {
      return res.status(403).json({
        error: 'Accès refusé',
        message: 'La feuille n\'est pas partagée avec le compte de service',
        solution: `Partage la feuille avec: ${process.env.GOOGLE_SHEETS_CLIENT_EMAIL}`
      });
    }
    
    res.status(500).json({ 
      error: 'Erreur technique',
      message: error.message 
    });
  }
}