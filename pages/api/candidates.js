import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: "Method not allowed" });

  try {
    const auth = new JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'consultants!A:U',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return res.status(404).json({ message: "Aucune donnée" });

    const headers = rows[0];
    const candidates = rows.slice(1).map(row => {
      const getCol = (name) => {
        const index = headers.findIndex(h => h.toLowerCase() === name.toLowerCase());
        return index >= 0 ? row[index] ?? "" : "";
      };
      return {
        id: getCol("id"),
        titre: getCol("titre"),
        annees_experience: getCol("annees_experience"),
        competences: getCol("competences"),
        // ajoute les autres champs de ton besoin...
      };
    });
    return res.status(200).json(candidates);

  } catch (error) {
    console.error("Erreur API candidates:", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des données",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack
    });
  }
}
