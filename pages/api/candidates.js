import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('🔧 API Candidates - Début');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        // Remplace correctement les \n par de vrais retours à la ligne
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    console.log('📋 Sheet ID:', spreadsheetId);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'consultants!A:U',
    });

    console.log('📊 Données brutes:', response.data);

    const rows = response.data.values;
    console.log('📊 Lignes reçues:', rows ? rows.length : 0);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Aucune donnée trouvée' });
    }

    const headers = rows[0];
    console.log('📋 En-têtes:', headers);

    const getColumnData = (row, columnName) => {
      const index = headers.findIndex(header =>
        header.toLowerCase().includes(columnName.toLowerCase())
      );
      return index >= 0 ? row[index] || '' : '';
    };

    const candidates = rows.slice(1).map((row, index) => {
      return {
        id: getColumnData(row, 'id') || (index + 1).toString(),
        titre: getColumnData(row, 'titre') || "Consultant",
        annees_experience: getColumnData(row, 'annees_experience'),
        competences: getColumnData(row, 'competences'),
        formation: getColumnData(row, 'formation'),
        secteur_recherche: getColumnData(row, 'secteur_recherche'),
        mobilite: getColumnData(row, 'mobilite'),
        experience_resume: getColumnData(row, 'experience_resume'),
        specialite: getColumnData(row, 'specialite'),
        niveau_expertise: getColumnData(row, 'niveau_expertise'),
        technologies_cles: getColumnData(row, 'technologies_cles'),
        secteurs_experience: getColumnData(row, 'secteurs_experience'),
        soft_skills: getColumnData(row, 'soft_skills'),
        realisations_chiffrees: getColumnData(row, 'realisations_chiffrees'),
        teletravail: getColumnData(row, 'teletravail'),
        mobilite_geographique: getColumnData(row, 'mobilite_geographique'),
        tjm_min: parseFloat(getColumnData(row, 'tjm_min')) || 0,
        tjm_max: parseFloat(getColumnData(row, 'tjm_max')) || 0,
        disponibilite: getColumnData(row, 'disponibilite'),
        projets_realises: getColumnData(row, 'projets_realises')
      };
    });

    console.log('✅ Nombre de candidats traités:', candidates.length);
    res.status(200).json(candidates);

  } catch (error) {
    console.error('❌ Erreur API candidates:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des données',
      error: error.message
    });
  }
}
