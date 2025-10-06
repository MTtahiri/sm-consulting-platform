// pages/api/consultants/index.js
// 📋 API LISTE CONSULTANTS AVEC PAGINATION ET FILTRES

import { GoogleSpreadsheet } from 'google-spreadsheet';

// Configuration
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_EMAIL = process.env.GOOGLE_SHEET_EMAIL;
const SHEET_PRIVATE_KEY = process.env.GOOGLE_SHEET_PRIVATE_KEY;

// Cache global pour la liste des consultants
let consultantsCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    // Paramètres de requête
    const {
      page = 1,
      limit = 12,
      search = '',
      experience = '',
      secteur = ''
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Récupération des consultants
    const allConsultants = await getAllConsultants();
    
    // Application des filtres
    let filteredConsultants = applyFilters(allConsultants, {
      search,
      experience,
      secteur
    });

    // Calcul pagination
    const total = filteredConsultants.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    // Consultants paginés
    const paginatedConsultants = filteredConsultants.slice(startIndex, endIndex);

    // Optimisation des données pour la liste (moins de détails)
    const optimizedConsultants = paginatedConsultants.map(consultant => ({
      id: consultant.id,
      titre: consultant.titre,
      competences: consultant.competences?.slice(0, 5) || [], // Max 5 pour la liste
      annees_experience: consultant.annees_experience,
      mobilite: consultant.mobilite,
      secteur_recherche: consultant.secteur_recherche,
      display: consultant.display
    }));

    // Headers cache
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    res.status(200).json({
      consultants: optimizedConsultants,
      pagination: {
        current_page: pageNum,
        total_pages: totalPages,
        total_items: total,
        items_per_page: limitNum,
        has_next: pageNum < totalPages,
        has_prev: pageNum > 1
      },
      filters_applied: {
        search: search || null,
        experience: experience || null,
        secteur: secteur || null
      },
      meta: {
        last_sync: new Date().toISOString(),
        source: consultantsCache ? 'google_sheets' : 'fallback'
      }
    });

  } catch (error) {
    console.error('❌ Erreur API consultants liste:', error);
    
    // Fallback avec données de test
    const fallbackData = getFallbackConsultantsList();
    res.status(200).json({
      consultants: fallbackData.slice(0, parseInt(req.query.limit || 12)),
      pagination: {
        current_page: 1,
        total_pages: Math.ceil(fallbackData.length / parseInt(req.query.limit || 12)),
        total_items: fallbackData.length
      },
      meta: { source: 'fallback', error: error.message }
    });
  }
}

// 📊 RÉCUPÉRATION COMPLÈTE DEPUIS GOOGLE SHEETS
async function getAllConsultants() {
  // Vérification du cache
  if (consultantsCache && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
    console.log('📋 Utilisation du cache consultants');
    return consultantsCache;
  }

  try {
    console.log('🔄 Synchronisation Google Sheets...');
    
    // Connexion Google Sheets
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: SHEET_EMAIL,
      private_key: SHEET_PRIVATE_KEY?.replace(/\\n/g, '\n')
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadHeaderRow();
    
    // Récupération de toutes les lignes
    const rows = await sheet.getRows();
    console.log(`📊 ${rows.length} consultants récupérés depuis Google Sheets`);

    // Formatage des données
    const consultants = rows
      .filter(row => row.id && row.titre) // Filtrer les lignes valides
      .map(row => formatConsultantForList(row));

    // Mise en cache
    consultantsCache = consultants;
    cacheTimestamp = Date.now();

    return consultants;

  } catch (error) {
    console.error('❌ Erreur Google Sheets:', error);
    
    // Si erreur, utiliser le cache existant s'il existe
    if (consultantsCache) {
      console.log('⚠️ Utilisation du cache périmé en fallback');
      return consultantsCache;
    }
    
    throw error;
  }
}

