// pages/candidates/index.js
import { useState, useEffect } from 'react';

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch('/api/candidates');
        if (!response.ok) throw new Error('Erreur HTTP');
        const data = await response.json();
        setCandidates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const generateSMCV = async (candidate) => {
    try {
      const response = await fetch('/api/generate-sm-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Télécharger le CV enrichi
        const blob = new Blob([result.anonymizedCV], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        alert('✅ CV Expert S.M. Consulting téléchargé!');
      } else {
        alert('Erreur: ' + (result.error || 'Génération échouée'));
      }
    } catch (err) {
      alert('Erreur génération CV: ' + err.message);
    }
  };

  const previewSMCV = async (candidate) => {
    try {
      const response = await fetch('/api/generate-sm-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Afficher le CV enrichi dans une nouvelle fenêtre avec un meilleur design
        const newWindow = window.open('', '_blank', 'width=900,height=700');
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>CV Expert S.M. Consulting - Consultant ${candidate.id}</title>
            <style>
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                margin: 0;
                padding: 0;
                line-height: 1.6;
                color: #2c3e50;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
              }
              .cv-container {
                max-width: 800px;
                margin: 20px auto;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                overflow: hidden;
              }
              .header { 
                background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
                color: white;
                padding: 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0 0 10px 0;
                font-size: 28px;
                font-weight: 700;
              }
              .header .subtitle {
                margin: 0;
                opacity: 0.9;
                font-size: 16px;
              }
              .contact-info {
                background: #f8f9fa;
                padding: 15px;
                text-align: center;
                border-bottom: 2px solid #e9ecef;
                font-size: 14px;
              }
              .section { 
                padding: 25px;
                border-bottom: 1px solid #e9ecef;
              }
              .section:last-child {
                border-bottom: none;
              }
              .section-title { 
                color: #1a365d;
                font-weight: 700;
                font-size: 18px;
                margin-bottom: 15px;
                padding-bottom: 8px;
                border-bottom: 2px solid #667eea;
                display: flex;
                align-items: center;
              }
              .section-title::before {
                content: "▸";
                margin-right: 10px;
                color: #667eea;
              }
              .content {
                font-size: 14px;
                line-height: 1.8;
              }
              .skills-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 10px;
              }
              .skill-category {
                background: #f8f9fa;
                padding: 12px;
                border-radius: 8px;
                border-left: 4px solid #667eea;
              }
              .footer {
                background: #1a365d;
                color: white;
                padding: 20px;
                text-align: center;
                font-size: 12px;
              }
              pre {
                white-space: pre-wrap;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                font-size: 14px;
              }
              .highlight {
                background: #fff3cd;
                padding: 2px 6px;
                border-radius: 4px;
                font-weight: 600;
              }
              .availability {
                display: inline-block;
                background: #28a745;
                color: white;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                margin-left: 10px;
              }
            </style>
          </head>
          <body>
            <div class="cv-container">
              <div class="header">
                <h1>S.M. CONSULTING</h1>
                <p class="subtitle">Fiche Consultant Expert Anonymisée</p>
              </div>
              
              <div class="contact-info">
                <strong>ID Consultant :</strong> SM-${candidate.id} | 
                <strong>Email :</strong> consultant-${candidate.id}@sm-consulting.fr
                <span class="availability">${candidate.disponibilite || 'DISPONIBLE'}</span>
              </div>

              <div class="section">
                <pre>${result.anonymizedCV}</pre>
              </div>

              <div class="footer">
                <p><strong>S.M. Consulting</strong> - Votre partenaire recrutement IT de confiance</p>
                <p>📞 +33 1 23 45 67 89 | 🌐 www.sm-consulting.fr | 📧 contact@sm-consulting.fr</p>
                <p><em>🔒 CV expert anonymisé conforme RGPD - Informations personnelles supprimées</em></p>
              </div>
            </div>
          </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        alert('Erreur: ' + (result.error || 'Prévisualisation échouée'));
      }
    } catch (err) {
      alert('Erreur prévisualisation: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Consultants S.M. Consulting</h1>
        <div style={{ padding: '40px' }}>Chargement des consultants experts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Consultants S.M. Consulting</h1>
        <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
          Erreur: {error}
          <br />
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '10px', padding: '10px 20px' }}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* En-tête */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          margin: '0 0 10px 0', 
          color: '#2c3e50',
          fontSize: '2.5rem'
        }}>
          🚀 S.M. Consulting
        </h1>
        <p style={{ 
          margin: '0', 
          color: '#7f8c8d',
          fontSize: '1.2rem'
        }}>
          Plateforme de Recrutement Expert - CVs enrichis conformes RGPD
        </p>
        <div style={{ 
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#e8f5e8',
          borderRadius: '5px',
          display: 'inline-block'
        }}>
          <strong>{candidates.length}</strong> consultants experts disponibles
        </div>
        <div style={{ 
          marginTop: '10px',
          padding: '8px',
          backgroundColor: '#e3f2fd',
          borderRadius: '5px',
          display: 'inline-block',
          fontSize: '0.9rem'
        }}>
          🎯 CVs experts enrichis - 100% anonymes RGPD
        </div>
      </div>

      {/* Grille des consultants */}
      {candidates.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>Aucun consultant expert trouvé</h3>
          <p>Commencez par ajouter des consultants via la page de validation CV.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '20px',
          padding: '10px'
        }}>
          {candidates.map((candidate, index) => (
            <div key={candidate.id || index} style={{ 
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0',
              transition: 'transform 0.2s, box-shadow 0.2s',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            }}
            >
              {/* En-tête de la carte */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '15px'
              }}>
                <div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    marginBottom: '5px'
                  }}>
                    <span style={{
                      backgroundColor: '#1a365d',
                      color: 'white',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>
                      ID: {candidate.id}
                    </span>
                    <span style={{
                      backgroundColor: candidate.niveau_expertise === 'Expert' ? '#e53e3e' : 
                                      candidate.niveau_expertise === 'Senior' ? '#dd6b20' : '#3182ce',
                      color: 'white',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '0.9rem'
                    }}>
                      {candidate.niveau_expertise || 'Confirmé'}
                    </span>
                  </div>
                  <h3 style={{ 
                    margin: '5px 0', 
                    color: '#2c3e50',
                    fontSize: '1.4rem'
                  }}>
                    {candidate.titre}
                  </h3>
                  <p style={{ 
                    margin: '0', 
                    color: '#7f8c8d',
                    fontSize: '1rem'
                  }}>
                    {candidate.specialite || 'Expertise technique avancée'}
                  </p>
                </div>
                
                {/* Indicateur de disponibilité */}
                <div style={{
                  backgroundColor: '#2d3748',
                  color: 'white',
                  padding: '8px 15px',
                  borderRadius: '25px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  {candidate.disponibilite || 'Disponible'}
                </div>
              </div>

              {/* Informations principales */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <div>
                    <strong>💰 TJM Expert:</strong><br />
                    <span style={{ color: '#27ae60', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      {candidate.tjm_min} - {candidate.tjm_max} €
                    </span>
                  </div>
                  <div>
                    <strong>📅 Expérience:</strong><br />
                    <span style={{ fontWeight: 'bold' }}>{candidate.annees_experience} ans</span>
                  </div>
                </div>

                <div>
                  <strong>🛠️ Compétences clés:</strong><br />
                  <span style={{ color: '#34495e' }}>
                    {candidate.competences}
                  </span>
                </div>
                
                {candidate.technologies_cles && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>🔧 Technologies:</strong><br />
                    <span style={{ color: '#4a5568', fontSize: '0.9rem' }}>
                      {candidate.technologies_cles}
                    </span>
                  </div>
                )}
              </div>

              {/* Boutons CV S.M. Consulting */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '10px',
                textAlign: 'center'
              }}>
                <button
                  onClick={() => previewSMCV(candidate)}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 15px',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  👁️ Voir CV Expert
                </button>
                
                <button
                  onClick={() => generateSMCV(candidate)}
                  style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 15px',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  📥 Télécharger CV Expert
                </button>
              </div>
              
              <div style={{ 
                fontSize: '0.8rem', 
                color: '#718096', 
                marginTop: '10px',
                textAlign: 'center'
              }}>
                🎯 CV expert enrichi - 100% anonyme RGPD
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
