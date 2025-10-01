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
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Merci pour votre inscription ! Nous étudierons votre profil sous 48h.');
    setFormData({
      name: '', email: '', phone: '', speciality: '', 
      experience: '', skills: '', linkedin: '', message: ''
    });
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
            {/* BOUTON RETOUR */}
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
          <h1 style={{ fontSize: '2.8rem', fontWeight: '700', marginBottom: '20px' }}>👨‍💻 Rejoignez notre vivier de talents IT</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: '1.6' }}>
            Intégrez notre réseau de <strong>221 consultants experts</strong> et accédez à des missions exclusives chez nos clients partenaires.
          </p>
        </div>
      </section>

      {/* Formulaire */}
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
              <div style={{ marginBottom: '25px' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
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
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
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

              <div style={{ marginBottom: '25px' }}>
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
                  placeholder="Ex: React, Node.js, Python, AWS, Docker..."
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
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

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a365d' }}>
                  Message (optionnel)
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

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)',
                  color: 'white',
                  padding: '15px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                🚀 Postuler maintenant
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
