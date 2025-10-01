// pages/recruteurs.js
import Layout from '../components/Layout';
import { useState } from 'react';

export default function Recruteurs() {
  const [showForm, setShowForm] = useState(false);

  return (
    <Layout 
      title="Espace Recruteurs - SM Consulting"
      description="Déposez vos besoins de recrutement IT et accédez à notre base de talents"
      showBackButton={true}
    >
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            🏢 Espace Recruteurs
          </h1>
          
          <p style={{ fontSize: '1.4rem', marginBottom: '2rem', opacity: '0.9' }}>
            Accédez aux meilleurs talents IT pour vos projets
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', marginBottom: '3rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fd7e14' }}>195+</div>
              <div style={{ fontSize: '1rem', opacity: '0.8' }}>Freelances actifs</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#38a169' }}>48h</div>
              <div style={{ fontSize: '1rem', opacity: '0.8' }}>Délai de réponse</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#3b82f6' }}>87%</div>
              <div style={{ fontSize: '1rem', opacity: '0.8' }}>Taux de satisfaction</div>
            </div>
          </div>

          <button
            onClick={() => setShowForm(true)}
            style={{
              background: 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)',
              color: 'white',
              padding: '16px 32px',
              border: 'none',
              borderRadius: '30px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(253, 126, 20, 0.3)'
            }}
          >
            🚀 Déposer un besoin
          </button>
        </div>
      </div>

      {/* Benefits Section */}
      <div style={{ padding: '80px 20px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', textAlign: 'center', marginBottom: '60px' }}>
            Pourquoi choisir SM Consulting ?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px'
          }}>
            {[
              {
                icon: '🎯',
                title: 'Sourcing Ciblé',
                description: 'Identification précise des profils correspondant exactement à vos besoins techniques et culturels.'
              },
              {
                icon: '⚡',
                title: 'Réactivité Garantie',
                description: 'Réponse sous 48h et présentation des premiers profils sous 5 jours ouvrés.'
              },
              {
                icon: '🔍',
                title: 'Évaluation Approfondie',
                description: 'Tests techniques, entretiens comportementaux et validation des références systématique.'
              },
              {
                icon: '🤝',
                title: 'Accompagnement Complet',
                description: 'Support durant tout le processus, de la définition du besoin à l\'intégration du candidat.'
              },
              {
                icon: '💼',
                title: 'Réseau Qualifié',
                description: 'Base de 195+ freelances experts dans toutes les technologies IT modernes.'
              },
              {
                icon: '📊',
                title: 'Reporting Transparent',
                description: 'Dashboard en temps réel avec suivi des candidatures et métriques détaillées.'
              }
            ].map((benefit, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '32px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>
                  {benefit.icon}
                </div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: '#1a365d',
                  marginBottom: '16px'
                }}>
                  {benefit.title}
                </h3>
                <p style={{
                  color: '#4a5568',
                  lineHeight: '1.6',
                  fontSize: '15px'
                }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div style={{ padding: '80px 20px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '60px' }}>
            Notre Processus de Recrutement
          </h2>

          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '40px' }}>
            {[
              { step: '1', title: 'Analyse du Besoin', desc: 'Définition précise du profil recherché' },
              { step: '2', title: 'Sourcing Actif', desc: 'Recherche et identification des talents' },
              { step: '3', title: 'Présélection', desc: 'Évaluation technique et comportementale' },
              { step: '4', title: 'Présentation', desc: 'Shortlist de 3-5 candidats qualifiés' }
            ].map((item, index) => (
              <div key={index} style={{ maxWidth: '200px', textAlign: 'center' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#fd7e14',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 auto 20px'
                }}>
                  {item.step}
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>
                  {item.title}
                </h4>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Form (réutiliser le formulaire d'inscription existant) */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px' }}>
              Déposer un Besoin de Recrutement
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
              Notre équipe vous recontactera sous 48h pour affiner votre besoin.
            </p>
            
            {/* Ici, intégrer le formulaire d'inscription recruteur existant */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={() => {
                  // Rediriger vers l'API inscription-recruteur
                  window.location.href = '/api/inscription-recruteur-form';
                }}
                style={{
                  background: '#fd7e14',
                  color: 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginRight: '12px'
                }}
              >
                Envoyer
              </button>
              
              <button
                onClick={() => setShowForm(false)}
                style={{
                  background: '#e5e7eb',
                  color: '#374151',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}