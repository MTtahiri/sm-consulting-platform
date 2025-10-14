import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function CandidatsPage({ candidats: candidatsInitiaux }) {
  const [filtres, setFiltres] = useState({
    typeContrat: '',
    localisation: '',
    competences: ''
  });

  const BadgeStatut = ({ statut }) => {
    const getBadgeStyle = (statut) => {
      switch(statut) {
        case 'Disponible':
          return {
            background: '#dcfce7',
            color: '#166534',
            border: '1px solid #bbf7d0',
            text: '🟢 Disponible immédiatement'
          };
        case 'En mission':
          return {
            background: '#fef3c7',
            color: '#92400e',
            border: '1px solid #fcd34d',
            text: '🟡 En mission'
          };
        default:
          return {
            background: '#f3f4f6',
            color: '#6b7280',
            border: '1px solid #d1d5db',
            text: '⚪ ' + statut
          };
      }
    };

    const style = getBadgeStyle(statut);
    
    return (
      <span style={{
        padding: '4px 8px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        ...style
      }}>
        {style.text}
      </span>
    );
  };

  const candidatsFiltres = candidatsInitiaux.filter(candidat => {
    if (filtres.typeContrat && candidat.type_contrat !== filtres.typeContrat) return false;
    if (filtres.localisation && !candidat.localisation.toLowerCase().includes(filtres.localisation.toLowerCase())) return false;
    if (filtres.competences && !candidat.competences_cles.some(comp => 
      comp.toLowerCase().includes(filtres.competences.toLowerCase())
    )) return false;
    return true;
  });

  const handleDownloadCV = async (candidateId) => {
    try {
      console.log('Téléchargement CV pour:', candidateId);
      
      const response = await fetch('/api/cv/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ candidateId: candidateId }),
      });

      if (!response.ok) {
        throw new Error('Erreur API');
      }

      // Créer un blob et télécharger
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'CV_SM_Consulting.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      alert('Erreur lors du téléchargement du CV');
    }
  };

  return (
    <>
      <Head>
        <title>Candidats Freelance | SM Consulting</title>
        <meta name="description" content="Découvrez nos talents freelance disponibles pour vos projets" />
      </Head>

      <header style={{
        background: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/" style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1a365d',
            textDecoration: 'none'
          }}>
            SM Consulting
          </Link>
          <nav style={{ display: 'flex', gap: '2rem' }}>
            <Link href="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Accueil</Link>
            <Link href="/offres-emploi" style={{ color: '#6b7280', textDecoration: 'none' }}>Offres</Link>
            <Link href="/candidates" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Candidats</Link>
            <Link href="/projets" style={{ color: '#6b7280', textDecoration: 'none' }}>Projets</Link>
            <Link href="/contact" style={{ color: '#6b7280', textDecoration: 'none' }}>Contact</Link>
          </nav>
        </div>
      </header>

      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '8rem 2rem 4rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Découvrez nos talents freelance
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#e5e7eb', marginBottom: '2rem' }}>
            {candidatsFiltres.length} candidat(s) correspondant à vos critères
          </p>
        </div>
      </section>

      <section style={{ padding: '2rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                Type de contrat
              </label>
              <select 
                value={filtres.typeContrat}
                onChange={(e) => setFiltres({ ...filtres, typeContrat: e.target.value })}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: 'white'
                }}
              >
                <option value="">Tous les contrats</option>
                <option value="Freelance">Freelance</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                Localisation
              </label>
              <input
                type="text"
                placeholder="Île-de-France, Remote..."
                value={filtres.localisation}
                onChange={(e) => setFiltres({ ...filtres, localisation: e.target.value })}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  width: '200px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                Compétences
              </label>
              <input
                type="text"
                placeholder="React, Python, Data..."
                value={filtres.competences}
                onChange={(e) => setFiltres({ ...filtres, competences: e.target.value })}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  width: '200px'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '2rem', background: '#f8fafc', minHeight: '50vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {candidatsFiltres.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem', 
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#6b7280', marginBottom: '1rem' }}>Aucun candidat ne correspond à vos critères</h3>
              <p style={{ color: '#9ca3af' }}>Essayez de modifier vos filtres de recherche</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
              gap: '2rem' 
            }}>
              {candidatsFiltres.map((candidat, index) => (
                <div 
                  key={candidat.id || index} 
                  style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, color: '#1a365d', flex: 1 }}>{candidat.titre}</h3>
                    <BadgeStatut statut={candidat.disponibilite} />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      👤 Candidat #{String(index + 1).padStart(3, '0')}
                    </span>
                    <span style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      📍 {candidat.localisation}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ 
                      background: '#eff6ff', 
                      color: '#1d4ed8', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {candidat.type_contrat}
                    </span>
                    <span style={{ 
                      background: '#f0fdf4', 
                      color: '#166534', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      💼 {candidat.experience}
                    </span>
                  </div>

                  <p style={{ 
                    color: '#6b7280', 
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '1.5rem'
                  }}>
                    {candidat.description}
                  </p>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {candidat.competences_cles?.slice(0, 6).map((competence, idx) => (
                        <span 
                          key={idx}
                          style={{
                            background: '#f3f4f6',
                            color: '#374151',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          {competence.trim()}
                        </span>
                      ))}
                      {candidat.competences_cles?.length > 6 && (
                        <span style={{
                          background: '#f3f4f6',
                          color: '#6b7280',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '12px'
                        }}>
                          +{candidat.competences_cles.length - 6}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={() => handleDownloadCV(candidat.id)}
                      style={{
                        background: 'white',
                        color: '#374151',
                        padding: '0.75rem 1.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        flex: 1
                      }}
                    >
                      Voir le CV
                    </button>
                    <button
                      onClick={() => window.open('/contact?candidat=' + candidat.id + '&poste=' + encodeURIComponent(candidat.titre), '_blank')}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        flex: 1
                      }}
                    >
                      Nous contacter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const baseURL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(baseURL + '/api/candidates/list');
    
    if (!res.ok) {
      throw new Error('Erreur API: ' + res.status);
    }
    
    const data = await res.json();
    
    if (data.success) {
      return {
        props: {
          candidats: data.candidats
        }
      };
    }
    
    throw new Error('API retourne success: false');
    
  } catch (error) {
    console.error('Erreur chargement Airtable:', error);
    
    const candidatsExemple = [
      {
        id: "1",
        titre: "Développeur Fullstack React/Node.js",
        localisation: "Île-de-France",
        type_contrat: "Freelance",
        experience: "5+ ans",
        disponibilite: "Disponible",
        description: "Données de démonstration",
        competences_cles: ["React", "Node.js", "TypeScript", "MongoDB"]
      }
    ];
    
    return {
      props: {
        candidats: candidatsExemple
      }
    };
  }
}
