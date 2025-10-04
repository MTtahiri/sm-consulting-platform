// pages/api/sync-consultants.js
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
  key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Données d'exemple pour 221 consultants
const SAMPLE_CONSULTANTS = [
  {
    id: "1",
    titre: "Consultant Senior Digital Transformation",
    competences: "Stratégie digitale, Transformation agile, Gestion de projet",
    annees_experience: "12",
    experience_resume: "12 ans dans le conseil en transformation digitale avec expertise en stratégie tech",
    formation: "MBA HEC Paris",
    secteur_recherche: "Tech, Finance, Santé",
    mobilite: "France, Suisse, Belgique",
    cv_url: "#"
  },
  {
    id: "2",
    titre: "Expert Data Science & Machine Learning",
    competences: "Python, Machine Learning, Data Analysis, SQL, Big Data",
    annees_experience: "8",
    experience_resume: "Data Scientist senior avec expertise en ML et analyse prédictive",
    formation: "Master Data Science",
    secteur_recherche: "Tech, Finance, E-commerce",
    mobilite: "Paris, Remote",
    cv_url: "#"
  }
  // ... Ajouter les 219 autres
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    let sheet = doc.sheetsByIndex[0];
    
    // Vérifier si le sheet est vide
    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();
    
    if (rows.length === 0) {
      // Peupler avec des données d'exemple
      console.log('📥 Peuplement du sheet avec des données exemple...');
      
      for (const consultant of SAMPLE_CONSULTANTS) {
        await sheet.addRow(consultant);
      }
      
      return res.json({ 
        success: true, 
        message: `${SAMPLE_CONSULTANTS.length} consultants ajoutés`,
        action: "peuplement"
      });
    } else {
      // Mise à jour des données existantes
      console.log('🔄 Mise à jour des données existantes...');
      
      const updates = [];
      for (const row of rows) {
        // Exemple de mise à jour
        const originalTitle = row.get('titre');
        if (!originalTitle.includes('Senior') && parseInt(row.get('annees_experience')) > 5) {
          row.assign({
            titre: `Senior ${originalTitle}`
          });
          await row.save();
          updates.push(row.get('id'));
        }
      }
      
      return res.json({ 
        success: true, 
        message: `${updates.length} consultants mis à jour`,
        updates: updates,
        action: "mise à jour"
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur synchronisation:', error);
    res.status(500).json({ error: error.message });
  }
}