// api/google-sheets.js - API pour Render
const { GoogleSpreadsheet } = require('google-spreadsheet');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Route pour récupérer tous les consultants
app.get('/consultants', async (req, res) => {
  try {
    console.log('🔗 Connexion à Google Sheets...');
    
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();
    console.log('📊 Sheet chargé:', doc.title);
    
    // Utilise l'onglet "consultants"
    const sheet = doc.sheetsByTitle['consultants'];
    const rows = await sheet.getRows();
    
    console.log(`✅ ${rows.length} consultants trouvés`);

    // Transforme les données
    const consultants = rows.map((row, index) => {
      return {
        id: row.get('id') || `consultant-${index + 1}`,
        titre: row.get('titre') || 'Consultant IT',
        competences: row.get('competences') ? 
          row.get('competences').split(',').map(s => s.trim()) : [],
        annees_experience: parseInt(row.get('annees_experience')) || 0,
        specialite: row.get('specialite') || 'Développement',
        niveau_expertise: row.get('niveau_expertise') || 'Confirmé',
        technologies_cles: row.get('technologies_cles') ? 
          row.get('technologies_cles').split(',').map(s => s.trim()) : [],
        tjm_min: parseInt(row.get('tjm_min')) || 400,
        tjm_max: parseInt(row.get('tjm_max')) || 800,
        disponibilite: row.get('disponibilite') || 'Immédiate',
        mobilite_geographique: row.get('mobilite_geographique') || 'Île-de-France',
        experience_resume: row.get('experience_resume') || '',
        formation: row.get('formation') || ''
      };
    });

    res.json({
      success: true,
      count: consultants.length,
      consultants: consultants
    });

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Route santé
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Google Sheets opérationnelle' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 API Google Sheets démarrée sur le port ${PORT}`);
});