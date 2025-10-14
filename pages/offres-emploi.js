import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function OffresEmploi({ offres: offresInitiales }) {
  const [offres, setOffres] = useState(offresInitiales);
  const [filtres, setFiltres] = useState({
    search: '',
    type: '',
    localisation: '',
    competences: ''
  });
  const router = useRouter();

  const filtrerOffres = () => {
    return offresInitiales.filter(offre => {
      const matchSearch = !filtres.search || 
        offre.titre?.toLowerCase().includes(filtres.search.toLowerCase()) ||
        offre.description?.toLowerCase().includes(filtres.search.toLowerCase()) ||
        offre.entreprise?.toLowerCase().includes(filtres.search.toLowerCase());
      
      const matchType = !filtres.type || offre.type === filtres.type;
      const matchLocalisation = !filtres.localisation || offre.localisation === filtres.localisation;
      const matchCompetences = !filtres.competences || 
        offre.competences_requises?.toLowerCase().includes(filtres.competences.toLowerCase());

      return matchSearch && matchType && matchLocalisation && matchCompetences;
    });
  };

  const offresFiltrees = filtrerOffres();

  return (
    <>
      <Head>
        <title>Offres d&apos;emploi | SM Consulting</title>
        <meta name="description" content="Découvrez nos offres d'emploi et missions en consulting IT" />
      </Head>

      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '80px 20px 60px',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              marginBottom: '20px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              Offres d&apos;emploi
            </h1>
            <p style={{ 
              fontSize: '1.2rem', 
              opacity: 0.9,
              lineHeight: 1.6
            }}>
              Découvrez nos meilleures opportunités en consulting IT
            </p>
          </div>
        </div>

        {/* Filtres */}
        <div style={{ 
          maxWidth: '1200px', 
          margin: '-30px auto 40px', 
          padding: '0 20px'
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            alignItems: 'end'
          }}>
            {/* Champs de filtres existants */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                Recherche
              </label>
              <input
                type="text"
                placeholder="Poste, entreprise, compétences..."
                value={filtres.search}
                onChange={(e) => setFiltres(prev => ({ ...prev, search: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                Type
              </label>
              <select
                value={filtres.type}
                onChange={(e) => setFiltres(prev => ({ ...prev, type: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: 'white'
                }}
              >
                <option value="">Tous les types</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Freelance">Freelance</option>
                <option value="Stage">Stage</option>
                <option value="Alternance">Alternance</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                Localisation
              </label>
              <select
                value={filtres.localisation}
                onChange={(e) => setFiltres(prev => ({ ...prev, localisation: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: 'white'
                }}
              >
                <option value="">Toutes localisations</option>
                <option value="Paris">Paris</option>
                <option value="Lyon">Lyon</option>
                <option value="Toulouse">Toulouse</option>
                <option value="Remote">Télétravail</option>
                <option value="Hybride">Hybride</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                Compétences
              </label>
              <input
                type="text"
                placeholder="React, Node.js, Python..."
                value={filtres.competences}
                onChange={(e) => setFiltres(prev => ({ ...prev, competences: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Liste des offres */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 60px' }}>
          {offresFiltrees.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              background: 'white',
              borderRadius: '15px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
              <h3 style={{ color: '#6b7280', marginBottom: '10px' }}>Aucune offre trouvée</h3>
              <p style={{ color: '#9ca3af' }}>Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gap: '25px',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))'
            }}>
              {offresFiltrees.map((offre, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    borderRadius: '15px',
                    padding: '30px',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    border: '1px solid #f3f4f6'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <h3 style={{ 
                      fontSize: '1.4rem', 
                      fontWeight: 'bold', 
                      color: '#1f2937',
                      margin: 0,
                      lineHeight: 1.3
                    }}>
                      {offre.titre}
                    </h3>
                    <span style={{
                      background: '#10b981',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      {offre.type}
                    </span>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600', color: '#6b7280', minWidth: '100px' }}>Entreprise:</span>
                      <span style={{ color: '#374151' }}>{offre.entreprise}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600', color: '#6b7280', minWidth: '100px' }}>Localisation:</span>
                      <span style={{ color: '#374151' }}>{offre.localisation}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600', color: '#6b7280', minWidth: '100px' }}>Salaire:</span>
                      <span style={{ color: '#374151' }}>{offre.salaire}</span>
                    </div>
                  </div>

                  <p style={{ 
                    color: '#6b7280', 
                    lineHeight: 1.6,
                    marginBottom: '20px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {offre.description}
                  </p>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Compétences requises:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {offre.competences_requises?.split(',').map((competence, i) => (
                        <span
                          key={i}
                          style={{
                            background: '#e5e7eb',
                            color: '#374151',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}
                        >
                          {competence.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingTop: '15px',
                    borderTop: '1px solid #f3f4f6'
                  }}>
                    <span style={{ 
                      color: '#9ca3af', 
                      fontSize: '0.9rem',
                      fontStyle: 'italic'
                    }}>
                      Publiée le {offre.date_publication}
                    </span>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      onClick={() => router.push('/inscription')}
                    >
                      Postuler
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    // Récupérer les offres depuis Airtable via l'API existante
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/offres/list`);
    
    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`);
    }
    
    const data = await res.json();
    
    // Adapter la structure des données si nécessaire
    const offres = data.offres || data || [];

    return {
      props: {
        offres: offres
      }
    };
  } catch (error) {
    console.error('Erreur lors du chargement des offres Airtable:', error);
    
    // Fallback vers des données mockées en cas d'erreur
    const offresMock = [
      {
        id: 1,
        titre: "Développeur Full Stack React/Node.js",
        entreprise: "FinTech Startup",
        type: "CDI",
        localisation: "Paris",
        salaire: "45K-55K€",
        description: "Rejoignez une équipe dynamique pour développer des solutions innovantes dans le secteur financier.",
        competences_requises: "React, Node.js, TypeScript, PostgreSQL, AWS",
        date_publication: "2024-01-15"
      }
    ];

    return {
      props: {
        offres: offresMock
      }
    };
  }
}