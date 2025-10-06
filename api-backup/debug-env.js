export default async function handler(req, res) {
  const envVars = {
    GOOGLE_SHEETS_CLIENT_EMAIL: process.env.GOOGLE_SHEETS_CLIENT_EMAIL ? 'PRESENT' : 'MISSING',
    GOOGLE_SHEETS_PRIVATE_KEY: process.env.GOOGLE_SHEETS_PRIVATE_KEY ? 'PRESENT' : 'MISSING', 
    GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID ? 'PRESENT' : 'MISSING',
    sheetIdValue: process.env.GOOGLE_SHEETS_ID || 'NOT_SET'
  };
  
  console.log('Environment check:', envVars);
  res.status(200).json(envVars);
}
