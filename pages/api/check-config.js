// pages/api/check-config.js
export default async function handler(req, res) {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  
  const config = {
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "sm-consulting@sm-consulting-447413-i7.iam.gserviceaccount.com",
    sheetId: process.env.GOOGLE_SHEET_ID || "1H4bSpOvOEMQ8ftg3aZyf8XJmtDFi9JIN8WaRTuwtUzQ",
    privateKeyExists: !!privateKey,
    privateKeyLength: privateKey ? privateKey.length : 0,
    privateKeyFirstLines: privateKey ? privateKey.split('\n').slice(0, 3).join(' | ') : 'Aucune clé',
    issues: []
  };

  // Détection des problèmes
  if (!config.privateKeyExists) {
    config.issues.push("❌ GOOGLE_PRIVATE_KEY manquante");
  }
  if (config.privateKeyLength < 100) {
    config.issues.push("❌ Clé privée trop courte (format incorrect)");
  }
  if (privateKey && privateKey.includes('\\n')) {
    config.issues.push("❌ Clé contient '\\n' au lieu de vraies nouvelles lignes");
  }

  res.status(200).json(config);
}