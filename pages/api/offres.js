import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('🔧 API Offres - Début');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    if (!spreadsheetId) {
      console.error('❌ GOOGLE_SHEETS_ID non défini');
      return res.status(500).json({ message: 'Spreadsheet ID not configured' });
    }
    console.log('📋 Sheet ID:', spreadsheetId);

    // Plage : onglet "Offres", colonnes A:J (ajuste si nécessaire)
    const range = 'Offres!A:K';
    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });

    const rows = response.data.values;
    console.log('📊 Lignes reçues Offres:', rows ? rows.length : 0);

    if (!rows || rows.length <= 1) {
      return res.status(200).json([]); // aucune offre -> renvoyer tableau vide
    }

    const headers = rows[0].map(h => (h || '').toString().trim().toLowerCase());
    console.log('📋 En-têtes Offres:', headers);

    const findIndex = (name) => {
      const lower = name.toLowerCase();
      return headers.findIndex(h => h.includes(lower));
    };

    const idx = {
      id: findIndex('id'),
      titre: findIndex('titre'),
      entreprise: findIndex('entreprise'),
      type: findIndex('type'),
      experience: findIndex('experience'),
      technologies: findIndex('technologies'),
      localisation: findIndex('localisation'),
      date: findIndex('date'),
      description: findIndex('description'),
      urgent: findIndex('urgent'),
      statut: findIndex('statut'),
    };

    const parseBool = (v) => {
      if (!v) return false;
      const s = v.toString().trim().toLowerCase();
      return ['1', 'true', 'yes', 'oui', 'y'].includes(s);
    };

    const offres = rows.slice(1).map((row, i) => {
      const get = (index) => (index >= 0 ? (row[index] ?? '').toString().trim() : '');

      const rawTech = get(idx.technologies);
      const techs = rawTech ? rawTech.split(/[,;|]/).map(t => t.trim()).filter(Boolean) : [];

      const dateRaw = get(idx.date);
      const parsedDate = dateRaw ? (isNaN(Date.parse(dateRaw)) ? null : new Date(dateRaw).toISOString()) : null;

      return {
        id: get(idx.id) || (i + 1).toString(),
        titre: get(idx.titre) || 'Offre',
        entreprise: get(idx.entreprise) || '',
        type: get(idx.type) || '',
        experience: get(idx.experience) || '',
        technologies: techs,
        localisation: get(idx.localisation) || '',
        date: parsedDate,
        description: get(idx.description) || '',
        urgent: parseBool(get(idx.urgent)),
        statut: get(idx.statut) || 'actif',
      };
    });

    console.log('✅ Nombre d\'offres traitées:', offres.length);
    return res.status(200).json(offres);
  } catch (error) {
    console.error('❌ Erreur API offres:', error);
    return res.status(500).json({
      message: 'Erreur lors de la récupération des offres',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
    });
  }
}
