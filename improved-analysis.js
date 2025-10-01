// Nouvelle fonction de détection de spécialité améliorée
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

// Amélioration de la détection d'expérience
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

// Amélioration de la détection TJM
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
