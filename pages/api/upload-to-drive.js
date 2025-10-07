// pages/api/upload-cv.js
import { google } from 'googleapis';
import pdfParse from 'pdf-parse';

// Buffer to stream utility
function bufferToStream(buffer) {
  const stream = require('stream');
  const readable = new stream.Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/spreadsheets'
      ],
    });

    // Récupérer le fichier depuis le body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // 1. Upload vers Google Drive
    const drive = google.drive({ version: 'v3', auth });
    
    const driveResponse = await drive.files.create({
      requestBody: {
        name: `CV_Consultant_${Date.now()}.pdf`,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
        mimeType: 'application/pdf',
      },
      media: {
        mimeType: 'application/pdf',
        body: bufferToStream(buffer),
      },
      fields: 'id,webViewLink',
    });

    const fileId = driveResponse.data.id;

    // Rendre le fichier accessible en lecture
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // 2. Parser le PDF
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;

    console.log('📄 Texte extrait du PDF:', text.substring(0, 500)); // Log pour debug

    // 3. Extraction des données
    const extractedData = extractCVData(text);
    
    // 4. Ajouter à Google Sheets
    const sheets = google.sheets({ version: 'v4', auth });
    
    const newRow = [
      generateId(), // id
      extractedData.titre,
      extractedData.competences.join(','),
      extractedData.annees_experience,
      extractedData.experience_resume,
      extractedData.formation,
      '', // secteur_recherche
      '', // mobilite
      `https://drive.google.com/file/d/${fileId}/view`, // lien_cv
      extractedData.specialite,
      extractedData.niveau_expertise,
      extractedData.technologies_cles.join(','),
      extractedData.secteurs_experience.join(','),
      extractedData.soft_skills.join(','),
      extractedData.realisations_chiffrees,
      'Oui', // teletravail
      extractedData.mobilite_geographique,
      extractedData.tjm_min,
      extractedData.tjm_max,
      extractedData.disponibilite,
      extractedData.projets_realises.join(';')
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'consultants!A:U',
      valueInputOption: 'RAW',
      resource: { values: [newRow] }
    });

    res.status(200).json({ 
      success: true, 
      consultant: extractedData,
      fileId: fileId,
      message: '✅ CV uploadé, analysé et profil créé avec succès !'
    });

  } catch (error) {
    console.error('❌ Erreur extraction CV:', error);
    res.status(500).json({ 
      error: 'Erreur lors du traitement du CV',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Fonctions d'extraction intelligente
function extractCVData(text) {
  const cleanText = text.replace(/\s+/g, ' ').toLowerCase();
  
  return {
    titre: extractTitre(cleanText),
    competences: extractCompetences(cleanText),
    annees_experience: extractExperience(cleanText),
    experience_resume: extractResumeExperience(cleanText),
    formation: extractFormation(cleanText),
    specialite: extractSpecialite(cleanText),
    technologies_cles: extractTechnologies(cleanText),
    secteurs_experience: extractSecteurs(cleanText),
    soft_skills: extractSoftSkills(cleanText),
    realisations_chiffrees: extractRealisations(cleanText),
    mobilite_geographique: extractLocalisation(cleanText),
    disponibilite: 'Disponible',
    tjm_min: extractTJMMin(cleanText),
    tjm_max: extractTJMMax(cleanText),
    projets_realises: extractProjets(cleanText),
    niveau_expertise: extractNiveauExpertise(cleanText)
  };
}

function extractTitre(text) {
  const titres = [
    'développeur', 'ingénieur', 'consultant', 'architecte', 
    'chef de projet', 'analyste', 'expert', 'lead', 'senior'
  ];
  
  for (const titre of titres) {
    if (text.includes(titre)) {
      // Capitaliser la première lettre
      return titre.charAt(0).toUpperCase() + titre.slice(1);
    }
  }
  
  return 'Consultant IT';
}

function extractCompetences(text) {
  const competences = [
    'javascript', 'python', 'java', 'react', 'node.js', 'angular', 'vue.js',
    'sql', 'mongodb', 'postgresql', 'mysql', 'aws', 'azure', 'gcp',
    'docker', 'kubernetes', 'jenkins', 'git', 'agile', 'scrum', 'devops',
    'html', 'css', 'typescript', 'php', 'c#', 'c++', 'ruby', 'go'
  ];
  
  return competences.filter(competence => 
    text.includes(competence)
  ).slice(0, 10); // Limiter à 10 compétences max
}

function extractExperience(text) {
  const expRegex = /(\d+)\s*(?:ans?|years?|années?)/i;
  const match = text.match(expRegex);
  return match ? parseInt(match[1]) : 3;
}

function extractResumeExperience(text) {
  // Extraire les 200 premiers caractères après "expérience" ou "experience"
  const expMatch = text.match(/(?:expérience|experience)[^.]{0,200}/i);
  return expMatch ? expMatch[0] : 'Expérience solide dans le domaine IT.';
}

function extractFormation(text) {
  const formations = [
    'master', 'licence', 'bachelor', 'diplôme', 'école', 'university', 'université',
    'engineering', 'computer science', 'informatique'
  ];
  
  const found = formations.filter(formation => text.includes(formation));
  return found.length > 0 ? found.join(', ') : 'Formation en informatique';
}

function extractSpecialite(text) {
  const specialites = [
    'développement web', 'mobile', 'backend', 'frontend', 'fullstack',
    'data science', 'ai', 'machine learning', 'cloud', 'devops',
    'cybersécurité', 'blockchain', 'iot'
  ];
  
  for (const specialite of specialites) {
    if (text.includes(specialite)) {
      return specialite;
    }
  }
  
  return 'Développement Fullstack';
}

function extractTechnologies(text) {
  // Même liste que les compétences mais plus technique
  return extractCompetences(text);
}

function extractSecteurs(text) {
  const secteurs = [
    'banque', 'finance', 'assurance', 'santé', 'énergie', 'retail',
    'telecom', 'transport', 'public', 'startup', 'ecommerce'
  ];
  
  return secteurs.filter(secteur => text.includes(secteur)).slice(0, 3);
}

function extractSoftSkills(text) {
  const softSkills = [
    'communication', 'leadership', 'teamwork', 'créativité', 'résolution',
    'adaptabilité', 'autonomie', 'rigueur', 'organisation'
  ];
  
  return softSkills.filter(skill => text.includes(skill)).slice(0, 5);
}

function extractRealisations(text) {
  const realisationsRegex = /(?:réalisations?|achievements?|accomplissements?)[^.]{0,150}/i;
  const match = text.match(realisationsRegex);
  return match ? match[0] : '';
}

function extractLocalisation(text) {
  const villes = ['paris', 'lyon', 'marseille', 'toulouse', 'lille', 'bordeaux'];
  for (const ville of villes) {
    if (text.includes(ville)) {
      return ville.charAt(0).toUpperCase() + ville.slice(1);
    }
  }
  return 'Île-de-France';
}

function extractTJMMin(text) {
  const tjmRegex = /(\d+)[\s€]*(?:tjm|tarif|jour)/i;
  const match = text.match(tjmRegex);
  return match ? parseInt(match[1]) : 400;
}

function extractTJMMax(text) {
  const min = extractTJMMin(text);
  return min + 200;
}

function extractProjets(text) {
  const projetsRegex = /(?:projets?|projects?)[^.]{0,200}/i;
  const match = text.match(projetsRegex);
  return match ? [match[0].substring(0, 100)] : ['Projets variés en environnement agile'];
}

function extractNiveauExpertise(text) {
  if (text.includes('senior') || text.includes('expert')) return 'Expert';
  if (text.includes('junior')) return 'Junior';
  return 'Intermédiaire';
}

function generateId() {
  return `consultant-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
}