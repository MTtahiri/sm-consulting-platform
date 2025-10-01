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
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Récupérer toutes les données
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'consultants!A:Z', // Ajustez selon le nom de votre feuille
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    // En-têtes de colonnes
    const headers = rows[0];
    
    // Trouver le consultant par ID
    const consultant = rows.slice(1).find(row => {
      const idIndex = headers.indexOf('id');
      return idIndex !== -1 && row[idIndex] === id;
    });

    if (!consultant) {
      return res.status(404).json({ message: 'Consultant not found' });
    }

    // Convertir en objet
    const consultantData = {};
    headers.forEach((header, index) => {
      consultantData[header] = consultant[index] || '';
    });

    res.status(200).json(consultantData);

  } catch (error) {
    console.error('Error fetching consultant:', error);
    res.status(500).json({ 
      message: 'Error fetching consultant data',
      error: error.message 
    });
  }
}