// 🎨 FORMATAGE OPTIMISÉ POUR LA LISTE
function formatConsultantForList(row) {
  const id = parseInt(row.id);
  
  // Parsing des compétences
  let competences = [];
  if (row.competences) {
    competences = row.competences.split(',').map(c => c.trim()).filter(c => c);
  }

  // Parsing des secteurs
  let secteurs = [];
  if (row.secteur_recherche) {
    secteurs = row.secteur_recherche.split(',').map(s => s.trim()).filter(s => s);
  }

  const annees = parseInt(row.annees_experience) || 0;

  return {
    id: id,
    titre: row.titre || `Consultant Expert #${id}`,
    competences: competences,
    annees_experience: annees,
    mobilite: row.mobilite || 'France',
    secteur_recherche: secteurs,
    formation: row.formation || 'Formation supérieure',
    
    // Données d'affichage optimisées
    display: {
      avatar_color: getAvatarColor(id),
      experience_level: getExperienceLevel(annees),
      top_skills: competences.slice(0, 3),
      formatted_experience: `${annees}+ ans`,
      availability_status: 'Disponible',
      match_score: Math.floor(Math.random() * 20) + 80 // Score simulé 80-100%
    }
  };
}

// 🔍 APPLICATION DES FILTRES
function applyFilters(consultants, filters) {
  let filtered = [...consultants];

  // Filtre par recherche (compétences et titre)
  if (filters.search && filters.search.trim()) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(consultant => {
      const titleMatch = consultant.titre?.toLowerCase().includes(searchTerm);
      const skillsMatch = consultant.competences?.some(skill => 
        skill.toLowerCase().includes(searchTerm)
      );
      return titleMatch || skillsMatch;
    });
  }

  // Filtre par expérience minimale
  if (filters.experience && filters.experience.trim()) {
    const minExperience = parseInt(filters.experience);
    filtered = filtered.filter(consultant => 
      consultant.annees_experience >= minExperience
    );
  }

  // Filtre par secteur
  if (filters.secteur && filters.secteur.trim()) {
    const secteurFilter = filters.secteur.toLowerCase();
    filtered = filtered.filter(consultant => {
      if (Array.isArray(consultant.secteur_recherche)) {
        return consultant.secteur_recherche.some(secteur => 
          secteur.toLowerCase().includes(secteurFilter)
        );
      }
      return false;
    });
  }

  // Tri par pertinence (score de match + expérience)
  filtered.sort((a, b) => {
    const scoreA = (a.display?.match_score || 0) + (a.annees_experience * 2);
    const scoreB = (b.display?.match_score || 0) + (b.annees_experience * 2);
    return scoreB - scoreA;
  });

  return filtered;
}

// 🎨 HELPERS
function getAvatarColor(id) {
  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', 
    '#fa709a', '#ffecd2', '#fcb045', '#fd746c', '#833ab4'
  ];
  return colors[parseInt(id) % colors.length];
}

function getExperienceLevel(years) {
  if (years >= 10) return 'Expert';
  if (years >= 5) return 'Senior';
  if (years >= 2) return 'Confirmé';
  return 'Junior';
}

