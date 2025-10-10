// pages/api/consultants.js
import { config } from 'dotenv';
import path from 'path';
import { google } from '@googleapis/sheets';

// Charger .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

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
    console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'undefined');
    console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID || 'undefined');
    console.log('GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? '[REDACTED]' : 'undefined');

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

    // Configurer l'authentification
    console.log('🔗 Début de l\'authentification Google...');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    console.log('✅ Authentification Google réussie');

    const sheets = google.sheets({ version: 'v4', auth });

    // Récupérer les données de l'onglet "consultants"
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'consultants!A:Z', // Ajustez la plage selon votre onglet
    });

    const rows = response.data.values || [];
    console.log(`📈 ${rows.length} lignes trouvées`);

    if (rows.length === 0) {
      throw new Error('Aucune donnée trouvée dans le Google Sheet');
    }

    // Vérifier les colonnes obligatoires
    const headers = rows[0] || [];
    const requiredHeaders = ['id', 'titre', 'competences', 'annees_experience'];
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));

    if (missingHeaders.length > 0) {
      throw new Error(`Colonnes manquantes dans le Google Sheet: ${missingHeaders.join(', ')}`);
    }

    // Transformer les données
    const consultants = rows.slice(1).map((row, index) => {
      const rowData = {};
      headers.forEach((header, i) => {
        rowData[header] = row[i] || '';
      });
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
    console.error('❌ ERREUR API consultants:', error.message, error.stack);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Vérifiez les variables d\'environnement Google Sheets et la configuration de @googleapis/sheets'
    });
  }
}
