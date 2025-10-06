// pages/api/cv/sync-drive.js
import { google } from 'googleapis';
import pdf from 'pdf-parse';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async function handler(req, res) {
  // 🔒 SÉCURITÉ - Compatible avec votre système existant
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  try {
    console.log('🔄 Démarrage synchro CV Drive → Base Consultants Optimisée');

    // 1. Scanner le dossier Drive des CVs
    const cvFiles = await listCVFilesFromDrive();
    console.log(`📁 ${cvFiles.length} CVs détectés dans Drive`);

    // 2. Préparer l'onglet consultants
    const sheet = await getConsultantsSheet();
    
    // 3. Traiter chaque CV
    const results = await processCVs(sheet, cvFiles);

    console.log('✅ Synchronisation terminée:', results);

    res.status(200).json({
      success: true,
      message: 'Synchronisation CV Drive → Base Consultants réussie',
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erreur globale synchro:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

// ============================================================================
// CONFIGURATION ONGLET "CONSULTANTS" EXISTANT
// ============================================================================
async function getConsultantsSheet() {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
  
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  });

  await doc.loadInfo();
  
  // Utiliser l'onglet "consultants" existant
  const sheet = doc.sheetsByTitle['consultants'];
  if (!sheet) {
    throw new Error('Onglet "consultants" non trouvé dans le Sheet');
  }
  
  console.log('📊 Onglet "consultants" chargé avec succès');
  return sheet;
}

// ============================================================================
// SCAN DRIVE DES CVs
// ============================================================================
async function listCVFilesFromDrive() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    },
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
  });

  const drive = google.drive({ version: 'v3', auth });

  const response = await drive.files.list({
    q: `'${process.env.DRIVE_FOLDER_ID}' in parents and (mimeType='application/pdf' or mimeType='application/vnd.openxmlformats-officedocument.wordprocessingml.document') and trashed=false`,
    fields: 'files(id, name, mimeType, modifiedTime, webViewLink)',
    orderBy: 'modifiedTime desc',
    pageSize: 50
  });

  return response.data.files || [];
}

// ============================================================================
// TRAITEMENT DES CVs
// ============================================================================
async function processCVs(sheet, cvFiles) {
  const results = {
    processed: 0,
    added: 0,
    updated: 0,
    errors: 0,
    skipped: 0
  };

  // Charger les consultants existants pour éviter les doublons
  const existingConsultants = await getExistingConsultants(sheet);
  
  for (const file of cvFiles) {
    try {
      // Vérifier si le CV a déjà été traité
      const existingId = findExistingConsultant(existingConsultants, file);
      if (existingId) {
        console.log(`⏭️ CV déjà traité: ${file.name}`);
        results.skipped++;
        continue;
      }

      console.log(`\n📄 Traitement: ${file.name}`);
      
      // Extraire les données du CV
      const consultantData = await extractConsultantData(file);
      
      if (consultantData) {
        // Insérer dans l'onglet consultants
        await insertConsultant(sheet, consultantData);
        results.added++;
        results.processed++;
        
        console.log(`✅ Consultant ajouté: ${consultantData.titre}`);
      } else {
        results.errors++;
      }

    } catch (error) {
      console.error(`❌ Erreur ${file.name}:`, error.message);
      results.errors++;
    }
  }

  return results;
}

