// pages/api/debug-env.js
export default function handler(req, res) {
  res.status(200).json({
    GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID || 'NON DÉFINI',
    GOOGLE_SHEETS_CLIENT_EMAIL: process.env.GOOGLE_SHEETS_CLIENT_EMAIL ? 'DÉFINI' : 'NON DÉFINI',
    GOOGLE_SHEETS_PRIVATE_KEY: process.env.GOOGLE_SHEETS_PRIVATE_KEY ? 'DÉFINI' : 'NON DÉFINI',
    NODE_ENV: process.env.NODE_ENV
  });
}