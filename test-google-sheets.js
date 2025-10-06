import { google } from 'googleapis';

async function testSheetsAPI() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    console.log('Sheet ID:', spreadsheetId);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'consultants!A:U',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found.');
      return;
    }

    console.log('Nombre de lignes récupérées:', rows.length);
    console.log('Première ligne:', rows[0]);

  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
  }
}

testSheetsAPI();
