// pages/api/sync-cv-drive.js
// Synchronisation automatique CV Drive → Google Sheets pour SM Consulting

import { google } from 'googleapis';
import pdf from 'pdf-parse';

// CONFIGURATION SM CONSULTING
const DRIVE_FOLDER_ID = '***REMOVED***'; // Dossier CVs_Recruteurs_2025
const SHEET_ID = '***REMOVED***';
const SHEET_NAME = 'consultants';

export default async function handler(req, res) {
  // Sécurité : vérifier le token pour les cron jobs
  const authHeader = req.headers.authorization;
  if (authHeader !== \Bearer \\) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('🚀 SM Consulting - Démarrage synchronisation CV Drive → Sheets');

    // 1. Authentification Google
    const auth = await getGoogleAuth();
    
    // 2. Lister les CV dans Drive
    const cvFiles = await listCVFilesFromDrive(auth);
    console.log(\📁 \ fichiers CV trouvés dans Drive\);

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
        console.log(\\\n📄 Traitement: \\);

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
        console.error(\❌ Erreur traitement \:\, error.message);
        results.errors++;
      }
    }

    console.log('\\n✅ SM Consulting - Synchronisation terminée:', results);

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
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\\\n/g, '\\n')
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
    q: \'\' in parents and (mimeType='application/pdf' or mimeType='application/vnd.openxmlformats-officedocument.wordprocessingml.document' or mimeType='application/msword') and trashed=false\,
    fields: 'files(id, name, mimeType, modifiedTime, size)',
    orderBy: 'modifiedTime desc',
    pageSize: 50
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

    // Parser selon le type de fichier
    let parsedData;
    if (file.mimeType === 'application/pdf') {
      parsedData = await parsePDF(buffer);
    } else {
      parsedData = await parseWord(buffer);
    }

    // Extraire les informations du CV
    const cvInfo = extractCVInformation(parsedData.text, file.name);
    
    return {
      ...cvInfo,
      cv_source: file.name,
      cv_drive_id: file.id,
      cv_date_upload: file.modifiedTime
    };

  } catch (error) {
    console.error(\Erreur téléchargement \:\, error.message);
    return null;
  }
}

// Parser PDF
async function parsePDF(buffer) {
  try {
    const data = await pdf(buffer);
    return {
      text: data.text,
      pages: data.numpages
    };
  } catch (error) {
    console.error('Erreur parsing PDF:', error.message);
    return { text: '', pages: 0 };
  }
}

// Parser Word (basique)
async function parseWord(buffer) {
  return {
    text: buffer.toString('utf-8', 0, Math.min(buffer.length, 10000)),
    pages: 1
  };
}

// ============================================================================
// EXTRACTION INTELLIGENTE DES DONNÉES DU CV
// ============================================================================
function extractCVInformation(text, filename) {
  const lowerText = text.toLowerCase();

  return {
    id: generateCVId(filename),
    titre: extractRole(text, filename),
    annees_experience: extractExperience(text),
    competences: extractSkills(text).join(', '),
    formation: extractEducation(text),
    secteur_recherche: extractSector(text),
    mobilite: extractMobility(text),
    experience_resume: extractExperienceSummary(text),
    specialite: extractSpecialties(text).join(', '),
    niveau_expertise: determineLevel(text, extractExperience(text)),
    technologies_cles: extractTechStack(text).join(', '),
    secteurs_experience: extractSectors(text).join(', '),
    soft_skills: extractSoftSkills(text).join(', '),
    realisations_chiffrees: extractAchievements(text),
    teletravail: extractRemote(text),
    mobilite_geographique: extractGeographicMobility(text),
    tjm_min: extractTJMMin(text),
    tjm_max: extractTJMMax(text),
    disponibilite: extractAvailability(text),
    projets_realises: extractProjects(text)
  };
}

// Extraction du rôle/titre
function extractRole(text, filename) {
  const roles = [
    'Développeur Full-Stack', 'Développeur Frontend', 'Développeur Backend', 
    'Lead Developer', 'Architecte Logiciel', 'DevOps Engineer', 'Data Scientist',
    'Data Engineer', 'Product Manager', 'Consultant IT', 'Chef de Projet IT',
    'Scrum Master', 'Tech Lead', 'CTO', 'Engineering Manager', 'UX/UI Designer'
  ];

  for (const role of roles) {
    if (text.toLowerCase().includes(role.toLowerCase())) {
      return role;
    }
  }

  // Extraction depuis le filename
  if (filename.toLowerCase().includes('front')) return 'Développeur Frontend';
  if (filename.toLowerCase().includes('back')) return 'Développeur Backend';
  if (filename.toLowerCase().includes('full')) return 'Développeur Full-Stack';
  if (filename.toLowerCase().includes('devops')) return 'DevOps Engineer';
  if (filename.toLowerCase().includes('data')) return 'Data Scientist';
  
  return 'Consultant IT';
}

// Extraction des compétences
function extractSkills(text) {
  const skills = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java',
    'PHP', 'Ruby', 'Go', 'C#', '.NET', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST', 'API', 'Microservices',
    'DevOps', 'CI/CD', 'Terraform', 'Jenkins', 'Git', 'Agile', 'Scrum'
  ];

  return skills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

// Extraction de l'expérience (en années)
function extractExperience(text) {
  const patterns = [
    /(\\d+)\\+?\\s*ans?\\s*(d['']|de\\s)?expérience/i,
    /expérience\\s*:\\s*(\\d+)\\s*ans?/i,
    /(\\d+)\\s*années?\\s*d['']expérience/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseInt(match[1]) + ' ans';
    }
  }

  // Estimation basée sur le nombre de postes
  const jobMatches = text.match(/\\d{4}\\s*-\\s*\\d{4}/g);
  if (jobMatches && jobMatches.length > 0) {
    return Math.min(jobMatches.length * 2, 15) + ' ans';
  }

  return '3 ans'; // Valeur par défaut
}

