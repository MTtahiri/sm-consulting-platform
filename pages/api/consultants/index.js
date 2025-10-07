// pages/api/consultants/index.js - VERSION CORRIGÉE
import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('🔍 Chargement consultants depuis Google Sheets...');
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Lecture de TOUTES les colonnes pour debug
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'consultants!A:U', // Toutes les colonnes
    });

    const rows = response.data.values;
    console.log('📊 Lignes trouvées:', rows ? rows.length : 0);

    if (!rows || rows.length === 0) {
      return res.status(200).json({ consultants: [], total: 0 });
    }

    // Affiche les en-têtes pour debug
    const headers = rows[0];
    console.log('🏷️ En-têtes des colonnes:', headers);

    // Transformation avec mapping corrigé
    const consultants = rows.slice(1).map((row, index) => {
      // Remplir les cases manquantes
      const fullRow = [...row, ...Array(21 - row.length).fill('')];
      
      console.log(`📝 Ligne ${index + 1}:`, fullRow.slice(0, 5)); // Log les premières colonnes
      
      return {
        id: fullRow[0] || `consultant-${index + 1}`,
        titre: fullRow[1] || 'Consultant IT',
        competences: fullRow[2] ? fullRow[2].split(',').map(s => s.trim()).filter(Boolean) : [],
        annees_experience: parseInt(fullRow[3]) || 0,
        experience_resume: fullRow[4] || 'Expérience en informatique',
        formation: fullRow[5] || '',
        secteur_recherche: fullRow[6] || '',
        mobilite: fullRow[7] || '',
        lien_cv: fullRow[8] || '',
        specialite: fullRow[9] || 'Développement Fullstack', // Colonne spécialité
        niveau_expertise: fullRow[10] || 'Senior',
        // CORRECTION : Ces colonnes sont probablement vides dans ton sheet
        technologies_cles: fullRow[11] ? fullRow[11].split(',').map(s => s.trim()).filter(Boolean) : 
                            fullRow[2] ? fullRow[2].split(',').map(s => s.trim()).filter(Boolean).slice(0, 5) : [], // Fallback sur compétences
        secteurs_experience: fullRow[12] ? fullRow[12].split(',').map(s => s.trim()).filter(Boolean) : 
                            fullRow[6] ? [fullRow[6]] : ['Tech'], // Fallback sur secteur_recherche
        soft_skills: fullRow[13] ? fullRow[13].split(',').map(s => s.trim()).filter(Boolean) : 
                     ['Autonomie', 'Rigueur', 'Communication'], // Valeurs par défaut
        realisations_chiffrees: fullRow[14] || '',
        teletravail: fullRow[15] || 'Oui',
        mobilite_geographique: fullRow[16] || 'Île-de-France',
        tjm_min: parseInt(fullRow[17]) || 500,
        tjm_max: parseInt(fullRow[18]) || 800,
        disponibilite: fullRow[19] || 'Disponible',
        projets_realises: fullRow[20] ? fullRow[20].split(';').map(s => s.trim()).filter(Boolean) : 
                         ['Applications web', 'Architecture cloud'] // Valeurs par défaut
      };
    });

    console.log(`✅ ${consultants.length} consultants transformés`);

    res.status(200).json({ 
      consultants: consultants,
      total: consultants.length
    });

  } catch (error) {
    console.error('❌ Erreur API consultants:', error);
    res.status(500).json({ 
      error: 'Erreur de chargement',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}