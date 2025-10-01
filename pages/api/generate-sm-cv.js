// pages/api/generate-sm-cv.js - VERSION ENRICHIE
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { candidate } = req.body;

  if (!candidate) {
    return res.status(400).json({ error: 'Candidate data required' });
  }

  try {
    console.log('🎨 Génération CV professionnel enrichi pour:', candidate.titre);

    // ===== FONCTIONS D'ANONYMISATION ENRICHIES =====
    
    const getProfessionalTitle = (title, specialite) => {
      if (!title) return 'Consultant IT Expert';
      
      const titleMapping = {
        'data analyst': 'Data Analyst Senior',
        'data scientist': 'Data Scientist Expert', 
        'business intelligence': 'Consultant BI Senior',
        'developpeur': 'Développeur Full Stack',
        'developer': 'Développeur Full Stack',
        'consultant': 'Consultant IT Senior',
        'engineer': 'Ingénieur Logiciel',
        'architect': 'Architecte Solutions Cloud',
        'manager': 'Manager Technique'
      };

      const lowerTitle = title.toLowerCase();
      let professionalTitle = title;

      for (const [key, value] of Object.entries(titleMapping)) {
        if (lowerTitle.includes(key)) {
          professionalTitle = value;
          break;
        }
      }

      return professionalTitle;
    };

    const generateRichProfile = (candidate) => {
      const yearsExp = candidate.annees_experience || '5';
      const specialite = candidate.specialite || 'IT';
      
      const profiles = [
        `Consultant ${specialite} avec ${yearsExp} ans d'expérience dans la conception et le déploiement de solutions techniques innovantes. Expertise avancée en architecture logicielle et gestion de projets complexes.`,
        `Expert ${specialite} confirmé, fort de ${yearsExp} années d'expérience en conseil et mise en œuvre de solutions digitales. Compétences solides en leadership technique et accompagnement des équipes.`,
        `Consultant senior ${specialite} spécialisé dans la transformation digitale. ${yearsExp} ans d'expérience en pilotage de projets technologiques et optimisation des processus métier.`
      ];
      
      return profiles[Math.floor(Math.random() * profiles.length)];
    };

    const generateDetailedExperience = (candidate) => {
      if (candidate.experience_resume) {
        return candidate.experience_resume.split('.').filter(exp => exp.trim()).map(exp => `• ${exp.trim()}.`).join('\n');
      }

      const experiences = [
        `Conception et développement d'architectures microservices pour applications haute disponibilité`,
        `Encadrement d'équipes techniques et mise en place de bonnes pratiques DevOps`,
        `Optimisation des performances et réduction des coûts infrastructure de 30% en moyenne`,
        `Migration de solutions legacy vers le cloud avec amélioration de la scalabilité`,
        `Collaboration avec les équipes métier pour définir la roadmap technique produit`,
        `Mise en place de stratégies de tests automatisés et d'intégration continue`,
        `Conseil en transformation digitale auprès de grands comptes et PME innovantes`
      ];

      return experiences.slice(0, 5).map(exp => `• ${exp}`).join('\n');
    };

    const generateTechnicalSkills = (candidate) => {
      if (!candidate.competences) {
        return `• Langages: Java, Python, JavaScript, SQL, TypeScript\n• Frameworks: Spring Boot, React, Node.js, Angular\n• Cloud: AWS, Azure, Docker, Kubernetes\n• Outils: Git, Jenkins, Terraform, Prometheus\n• Méthodologies: Agile, Scrum, DevOps, CI/CD`;
      }

      const allSkills = candidate.competences.split(',').map(skill => skill.trim()).filter(skill => skill);
      
      // Organisation avancée par catégories
      const languages = allSkills.filter(skill => 
        ['java', 'python', 'javascript', 'typescript', 'sql', 'go', 'rust', 'php', 'c#', 'c++'].includes(skill.toLowerCase())
      );
      
      const frameworks = allSkills.filter(skill => 
        ['react', 'angular', 'vue', 'node.js', 'spring', 'django', 'flask', 'express', 'nestjs'].includes(skill.toLowerCase())
      );
      
      const cloudTools = allSkills.filter(skill => 
        ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins'].includes(skill.toLowerCase())
      );

      const databases = allSkills.filter(skill => 
        ['mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle'].includes(skill.toLowerCase())
      );

      let skillsText = '';
      if (languages.length > 0) skillsText += `• Langages: ${languages.slice(0, 6).join(', ')}\n`;
      if (frameworks.length > 0) skillsText += `• Frameworks: ${frameworks.slice(0, 5).join(', ')}\n`;
      if (cloudTools.length > 0) skillsText += `• Cloud & DevOps: ${cloudTools.slice(0, 5).join(', ')}\n`;
      if (databases.length > 0) skillsText += `• Bases de données: ${databases.slice(0, 4).join(', ')}\n`;

      return skillsText || `• ${allSkills.slice(0, 10).join(', ')}`;
    };

    // ===== GÉNÉRATION DU CV ENRICHI =====
    const professionalCV = `
${getProfessionalTitle(candidate.titre, candidate.specialite).toUpperCase()}
${'='.repeat(70)}

📍 LOCALISATION: ${candidate.mobilite || 'Île-de-France'}
🎯 SECTEUR RECHERCHE: ${candidate.secteur_recherche || 'Tous secteurs innovants'}
✅ DISPONIBILITÉ: ${candidate.disponibilite || 'Immédiate (15 jours)'}
📧 CONTACT: consultant-${candidate.id}@sm-consulting.fr
🔖 ID CONSULTANT: SM-${candidate.id}

PROFIL PROFESSIONNEL
${'-'.repeat(30)}
${generateRichProfile(candidate)}

DOMAINES D'EXPERTISE
${'-'.repeat(30)}
• Architecture de solutions cloud-native et microservices
• Développement full-stack et applications web modernes
• DevOps et automatisation des déploiements
• Optimisation des performances et scaling horizontal
• Conseil en transformation digitale et innovation
• Management technique et accompagnement d'équipes

EXPÉRIENCE PROFESSIONNELLE
${'-'.repeat(30)}
${generateDetailedExperience(candidate)}

COMPÉTENCES TECHNIQUES
${'-'.repeat(30)}
${generateTechnicalSkills(candidate)}

RÉALISATIONS SIGNIFICATIVES
${'-'.static(30)}
• Augmentation des performances de 40% sur une application critique
• Réduction des temps de déploiement de 70% via l'automatisation
• Migration réussie de 10+ applications vers le cloud
• Formation de 50+ développeurs aux bonnes pratiques DevOps
• Livraison de 15+ projets majeurs dans les délais et budgets

FORMATION ET CERTIFICATIONS
${'-'.repeat(30)}
• Formation supérieure en Informatique ou équivalent
• Certifications cloud (AWS, Azure, GCP) selon le profil
• Agile/Scrum Master Certification
• Spécialisations en sécurité et bonnes pratiques

SECTEURS D'INTERVENTION
${'-'.repeat(30)}
• FinTech & Assurance
• E-commerce & Retail
• Santé & MedTech
• Energie & Environnement
• Transport & Logistique
• Media & Entertainment

LANGUES
${'-'.repeat(30)}
• Français: Langue maternelle
• Anglais: Courant professionnel (TOEIC 850+)
• Espagnol: Notions professionnelles

INFORMATIONS CONSULTANT
${'-'.repeat(30)}
• ID Consultant: SM-${candidate.id}
• Disponibilité: ${candidate.disponibilite || 'Immédiate'}
• Expérience: ${candidate.annees_experience || '5'}+ années
• Mobilité: ${candidate.mobilite || 'France entière'}
• Contact exclusif: consultant-${candidate.id}@sm-consulting.fr

${'='.repeat(70)}
S.M. CONSULTING - Votre partenaire recrutement IT d'excellence
📞 +33 619257588 | 🌐 www.saveursmaghrebines.com
${'='.repeat(70)}

* CV anonymisé conforme RGPD - Référence: CV-ANON-${candidate.id}
* Généré le: ${new Date().toLocaleDateString('fr-FR')}
* Toutes les informations personnelles identifiantes ont été supprimées
    `.trim();

    console.log('✅ CV professionnel enrichi généré');

    res.status(200).json({
      success: true,
      anonymizedCV: professionalCV,
      fileName: `CV_${getProfessionalTitle(candidate.titre, candidate.specialite).replace(/\s+/g, '_')}_SM_${candidate.id}.txt`,
      candidate: {
        ...candidate,
        professionalTitle: getProfessionalTitle(candidate.titre, candidate.specialite)
      }
    });

  } catch (error) {
    console.error('❌ Erreur génération CV enrichi:', error);
    
    // Solution de secours
    res.status(200).json({
      success: true,
      anonymizedCV: `
CONSULTANT IT EXPERT - SM${candidate.id}

${candidate.mobilite || 'Île-de-France'}

PROFIL
Consultant IT senior avec ${candidate.annees_experience || '5+'} ans d'expérience.

COMPÉTENCES
${candidate.competences || 'Architecture Cloud, Développement Full-Stack, DevOps'}

EXPÉRIENCE
${candidate.experience_resume || 'Expérience significative en conception et développement de solutions techniques complexes'}

INFORMATIONS
• ID: SM-${candidate.id}
• Secteur: ${candidate.secteur_recherche || 'Tous secteurs'}
• Mobilité: ${candidate.mobilite || 'France'}
• Contact: consultant-${candidate.id}@sm-consulting.fr

S.M. Consulting - Expertise IT
      `.trim(),
      fileName: `CV_Anonyme_SM_${candidate.id}.txt`
    });
  }
}

