// api/create-candidate.js - Workflow complet d'intégration candidat
import formidable from 'formidable';
import { uploadToGoogleDrive } from './upload-to-drive.js';
import { extractCVData } from './cv-parser.js';
import { createAirtableRecord } from './airtable-client.js';

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
    // 1. Parser les données du formulaire
    const form = formidable({
      multiples: true,
      maxFileSize: 10 * 1024 * 1024,
    });

    const [fields, files] = await form.parse(req);
    
    // 2. Extraire et valider les données candidat
    const candidateData = extractCandidateData(fields);
    
    // 3. Upload des CV vers Google Drive
    const driveResults = await uploadToGoogleDrive(files, candidateData);
    
    // 4. Parser les CV pour extraire les données structurées
    const cvAnalysis = await analyzeCVs(driveResults.files);
    
    // 5. Enrichir les données candidat avec l'analyse CV
    const enrichedData = enrichCandidateData(candidateData, cvAnalysis, driveResults);
    
    // 6. Créer l'enregistrement dans Airtable
    const airtableRecord = await createAirtableRecord(enrichedData);
    
    // 7. Déclencher les workflows automatiques
    await triggerAutomations(airtableRecord.id, enrichedData);
    
    res.status(200).json({
      success: true,
      message: 'Candidat créé avec succès',
      data: {
        candidateId: airtableRecord.id,
        driveFolder: driveResults.folderUrl,
        matchingScore: cvAnalysis.matchingScore,
        extractedSkills: cvAnalysis.skills,
        nextSteps: [
          'Validation par l\'équipe RH',
          'Anonymisation automatique du CV',
          'Indexation dans la base de recherche'
        ]
      }
    });

  } catch (error) {
    console.error('Erreur création candidat:', error);
    res.status(500).json({
      error: 'Erreur lors de la création du profil candidat',
      details: error.message
    });
  }
}

// Extraire les données du formulaire
function extractCandidateData(fields) {
  const getField = (name) => Array.isArray(fields[name]) ? fields[name][0] : fields[name];
  const getArray = (name) => Array.isArray(fields[name]) ? fields[name] : [fields[name]].filter(Boolean);
  
  return {
    // Informations personnelles
    nom: getField('nom'),
    prenom: getField('prenom'),
    email: getField('email'),
    telephone: getField('telephone'),
    
    // Localisation
    pays: getField('pays'),
    ville: getField('ville'),
    
    // Profil professionnel
    poste: getField('poste'),
    niveau: getField('niveau'),
    tjm: parseInt(getField('tjm')) || 0,
    disponibilite: getField('disponibilite'),
    modeTravail: getArray('mode_travail'),
    
    // Compétences et liens
    competences: getField('competences'),
    liens: getField('liens') ? JSON.parse(getField('liens')) : [],
    
    // Informations supplémentaires
    presentation: getField('presentation'),
    certifications: getField('certifications'),
    
    // Métadonnées
    dateAjout: new Date().toISOString().split('T')[0],
    source: 'Formulaire web'
  };
}

// Analyser les CVs uploadés
async function analyzeCVs(driveFiles) {
  const analysis = {
    skills: [],
    experiences: [],
    education: [],
    certifications: [],
    languages: [],
    matchingScore: 0,
    keyInsights: []
  };

  for (const file of driveFiles) {
    if (file.mimeType === 'application/pdf') {
      try {
        // Parser le CV (nécessite une bibliothèque de parsing PDF)
        const cvData = await extractCVData(file.id);
        
        // Fusionner les données extraites
        analysis.skills.push(...cvData.skills);
        analysis.experiences.push(...cvData.experiences);
        analysis.education.push(...cvData.education);
        analysis.certifications.push(...cvData.certifications);
        analysis.languages.push(...cvData.languages);
        
      } catch (error) {
        console.error(`Erreur parsing CV ${file.name}:`, error);
      }
    }
  }

  // Dédupliquer et scorer
  analysis.skills = [...new Set(analysis.skills)];
  analysis.matchingScore = calculateMatchingScore(analysis);
  analysis.keyInsights = generateKeyInsights(analysis);

  return analysis;
}

// Enrichir les données candidat
function enrichCandidateData(candidateData, cvAnalysis, driveResults) {
  return {
    // Données de base
    ...candidateData,
    
    // URLs Drive
    cv_drive_urls: driveResults.files.map(f => f.webViewLink).join(', '),
    dossier_drive_url: driveResults.folderUrl,
    
    // Données extraites du CV
    competences_extraites: cvAnalysis.skills.join(', '),
    experiences_cles: JSON.stringify(cvAnalysis.experiences),
    formations: JSON.stringify(cvAnalysis.education),
    certifications_extraites: cvAnalysis.certifications.join(', '),
    langues: cvAnalysis.languages.join(', '),
    
    // Scoring et insights
    score_matching: cvAnalysis.matchingScore,
    insights_cles: cvAnalysis.keyInsights.join(' | '),
    
    // Métadonnées de traitement
    statut: 'Nouveau candidat',
    disponible: candidateData.disponibilite === 'Immédiate' ? 'Oui' : 'Non',
    traitement_automatique: 'Oui',
    date_traitement: new Date().toISOString(),
    
    // Catégorisation automatique
    categorie_principale: detectMainCategory(cvAnalysis.skills),
    niveau_estime: estimateLevel(cvAnalysis.experiences),
    stack_principale: detectMainStack(cvAnalysis.skills)
  };
}

