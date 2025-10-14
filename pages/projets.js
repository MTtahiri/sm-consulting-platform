import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Projets({ projets: projetsInitiales }) {
  const [filtreStatut, setFiltreStatut] = useState('');

  // Filtrage des projets
  const projetsFiltres = projetsInitiales.filter(projet => {
    if (filtreStatut && projet.statut !== filtreStatut) return false;
    return true;
  });

  // Badge statut projet
  const BadgeStatutProjet = ({ statut }) => {
    const getBadgeStyle = (statut) => {
      switch(statut) {
        case 'En cours':
          return { background: '#dbeafe', color: '#1e40af', text: '🟦 En cours' };
        case 'Terminé':
          return { background: '#dcfce7', color: '#166534', text: '🟢 Terminé' };
        case 'En attente':
          return { background: '#fef3c7', color: '#92400e', text: '🟡 En attente' };
        default:
          return { background: '#f3f4f6', color: '#6b7280', text: '⚪ ' + statut };
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

  return (
    <>
      <Head>
        <title>Nos Projets | SM Consulting</title>
        <meta name="description" content="Découvrez nos projets et réalisations" />
      </Head>

      {/* Header */}
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
            <Link href="/projets" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Projets</Link>
            <Link href="/contact" style={{ color: '#6b7280', textDecoration: 'none' }}>Contact</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '8rem 2rem 4rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Nos Projets & Réalisations
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#e5e7eb', marginBottom: '2rem' }}>
            Découvrez notre expertise à travers nos projets clients
          </p>
        </div>
      </section>

      {/* Filtres */}
      <section style={{ padding: '2rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                Statut du projet
              </label>
              <select 
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: 'white'
                }}
              >
                <option value="">Tous les statuts</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
                <option value="En attente">En attente</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Projets */}
      <section style={{ padding: '2rem', background: '#f8fafc', minHeight: '50vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {projetsFiltres.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem', 
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#6b7280', marginBottom: '1rem' }}>Aucun projet ne correspond aux critères</h3>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
              gap: '2rem' 
            }}>
              {projetsFiltres.map((projet, index) => (
                <div 
                  key={projet.id || index} 
                  style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  {/* Header avec titre et badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, color: '#1a365d', flex: 1 }}>{projet.titre}</h3>
                    <BadgeStatutProjet statut={projet.statut} />
                  </div>

                  {/* Client */}
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      👤 Client: {projet.client}
                    </span>
                  </div>

                  {/* Durée et budget */}
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {projet.duree && (
                      <span style={{ 
                        background: '#eff6ff', 
                        color: '#1d4ed8', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        ⏱️ {projet.duree}
                      </span>
                    )}
                    {projet.budget && (
                      <span style={{ 
                        background: '#f0fdf4', 
                        color: '#166534', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        💰 {projet.budget}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p style={{ 
                    color: '#6b7280', 
                    lineHeight: '1.5',
                    marginBottom: '1rem'
                  }}>
                    {projet.description}
                  </p>

                  {/* Technologies */}
                  {projet.technologies && (
                    <div style={{ marginTop: '1rem' }}>
                      <h4 style={{ fontSize: '14px', color: '#374151', marginBottom: '0.5rem' }}>Technologies utilisées:</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {projet.technologies.split(',').slice(0, 6).map((tech, idx) => (
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
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
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
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/projets/list`);
    const data = await res.json();
    
    return {
      props: {
        projets: data.projets || []
      }
    };
  } catch (error) {
    console.error('Erreur chargement projets:', error);
    return {
      props: {
        projets: []
      }
    };
  }
}
