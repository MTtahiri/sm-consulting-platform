// lib/airtable.js - Configuration Airtable avec pagination
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'pathXG85b7P96CnjE.8fe40141abdb308305bfb43100855b821751c55e38edf0680bce3a9d19243235';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appNwg9iP8ub0cDCn';
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Candidats';

class AirtableService {
  constructor() {
    this.baseUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
    this.headers = {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    };
  }

  // 🚀 RÉCUPÉRER TOUS LES CANDIDATS (avec pagination automatique)
  async getAllCandidates(filters = {}) {
    let allRecords = [];
    let offset = null;
    let hasMore = true;

    try {
      while (hasMore) {
        const url = new URL(this.baseUrl);
        
        // Paramètres de pagination
        if (offset) url.searchParams.append('offset', offset);
        url.searchParams.append('maxRecords', '100'); // Maximum par page
        
        // Filtres optionnels
        if (filters.view) url.searchParams.append('view', filters.view);
        if (filters.filterByFormula) url.searchParams.append('filterByFormula', filters.filterByFormula);
        if (filters.sort) url.searchParams.append('sort[0][field]', filters.sort.field);
        if (filters.sort) url.searchParams.append('sort[0][direction]', filters.sort.direction || 'asc');

        console.log('🔍 Fetching from Airtable:', url.toString());

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: this.headers
        });

        if (!response.ok) {
          throw new Error(`Airtable API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        
        // Ajouter les enregistrements à notre collection
        allRecords = allRecords.concat(data.records || []);
        
        // Vérifier s'il y a plus de pages
        if (data.offset) {
          offset = data.offset;
        } else {
          hasMore = false;
        }

        console.log(`✅ Retrieved ${data.records?.length || 0} records. Total so far: ${allRecords.length}`);
      }

      console.log(`🎉 Total candidates retrieved: ${allRecords.length}`);
      
      // Transformer les données pour l'interface
      return this.transformCandidates(allRecords);
      
    } catch (error) {
      console.error('❌ Error fetching all candidates:', error);
      throw new Error(`Failed to fetch candidates: ${error.message}`);
    }
  }

  // 🔍 RÉCUPÉRER UN CANDIDAT SPÉCIFIQUE
  async getCandidateById(recordId) {
    try {
      const response = await fetch(`${this.baseUrl}/${recordId}`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`Candidate not found: ${response.status}`);
      }

      const data = await response.json();
      return this.transformCandidate(data);
      
    } catch (error) {
      console.error('❌ Error fetching candidate:', error);
      throw error;
    }
  }

  // ➕ CRÉER UN NOUVEAU CANDIDAT
  async createCandidate(candidateData) {
    try {
      const payload = {
        fields: this.prepareDataForAirtable(candidateData)
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create candidate: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log('✅ Candidate created successfully:', data.id);
      
      return this.transformCandidate(data);
      
    } catch (error) {
      console.error('❌ Error creating candidate:', error);
      throw error;
    }
  }

  // ✏️ METTRE À JOUR UN CANDIDAT
  async updateCandidate(recordId, updates) {
    try {
      const payload = {
        fields: this.prepareDataForAirtable(updates)
      };

      const response = await fetch(`${this.baseUrl}/${recordId}`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to update candidate: ${response.status}`);
      }

      const data = await response.json();
      return this.transformCandidate(data);
      
    } catch (error) {
      console.error('❌ Error updating candidate:', error);
      throw error;
    }
  }

  // 🗑️ SUPPRIMER UN CANDIDAT
  async deleteCandidate(recordId) {
    try {
      const response = await fetch(`${this.baseUrl}/${recordId}`, {
        method: 'DELETE',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`Failed to delete candidate: ${response.status}`);
      }

      return { success: true, id: recordId };
      
    } catch (error) {
      console.error('❌ Error deleting candidate:', error);
      throw error;
    }
  }

  // 🔍 RECHERCHE AVANCÉE AVEC FILTRES
  async searchCandidates(searchParams) {
    const {
      query,
      role,
      experience,
      location,
      skills,
      availability,
      minTJM,
      maxTJM
    } = searchParams;

    let filterFormula = '';
    const conditions = [];

    // Recherche textuelle
    if (query) {
      conditions.push(`OR(
        FIND("${query}", {Nom}),
        FIND("${query}", {Role}),
        FIND("${query}", {Competences}),
        FIND("${query}", {Stack})
      )`);
    }

    // Filtre par rôle
    if (role && role !== 'all') {
      conditions.push(`{Role} = "${role}"`);
    }

    // Filtre par expérience
    if (experience && experience !== 'all') {
      const expConditions = [];
      if (experience === 'junior') expConditions.push('{Experience} <= 3');
      if (experience === 'middle') expConditions.push('AND({Experience} > 3, {Experience} <= 7)');
      if (experience === 'senior') expConditions.push('{Experience} > 7');
      if (expConditions.length > 0) {
        conditions.push(`(${expConditions.join(' OR ')})`);
      }
    }

    // Filtre par localisation
    if (location && location !== 'all') {
      conditions.push(`FIND("${location}", {Localisation})`);
    }

    // Filtre par compétences
    if (skills && skills.length > 0) {
      const skillConditions = skills.map(skill => `FIND("${skill}", {Competences})`);
      conditions.push(`(${skillConditions.join(' OR ')})`);
    }

    // Filtre par disponibilité
    if (availability === 'available') {
      conditions.push(`{Disponible} = TRUE()`);
    }

    // Filtre par TJM
    if (minTJM) {
      conditions.push(`{TJM} >= ${minTJM}`);
    }
    if (maxTJM) {
      conditions.push(`{TJM} <= ${maxTJM}`);
    }

    // Construire la formule finale
    if (conditions.length > 0) {
      filterFormula = `AND(${conditions.join(', ')})`;
    }

    return this.getAllCandidates({
      filterByFormula: filterFormula,
      sort: { field: 'Date_Ajout', direction: 'desc' }
    });
  }

  // 📊 STATISTIQUES DES CANDIDATS
  async getCandidateStats() {
    try {
      const candidates = await this.getAllCandidates();
      
      const stats = {
        total: candidates.length,
        available: candidates.filter(c => c.disponible).length,
        byRole: {},
        byLocation: {},
        byExperience: {
          junior: candidates.filter(c => c.experience <= 3).length,
          middle: candidates.filter(c => c.experience > 3 && c.experience <= 7).length,
          senior: candidates.filter(c => c.experience > 7).length
        },
        averageTJM: candidates.reduce((sum, c) => sum + (c.tjm || 0), 0) / candidates.length,
        topSkills: this.getTopSkills(candidates)
      };

      // Statistiques par rôle
      candidates.forEach(candidate => {
        const role = candidate.role || 'Non spécifié';
        stats.byRole[role] = (stats.byRole[role] || 0) + 1;
      });

      // Statistiques par localisation
      candidates.forEach(candidate => {
        const location = candidate.localisation || 'Non spécifié';
        stats.byLocation[location] = (stats.byLocation[location] || 0) + 1;
      });

      return stats;
      
    } catch (error) {
      console.error('❌ Error getting candidate stats:', error);
      throw error;
    }
  }

  // 🏆 CALCULER LE SCORE D'UN CANDIDAT
  calculateCandidateScore(candidate) {
    let score = 0;
    
    // Score basé sur l'expérience (40 points max)
    if (candidate.experience) {
      score += Math.min(candidate.experience * 4, 40);
    }
    
    // Score basé sur les compétences (30 points max)
    if (candidate.competences) {
      const skills = candidate.competences.split(',').length;
      score += Math.min(skills * 3, 30);
    }
    
    // Score basé sur les certifications (20 points max)
    if (candidate.certifications) {
      const certs = candidate.certifications.split(',').length;
      score += Math.min(certs * 5, 20);
    }
    
    // Score basé sur les reviews (10 points max)
    if (candidate.rating) {
      score += candidate.rating * 2;
    }

    return Math.min(Math.round(score), 100);
  }

  // 🔄 TRANSFORMER LES DONNÉES AIRTABLE POUR L'INTERFACE
  transformCandidates(records) {
    return records.map(record => this.transformCandidate(record));
  }

  transformCandidate(record) {
    const fields = record.fields || {};
    const candidate = {
      id: record.id,
      nom: fields.Nom || '',
      email: fields.Courriel || '',
      telephone: fields.Telephone || '',
      role: fields.Role || '',
      experience: parseInt(fields.Experience) || 0,
      localisation: fields.Localisation || '',
      certifications: fields.Certifications || '',
      competences: fields.Competences || '',
      stack: fields.Stack || '',
      specialites: fields.Specialites || '',
      niveau: fields.Niveau || '',
      disponibilite: fields.Disponibilite || '',
      dateAjout: fields.Date_Ajout || '',
      typeContrat: fields.TypeContrat || '',
      disponible: fields.Disponible || false,
      tjm: parseInt(fields.TJM) || 0,
      reviews: fields.Reviews || '',
      rating: parseFloat(fields.Rating) || 0
    };

    // Ajouter le score calculé
    candidate.score = this.calculateCandidateScore(candidate);
    
    return candidate;
  }

  // 📝 PRÉPARER LES DONNÉES POUR AIRTABLE
  prepareDataForAirtable(data) {
    return {
      Nom: data.nom || data.name,
      Courriel: data.email,
      Telephone: data.telephone || data.phone,
      Role: data.role,
      Experience: data.experience,
      Localisation: data.localisation || data.location,
      Certifications: Array.isArray(data.certifications) ? data.certifications.join(', ') : data.certifications,
      Competences: Array.isArray(data.competences) ? data.competences.join(', ') : data.competences,
      Stack: Array.isArray(data.stack) ? data.stack.join(', ') : data.stack,
      Specialites: Array.isArray(data.specialites) ? data.specialites.join(', ') : data.specialites,
      Niveau: data.niveau,
      Disponibilite: data.disponibilite,
      Date_Ajout: data.dateAjout || new Date().toISOString(),
      TypeContrat: data.typeContrat,
      Disponible: data.disponible || false,
      TJM: data.tjm,
      Reviews: data.reviews,
      Rating: data.rating
    };
  }

  // 🔥 OBTENIR LES COMPÉTENCES LES PLUS DEMANDÉES
  getTopSkills(candidates, limit = 10) {
    const skillCounts = {};
    
    candidates.forEach(candidate => {
      if (candidate.competences) {
        const skills = candidate.competences.split(',').map(s => s.trim());
        skills.forEach(skill => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      }
    });

    return Object.entries(skillCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([skill, count]) => ({ skill, count }));
  }
}

// Export du service
const airtableService = new AirtableService();
export default airtableService;