// pages/api/sync-cv-drive.js
// Synchronisation automatique CV Drive → Google Sheets pour SM Consulting

const { google } = require('googleapis');
const pdfParse = require('pdf-parse');

// CONFIGURATION SM CONSULTING
const DRIVE_FOLDER_ID = process.env.DRIVE_FOLDER_ID || '***REMOVED***';
const SHEET_ID = '***REMOVED***';
const SHEET_NAME = 'consultants';

module.exports = async function handler(req, res) {
  console.log('🔐 Headers reçus:', req.headers.authorization ? 'PRÉSENT' : 'ABSENT');
  console.log('🔐 CRON_SECRET configuré:', process.env.CRON_SECRET ? 'OUI' : 'NON');
  
  // Sécurité : vérifier le token pour les cron jobs
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('❌ Authorization header manquant');
    return res.status(401).json({ error: 'Authorization header required' });
  }
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log('❌ Token invalide');
    console.log('🔐 Reçu:', authHeader);
    console.log('🔐 Attendu:', `Bearer ${process.env.CRON_SECRET}`);
    return res.status(401).json({ error: 'Unauthorized - Token mismatch' });
  }

  try {
    console.log('🚀 SM Consulting - Démarrage synchronisation CV Drive → Sheets');

    // 1. Authentification Google
    const auth = await getGoogleAuth();
    
    // 2. Lister les CV dans Drive
    const cvFiles = await listCVFilesFromDrive(auth);
    console.log(`📁 ${cvFiles.length} fichiers CV trouvés dans Drive`);

    // 3. Traiter chaque CV
    const results = {
      processed: 0,
      added: 0,
      updated: 0,
      errors: 0,
      skipped: 0
    };

    for (const file of cvFiles) {
      try {
        console.log(`\n📄 Traitement: ${file.name}`);

        // 4. Télécharger et parser le CV
        const cvData = await downloadAndParseCV(auth, file);
        
        if (!cvData) {
          results.errors++;
          continue;
        }

        // 5. Insérer/Mettre à jour dans Sheets
        const inserted = await upsertToSheets(auth, cvData, file);
        
        if (inserted) {
          results.added++;
        } else {
          results.updated++;
        }
        
        results.processed++;

      } catch (error) {
        console.error(`❌ Erreur traitement ${file.name}:`, error.message);
        results.errors++;
      }
    }

    console.log('\n✅ SM Consulting - Synchronisation terminée:', results);

    res.status(200).json({
      success: true,
      message: 'Synchronisation SM Consulting terminée',
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erreur globale SM Consulting:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// ============================================================================
// AUTHENTIFICATION GOOGLE
// ============================================================================
async function getGoogleAuth() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n')
    },
    scopes: [
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/spreadsheets'
    ]
  });

  return auth.getClient();
}

// ============================================================================
// LISTER LES CV DEPUIS DRIVE
// ============================================================================
async function listCVFilesFromDrive(auth) {
  const drive = google.drive({ version: 'v3', auth });

  const response = await drive.files.list({
    q: `'${DRIVE_FOLDER_ID}' in parents and (mimeType='application/pdf') and trashed=false`,
    fields: 'files(id, name, mimeType, modifiedTime, size)',
    orderBy: 'modifiedTime desc',
    pageSize: 10
  });

  return response.data.files || [];
}

// ============================================================================
// TÉLÉCHARGER ET PARSER UN CV
// ============================================================================
async function downloadAndParseCV(auth, file) {
  const drive = google.drive({ version: 'v3', auth });

  try {
    // Télécharger le fichier
    const response = await drive.files.get({
      fileId: file.id,
      alt: 'media'
    }, {
      responseType: 'arraybuffer'
    });

    const buffer = Buffer.from(response.data);

    // Parser le PDF
    const parsedData = await parsePDF(buffer);
    
    if (!parsedData.text) {
      console.log('⚠️ Aucun texte extrait du PDF');
      return null;
    }

    // Extraire les informations du CV
    const cvInfo = extractBasicCVInfo(parsedData.text, file.name);
    
    return {
      ...cvInfo,
      cv_source: file.name,
      cv_drive_id: file.id,
      cv_date_upload: file.modifiedTime
    };

  } catch (error) {
    console.error(`Erreur téléchargement ${file.name}:`, error.message);
    return null;
  }
}

// Parser PDF
async function parsePDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return {
      text: data.text,
      pages: data.numpages
    };
  } catch (error) {
    console.error('Erreur parsing PDF:', error.message);
    return { text: '', pages: 0 };
  }
}

// ============================================================================
// EXTRACTION BASIQUE DES DONNÉES
// ============================================================================
function extractBasicCVInfo(text, filename) {
  const skills = extractSkills(text);
  const experience = extractExperience(text);

  return {
    id: generateCVId(filename),
    prenom: extractName(filename),
    role: extractRole(text, filename),
    experience: experience,
    competences: skills.join(', '),
    niveau: determineLevel(experience),
    disponibilite: 'À valider',
    date_ajout: new Date().toISOString().split('T')[0]
  };
}

// RÉUTILISATION DE VOS FONCTIONS EXISTANTES
function extractSkills(text) {
  const commonSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'AWS', 'Docker', 
    'Kubernetes', 'SQL', 'MongoDB', 'TypeScript', 'Vue.js', 'Angular',
    'PHP', 'Symfony', 'Laravel', 'C#', '.NET', 'Spring', 'React Native'
  ];
  
  return commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

function extractExperience(text) {
  if (text.match(/\d+\+?\s*(ans|années|years)/i)) {
    const match = text.match(/(\d+\+?\s*(ans|années|years))/i);
    return match ? match[0] : 'Expérience non spécifiée';
  }
  return 'Expérience à déterminer';
}

function extractName(filename) {
  const nameFromFile = filename.replace(/\.pdf|\.docx|\.doc|cv|resume/gi, '').trim();
  return nameFromFile && nameFromFile.length > 2 ? nameFromFile.split(/[_\-\s]/)[0] : 'Consultant';
}

function extractRole(text, filename) {
  const roles = ['Développeur Full-Stack', 'Développeur Frontend', 'Développeur Backend', 'DevOps'];
  for (const role of roles) {
    if (text.toLowerCase().includes(role.toLowerCase())) {
      return role;
    }
  }
  return 'Consultant IT';
}

function determineLevel(experience) {
  const expMatch = experience.match(/(\d+)/);
  const years = expMatch ? parseInt(expMatch[1]) : 3;
  if (years >= 5) return 'Senior';
  if (years >= 2) return 'Confirmé';
  return 'Junior';
}

function generateCVId(filename) {
  return `CV_${filename.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;
}

// ============================================================================
// INSÉRER/METTRE À JOUR DANS GOOGLE SHEETS
// ============================================================================
async function upsertToSheets(auth, cvData, file) {
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    // Structure simplifiée
    const rowData = [
      cvData.id,
      cvData.prenom,
      cvData.role,
      cvData.experience,
      cvData.competences,
      cvData.niveau,
      cvData.disponibilite,
      cvData.cv_source,
      cvData.date_ajout
    ];

    // Ajouter directement
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:I`,
      valueInputOption: 'RAW',
      resource: { values: [rowData] }
    });

    console.log(`✅ Consultant ajouté: ${cvData.prenom} - ${cvData.role}`);
    return true;

  } catch (error) {
    console.error('Erreur ajout Sheets:', error.message);
    throw error;
  }
}
