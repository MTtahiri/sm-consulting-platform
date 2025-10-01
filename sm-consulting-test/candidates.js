import React, { useState, useEffect } from 'react';

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');

  const fetchCandidates = async (page = 1, searchQuery = '') => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '12');
      if (searchQuery) params.append('search', searchQuery);

      console.log(`🔄 Récupération page ${page}, recherche: "${searchQuery}"`);
      
      const response = await fetch(`/api/candidates?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 Données reçues:', data);
      
      if (data.success) {
        setCandidates(data.data || []);
        setPagination(data.pagination || null);
      } else {
        throw new Error(data.message || 'Erreur dans la réponse API');
      }
    } catch (err) {
      console.error('❌ Erreur fetch candidates:', err);
      setError(err.message);
      setCandidates([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial + rechargements page ou recherche
  useEffect(() => {
    fetchCandidates(currentPage, search);
  }, [currentPage, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); 
    // Le useEffect s’occupe d’appeler fetchCandidates avec la recherche
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || (pagination && newPage > pagination.totalPages)) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refreshData = () => {
    fetchCandidates(currentPage, search);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ color: '#1e40af' }}>👥 Candidats IT</h1>
        <div style={{ fontSize: '48px', margin: '20px 0' }}>⏳</div>
        <p>Chargement des candidats...</p>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '5px solid #e5e7eb', 
          borderTop: '5px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '20px auto'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ color: '#1e40af' }}>👥 Candidats IT</h1>
        <div style={{ 
          backgroundColor: '#fee2e2', 
          padding: '20px', 
          borderRadius: '8px', 
          color: '#dc2626',
          marginBottom: '20px'
        }}>
          <h3>❌ Erreur de chargement</h3>
          <p>{error}</p>
          <button 
            onClick={refreshData}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            🔄 Réessayer
          </button>
        </div>
        <a href="/" style={{ color: '#3b82f6' }}>← Retour à l'accueil</a>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header + recherche */}
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ color: '#1e40af', marginBottom: '10px' }}>
            👥 Candidats IT ({pagination?.totalCandidates ?? candidates.length})
          </h1>
          <form onSubmit={handleSearch} style={{ maxWidth: '400px', margin: '20px auto' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom, compétences, rôle..."
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🔍
              </button>
            </div>
          </form>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={refreshData}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#10b981', 
                color: 'white', 
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔄 Actualiser
            </button>
            <a 
              href="/inscription" 
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#f59e0b', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              ➕ Nouveau candidat
            </a>
          </div>
        </div>
        
        {/* Grille candidats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '20px',
          marginBottom: '40px'
        }}>
          {candidates.map(candidate => (
            <div 
              key={candidate.id} 
              style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '12px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              
              {/* Header candidat */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ color: '#1f2937', marginBottom: '5px', fontSize: '18px' }}>{candidate.nom}</h3>
                  <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>{candidate.role}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    backgroundColor: candidate.score >= 80 ? '#dcfce7' : candidate.score >= 60 ? '#dbeafe' : '#fef3c7',
                    color: candidate.score >= 80 ? '#166534' : candidate.score >= 60 ? '#1e40af' : '#92400e'
                  }}>
                    {candidate.score ?? 0}/100
                  </div>
                </div>
              </div>
              
              {/* Infos candidat */}
              <div style={{ marginBottom: '15px', fontSize: '14px', color: '#6b7280' }}>
                <p style={{ margin: '4px 0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '8px' }}>📍</span> {candidate.localisation || '—'}
                </p>
                <p style={{ margin: '4px 0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '8px' }}>💼</span> {candidate.experience || '—'} ans d'expérience
                </p>
                <p style={{ margin: '4px 0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '8px' }}>💰</span> {candidate.tjm ? `${candidate.tjm}€/jour` : '—'}
                </p>
                <p style={{ margin: '4px 0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '8px' }}>📞</span> {candidate.telephone || '—'}
                </p>
              </div>

              {/* Compétences */}
              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>
                  🛠️ Compétences :
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(candidate.skillsArray?.slice(0, 4).map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}
                    >
                      {skill}
                    </span>
                  ))) || (
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                      {candidate.competences?.split(',').slice(0, 3).map(s => s.trim()).join(', ')}
                    </span>
                  )}
                  {(candidate.skillsArray?.length > 4 || candidate.competences?.split(',').length > 3) && (
                    <span style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#e5e7eb', 
                      color: '#6b7280',
                      borderRadius: '12px',
                      fontSize: '11px'
                    }}>
                      +{(candidate.skillsArray?.length - 4) || (candidate.competences?.split(',').length - 3)}
                    </span>
                  )}
                </div>
              </div>

              {/* Footer statut + rating */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid #f3f4f6' }}>
                <span style={{ 
                  padding: '6px 12px', 
                  borderRadius: '20px', 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  backgroundColor: candidate.disponible ? '#dcfce7' : '#fee2e2',
                  color: candidate.disponible ? '#166534' : '#dc2626'
                }}>
                  {candidate.disponible ? '✅ Disponible' : '🔴 Occupé'}
                </span>
                
                <div style={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '4px' }}>
                    {'⭐'.repeat(Math.floor(candidate.rating || 0))}
                  </span>
                  <span style={{ color: '#6b7280' }}>
                    ({candidate.rating ?? 0})
                  </span>
                </div>
              </div>

              {/* Date ajout */}
              <div style={{ marginTop: '10px', fontSize: '11px', color: '#9ca3af', textAlign: 'center' }}>
                Ajouté le {candidate.dateAjout ? new Date(candidate.dateAjout).toLocaleDateString('fr-FR') : 'N/A'}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ marginBottom: '20px', color: '#6b7280' }}>
              Page {pagination.currentPage} sur {pagination.totalPages} 
              ({pagination.totalCandidates} candidats au total)
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPreviousPage}
                style={{
                  padding: '10px 20px',
                  backgroundColor: pagination.hasPreviousPage ? '#3b82f6' : '#d1d5db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: pagination.hasPreviousPage ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold'
                }}
              >
                ← Précédent
              </button>

              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    style={{
                      padding: '10px 15px',
                      backgroundColor: pageNum === currentPage ? '#1e40af' : '#f3f4f6',
                      color: pageNum === currentPage ? 'white' : '#374151',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: pageNum === currentPage ? 'bold' : 'normal'
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                style={{
                  padding: '10px 20px',
                  backgroundColor: pagination.hasNextPage ? '#3b82f6' : '#d1d5db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold'
                }}
              >
                Suivant →
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '30px 0', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ marginBottom: '15px' }}>
            <a 
              href="/" 
              style={{ 
                color: '#3b82f6', 
                textDecoration: 'none', 
                marginRight: '20px',
                padding: '8px 16px',
                backgroundColor: '#f3f4f6',
                borderRadius: '6px'
              }}
            >
              🏠 Accueil
            </a>
            <a 
              href="/dashboard" 
              style={{ 
                color: '#3b82f6', 
                textDecoration: 'none',
                padding: '8px 16px',
                backgroundColor: '#f3f4f6',
                borderRadius: '6px'
              }}
            >
              📊 Dashboard
            </a>
          </div>
          <p style={{ color: '#9ca3af', margin: 0, fontSize: '14px' }}>
            SM Consulting - Plateforme de recrutement IT
          </p>
        </div>
      </div>
    </div>
  );
}
