import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async function handler(req, res) {
  const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

    // Debug : lister méthodes
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(doc));

    res.status(200).json({ methods });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
