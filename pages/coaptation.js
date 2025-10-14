import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

export default function Coaptation() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/coaptation/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prenom: formData.name.split(' ')[0] || formData.name,
          nom: formData.name.split(' ').slice(1).join(' ') || formData.name,
          email: formData.email,
          telephone: formData.phone,
          entreprise_actuelle: formData.company,
          message: formData.message
        })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setMessage('Merci ! Nous vous recontacterons sous 24h pour activer votre compte coaptation.');
        setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      } else {
        setSuccess(false);
        setMessage(result.error || "Erreur lors de l'envoi. Veuillez réessayer.");
      }
    } catch (error) {
      setSuccess(false);
      setMessage('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Programme Coaptation - SM Consulting</title>
        <meta name="description" content="Gagnez jusqu'à 36k€ par an en recommandant des clients recruteurs. Programme de cooptation win-win." />
      </Head>

      {/* Header */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1a365d', margin: 0 }}>SM Consulting</h1>
          </Link>
          <nav style={{ display: 'flex', gap: '24px' }}>
            <Link href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Accueil</Link>
            <Link href="/candidates" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Candidats</Link>
            <Link href="/projets" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Projets</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '20px' }}>
            💰 Programme Coaptation
          </h1>
          <p style={{ fontSize: '1.3rem', opacity: 0.9, lineHeight: '1.6' }}>
            Gagnez <strong>50% de commission</strong> en nous recommandant des clients recruteurs.<br />
            <strong>30/60/90 jours</strong> selon le client - Processus 100% transparent.
          </p>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section style={{ padding: '80px 20px', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', color: '#1a365d', marginBottom: '60px' }}>
            🎯 Comment ça marche ?
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>👥</div>
              <h3 style={{ color: '#1a365d', marginBottom: '15px' }}>1. Recommandez</h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Partagez nos services à vos contacts recruteurs, anciens employeurs ou partenaires.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '30px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🤝</div>
              <h3 style={{ color: '#1a365d', marginBottom: '15px' }}>2. Nous intervenons</h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Nous gérons tout le processus de recrutement et la relation client.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '30px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💸</div>
              <h3 style={{ color: '#1a365d', marginBottom: '15px' }}>3. Vous gagnez</h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Recevez <strong>50% de la commission</strong> dès que le consultant commence sa mission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section style={{ padding: '80px 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', color: '#1a365d', marginBottom: '60px' }}>
            🗣️ Ils ont déjà gagné
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
            {/* Témoignage 1 */}
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '15px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #fd7e14'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>👩‍💻</div>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: '1.6',
                color: '#4b5563',
                fontStyle: 'italic',
                marginBottom: '20px'
              }}>
                "J'ai recommandé <strong>3 clients cette année</strong> et j'ai déjà touché plus de <strong>21k€ de commission</strong>. Le processus est ultra-transparent !"
              </p>
              <div style={{ fontWeight: '600', color: '#1a365d' }}>
                — Sophie, Développeuse Full Stack
              </div>
            </div>

            {/* Témoignage 2 */}
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '15px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #3b82f6'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>👨‍💼</div>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: '1.6',
                color: '#4b5563',
                fontStyle: 'italic',
                marginBottom: '20px'
              }}>
                "Mon ancien employeur avait besoin d'un Data Scientist. SM Consulting a trouvé le profil parfait, <strong>j'ai touché 12k€</strong> !"
              </p>
              <div style={{ fontWeight: '600', color: '#1a365d' }}>
                — Thomas, DevOps Engineer
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Calcul des Gains */}
      <section style={{ padding: '80px 20px', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', color: '#1a365d', marginBottom: '60px' }}>
            📊 Exemples concrets
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {/* Exemple 1 */}
            <div style={{
              background: 'linear-gradient(135deg, #fef3c7, #fbbf24)',
              padding: '30px',
              borderRadius: '15px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#1a365d', marginBottom: '15px' }}>🚀 Startup Fintech</h3>
              <p style={{ color: '#4b5563', marginBottom: '15px' }}><strong>50 employés</strong></p>
              <p style={{ color: '#4b5563', marginBottom: '10px' }}>Besoin : 2 développeurs React + 1 DevOps Engineer</p>
              <div style={{
                background: 'white',
                padding: '15px',
                borderRadius: '10px',
                marginTop: '15px'
              }}>
                <p style={{ margin: '5px 0', color: '#1a365d' }}><strong>Commission totale: 48k€</strong></p>
                <p style={{ margin: '5px 0', color: '#dc2626', fontSize: '1.2rem' }}><strong>Votre part (50%): 24k€</strong></p>
              </div>
            </div>

            {/* Exemple 2 */}
            <div style={{
              background: 'linear-gradient(135deg, #c7d2fe, #6366f1)',
              padding: '30px',
              borderRadius: '15px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#1a365d', marginBottom: '15px' }}>🏢 PME E-commerce</h3>
              <p style={{ color: '#4b5563', marginBottom: '15px' }}><strong>150 employés</strong></p>
              <p style={{ color: '#4b5563', marginBottom: '10px' }}>Besoin : 1 Architecte Solution + 1 Data Engineer</p>
              <div style={{
                background: 'white',
                padding: '15px',
                borderRadius: '10px',
                marginTop: '15px'
              }}>
                <p style={{ margin: '5px 0', color: '#1a365d' }}><strong>Commission totale: 12k€</strong></p>
                <p style={{ margin: '5px 0', color: '#dc2626', fontSize: '1.2rem' }}><strong>Votre part (50%): 6k€</strong></p>
              </div>
            </div>

            {/* Exemple 3 */}
            <div style={{
              background: 'linear-gradient(135deg, #bbf7d0, #22c55e)',
              padding: '30px',
              borderRadius: '15px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#1a365d', marginBottom: '15px' }}>🏛️ Grand Groupe</h3>
              <p style={{ color: '#4b5563', marginBottom: '15px' }}><strong>5000+ employés</strong></p>
              <p style={{ color: '#4b5563', marginBottom: '10px' }}>Besoin : Équipe complète de 8 développeurs</p>
              <div style={{
                background: 'white',
                padding: '15px',
                borderRadius: '10px',
                marginTop: '15px'
              }}>
                <p style={{ margin: '5px 0', color: '#1a365d' }}><strong>Commission totale: 115.2k€</strong></p>
                <p style={{ margin: '5px 0', color: '#dc2626', fontSize: '1.2rem' }}><strong>Votre part (50%): 57.6k€</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Calcul Gains Potentiels */}
      <section style={{ padding: '80px 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#1a365d', marginBottom: '40px' }}>
            🧮 Calculez vos gains potentiels
          </h2>

          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '15px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
            marginBottom: '40px'
          }}>
            <p style={{ fontSize: '1.2rem', color: '#4b5563', marginBottom: '30px' }}>
              <strong>Commission moyenne par recrutement : 12k€</strong> • <strong>Votre part : 6k€</strong>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
              <div style={{ textAlign: 'center', padding: '20px', background: '#f0fdf4', borderRadius: '10px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#16a34a' }}>1 client</div>
                <div style={{ fontSize: '1.2rem', color: '#1a365d' }}>= 7.2k€/an</div>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: '#fef3c7', borderRadius: '10px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#d97706' }}>3 clients</div>
                <div style={{ fontSize: '1.2rem', color: '#1a365d' }}>= 21.6k€/an</div>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: '#c7d2fe', borderRadius: '10px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3730a3' }}>5 clients</div>
                <div style={{ fontSize: '1.2rem', color: '#1a365d' }}>= 36k€/an</div>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: '#fecaca', borderRadius: '10px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#dc2626' }}>10 clients</div>
                <div style={{ fontSize: '1.2rem', color: '#1a365d' }}>= 60k€/an</div>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '1.1rem', color: '#6b7280', lineHeight: '1.6' }}>
            💡 <strong>Calcul basé sur :</strong> Commission moyenne de 600€ par mois par recrutement × 12 mois = 7.2k€/an par client
          </p>
        </div>
      </section>

      {/* Formulaire d'inscription */}
      <section style={{ padding: '80px 20px', background: 'white' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
            color: 'white',
            padding: '50px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>🚀 Devenez Coaptant</h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '40px' }}>
              Rejoignez notre programme et commencez à générer des revenus passifs dès maintenant.
            </p>

            {/* Message de statut */}
            {message && (
              <div style={{
                background: success ? '#f0fdf4' : '#fef2f2',
                color: success ? '#166534' : '#dc2626',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                border: '1px solid ' + (success ? '#bbf7d0' : '#fecaca')
              }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Votre nom complet"
                  required
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    opacity: loading ? 0.7 : 1
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Votre email"
                  required
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    opacity: loading ? 0.7 : 1
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Votre téléphone"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    opacity: loading ? 0.7 : 1
                  }}
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Votre entreprise actuelle (optionnel)"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    opacity: loading ? 0.7 : 1
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)',
                  color: 'white',
                  padding: '18px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: loading ? 0.7 : 1
                }}
                onMouseOver={(e) => { if (!loading) e.target.style.transform = 'translateY(-2px)' }}
                onMouseOut={(e) => { if (!loading) e.target.style.transform = 'translateY(0)' }}
              >
                {loading ? '⏳ Envoi en cours...' : '💰 Devenir Coaptant'}
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
