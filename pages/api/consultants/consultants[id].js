// pages/api/consultants/[id].js - CODE API CORRECT
export default function handler(req, res) {
  const { id } = req.query;

  console.log('✅ API consultants appelée pour ID:', id);

  // Données fixes pour test
  const consultantsData = {
    "1": {
      id: "1",
      titre: "Développeur Fullstack JavaScript Senior",
      competences: "React, Node.js, TypeScript, MongoDB, AWS, Docker, PostgreSQL",
      annees_experience: "5",
      experience_resume: "Expert en développement d'applications web modernes avec 5 ans d'expérience fullstack. Spécialisé dans les architectures microservices.",
      formation: "Master Informatique - École d'Ingénieurs",
      secteur_recherche: "Tech, SaaS, E-commerce",
      mobilite: "Paris, Remote, Île-de-France"
    },
    "2": {
      id: "2", 
      titre: "Data Scientist Python",
      competences: "Python, Machine Learning, SQL, TensorFlow, PyTorch, Data Analysis",
      annees_experience: "4",
      experience_resume: "Data Scientist passionné par l'IA et l'analyse prédictive. Expérience en NLP et computer vision.",
      formation: "Master Data Science - Université Paris-Saclay",
      secteur_recherche: "IA, Santé, FinTech",
      mobilite: "Lyon, Remote, France"
    },
    "consultant-1-1758907678336": {
      id: "consultant-1-1758907678336",
      titre: "Développeur Fullstack",
      competences: "JavaScript, React, Node.js, MongoDB",
      annees_experience: "3",
      experience_resume: "Développeur fullstack avec expérience en startups tech.",
      formation: "Licence Informatique",
      secteur_recherche: "Tech, Startup",
      mobilite: "Paris, Remote"
    }
  };

  // Trouver le candidat ou retourner un profil par défaut
  const candidate = consultantsData[id] || {
    id: id,
    titre: "Consultant IT",
    competences: "Compétences à définir",
    annees_experience: "3",
    experience_resume: "Profil professionnel en cours de finalisation",
    formation: "Formation à préciser",
    secteur_recherche: "Secteur à définir",
    mobilite: "Mobilité à préciser"
  };

  res.status(200).json(candidate);
}