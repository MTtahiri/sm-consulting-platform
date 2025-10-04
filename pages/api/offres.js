import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'Offres!A:K', // A à K pour toutes les colonnes
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Aucune offre trouvée' });
    }

    const headers = rows[0];
    
    // Mapping des colonnes
    const offres = rows.slice(1).map((row, index) => {
      const getValue = (columnName) => {
        const index = headers.findIndex(header => 
          header.toLowerCase().includes(columnName.toLowerCase())
        );
        return index >= 0 ? row[index] || '' : '';
      };

      return {
        id: getValue('id') || (index + 1).toString(),
        titre: getValue('titre'),
        entreprise: getValue('entreprise'),
        type: getValue('type'),
        experience: getValue('experience'),
        technologies: getValue('technologies') ? getValue('technologies').split(',').map(t => t.trim()) : [],
        localisation: getValue('localisation'),
        date: getValue('date'),
        description: getValue('description'),
        urgent: getValue('urgent') === 'true',
        statut: getValue('statut') || 'active'
      };
    });

    // Filtrer seulement les offres actives
    const offresActives = offres.filter(offre => offre.statut === 'active');

    res.status(200).json(offresActives);

  } catch (error) {
    console.error('❌ Erreur API offres:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des offres',
      error: error.message
    });
  }
}
