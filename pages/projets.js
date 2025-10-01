import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

export default function Projets() {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    budget: '',
    timeline: '',
    contactEmail: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Projet soumis avec succès ! Nous vous recontacterons rapidement.');
    setFormData({
      projectName: '',
      description: '',
      budget: '',
      timeline: '',
      contactEmail: ''
    });
  };

  return (
    <>
      <Head>
        <title>Déposer un Projet - SM Consulting</title>
        <meta name="description" content="Déposez vos projets et trouvez le consultant idéal parmi nos 221 experts. Solutions tech et digitales sur-mesure pour startups, PME et grands groupes." />
        <meta name="keywords" content="consulting, projets tech, développement, digital, freelance, experts IT, recrutement IT, solutions sur-mesure" />
        <meta property="og:title" content="Déposer un Projet - SM Consulting" />
        <meta property="og:description" content="221 consultants experts pour vos projets tech et digitaux. Solutions 100% sur-mesure." />
      </Head>

      {/* Header existant */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1a365d', margin: 0 }}>SM Consulting</h1>
          </Link>
          <nav style={{ display: 'flex', gap: '24px' }}>
            <Link href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Accueil</Link>
            <Link href="/candidates" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Candidats</Link>
            <Link href="/coaptation" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Coaptation</Link>
          </nav>
        </div>
      </header>

      {/* 🔥 BANNIÈRE SEO OPTIMISÉE */}
      <section style={{ 
        background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)', 
        color: 'white', 
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '700', 
            marginBottom: '30px',
            lineHeight: '1.2'
          }}>
            Déposez votre Projet IT
          </h1>
          <p style={{ 
            fontSize: '20px', 
            lineHeight: '1.6',
            maxWidth: '900px', 
            margin: '0 auto 40px',
            fontWeight: '500'
          }}>
            <strong>Déposez vos projets et bénéficiez de l'expertise de nos 221 consultants qualifiés !</strong><br />
            Que vous soyez une <strong>startup</strong>, une <strong>PME</strong> ou un <strong>grand groupe</strong>, nous vous accompagnons dans la réalisation de vos projets tech, digitaux et stratégiques. <strong>100% sur-mesure, 100% transparent.</strong>
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            flexWrap: 'wrap',
            marginTop: '40px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fd7e14' }}>221+</div>
              <div style={{ fontSize: '1rem', opacity: 0.9 }}>Consultants Experts</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#38a169' }}>50+</div>
              <div style={{ fontSize: '1rem', opacity: 0.9 }}>Projets Réalisés</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#3b82f6' }}>25+</div>
              <div style={{ fontSize: '1rem', opacity: 0.9 }}>Technologies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire de projet existant */}
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
              📋 Formulaire de Projet
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a365d' }}>
                  Nom du projet *
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                  placeholder="Ex: Application mobile e-commerce"
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a365d' }}>
                  Description détaillée *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                  placeholder="Décrivez votre projet, les technologies souhaitées, les fonctionnalités..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a365d' }}>
                    Budget (TJM)
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="">Sélectionnez un budget</option>
                    <option value="5k-10k">300-400 €</option>
                    <option value="10k-25k">400-500 €</option>
                    <option value="25k-50k">500-600 €</option>
                    <option value="50k+">600+ €</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a365d' }}>
                    Délai souhaité
                  </label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="">Sélectionnez un délai</option>
                    <option value="1-3months">1-3 mois</option>
                    <option value="3-6months">3-6 mois</option>
                    <option value="6-12months">6-12 mois</option>
                    <option value="12+months">12+ mois</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a365d' }}>
                  Email de contact *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
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
                🚀 Soumettre mon projet
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer et ScrollToTop */}
      <Footer />
      <ScrollToTop />
    </>
  );
}


