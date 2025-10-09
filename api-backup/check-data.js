// pages/api/check-data.js
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const serviceAccountAuth = new JWT({
  email: "service-account-smc@sm-consulting-platform.iam.gserviceaccount.com",
  key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export default async function handler(req, res) {
  try {
    const doc = new GoogleSpreadsheet("1H4bSpOvOEMQ8ftg3aZyf8XJmtDFi9JIN8WaRTuwtUzQ", serviceAccountAuth);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();
    
    // Analyse complète des données
    const analysis = {
      totalConsultants: rows.length,
      headers: sheet.headerValues,
      sampleData: rows.slice(0, 5).map(row => ({
        id: row.get('id'),
        titre: row.get('titre'),
        competences: row.get('competences'),
        annees_experience: row.get('annees_experience'),
        mobilite: row.get('mobilite')
      })),
      missingData: {
        sans_id: rows.filter(r => !r.get('id')).length,
        sans_titre: rows.filter(r => !r.get('titre')).length,
        sans_competences: rows.filter(r => !r.get('competences')).length
      }
    };
    
    res.status(200).json(analysis);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}