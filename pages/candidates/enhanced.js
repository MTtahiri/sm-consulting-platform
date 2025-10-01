import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function EnhancedCandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    specialite: '',
    niveau: '',
    tjm_max: '',
    disponibilite: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/candidates')
      .then(res => res.json())
      .then(data => {
        setCandidates(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredCandidates = candidates.filter(candidate => {
    const searchMatch = !filters.search || 
      candidate.titre.toLowerCase().includes(filters.search.toLowerCase()) ||
      candidate.competences.toLowerCase().includes(filters.search.toLowerCase()) ||
      candidate.technologies_cles.toLowerCase().includes(filters.search.toLowerCase());

    const specialiteMatch = !filters.specialite || candidate.specialite === filters.specialite;
    const niveauMatch = !filters.niveau || candidate.niveau_expertise === filters.niveau;
    const tjmMatch = !filters.tjm_max || candidate.tjm_max <= parseInt(filters.tjm_max);
    const disponibiliteMatch = !filters.disponibilite || candidate.disponibilite === filters.disponibilite;

    return searchMatch && specialiteMatch && niveauMatch && tjmMatch && disponibiliteMatch;
  });

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <p>Chargement des consultants experts...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Head>
        <title>Consultants Experts - SM Consulting</title>
      </Head>

      <nav style={{ background: 'white', padding: '20px 40px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Link href="/" style={{ color: '#0a66c2', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Accueil
        </Link>
        <span style={{ marginLeft: '20px', fontWeight: 'bold', color: '#0a66c2', fontSize: '18px' }}>
          🔍 SM CONSULTING - RECHERCHE AVANCÉE
        </span>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {/* FILTRES AVANCÉS */}
        <div style={{
          background: 'white', 
          padding: '25px', 
          borderRadius: '12px',
          marginBottom: '25px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>Filtres Avancés</h2>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
            <input
              type="text"
              placeholder="🔍 Technologies, compétences..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              style={{padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px'}}
            />
            
            <select 
              value={filters.specialite} 
              onChange={(e) => setFilters({...filters, specialite: e.target.value})}
              style={{padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px'}}
            >
              <option value="">Toutes spécialités</option>
              <option value="Data Science">Data Science</option>
              <option value="IA & Machine Learning">IA & Machine Learning</option>
              <option value="Développement">Développement</option>
              <option value="Business Intelligence">Business Intelligence</option>
              <option value="SAP">SAP</option>
              <option value="DevOps">DevOps</option>
            </select>

            <select 
              value={filters.niveau} 
              onChange={(e) => setFilters({...filters, niveau: e.target.value})}
              style={{padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px'}}
            >
              <option value="">Tous niveaux</option>
              <option value="Junior">Junior (0-3 ans)</option>
              <option value="Confirmé">Confirmé (3-6 ans)</option>
              <option value="Senior">Senior (6-10 ans)</option>
              <option value="Expert">Expert (10+ ans)</option>
            </select>

            <select 
              value={filters.tjm_max} 
              onChange={(e) => setFilters({...filters, tjm_max: e.target.value})}
              style={{padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px'}}
            >
              <option value="">Tous TJM</option>
              <option value="400">≤ 400€/jour</option>
              <option value="600">≤ 600€/jour</option>
              <option value="800">≤ 800€/jour</option>
              <option value="1000">≤ 1000€/jour</option>
            </select>
          </div>
        </div>

        {/* RÉSULTATS */}
        <div style={{marginBottom: '20px', fontSize: '16px'}}>
          <strong style={{color: '#0a66c2'}}>{filteredCandidates.length}</strong> consultants experts correspondent à vos critères
        </div>

        {/* GRILLE AMÉLIORÉE */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '25px'
        }}>
          {filteredCandidates.map(candidate => (
            <div key={candidate.id} style={{
              background: 'white',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              border: '1px solid #e1e5e9',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }} 
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}>
              {/* EN-TÊTE AVEC BADGE */}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px'}}>
                <div style={{flex: 1}}>
                  <h3 style={{margin: '0 0 8px 0', color: '#0a66c2', fontSize: '18px'}}>
                    {candidate.titre}
                  </h3>
                  <div style={{
                    display: 'inline-block',
                    background: '#e3f2fd',
                    color: '#1976d2',
                    padding: '4px 12px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {candidate.niveau_expertise || 'Expert'}
                  </div>
                </div>
                <div style={{
                  background: '#f8f9fa',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#333',
                  border: '1px solid #e9ecef'
                }}>
                  {candidate.tjm_min > 0 && candidate.tjm_max > 0 ? 
                    `${candidate.tjm_min}€ - ${candidate.tjm_max}€/j` : 'TJM sur mesure'
                  }
                </div>
              </div>

              {/* SPÉCIALITÉ */}
              {candidate.specialite && (
                <p style={{margin: '12px 0', fontSize: '14px', color: '#555'}}>
                  <strong>🎯 Spécialité:</strong> {candidate.specialite}
                </p>
              )}

              {/* TECHNOLOGIES */}
              <p style={{margin: '12px 0', fontSize: '14px'}}>
                <strong>🛠️ Stack technique:</strong> {candidate.technologies_cles || candidate.competences}
              </p>

              {/* EXPÉRIENCE */}
              <p style={{margin: '12px 0', fontSize: '14px', color: '#666'}}>
                <strong>📊 Expérience:</strong> {candidate.annees_experience} ans
                {candidate.secteurs_experience && ` • ${candidate.secteurs_experience}`}
              </p>

              {/* RÉALISATIONS */}
              {candidate.realisations_chiffrees && (
                <div style={{
                  background: '#f0f9ff',
                  padding: '12px',
                  borderRadius: '8px',
                  margin: '12px 0',
                  borderLeft: '4px solid #0a66c2'
                }}>
                  <p style={{margin: 0, fontSize: '13px', color: '#0369a1', fontStyle: 'italic'}}>
                    🎯 {candidate.realisations_chiffrees}
                  </p>
                </div>
              )}

              {/* DISPONIBILITÉ */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '18px',
                paddingTop: '18px',
                borderTop: '1px solid #f0f0f0'
              }}>
                <div style={{fontSize: '13px', color: '#666'}}>
                  {candidate.disponibilite === 'Immédiate' ? (
                    <span style={{color: '#059669', fontWeight: 'bold'}}>✅ Disponible maintenant</span>
                  ) : candidate.disponibilite ? (
                    <span>📅 {candidate.disponibilite}</span>
                  ) : (
                    <span>📅 Disponible sous 2 semaines</span>
                  )}
                  {candidate.teletravail && (
                    <span style={{marginLeft: '10px'}}>🏠 {candidate.teletravail}</span>
                  )}
                </div>
                
                <Link href={`/consultant/${candidate.id}`}>
                  <button style={{
                    padding: '10px 18px',
                    background: '#0a66c2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#004182'}
                  onMouseLeave={(e) => e.target.style.background = '#0a66c2'}>
                    Voir le profil ↗
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredCandidates.length === 0 && candidates.length > 0 && (
          <div style={{textAlign: 'center', padding: '50px', color: '#666'}}>
            <h3 style={{color: '#6b7280'}}>Aucun consultant ne correspond à vos critères de recherche</h3>
            <p>Essayez d'élargir vos filtres ou modifier vos termes de recherche</p>
          </div>
        )}

        {candidates.length === 0 && (
          <div style={{textAlign: 'center', padding: '50px', color: '#666'}}>
            <h3>Aucun consultant disponible</h3>
          </div>
        )}
      </div>
    </div>
  );
}