// 🔄 DONNÉES FALLBACK (DÉMONSTRATION AVEC 15 CONSULTANTS)
function getFallbackConsultantsList() {
  return [
    {
      id: 1,
      titre: "Développeur Full-Stack Senior",
      competences: ["React", "Node.js", "MongoDB", "AWS", "TypeScript"],
      annees_experience: 8,
      mobilite: "Paris/Remote",
      secteur_recherche: ["Fintech", "E-commerce"],
      display: { avatar_color: '#667eea', experience_level: 'Senior', top_skills: ["React", "Node.js", "MongoDB"], formatted_experience: "8+ ans" }
    },
    {
      id: 2,
      titre: "Lead Developer Frontend",
      competences: ["React", "Vue.js", "JavaScript", "CSS", "Webpack"],
      annees_experience: 6,
      mobilite: "Lyon/Hybride",
      secteur_recherche: ["Startup", "Tech"],
      display: { avatar_color: '#764ba2', experience_level: 'Senior', top_skills: ["React", "Vue.js", "JavaScript"], formatted_experience: "6+ ans" }
    },
    {
      id: 3,
      titre: "Architecte Cloud DevOps",
      competences: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform"],
      annees_experience: 10,
      mobilite: "France entière",
      secteur_recherche: ["Enterprise", "Cloud"],
      display: { avatar_color: '#f093fb', experience_level: 'Expert', top_skills: ["AWS", "Azure", "Docker"], formatted_experience: "10+ ans" }
    },
    {
      id: 4,
      titre: "Data Scientist Senior",
      competences: ["Python", "Machine Learning", "TensorFlow", "SQL", "Tableau"],
      annees_experience: 7,
      mobilite: "Paris/Remote",
      secteur_recherche: ["Data", "IA", "Finance"],
      display: { avatar_color: '#4facfe', experience_level: 'Senior', top_skills: ["Python", "Machine Learning", "TensorFlow"], formatted_experience: "7+ ans" }
    },
    {
      id: 5,
      titre: "Product Manager Digital",
      competences: ["Product Strategy", "Agile", "Analytics", "UX", "Roadmap"],
      annees_experience: 9,
      mobilite: "Paris",
      secteur_recherche: ["SaaS", "E-commerce", "Fintech"],
      display: { avatar_color: '#43e97b', experience_level: 'Expert', top_skills: ["Product Strategy", "Agile", "Analytics"], formatted_experience: "9+ ans" }
    },
    {
      id: 6,
      titre: "Consultant Salesforce Senior",
      competences: ["Salesforce", "Apex", "Lightning", "Integration", "CPQ"],
      annees_experience: 5,
      mobilite: "Remote",
      secteur_recherche: ["CRM", "Enterprise", "Conseil"],
      display: { avatar_color: '#fa709a', experience_level: 'Senior', top_skills: ["Salesforce", "Apex", "Lightning"], formatted_experience: "5+ ans" }
    },
    {
      id: 7,
      titre: "Expert Cybersécurité",
      competences: ["Pentest", "CISSP", "ISO27001", "SOC", "Forensic"],
      annees_experience: 12,
      mobilite: "France/Europe",
      secteur_recherche: ["Sécurité", "Banking", "Defense"],
      display: { avatar_color: '#ffecd2', experience_level: 'Expert', top_skills: ["Pentest", "CISSP", "ISO27001"], formatted_experience: "12+ ans" }
    },
    {
      id: 8,
      titre: "Développeur Mobile React Native",
      competences: ["React Native", "iOS", "Android", "JavaScript", "Redux"],
      annees_experience: 4,
      mobilite: "Lyon/Remote",
      secteur_recherche: ["Mobile", "Startup", "E-commerce"],
      display: { avatar_color: '#fcb045', experience_level: 'Confirmé', top_skills: ["React Native", "iOS", "Android"], formatted_experience: "4+ ans" }
    },
    // Ajout de consultants supplémentaires pour démontrer la pagination
    ...Array.from({ length: 12 }, (_, i) => ({
      id: i + 9,
      titre: `Consultant Expert ${i + 9}`,
      competences: ["Expertise", "Conseil", "Management", "Digital"],
      annees_experience: Math.floor(Math.random() * 10) + 3,
      mobilite: ["Paris", "Lyon", "Remote", "France"][Math.floor(Math.random() * 4)],
      secteur_recherche: [["Tech", "Startup"], ["Finance", "Banking"], ["E-commerce", "Retail"]][Math.floor(Math.random() * 3)],
      display: { 
        avatar_color: getAvatarColor(i + 9), 
        experience_level: getExperienceLevel(Math.floor(Math.random() * 10) + 3),
        top_skills: ["Expertise", "Conseil", "Management"],
        formatted_experience: `${Math.floor(Math.random() * 10) + 3}+ ans`
      }
    }))
  ];
}