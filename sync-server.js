// sync-server.js - API COMPLÈTE POUR RENDER
const { GoogleSpreadsheet } = require('google-spreadsheet');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Route principale - Page d'accueil de l'API
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API SM Consulting - Synchronisation Google Sheets',
    version: '1.0.0',
    endpoints: {
      consultants: '/consultants',
      health: '/health'
    }
  });
});

// Route santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Google Sheets opérationnelle',
    timestamp: new Date().toISOString()
  });
});

// ROUTE CONSULTANTS - Récupère tous les consultants depuis Google Sheets
app.get('/consultants', async (req, res) => {
  try {
    console.log('🔗 Début récupération consultants...');
    
    // Vérifier les variables d'environnement
    if (!process.env.GOOGLE_SHEET_ID) {
      throw new Error('GOOGLE_SHEET_ID manquant dans les variables d\'environnement');
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
    
    // Lister tous les onglets disponibles
    console.log('📑 Onglets disponibles:');
    doc.sheetsByTitle.forEach((sheet, title) => {
      console.log(`   - ${title}`);
    });
    
    // Utiliser l'onglet "consultants"
    let sheet;
    if (doc.sheetsByTitle['consultants']) {
      sheet = doc.sheetsByTitle['consultants'];
      console.log('🎯 Utilisation de l\'onglet "consultants"');
    } else {
      // Fallback sur le premier onglet
      sheet = doc.sheetsByIndex[0];
      console.log('⚠️  Onglet "consultants" non trouvé, utilisation du premier onglet:', sheet.title);
    }

    const rows = await sheet.getRows();
    console.log(`📈 ${rows.length} lignes trouvées dans l'onglet`);
    
    // Afficher les en-têtes de colonnes pour debug
    if (rows.length > 0) {
      console.log('🏷️  Colonnes disponibles:', Object.keys(rows[0].toObject()));
    }

    // Transformer les données
    const consultants = rows.map((row, index) => {
      const rowData = row.toObject();
      console.log(`📝 Ligne ${index + 1}:`, rowData);
      
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
        mobilite_geographique: rowData.mobilite_geographique || 'Île-de-France',
        experience_resume: rowData.experience_resume || '',
        formation: rowData.formation || '',
        // Données brutes pour debug
        _raw: rowData
      };
    });

    console.log(`✅ ${consultants.length} consultants transformés`);

    res.json({
      success: true,
      count: consultants.length,
      consultants: consultants,
      source: 'Google Sheets - Onglet consultants',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ ERREUR CRITIQUE:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
      details: 'Vérifiez les variables d\'environnement et les permissions Google Sheets'
    });
  }
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    availableRoutes: ['/', '/health', '/consultants']
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 API SM Consulting démarrée sur le port ${PORT}`);
  console.log(`📊 URL: http://localhost:${PORT}`);
  console.log(`🔍 Environment: ${process.env.NODE_ENV || 'development'}`);
});