export default async function handler(req, res) {
  const envVars = {
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'PRESENT' : 'MISSING',
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? 'PRESENT' : 'MISSING', 
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID ? 'PRESENT' : 'MISSING',
    sheetIdValue: process.env.GOOGLE_SHEET_ID || 'NOT_SET'
  };
  
  console.log('Environment check:', envVars);
  res.status(200).json(envVars);
}
