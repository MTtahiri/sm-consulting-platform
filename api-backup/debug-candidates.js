// pages/api/debug-candidates.js
export default async function handler(req, res) {
  try {
    const { google } = require('googleapis');
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    // Test de lecture simple
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'consultants!A:Z',
    });

    const rows = response.data.values || [];
    
    console.log('📊 Debug - Nombre de lignes:', rows.length);
    console.log('📊 Debug - En-têtes:', rows[0]);
    
    if (rows.length > 1) {
      console.log('📊 Debug - Première ligne données:', rows[1]);
    }

    res.status(200).json({
      success: true,
      totalRows: rows.length,
      headers: rows[0] || [],
      firstRow: rows[1] || [],
      sample: rows.slice(0, 3) // 3 premières lignes
    });

  } catch (error) {
    console.error('❌ Debug Error:', error);
    res.status(500).json({
      error: 'Erreur debug',
      details: error.message
    });
  }
}

