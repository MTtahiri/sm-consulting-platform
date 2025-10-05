import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch('/api/candidates');
        const data = await response.json();
        setCandidates(data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter(candidate =>
    candidate.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.competences?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.technologies_cles?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Candidats IT | SM Consulting</title>
        <meta name="description" content="Découvrez nos consultants IT qualifiés : développeurs, data scientists, DevOps." />
      </Head>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '700', color: '#1a365d', marginBottom: '1rem' }}>
            Nos Consultants IT
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#4a5568', maxWidth: '600px', margin: '0 auto' }}>
            Découvrez notre réseau de consultants IT qualifiés et disponibles
          </p>
        </div>

        {/* Barre de recherche */}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '15px', 
          marginBottom: '3rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <input
            type="text"
            placeholder="🔍 Rechercher par compétence, technologie ou métier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '1.1rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Liste des candidats */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <div>Chargement des consultants...</div>
          </div>
        ) : filteredCandidates.length > 0 ? (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {filteredCandidates.map(candidate => (
              <div key={candidate.id} style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '15px',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1a365d', marginBottom: '0.5rem' }}>
                      {candidate.titre}
                    </h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {candidate.annees_experience && (
                        <span style={{ 
                          background: '#edf2f7', 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '15px',
                          fontSize: '0.9rem'
                        }}>
                          {candidate.annees_experience} d'expérience
                        </span>
                      )}
                      {candidate.disponibilite && (
                        <span style={{ 
                          background: '#f0fff4', 
                          color: '#276749',
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '15px',
                          fontSize: '0.9rem'
                        }}>
                          {candidate.disponibilite}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link 
                    href={\/candidate/\\}
                    style={{
                      background: 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '25px',
                      textDecoration: 'none',
                      fontWeight: '600'
                    }}
                  >
                    Voir profil
                  </Link>
                </div>

                {candidate.competences && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: '#1a365d' }}>Compétences : </strong>
                    {candidate.competences}
                  </div>
                )}

                {candidate.technologies_cles && (
                  <div>
                    <strong style={{ color: '#1a365d', marginBottom: '0.5rem', display: 'block' }}>
                      Technologies :
                    </strong>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {candidate.technologies_cles.split(',').map(tech => (
                        <span 
                          key={tech}
                          style={{
                            background: '#ebf8ff',
                            color: '#2b6cb0',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '15px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ color: '#4a5568', marginBottom: '1rem' }}>Aucun consultant trouvé</h3>
            <p style={{ color: '#718096' }}>Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </>
  );
}
