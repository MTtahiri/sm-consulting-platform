export default async function handler(req, res) {
  const envVars = {
    // NOUVEAUX noms (ceux dans Vercel)
    GOOGLE_SHEETS_CLIENT_EMAIL: process.env.GOOGLE_SHEETS_CLIENT_EMAIL ? 'PRESENT' : 'MISSING',
    GOOGLE_SHEETS_PRIVATE_KEY: process.env.GOOGLE_SHEETS_PRIVATE_KEY ? 'PRESENT' : 'MISSING',
    GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID ? 'PRESENT' : 'MISSING',
    
    // Anciens noms (pour comparaison)
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'PRESENT' : 'MISSING',
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? 'PRESENT' : 'MISSING',
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID ? 'PRESENT' : 'MISSING',
  };
  
  console.log('Environment check:', envVars);
  res.status(200).json(envVars);
}