// Détection automatique de la catégorie principale
function detectMainCategory(skills) {
  const categories = {
    'Frontend Developer': ['React', 'Vue', 'Angular', 'JavaScript', 'CSS', 'HTML'],
    'Backend Developer': ['Node.js', 'Python', 'Java', 'C#', 'Ruby', 'Go'],
    'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'Jenkins', 'Terraform'],
    'Data Scientist': ['Python', 'R', 'TensorFlow', 'Pandas', 'SQL', 'Machine Learning'],
    'Mobile Developer': ['React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin'],
    'Full Stack Developer': [] // Sera détecté si plusieurs catégories matchent
  };

  let categoryScores = {};
  
  Object.entries(categories).forEach(([category, keywords]) => {
    const matches = skills.filter(skill => 
      keywords.some(keyword => 
        skill.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    categoryScores[category] = matches.length;
  });

  // Si plusieurs catégories ont des scores élevés, c'est probablement un Full Stack
  const highScoreCategories = Object.entries(categoryScores)
    .filter(([_, score]) => score >= 2)
    .length;

  if (highScoreCategories >= 3) {
    return 'Full Stack Developer';
  }

  return Object.entries(categoryScores)
    .reduce((a, b) => a[1] > b[1] ? a : b)[0];
}

// Estimation du niveau basée sur l'expérience
function estimateLevel(experiences) {
  const totalYears = experiences.reduce((sum, exp) => {
    const duration = exp.duration || 0;
    return sum + duration;
  }, 0);

  if (totalYears < 2) return 'Junior';
  if (totalYears < 5) return 'Confirmé';
  if (totalYears < 8) return 'Senior';
  return 'Expert';
}

// Détection de la stack principale
function detectMainStack(skills) {
  const stacks = {
    'MEAN': ['MongoDB', 'Express', 'Angular', 'Node.js'],
    'MERN': ['MongoDB', 'Express', 'React', 'Node.js'],
    'LAMP': ['Linux', 'Apache', 'MySQL', 'PHP'],
    'Django': ['Python', 'Django', 'PostgreSQL'],
    '.NET': ['C#', '.NET', 'SQL Server', 'Azure'],
    'Spring': ['Java', 'Spring', 'MySQL', 'Maven']
  };

  let stackScores = {};
  
  Object.entries(stacks).forEach(([stack, technologies]) => {
    const matches = skills.filter(skill => 
      technologies.some(tech => 
        skill.toLowerCase().includes(tech.toLowerCase())
      )
    );
    stackScores[stack] = matches.length;
  });

  const bestStack = Object.entries(stackScores)
    .reduce((a, b) => a[1] > b[1] ? a : b);

  return bestStack[1] > 0 ? bestStack[0] : 'Stack personnalisée';
}

// Calculer le score de matching
function calculateMatchingScore(analysis) {
  let score = 0;
  
  // Score basé sur le nombre de compétences
  score += Math.min(analysis.skills.length * 2, 30);
  
  // Score basé sur l'expérience
  score += Math.min(analysis.experiences.length * 5, 25);
  
  // Score basé sur les certifications
  score += Math.min(analysis.certifications.length * 5, 20);
  
  // Score basé sur la formation
  score += Math.min(analysis.education.length * 3, 15);
  
  // Score basé sur les langues
  score += Math.min(analysis.languages.length * 2, 10);
  
  return Math.min(score, 100);
}

// Générer des insights clés
function generateKeyInsights(analysis) {
  const insights = [];
  
  if (analysis.skills.length > 15) {
    insights.push('Profil polyvalent avec de nombreuses compétences');
  }
  
  if (analysis.certifications.length > 2) {
    insights.push('Candidat certifié avec validations officielles');
  }
  
  if (analysis.experiences.some(exp => exp.duration > 3)) {
    insights.push('Expérience approfondie sur des projets long terme');
  }
  
  if (analysis.languages.length > 2) {
    insights.push('Profil international - multilingue');
  }
  
  const techDiversity = detectTechDiversity(analysis.skills);
  if (techDiversity.score > 3) {
    insights.push(`Expertise transverse - ${techDiversity.categories.join(', ')}`);
  }
  
  return insights;
}

// Détecter la diversité technologique
function detectTechDiversity(skills) {
  const techCategories = {
    'Frontend': ['React', 'Vue', 'Angular'],
    'Backend': ['Node.js', 'Python', 'Java'],
    'Database': ['MongoDB', 'PostgreSQL', 'MySQL'],
    'Cloud': ['AWS', 'Azure', 'GCP'],
    'DevOps': ['Docker', 'Kubernetes', 'Jenkins']
  };
  
  const categoriesWithSkills = [];
  
  Object.entries(techCategories).forEach(([category, techs]) => {
    if (skills.some(skill => techs.some(tech => skill.includes(tech)))) {
      categoriesWithSkills.push(category);
    }
  });
  
  return {
    score: categoriesWithSkills.length,
    categories: categoriesWithSkills
  };
}

// Déclencher les automations Airtable
async function triggerAutomations(recordId, enrichedData) {
  // 1. Automation pour notification équipe RH
  await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Automations/trigger`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
      'Content-Type': 'application/
