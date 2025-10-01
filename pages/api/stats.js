// pages/api/stats.js
export default async function handler(req, res) {
  // Headers CORS et JSON
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log(`📊 API Stats appelée - Méthode: ${req.method}`);

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ 
      error: 'Méthode non autorisée',
      allowedMethods: ['GET'],
      receivedMethod: req.method
    });
    return;
  }

  try {
    // Statistiques réalistes basées sur 195 candidats
    const stats = {
      total: 195,
      available: 87,
      averageScore: 78.5,
      averageTJM: 625,
      newThisWeek: 12,
      newThisMonth: 43,
      topPerformers: 15,
      byRole: {
        'Développeur Full Stack': 45,
        'DevOps Engineer': 28,
        'Data Engineer': 32,
        'Frontend Developer': 35,
        'Backend Developer': 25,
        'Data Scientist': 18,
        'Tech Lead': 8,
        'Architect Solution': 4
      },
      byLocation: {
        'Paris': 65,
        'Lyon': 35,
        'Marseille': 25,
        'Toulouse': 30,
        'Nice': 15,
        'Nantes': 15,
        'Remote': 10
      },
      byExperience: {
        'Junior (0-3 ans)': 58,
        'Confirmé (4-7 ans)': 82,
        'Senior (8+ ans)': 55
      },
      topSkills: [
        { skill: 'JavaScript', count: 89, trend: '+5%' },
        { skill: 'React', count: 67, trend: '+12%' },
        { skill: 'Python', count: 54, trend: '+8%' },
        { skill: 'AWS', count: 78, trend: '+15%' },
        { skill: 'Docker', count: 52, trend: '+20%' },
        { skill: 'Node.js', count: 48, trend: '+7%' },
        { skill: 'MongoDB', count: 35, trend: '+3%' },
        { skill: 'Kubernetes', count: 28, trend: '+25%' }
      ],
      contractTypes: {
        'CDI': 98,
        'Freelance': 67,
        'CDD': 30
      },
      availability: {
        'Immédiate': 45,
        '1 mois': 32,
        '2-3 mois': 10
      }
    };

    const response = {
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
      message: 'Statistiques récupérées avec succès',
      generatedAt: new Date().toLocaleString('fr-FR')
    };

    console.log('✅ Stats générées avec succès');
    res.status(200).json(response);

  } catch (error) {
    console.error('❌ ERREUR API Stats:', error);
    res.status(500).json({ 
      error: 'Erreur serveur interne',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}