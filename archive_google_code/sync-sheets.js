import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'consultants!A:Z',
    });

    const rows = response.data.values;
    
    res.status(200).json({ 
      message: 'Synchronisation réussie', 
      count: rows ? rows.length - 1 : 0 
    });

  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ 
      message: 'Erreur de synchronisation',
      error: error.message 
    });
  }
}
