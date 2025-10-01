// lib/api-client.js - Client API pour le frontend
export class APIClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
      
    } catch (error) {
      console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);
      throw error;
    }
  }

  // Méthodes pour les candidats
  async getCandidates(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/candidates${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getCandidate(id) {
    return this.request(`/candidates/${id}`);
  }

  async createCandidate(data) {
    return this.request('/candidates', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateCandidate(id, data) {
    return this.request(`/candidates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteCandidate(id) {
    return this.request(`/candidates/${id}`, {
      method: 'DELETE'
    });
  }

  // Recherche avancée
  async searchCandidates(searchParams) {
    return this.request('/search', {
      method: 'POST',
      body: JSON.stringify(searchParams)
    });
  }

  // Statistiques
  async getStats() {
    return this.request('/stats');
  }

  // Upload CV
  async uploadCV(file, candidateId) {
    const formData = new FormData();
    formData.append('cv', file);
    formData.append('candidateId', candidateId);

    return this.request('/upload-cv', {
      method: 'POST',
      headers: {}, // Laisser le browser définir le Content-Type pour FormData
      body: formData
    });
  }

  // Contact
  async sendContact(contactData) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData)
    });
  }
}

// Instance par défaut
export const apiClient = new APIClient();