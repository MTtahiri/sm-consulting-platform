// test-sheets.js
const { GoogleSpreadsheet } = require('google-spreadsheet');

async function testConnection() {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SHEET_EMAIL,
      private_key: process.env.GOOGLE_SHEET_PRIVATE_KEY?.replace(/\\n/g, '\n')
    });

    await doc.loadInfo();
    console.log('✅ Connexion réussie !');
    console.log('📄 Nom du document:', doc.title);
    
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadHeaderRow();
    console.log('📊 Colonnes:', sheet.headerValues);
    
    const rows = await sheet.getRows();
    console.log('📋 Nombre de consultants:', rows.length);
    
    if (rows.length > 0) {
      console.log('👤 Premier consultant:', {
        id: rows[0].id,
        titre: rows[0].titre,
        competences: rows[0].competences
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  }
}

testConnection();