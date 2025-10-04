import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    console.log('Testing sheet access...');
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    console.log('Sheet ID:', process.env.GOOGLE_SHEETS_ID);
    
    // Test d'accès au spreadsheet
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    });

    console.log('Success! Sheet title:', response.data.properties?.title);
    
    res.status(200).json({
      success: true,
      title: response.data.properties?.title,
      sheets: response.data.sheets?.map(sheet => ({
        title: sheet.properties?.title,
        sheetId: sheet.properties?.sheetId
      }))
    });
    
  } catch (error) {
    console.error('Sheet access error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      suggestion: 'Partagez le Sheet avec: ***REMOVED***'
    });
  }
}
