import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        // Il faut remplacer '\\n' par '\n' (double échappement dans chaîne JS)
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Test d'accès au spreadsheet
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    });

    res.status(200).json({
      success: true,
      title: response.data.properties?.title,
      sheets: response.data.sheets?.map(sheet => ({
        title: sheet.properties?.title,
        sheetId: sheet.properties?.sheetId
      }))
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      suggestion: "Partagez le Sheet avec le Service Account: ***REMOVED***"
    });
  }
}
