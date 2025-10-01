// pages/services.js
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Services() {
  const services = [
    {
      icon: '🎯',
      title: 'Recrutement IT Spécialisé',
      description: 'Identification et sélection des meilleurs talents IT pour vos projets.',
      features: ['Sourcing ciblé', 'Évaluation technique', 'Matching précis', 'Suivi personnalisé']
    },
    {
      icon: '💼',
      title: 'Portage Salarial',
      description: 'Solution clé en main pour vos missions freelance en toute sérénité.',
      features: ['Gestion administrative', 'Protection sociale', 'Accompagnement juridique', 'Facturation']
    },
    {
      icon: '🤝',
      title: 'Conseil RH IT',
      description: 'Accompagnement stratégique pour vos enjeux RH dans le secteur IT.',
      features: ['Audit RH', 'Stratégie de recrutement', 'Formation équipes', 'Transformation digitale']
    },
    {
      icon: '🚀',
      title: 'Coaptation & Recommandation',
      description: 'Programme de recommandation pour étendre votre réseau professionnel.',
      features: ['Réseau qualifié', 'Primes attractives', 'Process simplifié', 'Suivi transparent']
    }
  ];

  return (
    <Layout 
      title="Nos Services - SM Consulting"
      description="Services de recrutement IT, portage salarial et conseil RH spécialisé"
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
          <div style={{
            display: 'inline-block',
            backgroundColor: 'rgba(253, 126, 20, 0.2)',
            padding: '8px 20px',
            borderRadius: '25px',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            🔧 NOS SERVICES
          </div>
          
          <h1 style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            Expertise IT & Solutions RH
          </h1>
          
          <p style={{ fontSize: '1.4rem', marginBottom: '2rem', opacity: '0.9' }}>
            Des services sur-mesure pour accompagner votre croissance
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div style={{ padding: '80px 20px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px'
          }}>
            {services.map((service, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: '40px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e5e7eb',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>
                  {service.icon}
                </div>
                
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1a365d',
                  marginBottom: '16px'
                }}>
                  {service.title}
                </h3>
                
                <p style={{
                  color: '#4a5568',
                  lineHeight: '1.6',
                  marginBottom: '24px',
                  fontSize: '16px'
                }}>
                  {service.description}
                </p>
                
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {service.features.map((feature, idx) => (
                    <li key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                      color: '#374151',
                      fontSize: '14px'
                    }}>
                      <span style={{ color: '#22c55e' }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ padding: '80px 20px', backgroundColor: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1a365d', marginBottom: '20px' }}>
            Prêt à accélérer vos projets IT ?
          </h2>
          
          <p style={{ fontSize: '1.2rem', color: '#4a5568', marginBottom: '40px' }}>
            Discutons de vos besoins et trouvons ensemble les meilleures solutions
          </p>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" style={{
              background: 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '30px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(253, 126, 20, 0.3)'
            }}>
              📞 Nous Contacter
            </Link>
            
            <Link href="/projets" style={{
              backgroundColor: 'transparent',
              color: '#1a365d',
              padding: '16px 32px',
              borderRadius: '30px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              border: '2px solid #1a365d'
            }}>
              💼 Voir les Projets
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}