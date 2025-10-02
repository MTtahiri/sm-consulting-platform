import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import ScrollToTopOrange from '../components/ScrollToTopOrange';

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedCV, setSelectedCV] = useState(null);
  const [showCVModal, setShowCVModal] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/candidates');
        const data = await response.json();
        
        if (data && data.length > 0) {
          setCandidates(data);
          setFilteredCandidates(data);
        }
      } catch (error) {
        console.error('Erreur chargement candidats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Filtres
  useEffect(() => {
    let filtered = candidates;

    if (searchTerm) {
      filtered = filtered.filter(candidate =>
        candidate.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.competences?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.specialite?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.secteur_recherche?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.experience_resume?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSkill) {
      filtered = filtered.filter(candidate =>
        candidate.competences?.toLowerCase().includes(selectedSkill.toLowerCase())
      );
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(candidate =>
        candidate.specialite?.toLowerCase().includes(selectedSpecialty.toLowerCase())
      );
    }

    setFilteredCandidates(filtered);
  }, [searchTerm, selectedSkill, selectedSpecialty, candidates]);

  const skills = [...new Set(candidates.flatMap(c => c.competences?.split(',').map(s => s.trim())).filter(Boolean))];
  
  // 🛠️ SPÉCIALITÉS IT 2025 COMPLÈTES
  const specialties = [
    "Développement / Logiciel",
    "Développeur Front-End",
    "Développeur Back-End", 
    "Développeur Full-Stack",
    "Développeur Mobile (iOS / Android / cross-platform)",
    "Développeur Web",
    "Développeur d'API / Microservices",
    "Ingénieur Logiciel / Software Engineer",
    "Ingénieur IA / Machine Learning Engineer",
    "Ingénieur Deep Learning / Data & AI Specialist",
    "Ingénieur Logiciel Embarqué (Embedded Software Engineer)",
    "Développeur de jeux vidéo (Game Developer)",
    "Ingénieur DevOps",
    "Ingénieur Site Reliability (SRE)",
    "Infrastructure / Ops / Cloud",
    "Administrateur Systèmes (SysAdmin)",
    "Administrateur Réseau / Network Administrator / Network Engineer",
    "Ingénieur Cloud (Cloud Engineer)",
    "Architecte Cloud (Cloud Architect)",
    "Ingénieur Infrastructure",
    "Ingénieur Virtualisation / Containers (Docker / Kubernetes)",
    "Ingénieur de la plateforme (Platform Engineer)",
    "Ingénieur Opérations (Ops Engineer)",
    "Ingénieur Fiabilité / Performance",
    "Sécurité / Risk / Conformité",
    "Analyste Sécurité / Cybersecurity Analyst",
    "Ingénieur Sécurité / Security Engineer",
    "Architecte Sécurité (Security Architect)",
    "Responsable Sécurité / CISO (Chief Information Security Officer)",
    "Expert en Tests d'intrusion / Pentester",
    "Spécialiste en conformité / Risk & Compliance / Gouvernance",
    "Forensic / Incident Response",
    "Données / Big Data / IA",
    "Data Analyst",
    "Data Engineer",
    "Data Scientist",
    "Ingénieur Big Data",
    "Ingénieur Machine Learning / IA",
    "Ingénieur NLP (Natural Language Processing)",
    "Ingénieur Vision par Ordinateur (Computer Vision)",
    "Ingénieur en automatisation / apprentissage automatique",
    "Architecte des données (Data Architect)",
    "Ingénieur / Spécialiste BI (Business Intelligence)",
    "Gestion & Coordination de projets technologiques",
    "Chef de Projet IT / Project Manager",
    "Scrum Master / Agile Coach",
    "Responsable Delivery / Delivery Manager",
    "Product Owner / Product Manager (tech)",
    "Coordinateur IT / IT Program Manager",
    "Manager d'Equipe Technique / Engineering Manager",
    "Directeur Technique / CTO (Chief Technical Officer)",
    "Directeur des Technologies / Directeur IT",
    "Support / Maintenance / Assistance",
    "Technicien Support / Helpdesk",
    "Technicien de Support à distance",
    "Support Utilisateur / Support Client IT",
    "Maintenance des infrastructures / opérationnels",
    "UX / Design / Expérience Utilisateur",
    "UX Designer",
    "UI Designer",
    "UX/UI Researcher",
    "Designer d'interaction / Interaction Designer",
    "Architecte UX / Design System Specialist",
    "Architecture & Analyse",
    "Architecte Logiciel / Software Architect",
    "Architecte Systèmes / Systems Architect",
    "Architecte d'Entreprise (Enterprise Architect)",
    "Analyste Fonctionnel / Business Analyst",
    "Analyste Systèmes / Systems Analyst",
    "Spécialités émergentes / niches",
    "Ingénieur Edge Computing / IoT Engineer",
    "Ingénieur Quantique / Quantum Computing Specialist",
    "Ingénieur Serverless / architecte serverless",
    "Spécialiste Blockchain / Développeur de chaînes de blocs",
    "Spécialiste Réalité Augmentée / Réalité Virtuelle (AR/VR)",
    "Spécialiste Automatisation / RPA (Robotic Process Automation)",
    "Ingénieur Big Data temps réel / Streaming Data Engineer",
    "Ingénieur en Infrastructure Observabilité / Monitoring / Logging"
  ];

  const generateAnonymizedCV = async (candidate) => {
    try {
      const response = await fetch('/api/generate-sm-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate })
      });
      
      const data = await response.json();
      if (data.success) {
        setSelectedCV(data.anonymizedCV);
        setShowCVModal(true);
      }
    } catch (error) {
      console.error('Erreur génération CV:', error);
      alert('Erreur lors de la génération du CV');
    }
  };

  const downloadCV = () => {
    if (selectedCV) {
      const blob = new Blob([selectedCV], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV_Anonyme_SM_${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const generateCVFromPDF = async (candidate) => {
    try {
      // Appel à l'API pour extraire et anonymiser le CV PDF
      const response = await fetch('/api/extract-and-anonymize-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          candidateId: candidate.id,
          pdfFileName: candidate.cv_file // Supposons que vous avez ce champ
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setSelectedCV(data.anonymizedCV);
        setShowCVModal(true);
      } else {
        // Fallback vers le CV généré
        generateAnonymizedCV(candidate);
      }
    } catch (error) {
      console.error('Erreur extraction CV PDF:', error);
      // Fallback vers le CV généré
      generateAnonymizedCV(candidate);
    }
  };

  return (
    <>
      <Head>
        <title>Candidats - SM Consulting</title>
        <meta name="description" content="Découvrez nos 221 consultants IT qualifiés. Profils experts en développement, data, cloud et plus encore." />
      </Head>

      {/* Header avec bouton retour */}
      <header style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb', 
        padding: '16px 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ 
          maxWidth: 1400, 
          margin: '0 auto', 
          padding: '0 20px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link href="/" style={{ 
              textDecoration: 'none', 
              color: '#fd7e14',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ← Accueil
            </Link>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1a365d', margin: 0 }}>SM Consulting</h1>
            </Link>
          </div>
          
          <nav style={{ display: 'flex', gap: '24px' }}>
            <Link href="/projets" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Projets</Link>
            <Link href="/coaptation" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Coaptation</Link>
            <Link href="/inscription-recruteur" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Recruteur</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)', 
        color: 'white', 
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '20px' }}>👥 Notre Réseau de Consultants IT</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: '1.6' }}>
            Découvrez nos <strong>221 consultants experts</strong> sélectionnés pour leurs compétences techniques et leur expérience terrain.
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '40px', 
            marginTop: '40px',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fd7e14' }}>{candidates.length}+</div>
              <div style={{ fontSize: '1rem', opacity: 0.9 }}>Experts IT</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#38a169' }}>{skills.length}+</div>
              <div style={{ fontSize: '1rem', opacity: 0.9 }}>Technologies</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#3b82f6' }}>95%</div>
              <div style={{ fontSize: '1rem', opacity: 0.9 }}>Disponibles</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres améliorés */}
      <section style={{ padding: '40px 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ 
            background: 'white', 
            padding: '30px', 
            borderRadius: '15px', 
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
            border: '2px solid #e2e8f0'
          }}>
            <h3 style={{ color: '#1a365d', marginBottom: '20px', fontSize: '1.5rem' }}>🔍 Recherche Avancée</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a365d' }}>Mot-clé</label>
                <input
                  type="text"
                  placeholder="Rechercher par compétence, expérience, secteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#fd7e14'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a365d' }}>🛠️ Compétence technique</label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    background: 'white'
                  }}
                >
                  <option value="">Toutes les compétences</option>
                  {skills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a365d' }}>🎯 Spécialité / Poste</label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    background: 'white'
                  }}
                >
                  <option value="">🛠️ Toutes les spécialités</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Liste des candidats - NOUVELLE STRUCTURE 2 COLONNES */}
      <section style={{ padding: '40px 20px', background: 'white' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
              <p style={{ color: '#6b7280', fontSize: '1.2rem' }}>Chargement des consultants...</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#1a365d', fontSize: '2rem' }}>
                  {filteredCandidates.length} Consultant{filteredCandidates.length > 1 ? 's' : ''} trouvé{filteredCandidates.length > 1 ? 's' : ''}
                </h2>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>
                  Profils triés par pertinence
                </div>
              </div>

              {/* GRID 2 COLONNES */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))', 
                gap: '30px',
                alignItems: 'start'
              }}>
                {filteredCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    style={{
                      background: 'white',
                      border: '2px solid #e2e8f0',
                      borderRadius: '15px',
                      padding: '30px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.borderColor = '#fd7e14';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    {/* Bandeau couleur */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(135deg, #1a365d 0%, #fd7e14 100%)'
                    }}></div>

                    {/* En-tête du profil */}
                    <div style={{ marginBottom: '25px' }}>
                      <h3 style={{ 
                        color: '#1a365d', 
                        fontSize: '1.5rem', 
                        marginBottom: '8px',
                        fontWeight: '700'
                      }}>
                        {candidate.titre || 'Consultant IT Expert'}
                      </h3>
                      <p style={{ color: '#fd7e14', fontWeight: '600', marginBottom: '12px', fontSize: '1.1rem' }}>
                        {candidate.specialite || 'Spécialité IT'}
                      </p>
                      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <div style={{ 
                          display: 'inline-block', 
                          background: '#f0fdf4', 
                          color: '#16a34a',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          📍 {candidate.mobilite || 'Île-de-France'}
                        </div>
                        <div style={{ 
                          display: 'inline-block', 
                          background: '#fef3c7', 
                          color: '#92400e',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          ⏱️ {candidate.annees_experience || '5'}+ ans exp.
                        </div>
                        <div style={{ 
                          display: 'inline-block', 
                          background: '#dbeafe', 
                          color: '#1e40af',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          ✅ {candidate.disponibilite || 'Disponible'}
                        </div>
                      </div>
                    </div>

                    {/* Section Compétences principales - TOUTES LES COMPÉTENCES */}
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ color: '#1a365d', marginBottom: '12px', fontSize: '1.1rem', fontWeight: '600' }}>
                        🛠️ Compétences principales
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {candidate.competences?.split(',').map((skill, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: 'linear-gradient(135deg, #1a365d, #2d3748)',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500',
                              border: '1px solid #e2e8f0'
                            }}
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Section Expérience résumée */}
                    {candidate.experience_resume && (
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ color: '#1a365d', marginBottom: '12px', fontSize: '1.1rem', fontWeight: '600' }}>
                          💼 Expérience professionnelle
                        </h4>
                        <p style={{ 
                          color: '#4b5563', 
                          lineHeight: '1.5',
                          fontSize: '14px',
                          background: '#f8fafc',
                          padding: '15px',
                          borderRadius: '8px',
                          borderLeft: '4px solid #fd7e14'
                        }}>
                          {candidate.experience_resume}
                        </p>
                      </div>
                    )}

                    {/* Section Secteur de recherche */}
                    {candidate.secteur_recherche && (
                      <div style={{ marginBottom: '25px' }}>
                        <h4 style={{ color: '#1a365d', marginBottom: '12px', fontSize: '1.1rem', fontWeight: '600' }}>
                          🎯 Secteur recherché
                        </h4>
                        <div style={{ 
                          background: 'linear-gradient(135deg, #fef3c7, #fbbf24)', 
                          padding: '12px 15px',
                          borderRadius: '8px',
                          border: '1px solid #fbbf24'
                        }}>
                          <span style={{ fontWeight: '600', color: '#92400e', fontSize: '14px' }}>
                            {candidate.secteur_recherche}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Boutons d'action */}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
                      <button
                        onClick={() => generateAnonymizedCV(candidate)}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '14px 20px',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, #2d3748 0%, #1a365d 100%)';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        📄 CV Anonyme
                      </button>
                      
                      <button
                        onClick={() => generateCVFromPDF(candidate)}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '14px 20px',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, #e67e22 0%, #fd7e14 100%)';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        📋 CV Complet
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCandidates.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
                  <h3 style={{ color: '#6b7280', marginBottom: '10px' }}>Aucun consultant trouvé</h3>
                  <p style={{ color: '#9ca3af' }}>Essayez de modifier vos critères de recherche</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Modal pour afficher le CV */}
      {showCVModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '30px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowCVModal(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              ×
            </button>
            
            <h3 style={{ color: '#1a365d', marginBottom: '20px', fontSize: '1.5rem' }}>
              📄 CV Consultant Anonyme
            </h3>
            
            <pre style={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              fontSize: '12px',
              lineHeight: '1.4',
              background: '#f8fafc',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              maxHeight: '50vh',
              overflow: 'auto'
            }}>
              {selectedCV}
            </pre>
            
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <button
                onClick={downloadCV}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                💾 Télécharger le CV
              </button>
              <button
                onClick={() => setShowCVModal(false)}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer et ScrollToTop Orange */}
      <Footer />
      <ScrollToTopOrange />
    </>
  );
}
