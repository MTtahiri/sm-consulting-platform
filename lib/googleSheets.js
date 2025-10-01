import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

function getPrivateKey() {
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!rawKey) throw new Error('GOOGLE_PRIVATE_KEY manquante');
  return rawKey.replace(/\\n/g, '\n').trim();
}

const SERVICE_ACCOUNT_PRIVATE_KEY = getPrivateKey();

const authClient = new JWT({
  email: SERVICE_ACCOUNT_EMAIL,
  key: SERVICE_ACCOUNT_PRIVATE_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

let cachedData = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60000; // 1 minute

export async function fetchData() {
  if (cachedData && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedData;
  }

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
  await doc.useOAuth2Client(authClient);
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];
  await sheet.loadHeaderRow();

  const rows = await sheet.getRows();

  const data = rows.map(row => ({
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

  cachedData = data;
  cacheTimestamp = Date.now();
  return data;
}
