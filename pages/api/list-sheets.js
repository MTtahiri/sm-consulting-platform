// pages/api/list-sheets.js
import { google } from 'googleapis';

export default async function handler(req, res) {
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

    // Obtenir les métadonnées de la spreadsheet
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheetNames = response.data.sheets.map(sheet => sheet.properties.title);
    
    console.log('📊 Feuilles disponibles:', sheetNames);

    res.status(200).json({
      success: true,
      sheetNames: sheetNames,
      firstSheet: sheetNames[0] || 'Aucune feuille trouvée'
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({
      error: 'Erreur liste feuilles',
      details: error.message
    });
  }
}
