// pages/api/consultants.js - API Google Sheets pour Next.js
import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async function handler(req, res) {
  // Autoriser CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    console.log('🔗 Début récupération consultants depuis Google Sheets...');
    
    // Vérifier les variables d'environnement
    if (!process.env.GOOGLE_SHEET_ID) {
      throw new Error('GOOGLE_SHEET_ID manquant');
    }
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL manquant');
    }
    if (!process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('GOOGLE_PRIVATE_KEY manquant');
    }

    console.log('📊 Connexion à Google Sheets...');
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();
    console.log('✅ Google Sheets connecté:', doc.title);
    
    // Utiliser l'onglet "consultants"
    let sheet;
    if (doc.sheetsByTitle['consultants']) {
      sheet = doc.sheetsByTitle['consultants'];
      console.log('🎯 Utilisation de l\'onglet "consultants"');
    } else {
      sheet = doc.sheetsByIndex[0];
      console.log('⚠️  Onglet "consultants" non trouvé, utilisation du premier onglet:', sheet.title);
    }

    const rows = await sheet.getRows();
    console.log(`📈 ${rows.length} lignes trouvées`);
    
    // Transformer les données
    const consultants = rows.map((row, index) => {
      const rowData = row.toObject();
      
      return {
        id: rowData.id || `consultant-${index + 1}`,
        titre: rowData.titre || 'Consultant IT',
        competences: rowData.competences ? 
          rowData.competences.split(',').map(s => s.trim()).filter(Boolean) : [],
        annees_experience: parseInt(rowData.annees_experience) || 0,
        specialite: rowData.specialite || 'Développement',
        niveau_expertise: rowData.niveau_expertise || 'Confirmé',
        technologies_cles: rowData.technologies_cles ? 
          rowData.technologies_cles.split(',').map(s => s.trim()).filter(Boolean) : [],
        tjm_min: parseInt(rowData.tjm_min) || 400,
        tjm_max: parseInt(rowData.tjm_max) || 800,
        disponibilite: rowData.disponibilite || 'Immédiate',
        mobilite_geographique: rowData.mobilite_geographique || 'Île-de-France'
      };
    });

    console.log(`✅ ${consultants.length} consultants transformés`);

    res.status(200).json({
      success: true,
      count: consultants.length,
      consultants: consultants,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ ERREUR API consultants:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Vérifiez les variables d\'environnement Google Sheets'
    });
  }
}