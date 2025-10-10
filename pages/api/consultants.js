// pages/api/consultants.js - VERSION MODERNE
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(req, res) {
  try {
    console.log('🚀 DÉMARRAGE API consultants...');

    const sheetId = process.env.GOOGLE_SHEET_ID;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!sheetId || !clientEmail || !privateKey) {
      throw new Error('Variables manquantes: ' + 
        [!sheetId && 'GOOGLE_SHEET_ID', 
         !clientEmail && 'GOOGLE_SERVICE_ACCOUNT_EMAIL', 
         !privateKey && 'GOOGLE_PRIVATE_KEY'].filter(Boolean).join(', '));
    }

    console.log('🔐 Authentification JWT...');
    
    // CORRECTION : Syntaxe moderne avec JWT direct
    const auth = new JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
      ],
    });

    console.log('📊 Initialisation Google Sheets...');
    const doc = new GoogleSpreadsheet(sheetId, auth);
    
    console.log('✅ Chargement des informations...');
    await doc.loadInfo();
    
    console.log('📑 Titre du document:', doc.title);
    console.log('📋 Feuilles disponibles:', Object.keys(doc.sheetsByTitle));
    
    const sheet = doc.sheetsByTitle['consultants'];
    if (!sheet) {
      const availableSheets = Object.keys(doc.sheetsByTitle);
      throw new Error(`Feuille "consultants" non trouvée. Feuilles disponibles: ${availableSheets.join(', ')}`);
    }

    console.log('📄 Chargement des lignes...');
    const rows = await sheet.getRows();
    console.log(`🎯 ${rows.length} lignes de données trouvées!`);

    const consultants = rows.map((row, index) => {
      const titre = row.get('titre') || '';
      const mots = titre.split(' ').filter(word => word.length > 0);
      const initials = mots.length >= 2 
        ? (mots[0].charAt(0) + mots[1].charAt(0)).toUpperCase()
        : mots.length === 1 
          ? mots[0].charAt(0).toUpperCase()
          : '';

      return {
        id: row.get('id') || `consultant-${index + 1}`,
        initials,
        titre: titre,
        competences: row.get('competences')?.split(',').map(s => s.trim()) || [],
        annees_experience: parseInt(row.get('annees_experience')) || 0,
        experience: row.get('experience') || row.get('experience_resume') || '',
        formation: row.get('formation') || '',
        mobilite: row.get('mobilite') || row.get('mobilite_geographique') || '',
      };
    });

    console.log(`✅ ${consultants.length} consultants transformés!`);
    
    res.status(200).json({ 
      success: true, 
      count: consultants.length,
      consultants,
      message: `🎉 ${consultants.length} consultants chargés depuis Google Sheets!`
    });
    
  } catch (error) {
    console.error('❌ ERREUR DÉTAILLÉE:', error);
    
    let solution = '';
    if (error.message.includes('invalid_grant')) {
      solution = 'Le Google Sheet doit être partagé avec: ' + process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    } else if (error.message.includes('not found')) {
      solution = 'Vérifiez le GOOGLE_SHEET_ID dans les variables d\'environnement';
    } else {
      solution = 'Vérifiez la configuration Google Sheets';
    }

    res.status(500).json({ 
      success: false, 
      error: error.message,
      solution: solution
    });
  }
}