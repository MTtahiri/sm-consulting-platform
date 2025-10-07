export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const specialites = [
      "Développement Front-End", "Développement Back-End", "Développement Full Stack",
      "Data Science", "Data Engineering", "Data Analysis", 
      "DevOps Engineering", "Cloud Architecture", "Infrastructure",
      "Cybersécurité", "Sécurité Cloud", "Pentesting",
      "Mobile Development", "IoT Development", "Embedded Systems",
      "UX/UI Design", "Product Management", "Project Management",
      "ERP Consulting", "CRM Consulting", "Business Analysis"
    ];

    const niveaux = ["Junior", "Intermédiaire", "Senior", "Expert", "Lead"];
    const localisations = ["Île-de-France", "Lyon", "Marseille", "Remote", "International", "Europe"];
    
    const sampleConsultants = [];

    for (let i = 1; i <= 221; i++) {
      const specialite = specialites[i % specialites.length];
      const niveau = niveaux[i % niveaux.length];
      const tjmBase = 400 + (i % 10) * 50;
      
      sampleConsultants.push({
        id: i.toString(),
        titre: `Consultant ${specialite.split(' ')[0]} ${niveau}`,
        specialite: specialite,
        niveau_expertise: niveau,
        technologies_cles: getTechnologiesForSpecialite(specialite),
        localisation: localisations[i % localisations.length],
        disponibilite: i % 5 !== 0 ? "Disponible" : "En mission",
        tjm_min: tjmBase.toString(),
        tjm_max: (tjmBase + 200 + (i % 10) * 30).toString(),
        lien_cv: `/cv/${i}`,
        annees_experience: (3 + (i % 12)).toString(),
        experience_resume: `${niveau} en ${specialite} avec expertise confirmée`,
        soft_skills: "Communication, Leadership, Résolution créative"
      });
    }

    res.status(200).json({
      success: true,
      count: sampleConsultants.length,
      consultants: sampleConsultants
    });

  } catch (error) {
    console.error("❌ Erreur API:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

function getTechnologiesForSpecialite(specialite) {
  const techMap = {
    "Développement Front-End": ["React", "Vue.js", "Angular", "TypeScript", "SASS"],
    "Développement Back-End": ["Node.js", "Python", "Java", "Spring", "PostgreSQL"],
    "Data Science": ["Python", "R", "TensorFlow", "PyTorch", "SQL"],
    "DevOps Engineering": ["Docker", "Kubernetes", "AWS", "Terraform", "Jenkins"],
    "Cybersécurité": ["Kali Linux", "Metasploit", "Wireshark", "SIEM", "OWASP"],
    "Mobile Development": ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"]
  };
  
  return techMap[specialite] || ["JavaScript", "Python", "SQL", "Docker", "AWS"];
}
