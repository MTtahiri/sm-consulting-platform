export default function handler(req, res) {
  res.status(200).json({
    clientEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL || null,
    privateKeySet: !!process.env.GOOGLE_SHEETS_PRIVATE_KEY,
    sheetId: process.env.GOOGLE_SHEET_ID || null
  });
}