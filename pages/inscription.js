// pages/inscription.js - FORMULAIRE COMPLET AVEC UPLOAD DRIVE
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import ScrollToTopOrange from '../components/ScrollToTopOrange';

export default function Inscription() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    speciality: '',
    experience: '',
    skills: '',
    linkedin: '',
    currentCompany: '',
    salaryExpectation: '',
    availability: '',
    message: '',
    cvFile: null
  });
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, cvFile: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Upload du CV vers Google Drive
      if (formData.cvFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('cvFile', formData.cvFile);
        uploadFormData.append('candidateData', JSON.stringify(formData));

        const uploadResponse = await fetch('/api/upload-cv', {
          method: 'POST',
          body: uploadFormData
        });

        const uploadResult = await uploadResponse.json();
        
        if (!uploadResult.success) {
          throw new Error('Erreur upload CV');
        }
      }

      alert('🎉 Candidature envoyée avec succès ! Nous étudierons votre profil sous 48h.');
      
      // Reset du formulaire
      setFormData({
        name: '', email: '', phone: '', speciality: '', 
        experience: '', skills: '', linkedin: '', currentCompany: '',
        salaryExpectation: '', availability: '', message: '', cvFile: null
      });

    } catch (error) {
      console.error('Erreur soumission:', error);
      alert('❌ Erreur lors de l envoi de la candidature. Veuillez réessayer.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Inscription Candidat - SM Consulting</title>
        <meta name="description" content="Rejoignez notre vivier de talents IT et accédez à des opportunités de missions exclusives." />
      </Head>

      {/* Header avec bouton retour */}
      <header style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb', 
        padding: '16px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
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
            <Link href="/" style={{ 
              textDecoration: 'none', 
              color: '#fd7e14',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ← Retour
            </Link>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1a365d', margin: 0 }}>SM Consulting</h1>
            </Link>
          </div>
          
          <nav style={{ display: 'flex', gap: '24px' }}>
            <Link href="/candidates" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Candidats</Link>
            <Link href="/projets" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Projets</Link>
            <Link href="/coaptation" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Coaptation</Link>
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
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: '700', marginBottom: '20px' }}>👨‍💻 Formulaire de Candidature</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: '1.6' }}>
            Rejoignez notre réseau de <strong>221 consultants experts</strong> et accédez à des missions exclusives chez nos clients partenaires.
          </p>
        </div>
      </section>

      {/* Formulaire détaillé */}
      <section style={{ padding: '80px 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            background: 'white', 
            padding: '50px', 
            borderRadius: '15px', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
          }}>
            <h2 style={{ 
              textAlign: 'center', 
              color: '#1a365d', 
              marginBottom: '40px',
              fontSize: '2.2rem'
            }}>
              📝 Formulaire de Candidature
            </h2>
            
            <form onSubmit={handleSubmit}>
              {/* Informations personnelles */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '#1a365d', marginBottom: '20px', borderBottom: '2px solid #fd7e14', paddingBottom: '10px' }}>👤 Informations Personnelles</h3>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a365d' }}>
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    placeholder="Votre nom et prénom"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a365d' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a365d' }}>
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                      placeholder="+33 ..."
                    />
                  </div>
                </div>
              </div>

              {/* Profil professionnel */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '#1a365d', marginBottom: '20px', borderBottom: '2px solid #fd7e14', paddingBottom: '10px' }}>💼 Profil Professionnel</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a365d' }}>
                      Spécialité *
                    </label>
                    <select
                      name="speciality"
                      value={formData.speciality}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    >
                      <option value="">Sélectionnez votre spécialité</option>
                      <option value="frontend">Développeur Frontend</option>
                      <option value="backend">Développeur Backend</option>
                      <option value="fullstack">Développeur Fullstack</option>
                      <option value="mobile">Développeur Mobile</option>
                      <option value="data">Data Scientist/Engineer</option>
                      <option value="devops">DevOps/Cloud</option>
                      <option value="cyber">Cybersécurité</option>
                      <option value="ai">IA/Machine Learning</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a365d' }}>
                      Années d'expérience *
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    >
                      <option value="">Sélectionnez</option>
                      <option value="0-2">0-2 ans</option>
                      <option value="2-5">2-5 ans</option>
                      <option value="5-8">5-8 ans</option>
                      <option value="8+">8+ ans</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a365d' }}>
                    Entreprise actuelle
                  </label>
                  <input
                    type="text"
                    name="currentCompany"
                    value={formData.currentCompany}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    placeholder="Nom de votre entreprise actuelle"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a365d' }}>
                    Compétences techniques *
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    placeholder="Ex: React, Node.js, Python, AWS, Docker, Kubernetes..."
                  />
                </div>
              </div>

              {/* Informations complémentaires */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '#1a365d', marginBottom: '20px', borderBottom: '2px solid #fd7e14', paddingBottom: '10px' }}>📋 Informations Complémentaires</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a365d' }}>
                      Prétentions salariales
                    </label>
                    <select
                      name="salaryExpectation"
                      value={formData.salaryExpectation}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    >
                      <option value="">Sélectionnez</option>
                      <option value="40-50k">40-50k €</option>
                      <option value="50-60k">50-60k €</option>
                      <option value="60-70k">60-70k €</option>
                      <option value="70-80k">70-80k €</option>
                      <option value="80k+">80k+ €</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a365d' }}>
                      Disponibilité *
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    >
                      <option value="">Sélectionnez</option>
                      <option value="immediate">Immédiate</option>
                      <option value="1month">1 mois</option>
                      <option value="2months">2 mois</option>
                      <option value="3months">3 mois</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a365d' }}>
                    LinkedIn (optionnel)
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    placeholder="https://linkedin.com/in/votre-profil"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a365d' }}>
                    CV (PDF) *
                  </label>
                  <input
                    type="file"
                    name="cvFile"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a365d' }}>
                    Message de motivation (optionnel)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                    placeholder="Présentez-vous brièvement ou partagez vos attentes..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                style={{
                  width: '100%',
                  background: uploading ? '#9ca3af' : 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)',
                  color: 'white',
                  padding: '15px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!uploading) {
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!uploading) {
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {uploading ? '⏳ Envoi en cours...' : '🚀 Postuler maintenant'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer et ScrollToTop Orange */}
      <Footer />
      <ScrollToTopOrange />
    </>
  );
}
