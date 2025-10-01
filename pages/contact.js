// pages/contact.js - CODE CORRECT POUR LA PAGE CONTACT
import Layout from '../components/Layout';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: '', email: '', telephone: '', sujet: '', message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitMessage('✅ Message envoyé avec succès !');
        setFormData({ nom: '', email: '', telephone: '', sujet: '', message: '' });
      } else {
        setSubmitMessage('❌ Erreur lors de l\'envoi. Réessayez.');
      }
    } catch (error) {
      setSubmitMessage('❌ Erreur de connexion.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <Layout 
      title="Contact - SM Consulting"
      description="Contactez-nous pour vos projets de recrutement IT et portage salarial"
      showBackButton={true}
    >
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '700', color: '#1a365d', marginBottom: '20px' }}>
              📞 Contactez-nous
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#4a5568' }}>
              Une question ? Un projet ? Notre équipe est à votre écoute
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '40px'
          }}>
            
            {/* Formulaire de contact */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '40px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px' }}>
                Envoyez-nous un message
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Sujet *
                  </label>
                  <select
                    required
                    value={formData.sujet}
                    onChange={(e) => setFormData({...formData, sujet: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="recrutement">Besoin de recrutement</option>
                    <option value="portage">Portage salarial</option>
                    <option value="candidature">Candidature freelance</option>
                    <option value="partenariat">Partenariat</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Message *
                  </label>
                  <textarea
                    required
                    rows="6"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Décrivez votre projet ou votre besoin..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)',
                    color: 'white',
                    padding: '14px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? '⏳ Envoi en cours...' : '📧 Envoyer le message'}
                </button>
              </form>

              {submitMessage && (
                <div style={{
                  marginTop: '20px',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: submitMessage.includes('✅') ? '#f0fdf4' : '#fef2f2',
                  color: submitMessage.includes('✅') ? '#15803d' : '#dc2626',
                  textAlign: 'center'
                }}>
                  {submitMessage}
                </div>
              )}
            </div>

            {/* Informations de contact */}
            <div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '40px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                marginBottom: '30px'
              }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '24px' }}>
                  📍 Nos Coordonnées
                </h3>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>📧</span>
                    <strong>Email</strong>
                  </div>
                  <p style={{ color: '#4a5568', marginLeft: '32px' }}>
                    <a href="mailto:contact@sm-consulting.fr" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                      contact@sm-consulting.fr
                    </a>
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>📱</span>
                    <strong>Téléphone</strong>
                  </div>
                  <p style={{ color: '#4a5568', marginLeft: '32px' }}>
                    +33 1 23 45 67 89
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>📍</span>
                    <strong>Adresse</strong>
                  </div>
                  <p style={{ color: '#4a5568', marginLeft: '32px', lineHeight: '1.6' }}>
                    123 Avenue des Champs-Élysées<br />
                    75008 Paris, France
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>🕒</span>
                    <strong>Horaires</strong>
                  </div>
                  <p style={{ color: '#4a5568', marginLeft: '32px' }}>
                    Lundi - Vendredi : 9h00 - 18h00
                  </p>
                </div>
              </div>

              {/* Réponse rapide */}
              <div style={{
                backgroundColor: '#fff7ed',
                border: '1px solid #fed7aa',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⚡</div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#ea580c', marginBottom: '8px' }}>
                  Réponse Garantie
                </h4>
                <p style={{ color: '#9a3412', fontSize: '14px' }}>
                  Nous nous engageons à vous répondre sous 2h en jours ouvrés
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}