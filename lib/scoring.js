// lib/scoring.js - Algorithme de scoring intelligent
export class CandidateScoring {
  constructor() {
    this.weights = {
      experience: 0.3,      // 30%
      skills: 0.25,         // 25%
      certifications: 0.2,  // 20%
      availability: 0.15,   // 15%
      reviews: 0.1          // 10%
    };

    this.skillCategories = {
      frontend: ['React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'HTML', 'CSS'],
      backend: ['Node.js', 'Python', 'Java', 'PHP', 'C#', '.NET', 'Go', 'Ruby'],
      database: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch'],
      cloud: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes'],
      devops: ['Jenkins', 'GitLab CI', 'Terraform', 'Ansible'],
      mobile: ['React Native', 'Flutter', 'iOS', 'Android'],
      data: ['Python', 'R', 'Spark', 'Hadoop', 'TensorFlow', 'PyTorch']
    };

    this.demandSkills = {
      'React': 0.9,
      'Node.js': 0.85,
      'Python': 0.8,
      'AWS': 0.85,
      'Docker': 0.75,
      'Kubernetes': 0.7,
      'TypeScript': 0.8,
      'Vue.js': 0.7
    };
  }

  calculateScore(candidate) {
    let totalScore = 0;

    // Score d'expérience (0-30 points)
    const experienceScore = this.calculateExperienceScore(candidate.experience);
    totalScore += experienceScore * this.weights.experience * 100;

    // Score des compétences (0-25 points)
    const skillsScore = this.calculateSkillsScore(candidate.competences);
    totalScore += skillsScore * this.weights.skills * 100;

    // Score des certifications (0-20 points)
    const certificationsScore = this.calculateCertificationsScore(candidate.certifications);
    totalScore += certificationsScore * this.weights.certifications * 100;

    // Score de disponibilité (0-15 points)
    const availabilityScore = this.calculateAvailabilityScore(candidate);
    totalScore += availabilityScore * this.weights.availability * 100;

    // Score des reviews (0-10 points)
    const reviewsScore = this.calculateReviewsScore(candidate.rating, candidate.reviews);
    totalScore += reviewsScore * this.weights.reviews * 100;

    return {
      total: Math.min(Math.round(totalScore), 100),
      breakdown: {
        experience: Math.round(experienceScore * 100),
        skills: Math.round(skillsScore * 100),
        certifications: Math.round(certificationsScore * 100),
        availability: Math.round(availabilityScore * 100),
        reviews: Math.round(reviewsScore * 100)
      }
    };
  }

  calculateExperienceScore(years) {
    if (!years) return 0;
    // Courbe logarithmique : plus d'expérience = diminution des gains marginaux
    return Math.min(Math.log(years + 1) / Math.log(16), 1); // Max à 15 ans
  }

  calculateSkillsScore(competences) {
    if (!competences) return 0;
    
    const skills = competences.split(',').map(s => s.trim());
    let score = 0;
    let totalPossibleScore = 0;

    skills.forEach(skill => {
      const demand = this.demandSkills[skill] || 0.5; // Score par défaut
      score += demand;
      totalPossibleScore += 1;
    });

    // Bonus pour diversité des catégories
    const categories = this.getCategoryCoverage(skills);
    const diversityBonus = categories.length * 0.1;

    const baseScore = totalPossibleScore > 0 ? score / totalPossibleScore : 0;
    return Math.min(baseScore + diversityBonus, 1);
  }

  calculateCertificationsScore(certifications) {
    if (!certifications) return 0;
    
    const certs = certifications.split(',').map(c => c.trim());
    const majorCerts = [
      'AWS Certified', 'Azure Certified', 'GCP Professional',
      'Scrum Master', 'PMP', 'CISSP', 'Oracle Certified'
    ];

    let score = Math.min(certs.length * 0.2, 0.8); // Base score
    
    // Bonus pour certifications majeures
    const majorCertCount = certs.filter(cert => 
      majorCerts.some(major => cert.includes(major))
    ).length;
    
    score += majorCertCount * 0.1;
    
    return Math.min(score, 1);
  }

  calculateAvailabilityScore(candidate) {
    let score = 0;

    // Disponibilité immédiate
    if (candidate.disponible) {
      score += 0.6;
    }

    // Type de contrat flexible
    if (candidate.typeContrat && candidate.typeContrat.includes('Freelance')) {
      score += 0.2;
    }

    // TJM raisonnable (ni trop bas ni trop haut)
    if (candidate.tjm) {
      if (candidate.tjm >= 400 && candidate.tjm <= 800) {
        score += 0.2;
      } else if (candidate.tjm < 400 || candidate.tjm > 1000) {
        score -= 0.1;
      }
    }

    return Math.max(score, 0);
  }

  calculateReviewsScore(rating, reviews) {
    let score = 0;

    if (rating) {
      score += rating / 5; // Normaliser sur 1
    }

    if (reviews) {
      const reviewCount = reviews.split(',').length;
      score += Math.min(reviewCount * 0.1, 0.3); // Bonus pour nombre de reviews
    }

    return Math.min(score, 1);
  }

  getCategoryCoverage(skills) {
    const categories = [];
    
    Object.entries(this.skillCategories).forEach(([category, categorySkills]) => {
      const hasSkillInCategory = skills.some(skill =>
        categorySkills.some(catSkill => 
          skill.toLowerCase().includes(catSkill.toLowerCase())
        )
      );
      if (hasSkillInCategory) {
        categories.push(category);
      }
    });

    return categories;
  }

  getRecommendations(candidate) {
    const recommendations = [];
    const score = this.calculateScore(candidate);

    if (score.breakdown.experience < 50) {
      recommendations.push({
        type: 'experience',
        message: 'Considérer des projets supplémentaires pour augmenter l\'expérience',
        priority: 'medium'
      });
    }

    if (score.breakdown.skills < 60) {
      recommendations.push({
        type: 'skills',
        message: 'Développer des compétences dans les technologies en demande',
        priority: 'high',
        suggestions: Object.keys(this.demandSkills).slice(0, 3)
      });
    }

    if (score.breakdown.certifications < 40) {
      recommendations.push({
        type: 'certifications',
        message: 'Obtenir des certifications reconnues dans le domaine',
        priority: 'medium'
      });
    }

    return recommendations;
  }
}