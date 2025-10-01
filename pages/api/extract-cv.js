import pdf from 'pdf-parse';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method POST required' });
  }

  try {
    const { pdfFileName } = req.body;
    
    if (!pdfFileName) {
      return res.status(400).json({ error: 'PDF filename required' });
    }

    // Chemin vers le PDF - version corrigée
    const pdfPath = path.join('C:', 'Users', 'mohat', 'Downloads', 'Mes CVs pdf', pdfFileName);
    
    console.log('🔧 Tentative extraction:', pdfPath);

    // Vérifier si le fichier existe
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: 'PDF file not found: ' + pdfPath });
    }

    // Lire et parser le PDF
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    
    const text = data.text;
    console.log('✅ PDF extrait - Longueur:', text.length, 'caractères');

    // Analyser le contenu
    const analysis = analyzeCVText(text, pdfFileName);
    
    res.status(200).json({
      success: true,
      fileName: pdfFileName,
      textLength: text.length,
      textSample: text.substring(0, 300) + '...',
      analysis: analysis
    });

  } catch (error) {
    console.error('❌ Erreur extraction:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

// Fonction principale d'analyse
function analyzeCVText(text, fileName) {
  const technologies = detectTechnologies(text);
  const specialite = detectSpecialite(text, fileName);
  const experience = detectExperience(text);
  const tjm = detectTJM(fileName, text);

  return {
    specialite: specialite,
    technologies_cles: technologies.join(', '),
    niveau_expertise: calculateNiveau(experience),
    annees_experience: experience,
    tjm_min: tjm.min,
    tjm_max: tjm.max,
    mobilite: detectMobilite(text),
    disponibilite: detectDisponibilite(fileName),
    competences_detectees: technologies.slice(0, 8),
    confidence: calculateConfidence(text)
  };
}

// Détection des technologies
function detectTechnologies(text) {
  const techKeywords = {
    'Python': ['python', 'pandas', 'numpy', 'scikit', 'tensorflow', 'pytorch'],
    'JavaScript': ['javascript', 'js', 'node', 'react', 'angular', 'vue', 'typescript'],
    'Java': ['java', 'spring', 'hibernate', 'j2ee'],
    'SQL': ['sql', 'mysql', 'postgresql', 'oracle', 'nosql', 'mongodb'],
    'AWS': ['aws', 'amazon web services', 's3', 'ec2', 'lambda'],
    'Azure': ['azure', 'microsoft azure'],
    'Docker': ['docker', 'container'],
    'Kubernetes': ['kubernetes', 'k8s'],
    'SAP': ['sap', 'fico', 'mm', 'sd', 'pp'],
    'Data Science': ['machine learning', 'deep learning', 'ai', 'artificial intelligence']
  };

  const foundTechs = [];
  const lowerText = text.toLowerCase();

  for (const [tech, keywords] of Object.entries(techKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      foundTechs.push(tech);
    }
  }

  return foundTechs.length > 0 ? foundTechs : ['Technologies à identifier'];
}

// Détection améliorée des spécialités
function detectSpecialite(text, fileName) {
  const lowerText = text.toLowerCase();
  const lowerFileName = fileName.toLowerCase();

  const specialites = {
    'Data Scientist': ['data scientist', 'machine learning engineer', 'ml engineer', 'ai scientist'],
    'Data Analyst': ['data analyst', 'business intelligence', 'bi analyst', 'reporting analyst'],
    'Data Engineer': ['data engineer', 'etl', 'data pipeline', 'big data engineer'],
    'Développeur Fullstack': ['fullstack', 'full stack', 'full-stack', 'développeur fullstack'],
    'Développeur Backend': ['backend', 'back-end', 'développeur backend', 'java developer', 'spring boot'],
    'Développeur Frontend': ['frontend', 'front-end', 'react', 'angular', 'vue', 'développeur frontend'],
    'Développeur IA': ['ai developer', 'développeur ia', 'machine learning developer'],
    'Consultant SAP': ['sap', 'fico', 'erp', 'consultant sap', 'functional consultant'],
    'DevOps Engineer': ['devops', 'cloud engineer', 'aws', 'azure', 'gcp', 'kubernetes'],
    'Business Analyst': ['business analyst', 'functional analyst', 'product owner']
  };

  // Score pour chaque spécialité
  const scores = {};
  
  for (const [specialite, keywords] of Object.entries(specialites)) {
    let score = 0;
    
    // Recherche dans le texte
    keywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const matches = text.match(regex);
      if (matches) score += matches.length * 10;
    });
    
    // Bonus si trouvé dans le nom du fichier
    if (keywords.some(keyword => lowerFileName.includes(keyword))) {
      score += 50;
    }
    
    scores[specialite] = score;
  }

  // Trouver la spécialité avec le score le plus élevé
  const bestMatch = Object.entries(scores)
    .sort(([,a], [,b]) => b - a)
    .find(([,score]) => score > 0);

  return bestMatch ? bestMatch[0] : 'Expert IT';
}

// Détection améliorée de l'expérience
function detectExperience(text) {
  const expPatterns = [
    /(\d+)\s*(ans?|years?|années)/gi,
    /(\d+)\s*\+?\s*(ans?|years?|années)/gi,
    /expérience.*?(\d+)\s*(ans?|années)/gi,
    /experience.*?(\d+)\s*(years?)/gi
  ];

  let maxYears = 0;

  expPatterns.forEach(pattern => {
    const matches = [...text.matchAll(pattern)];
    matches.forEach(match => {
      const years = parseInt(match[1]);
      if (years > 0 && years < 50 && years > maxYears) {
        maxYears = years;
      }
    });
  });

  return maxYears;
}

// Détection améliorée du TJM
function detectTJM(fileName, text) {
  // Recherche précise dans le nom du fichier
  const tjmPatterns = [
    /(\d{3})\s*€/,
    /(\d{3})\s*euros?/,
    /tjm.*?(\d{3})/i,
    /rate.*?(\d{3})/i
  ];

  for (const pattern of tjmPatterns) {
    const match = fileName.match(pattern) || text.match(pattern);
    if (match) {
      const tjm = parseInt(match[1]);
      if (tjm >= 100 && tjm <= 2000) {
        return { 
          min: Math.max(100, tjm - 100), 
          max: tjm + 100 
        };
      }
    }
  }

  return { min: 0, max: 0 };
}

// Calcul du niveau
function calculateNiveau(experience) {
  if (experience >= 10) return 'Expert';
  if (experience >= 6) return 'Senior';
  if (experience >= 3) return 'Confirmé';
  return 'Junior';
}

// Détection mobilité
function detectMobilite(text) {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('remote') || lowerText.includes('télétravail') || lowerText.includes('teletravail')) {
    return 'Remote possible';
  }
  if (lowerText.includes('paris') || lowerText.includes('île-de-france')) {
    return 'Paris/Île-de-France';
  }
  return 'Mobilité à préciser';
}

// Détection disponibilité
function detectDisponibilite(fileName) {
  const lowerFileName = fileName.toLowerCase();
  if (lowerFileName.includes('dispo')) return 'Disponible rapidement';
  return 'Disponibilité à confirmer';
}

// Calcul confiance
function calculateConfidence(text) {
  let score = 0;
  if (text.length > 500) score += 30;
  if (text.includes('experience') || text.includes('expérience')) score += 20;
  if (text.includes('competence') || text.includes('compétence')) score += 20;
  if (text.match(/\d+\s*(ans|years)/)) score += 30;
  
  return Math.min(score, 100);
}
