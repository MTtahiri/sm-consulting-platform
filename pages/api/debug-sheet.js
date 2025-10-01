// pages/api/debug-sheet.js
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export default async function handler(req, res) {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();
    
    // Afficher la structure
    const structure = {
      sheetTitle: doc.title,
      headers: sheet.headerValues,
      totalRows: rows.length,
      firstRow: rows[0] ? sheet.headerValues.reduce((acc, header) => {
        acc[header] = rows[0].get(header);
        return acc;
      }, {}) : null,
      sampleData: rows.slice(0, 3).map(row => ({
        id: row.get('id'),
        titre: row.get('titre'),
        competences: row.get('competences')
      }))
    };
    
    res.status(200).json(structure);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}