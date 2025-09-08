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
  const automations = [];

  try {
    // 1. Automation pour notification équipe RH
    const hrNotification = await fetch(`${process.env.AIRTABLE_WEBHOOK_HR_NOTIFICATION}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recordId: recordId,
        candidateName: `${enrichedData.prenom} ${enrichedData.nom}`,
        position: enrichedData.poste,
        matchingScore: enrichedData.score_matching,
        urgency: enrichedData.disponibilite === 'Immédiate' ? 'high' : 'normal'
      })
    });
    
    automations.push({ type: 'HR_Notification', status: hrNotification.ok ? 'success' : 'failed' });

    // 2. Automation pour anonymisation CV
    if (enrichedData.cv_drive_urls) {
      const anonymization = await fetch(`/api/anonymize-cv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordId: recordId,
          driveUrls: enrichedData.cv_drive_urls.split(', '),
          candidateInfo: {
            nom: enrichedData.nom,
            prenom: enrichedData.prenom,
            email: enrichedData.email,
            telephone: enrichedData.telephone
          }
        })
      });
      
      automations.push({ type: 'CV_Anonymization', status: anonymization.ok ? 'success' : 'failed' });
    }

    // 3. Automation pour indexation recherche
    const indexing = await fetch(`/api/index-candidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recordId: recordId,
        searchableData: {
          skills: enrichedData.competences_extraites,
          position: enrichedData.poste,
          location: enrichedData.ville,
          level: enrichedData.niveau_estime,
          availability: enrichedData.disponibilite
        }
      })
    });
    
    automations.push({ type: 'Search_Indexing', status: indexing.ok ? 'success' : 'failed' });

    // 4. Mise à jour du statut dans Airtable
    await updateAirtableRecord(recordId, {
      'Statut_Traitement': 'Traité automatiquement',
      'Automations_Status': JSON.stringify(automations),
      'Date_Traitement_Complet': new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur lors des automations:', error);
    await updateAirtableRecord(recordId, {
      'Statut_Traitement': 'Erreur automation',
      'Erreur_Details': error.message
    });
  }

  return automations;
}

// Mise à jour d'un enregistrement Airtable
async function updateAirtableRecord(recordId, fields) {
  const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Candidats`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      records: [{
        id: recordId,
        fields: fields
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Erreur mise à jour Airtable: ${response.status}`);
  }

  return await response.json();
}

// Fonction de parsing CV (simulée - nécessite une vraie implémentation)
async function extractCVData(driveFileId) {
  // Cette fonction utiliserait une API de parsing de CV comme:
  // - Google Document AI
  // - Amazon Textract
  // - Une solution open source comme Spacy/NLTK
  
  // Simulation des données extraites
  return {
    skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker'],
    experiences: [
      {
        company: 'TechCorp',
        position: 'Senior Developer',
        duration: 3.5,
        startDate: '2021-01',
        endDate: '2024-06',
        description: 'Développement d\'applications web avec React et Node.js'
      }
    ],
    education: [
      {
        institution: 'Université Tech',
        degree: 'Master Informatique',
        year: '2020',
        field: 'Génie Logiciel'
      }
    ],
    certifications: ['AWS Solutions Architect', 'Scrum Master'],
    languages: ['Français', 'Anglais', 'Espagnol'],
    contactInfo: {
      email: 'candidate@example.com',
      phone: '+33123456789'
    }
  };
}

// Configuration des webhooks Airtable pour automatisation
const AIRTABLE_AUTOMATIONS_CONFIG = `
// Configuration des automations Airtable à créer manuellement :

1. AUTOMATION: "Nouveau Candidat - Notification RH"
   - Trigger: Nouveau record avec Statut = "Nouveau candidat"
   - Action: Envoyer email à l'équipe RH avec détails candidat
   - Template email: "Nouveau candidat: {Prenom} {Nom} - {Poste} - Score: {Score_Matching}%"

2. AUTOMATION: "CV Prêt - Notification Recruteur"  
   - Trigger: Champ CV_Anonyme_URL devient non vide
   - Action: Slack/Teams notification aux recruteurs
   - Message: "CV anonymisé disponible pour {Poste} - Consulter: {CV_Anonyme_URL}"

3. AUTOMATION: "Candidat Disponible - Alerte Urgente"
   - Trigger: Disponibilite = "Immédiate" ET Score_Matching > 80
   - Action: Notification immédiate + flag prioritaire
   - Condition: Seulement pendant heures ouvrables

4. AUTOMATION: "Mise à jour Drive - Sync Status"
   - Trigger: Modification des champs Drive
   - Action: Vérifier intégrité des liens et mettre à jour statut

5. AUTOMATION: "Weekly Report - Nouveaux Candidats"
   - Trigger: Chaque lundi à 9h
   - Action: Rapport hebdomadaire des nouveaux candidats
   - Format: Tableau avec métriques clés
`;

// Fonction utilitaire pour créer les vues Airtable automatiquement
async function createAirtableViews() {
  const views = [
    {
      name: "Candidats - Validation Pending",
      type: "grid",
      filters: [
        { field: "Statut", operator: "is", value: "Nouveau candidat" }
      ],
      sorts: [
        { field: "Score_Matching", direction: "desc" },
        { field: "Date_Ajout", direction: "desc" }
      ]
    },
    {
      name: "Disponibles Immédiatement",
      type: "grid", 
      filters: [
        { field: "Disponibilite", operator: "is", value: "Immédiate" },
        { field: "Statut", operator: "isNot", value: "Rejeté" }
      ],
      sorts: [
        { field: "Score_Matching", direction: "desc" }
      ]
    },
    {
      name: "Top Performers (Score > 80)",
      type: "grid",
      filters: [
        { field: "Score_Matching", operator: "isGreater", value: 80 }
      ],
      sorts: [
        { field: "Score_Matching", direction: "desc" },
        { field: "Date_Ajout", direction: "desc" }
      ]
    },
    {
      name: "Par Stack Technique",
      type: "grouped",
      groupBy: "Stack_Principale",
      sorts: [
        { field: "Score_Matching", direction: "desc" }
      ]
    }
  ];

  // Code pour créer les vues via API Airtable
  // Note: Nécessite des permissions spéciales sur la base
  return views;
}

// Variables d'environnement nécessaires
const REQUIRED_ENV_VARS = `
# Airtable
AIRTABLE_API_KEY=pathXG85b7P96CnjE.8fe40141abdb308305bfb43100855b821751c55e38edf0680bce3a9d19243235
AIRTABLE_BASE_ID=appNwg9iP8ub0cDCn
AIRTABLE_TABLE_NAME=Candidats

# Google Drive
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
GOOGLE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_DRIVE_PARENT_FOLDER_ID=1ABcDeFgHiJkLmNoPqRsTuVwXyZ

# Webhooks Airtable  
AIRTABLE_WEBHOOK_HR_NOTIFICATION=https://hooks.airtable.com/workflows/...
AIRTABLE_WEBHOOK_CV_READY=https://hooks.airtable.com/workflows/...

# Notifications
HR_EMAIL_1=rh1@sm-consulting.com
HR_EMAIL_2=rh2@sm-consulting.com
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# CV Processing
CV_PARSER_API_KEY=your-cv-parser-api-key
ANONYMIZATION_SERVICE_URL=https://your-anonymization-service.com
`;

export { 
  extractCandidateData,
  analyzeCVs, 
  enrichCandidateData,
  triggerAutomations,
  createAirtableViews,
  AIRTABLE_AUTOMATIONS_CONFIG,
  REQUIRED_ENV_VARS 
};