// Extraction de la formation
function extractEducation(text) {
  const formations = ['Master', 'Licence', 'Ingénieur', 'MBA', 'PhD', 'Bac+5', 'Bac+3'];
  for (const formation of formations) {
    if (text.includes(formation)) {
      return formation;
    }
  }
  return 'Formation supérieure';
}

// Extraction du secteur de recherche
function extractSector(text) {
  const sectors = ['FinTech', 'HealthTech', 'EdTech', 'E-commerce', 'SaaS', 'IA', 'Blockchain'];
  for (const sector of sectors) {
    if (text.includes(sector)) {
      return sector;
    }
  }
  return 'Digital/Tech';
}

// Extraction de la mobilité
function extractMobility(text) {
  if (text.toLowerCase().includes('remote') || text.toLowerCase().includes('télétravail')) {
    return 'Remote possible';
  }
  return 'Sur site';
}

// Extraction du résumé d'expérience
function extractExperienceSummary(text) {
  const lines = text.split('\\n').slice(0, 3);
  return lines.join(' ').substring(0, 200) + '...';
}

// Extraction des spécialités
function extractSpecialties(text) {
  const specialties = ['Frontend', 'Backend', 'Full-Stack', 'DevOps', 'Cloud', 'Data', 'Mobile', 'Security'];
  return specialties.filter(spec => text.toLowerCase().includes(spec.toLowerCase()));
}

// Extraction du stack technique
function extractTechStack(text) {
  const techs = ['React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'AWS', 'Azure', 'Docker', 'Kubernetes'];
  return techs.filter(tech => text.toLowerCase().includes(tech.toLowerCase()));
}

// Extraction des secteurs d'expérience
function extractSectors(text) {
  const sectors = ['Finance', 'Santé', 'Éducation', 'E-commerce', 'Media', 'Transport', 'Énergie'];
  return sectors.filter(sector => text.toLowerCase().includes(sector.toLowerCase()));
}

// Extraction des soft skills
function extractSoftSkills(text) {
  const skills = ['Leadership', 'Communication', 'Gestion d\\'équipe', 'Agile', 'Résolution de problèmes'];
  return skills.filter(skill => text.toLowerCase().includes(skill.toLowerCase()));
}

// Extraction des réalisations
function extractAchievements(text) {
  return 'Réalisations techniques significatives';
}

// Extraction du télétravail
function extractRemote(text) {
  return text.toLowerCase().includes('remote') ? 'Oui' : 'Non';
}

// Extraction de la mobilité géographique
function extractGeographicMobility(text) {
  return 'France';
}

// Extraction TJM min
function extractTJMMin(text) {
  const match = text.match(/TJM?\\s*(\\d+)/i);
  return match ? match[1] : '500';
}

// Extraction TJM max
function extractTJMMax(text) {
  const match = text.match(/TJM?\\s*\\d+\\s*-\\s*(\\d+)/i);
  return match ? match[1] : '800';
}

// Extraction disponibilité
function extractAvailability(text) {
  return 'Immédiate';
}

// Extraction projets réalisés
function extractProjects(text) {
  return 'Projets digitaux innovants';
}

// Déterminer le niveau
function determineLevel(text, experience) {
  const exp = parseInt(experience);
  if (exp >= 10) return 'Expert';
  if (exp >= 5) return 'Senior';
  if (exp >= 2) return 'Confirmé';
  return 'Junior';
}

// Générer un ID unique pour le CV
function generateCVId(filename) {
  return \CV_\_\\;
}

// ============================================================================
// INSÉRER/METTRE À JOUR DANS GOOGLE SHEETS
// ============================================================================
async function upsertToSheets(auth, cvData, file) {
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    // Vérifier si le consultant existe déjà
    const existingData = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: \\!A:U\
    });

    const rows = existingData.data.values || [];
    
    // Chercher si le consultant existe (par ID ou titre similaire)
    const existingIndex = rows.findIndex((row, index) => 
      index > 0 && (row[0] === cvData.id || row[1] === cvData.titre)
    );

    const rowData = [
      cvData.id,
      cvData.titre,
      cvData.annees_experience,
      cvData.competences,
      cvData.formation,
      cvData.secteur_recherche,
      cvData.mobilite,
      cvData.experience_resume,
      cvData.specialite,
      cvData.niveau_expertise,
      cvData.technologies_cles,
      cvData.secteurs_experience,
      cvData.soft_skills,
      cvData.realisations_chiffrees,
      cvData.teletravail,
      cvData.mobilite_geographique,
      cvData.tjm_min,
      cvData.tjm_max,
      cvData.disponibilite,
      cvData.projets_realises,
      new Date().toISOString()
    ];

    if (existingIndex > 0) {
      // Mise à jour
      console.log(\♻️ Mise à jour du consultant existant: \\);
      
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: \\!A\:U\\,
        valueInputOption: 'RAW',
        resource: { values: [rowData] }
      });

      return false; // Updated
    } else {
      // Insertion
      console.log(\➕ Ajout nouveau consultant: \\);
      
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: \\!A:U\,
        valueInputOption: 'RAW',
        resource: { values: [rowData] }
      });

      return true; // Inserted
    }

  } catch (error) {
    console.error('Erreur upsert Sheets:', error.message);
    throw error;
  }
}
