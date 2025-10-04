import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function OffresEmploi() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtreTechno, setFiltreTechno] = useState('');
  const [filtreType, setFiltreType] = useState('');

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/offres');
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des offres');
        }
        
        const data = await response.json();
        setOffres(data);
      } catch (err) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffres();
  }, []);

  // Filtres
  const offresFiltrees = offres.filter(offre => {
    return (
      (filtreTechno === '' || offre.technologies.some(tech => 
        tech.toLowerCase().includes(filtreTechno.toLowerCase())
      )) &&
      (filtreType === '' || offre.type === filtreType)
    );
  });

  const toutesTechnologies = [...new Set(offres.flatMap(offre => offre.technologies))];
  const tousTypes = [...new Set(offres.map(offre => offre.type))];

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <div>Chargement des offres d'emploi...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
        <h2 style={{ color: '#e53e3e', marginBottom: '1rem' }}>Erreur de chargement</h2>
        <p style={{ color: '#4a5568', marginBottom: '2rem' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            background: '#fd7e14',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '25px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Offres d'emploi IT | SM Consulting</title>
        <meta name="description" content="Découvrez nos offres d'emploi IT : développeurs, data scientists, DevOps. Postulez directement en ligne." />
      </Head>

      <div style={{ height: '80px' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '700', color: '#1a365d', marginBottom: '1rem' }}>
            Offres d'emploi IT
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#4a5568', maxWidth: '600px', margin: '0 auto' }}>
            {offres.length > 0 
              ? offres.length + ' opportunités disponibles - Postulez en 2 minutes'
              : 'Aucune offre disponible actuellement'
            }
          </p>
        </div>

        {/* Filtres - seulement si des offres existent */}
        {offres.length > 0 && (
          <div style={{ 
            background: '#f8fafc', 
            padding: '2rem', 
            borderRadius: '15px', 
            marginBottom: '3rem',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a365d' }}>
                Technologies
              </label>
              <select 
                value={filtreTechno} 
                onChange={(e) => setFiltreTechno(e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  minWidth: '200px'
                }}
              >
                <option value="">Toutes les technologies</option>
                {toutesTechnologies.map(tech => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a365d' }}>
                Type de contrat
              </label>
              <select 
                value={filtreType} 
                onChange={(e) => setFiltreType(e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  minWidth: '200px'
                }}
              >
                <option value="">Tous les contrats</option>
                {tousTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Liste des offres */}
        {offresFiltrees.length > 0 ? (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {offresFiltrees.map(offre => (
              <div key={offre.id} style={{
                background: 'white',
                border: offre.urgent ? '2px solid #e53e3e' : '1px solid #e2e8f0',
                borderRadius: '15px',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                position: 'relative'
              }}>
                {offre.urgent && (
                  <span style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '20px',
                    background: '#e53e3e',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    🔥 URGENT
                  </span>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1a365d', marginBottom: '0.5rem' }}>
                      {offre.titre}
                    </h2>
                    <p style={{ color: '#4a5568', marginBottom: '0.5rem' }}>
                      <strong>{offre.entreprise}</strong> • {offre.localisation}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ 
                        background: '#edf2f7', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '15px',
                        fontSize: '0.9rem'
                      }}>
                        {offre.type}
                      </span>
                      <span style={{ 
                        background: '#edf2f7', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '15px',
                        fontSize: '0.9rem'
                      }}>
                        {offre.experience}
                      </span>
                    </div>
                  </div>

                  <Link 
                    href={'/postuler/' + offre.id}
                    style={{
                      background: 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '25px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Postuler
                  </Link>
                </div>

                <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  {offre.description}
                </p>

                {offre.technologies.length > 0 && (
                  <div>
                    <strong style={{ color: '#1a365d', marginBottom: '0.5rem', display: 'block' }}>
                      Technologies recherchées :
                    </strong>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {offre.technologies.map(tech => (
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
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#718096' }}>
                  {offre.date && 'Publiée le ' + new Date(offre.date).toLocaleDateString('fr-FR')}
                </div>
              </div>
            ))}
          </div>
        ) : offres.length > 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: '#f8fafc', borderRadius: '15px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ color: '#4a5568', marginBottom: '1rem' }}>Aucune offre ne correspond à vos critères</h3>
            <p style={{ color: '#718096' }}>Essayez de modifier vos filtres de recherche</p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', background: '#f8fafc', borderRadius: '15px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h3 style={{ color: '#4a5568', marginBottom: '1rem' }}>Aucune offre disponible actuellement</h3>
            <p style={{ color: '#718096', marginBottom: '2rem' }}>Revenez bientôt pour découvrir de nouvelles opportunités</p>
            <Link 
              href="/candidature-spontanee"
              style={{
                background: '#fd7e14',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              📄 Déposer une candidature spontanée
            </Link>
          </div>
        )}

        {/* CTA Bottom */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '4rem',
          padding: '3rem',
          background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
          borderRadius: '15px',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            Vous ne trouvez pas votre profil ?
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
            Déposez votre CV spontanément, nous vous recontacterons pour des opportunités sur mesure.
          </p>
          <Link 
            href="/candidature-spontanee"
            style={{
              background: '#fd7e14',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.1rem'
            }}
          >
            📄 Candidature spontanée
          </Link>
        </div>
      </div>
    </>
  );
}
