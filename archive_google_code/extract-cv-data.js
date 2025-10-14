// pages/api/extract-cv-data.js
import { google } from 'googleapis';
import pdfParse from 'pdf-parse';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileId } = req.body;
    
    // 1. Télécharger le PDF depuis Drive
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/spreadsheets'
      ],
    });

    const drive = google.drive({ version: 'v3', auth });
    
    // Télécharger le fichier PDF
    const fileResponse = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    // 2. Parser le PDF
    const pdfBuffer = await streamToBuffer(fileResponse.data);
    const pdfData = await pdfParse(pdfBuffer);
    const text = pdfData.text;

    // 3. Extraction intelligente des données
    const extractedData = extractCVData(text);
    
    // 4. Ajouter à Google Sheets
    const sheets = google.sheets({ version: 'v4', auth });
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'consultants!A:U',
      valueInputOption: 'RAW',
      resource: {
        values: [[
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
        ]]
      }
    });

    res.status(200).json({ 
      success: true, 
      consultant: extractedData,
      message: 'CV extrait et ajouté à la base avec succès'
    });

  } catch (error) {
    console.error('Erreur extraction CV:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'extraction du CV',
      details: error.message 
    });
  }
}

// Fonction d'extraction intelligente
function extractCVData(text) {
  const data = {
    titre: extractTitre(text),
    competences: extractCompetences(text),
    annees_experience: extractExperience(text),
    experience_resume: extractResumeExperience(text),
    formation: extractFormation(text),
    specialite: extractSpecialite(text),
    technologies_cles: extractTechnologies(text),
    secteurs_experience: extractSecteurs(text),
    soft_skills: extractSoftSkills(text),
    realisations_chiffrees: extractRealisations(text),
    mobilite_geographique: extractLocalisation(text),
    disponibilite: 'Disponible',
    tjm_min: 0,
    tjm_max: 0,
    projets_realises: extractProjets(text),
    niveau_expertise: extractNiveauExpertise(text)
  };

  return data;
}

// Extracteurs spécifiques
function extractTitre(text) {
  const matches = text.match(/(?:ingénieur|développeur|consultant|architecte|expert|lead|senior|junior)[^.,\n]{0,50}/gi);
  return matches ? matches[0] : 'Consultant IT';
}

function extractCompetences(text) {
  const skillKeywords = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'MongoDB',
    'AWS', 'Azure', 'Docker', 'Kubernetes', 'Agile', 'Scrum', 'DevOps'
  ];
  return skillKeywords.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

function extractExperience(text) {
  const expMatch = text.match(/(\d+)\s*(?:ans?|years?|années)/i);
  return expMatch ? parseInt(expMatch[1]) : 3;
}

function extractFormation(text) {
  const formationMatch = text.match(/(?:master|licence|bachelor|diplôme|école|university|université)[^.,\n]{0,100}/gi);
  return formationMatch ? formationMatch.join(', ') : 'Formation non spécifiée';
}

// ... autres fonctions d'extraction

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

function generateId() {
  return `consultant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}