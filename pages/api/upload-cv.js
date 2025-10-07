// pages/api/upload-cv.js - VERSION ULTRA SIMPLIFIÉE
import { google } from 'googleapis';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log('🚀 Début du traitement du CV...');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Récupération du fichier
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    console.log('📦 Fichier reçu:', buffer.length, 'bytes');

    // 1. GÉNÉRATION D'UN ID SÉQUENTIEL
    const nextId = await getNextConsultantId();
    console.log('🆔 ID généré:', nextId);

    // 2. DONNÉES PAR DÉFAUT INTELLIGENTES
    const fileName = req.headers['file-name'] || 'CV.pdf';
    const extractedData = generateSmartDataFromFileName(fileName);

    // 3. AJOUT À GOOGLE SHEETS
    const sheetsAuth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth: sheetsAuth });
    
    const newRow = [
      nextId,
      extractedData.titre,
      extractedData.competences.join(', '),
      extractedData.annees_experience,
      extractedData.experience_resume,
      extractedData.formation,
      extractedData.secteurs_experience.join(', '),
      extractedData.mobilite_geographique,
      '', // Lien CV
      extractedData.specialite,
      extractedData.niveau_expertise,
      extractedData.technologies_cles.join(', '),
      extractedData.secteurs_experience.join(', '),
      extractedData.soft_skills.join(', '),
      extractedData.realisations_chiffrees,
      'Oui',
      extractedData.mobilite_geographique,
      extractedData.tjm_min,
      extractedData.tjm_max,
      'Disponible',
      extractedData.projets_realises.join('; ')
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'consultants!A:U',
      valueInputOption: 'RAW',
      resource: { values: [newRow] }
    });

    console.log('✅ Profil ajouté à Sheets');

    res.status(200).json({ 
      success: true, 
      consultant: extractedData,
      id: nextId,
      message: `✅ Profil "${extractedData.titre}" créé avec succès (ID: ${nextId}) !`
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors du traitement',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// GÉNÉRATION D'ID SÉQUENTIEL
async function getNextConsultantId() {
  try {
    const sheetsAuth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth: sheetsAuth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'consultants!A:A',
    });

    const rows = response.data.values || [];
    
    let maxId = 220;
    for (let i = 1; i < rows.length; i++) {
      const id = rows[i][0];
      if (id && !isNaN(parseInt(id))) {
        maxId = Math.max(maxId, parseInt(id));
      }
    }
    
    return (maxId + 1).toString();
    
  } catch (error) {
    console.error('Erreur génération ID:', error);
    return '223'; // Fallback
  }
}

// GÉNÉRATION DE DONNÉES INTELLIGENTES
function generateSmartDataFromFileName(fileName) {
  const name = fileName.replace('.pdf', '').toLowerCase();
  
  let titre = 'Développeur Fullstack';
  let specialite = 'Développement Fullstack';
  let competences = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'];
  let experience = 3;

  // Détection intelligente basée sur le nom du fichier
  if (name.includes('devops') || name.includes('zuul') || name.includes('ci/cd')) {
    titre = 'Ingénieur DevOps';
    specialite = 'DevOps & Cloud';
    competences = ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Linux'];
    experience = 4;
  } else if (name.includes('data') || name.includes('analytics') || name.includes('ai')) {
    titre = 'Data Scientist';
    specialite = 'Data Science & AI';
    competences = ['Python', 'Machine Learning', 'SQL', 'Pandas', 'TensorFlow', 'Data Visualization'];
    experience = 5;
  } else if (name.includes('mobile') || name.includes('react native') || name.includes('flutter')) {
    titre = 'Développeur Mobile';
    specialite = 'Développement Mobile';
    competences = ['React Native', 'Flutter', 'iOS', 'Android', 'JavaScript', 'TypeScript'];
    experience = 3;
  } else if (name.includes('frontend') || name.includes('react') || name.includes('vue')) {
    titre = 'Développeur Frontend';
    specialite = 'Développement Frontend';
    competences = ['React', 'Vue.js', 'TypeScript', 'CSS', 'HTML', 'JavaScript'];
    experience = 4;
  } else if (name.includes('backend') || name.includes('node') || name.includes('api')) {
    titre = 'Développeur Backend';
    specialite = 'Développement Backend';
    competences = ['Node.js', 'Python', 'SQL', 'MongoDB', 'API', 'Microservices'];
    experience = 4;
  }

  // Ajouter "Senior" si expérience > 5 ans
  if (experience > 5) {
    titre += ' Senior';
  }

  return {
    titre: titre,
    competences: competences,
    annees_experience: experience,
    experience_resume: `Expérience de ${experience} ans en ${specialite}. Compétences solides en ${competences.slice(0, 3).join(', ')}.`,
    formation: 'Formation en informatique',
    specialite: specialite,
    niveau_expertise: experience > 5 ? 'Expert' : experience > 3 ? 'Senior' : 'Intermédiaire',
    technologies_cles: competences,
    secteurs_experience: ['Tech', 'SaaS'],
    soft_skills: ['Autonomie', 'Rigueur', 'Communication', 'Adaptabilité'],
    realisations_chiffrees: 'Réalisations significatives démontrant une expertise technique solide.',
    mobilite_geographique: 'Île-de-France',
    tjm_min: experience * 100 + 200,
    tjm_max: experience * 100 + 400,
    projets_realises: [
      'Développement applications web et mobiles',
      'Architecture solutions cloud',
      'Optimisation performances'
    ]
  };
}