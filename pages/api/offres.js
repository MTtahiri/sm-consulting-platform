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
    
    // Essayer de récupérer les offres
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'Offres!A:K',
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      // Retourner des offres par défaut si la feuille est vide
      const offresParDefaut = [
        {
          id: '1',
          titre: 'Développeur Full Stack JavaScript',
          entreprise: 'Startup Tech',
          type: 'CDI',
          experience: '3-5 ans',
          technologies: ['React', 'Node.js', 'TypeScript'],
          localisation: 'Paris / Remote',
          date: '2024-01-15',
          description: 'Rejoignez une équipe innovante pour développer des applications web modernes.',
          urgent: true,
          statut: 'active'
        },
        {
          id: '2',
          titre: 'Data Scientist Python',
          entreprise: 'Groupe International',
          type: 'CDI',
          experience: '2-4 ans',
          technologies: ['Python', 'Machine Learning', 'SQL'],
          localisation: 'Lyon',
          date: '2024-01-10',
          description: 'Analyser des données complexes et développer des modèles prédictifs.',
          urgent: false,
          statut: 'active'
        }
      ];
      return res.status(200).json(offresParDefaut);
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
    
    // En cas d'erreur, retourner des offres par défaut
    const offresParDefaut = [
      {
        id: '1',
        titre: 'Développeur Full Stack',
        entreprise: 'Entreprise Partenaire',
        type: 'CDI',
        experience: '2+ ans',
        technologies: ['JavaScript', 'React', 'Node.js'],
        localisation: 'Remote',
        date: '2024-01-01',
        description: 'Poste de développeur full stack dans une entreprise innovante.',
        urgent: false,
        statut: 'active'
      }
    ];
    
    res.status(200).json(offresParDefaut);
  }
}
