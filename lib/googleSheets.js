import { GoogleSpreadsheet } from 'google-spreadsheet';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

export async function fetchData() {
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

  await doc.useServiceAccountAuth({
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY,
  });

  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];
  await sheet.loadHeaderRow();

  const rows = await sheet.getRows();

  return rows.map(row => ({
    id: row.id,
    prenom: row.prenom,
    titre: row.titre,
    competences: row.competences ? row.competences.split(',').map(s => s.trim()) : [],
    annees_experience: row.annees_experience,
    experience_resume: row.experience_resume,
    formation: row.formation,
    secteur_recherche: row.secteur_recherche,
    mobilite: row.mobilite,
    cv_url: row.lien_cv || '#',
  }));
}