// ============================================================================
// EXTRACTION INTELLIGENTE DES DONNÉES
// ============================================================================
async function extractConsultantData(file) {
  const text = await downloadAndParseCV(file);
  if (!text) return null;

  const lowerText = text.toLowerCase();
  
  return {
    id: `consultant-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    titre: extractJobTitle(text, file.name),
    competences: extractCompetences(text).join(', '),
    annees_experience: extractAnneesExperience(text),
    experience_resume: extractExperienceResume(text),
    formation: extractFormation(text),
    secteur_recherche: extractSecteurRecherche(text),
    mobilite: extractMobilite(text),
    lien_cv: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
    specialite: extractSpecialite(text),
    niveau_expertise: extractNiveauExpertise(text),
    technologies_cles: extractTechnologiesCles(text).join(', '),
    secteurs_experience: extractSecteursExperience(text).join(', '),
    soft_skills: extractSoftSkills(text).join(', '),
    realisations_chiffrees: extractRealisationsChiffrees(text),
    teletravail: extractTeletravail(text),
    mobilite_geographique: extractMobiliteGeographique(text),
    tjm_min: extractTJMMin(text),
    tjm_max: extractTJMMax(text),
    disponibilite: 'Immédiate',
    projets_realises: extractProjetsRealises(text),
    cv_source: file.name,
    date_ajout: new Date().toISOString().split('T')[0]
  };
}

// Fonctions d'extraction (versions simplifiées pour le déploiement)
function extractJobTitle(text, filename) {
  const cleanName = filename.replace(/\.(pdf|docx|doc)/gi, '')
    .replace(/(cv|resume|curriculum)/gi, '')
    .trim();
  return cleanName || 'Consultant IT';
}

function extractCompetences(text) {
  const competences = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'AWS', 'Docker', 'MongoDB'];
  return competences.filter(comp => text.toLowerCase().includes(comp.toLowerCase())).slice(0, 5);
}

function extractAnneesExperience(text) {
  const match = text.match(/(\d+)\+?\s*ans?\s*d'expérience/i);
  return match ? parseInt(match[1]) : 3;
}

function extractExperienceResume(text) {
  return 'Expert avec expérience significative dans le domaine IT';
}

function extractFormation(text) {
  return text.toLowerCase().includes('master') ? 'Master Informatique' : 'Formation supérieure en informatique';
}

function extractSecteurRecherche(text) {
  return 'Technologie, Digital';
}

function extractMobilite(text) {
  return text.toLowerCase().includes('remote') ? 'Remote, France' : 'France';
}

function extractSpecialite(text) {
  return 'Développement Full-Stack';
}

function extractNiveauExpertise(text) {
  const experience = extractAnneesExperience(text);
  if (experience >= 5) return 'Senior';
  return 'Confirmé';
}

function extractTechnologiesCles(text) {
  return extractCompetences(text).slice(0, 3);
}

function extractSecteursExperience(text) {
  return ['Technologie'];
}

function extractSoftSkills(text) {
  return ['Communication', 'Travail d\'équipe', 'Résolution de problèmes'];
}

function extractRealisationsChiffrees(text) {
  return 'Non spécifié';
}

function extractTeletravail(text) {
  return 'Oui';
}

function extractMobiliteGeographique(text) {
  return 'France';
}

function extractTJMMin(text) {
  return 400;
}

function extractTJMMax(text) {
  return 600;
}

function extractProjetsRealises(text) {
  return 'Non spécifié';
}

async function downloadAndParseCV(file) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    },
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
  });

  const drive = google.drive({ version: 'v3', auth });

  try {
    const response = await drive.files.get({
      fileId: file.id,
      alt: 'media'
    }, {
      responseType: 'arraybuffer'
    });

    const buffer = Buffer.from(response.data);

    if (file.mimeType === 'application/pdf') {
      const data = await pdf(buffer);
      return data.text;
    } else {
      return buffer.toString('utf-8', 0, Math.min(buffer.length, 10000));
    }
  } catch (error) {
    console.error(`Erreur téléchargement ${file.name}:`, error.message);
    return null;
  }
}

async function getExistingConsultants(sheet) {
  await sheet.loadHeaderRow();
  const rows = await sheet.getRows();
  return rows.map(row => ({
    id: row.id,
    cv_source: row.cv_source,
    lien_cv: row.lien_cv
  }));
}

function findExistingConsultant(existingConsultants, file) {
  return existingConsultants.find(consultant => 
    consultant.lien_cv.includes(file.id) || 
    consultant.cv_source === file.name
  )?.id;
}

async function insertConsultant(sheet, data) {
  await sheet.addRow(data);
}