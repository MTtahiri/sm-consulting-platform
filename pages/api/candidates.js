import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    console.log('🔄 Tentative d\'accès à la feuille...');
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Test avec une plage très simple
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'A1:A1',
    });

    console.log('✅ ACCÈS RÉUSSI!');
    res.status(200).json({ 
      success: true,
      message: 'Connexion établie avec Google Sheets',
      testData: response.data.values
    });

  } catch (error) {
    console.error('❌ ERREUR CRITIQUE:', error);
    
    // Message d'erreur très détaillé
    if (error.code === 403) {
      return res.status(403).json({
        error: 'ACCÈS REFUSÉ par Google Sheets',
        details: {
          sheetId: process.env.GOOGLE_SHEETS_ID,
          serviceAccount: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
          reason: 'La feuille n\'est pas partagée avec le compte de service OU l\'ID est incorrect'
        },
        steps: [
          '1. OUVRE cette URL: https://docs.google.com/spreadsheets/d/***REMOVED***/edit',
          '2. Clique sur PARTAGER',
          '3. Ajoute EXACTEMENT: ***REMOVED***',
          '4. Donne les permissions ÉDITEUR',
          '5. Clique sur ENVOYER'
        ]
      });
    }
    
    res.status(500).json({ 
      error: 'Erreur technique',
      message: error.message 
    });
  }
}