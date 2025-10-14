import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function NouvelleOffre() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    titre: '',
    entreprise: '',
    localisation: '',
    type_contrat: '',
    salaire: '',
    description: '',
    competences_requises: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/offres/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setMessage('✅ Offre créée avec succès !');
        // Réinitialiser le formulaire
        setFormData({
          titre: '',
          entreprise: '',
          localisation: '',
          type_contrat: '',
          salaire: '',
          description: '',
          competences_requises: ''
        });
        
        // Rediriger après 2 secondes
        setTimeout(() => {
          router.push('/offres-emploi');
        }, 2000);
      } else {
        setMessage('❌ Erreur: ' + result.error);
      }
    } catch (error) {
      setMessage('❌ Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Publier une Offre - SM Consulting</title>
        <meta name="description" content="Publiez votre offre d'emploi IT sur SM Consulting" />
      </Head>

      {/* Header */}
      <header style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb', 
        padding: '16px 0'
      }}>
        <div style={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          padding: '0 20px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button 
              onClick={() => router.push('/offres-emploi')}
              style={{ 
                background: 'none',
                border: 'none',
                color: '#fd7e14',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Retour aux offres
            </button>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a365d', margin: 0 }}>
              SM Consulting
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)', 
        color: 'white', 
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '16px' }}>
            📝 Publier une Offre d'Emploi
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: '1.6' }}>
            Remplissez ce formulaire pour publier votre offre d'emploi IT
          </p>
        </div>
      </section>

      {/* Formulaire */}
      <section style={{ padding: '40px 20px', background: '#f8fafc', minHeight: '80vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div style={{ 
            background: 'white', 
            padding: '40px', 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {/* Message de statut */}
            {message && (
              <div style={{
                background: message.includes('❌') ? '#fef2f2' : '#f0fdf4',
                color: message.includes('❌') ? '#dc2626' : '#16a34a',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '24px',
                border: `1px solid ${message.includes('❌') ? '#fecaca' : '#bbf7d0'}`,
                fontWeight: '500'
              }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
              
              {/* Titre du poste */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#1a365d',
                  fontSize: '14px'
                }}>
                  Titre du poste *
                </label>
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  placeholder="Ex: Développeur Fullstack React/Node.js"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>

              {/* Entreprise et Localisation */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600', 
                    color: '#1a365d',
                    fontSize: '14px'
                  }}>
                    Entreprise *
                  </label>
                  <input
                    type="text"
                    name="entreprise"
                    value={formData.entreprise}
                    onChange={handleChange}
                    placeholder="Ex: SM Consulting"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600', 
                    color: '#1a365d',
                    fontSize: '14px'
                  }}>
                    Localisation *
                  </label>
                  <input
                    type="text"
                    name="localisation"
                    value={formData.localisation}
                    onChange={handleChange}
                    placeholder="Ex: Paris, Remote, Lyon..."
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>

              {/* Type de contrat et Salaire */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600', 
                    color: '#1a365d',
                    fontSize: '14px'
                  }}>
                    Type de contrat *
                  </label>
                  <select
                    name="type_contrat"
                    value={formData.type_contrat}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      background: 'white'
                    }}
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Stage">Stage</option>
                    <option value="Alternance">Alternance</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600', 
                    color: '#1a365d',
                    fontSize: '14px'
                  }}>
                    Salaire (optionnel)
                  </label>
                  <input
                    type="text"
                    name="salaire"
                    value={formData.salaire}
                    onChange={handleChange}
                    placeholder="Ex: 45K-55K€, 500-700€/jour"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>

              {/* Description du poste */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#1a365d',
                  fontSize: '14px'
                }}>
                  Description du poste *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Décrivez les missions, responsabilités, environnement de travail..."
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Compétences requises */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#1a365d',
                  fontSize: '14px'
                }}>
                  Compétences requises *
                </label>
                <textarea
                  name="competences_requises"
                  value={formData.competences_requises}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Ex: React, Node.js, MongoDB, AWS, Docker..."
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
                <p style={{ 
                  marginTop: '8px', 
                  color: '#6b7280', 
                  fontSize: '14px',
                  fontStyle: 'italic'
                }}>
                  Séparez les compétences par des virgules
                </p>
              </div>

              {/* Bouton de soumission */}
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => router.push('/offres-emploi')}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: loading ? '#9ca3af' : '#fd7e14',
                    color: 'white',
                    padding: '12px 32px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? '⏳ Publication...' : '🚀 Publier l\'offre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
