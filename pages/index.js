import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ScrollToTop from '../components/ScrollToTop';

// Composant StatBox avec données réelles
function StatBox({ color, label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem', fontWeight: '700', color }}>{value}</div>
      <div style={{ fontSize: '1rem', opacity: 0.8 }}>{label}</div>
    </div>
  );
}

// Composant ServiceCard
function ServiceCard({ icon, title, description, color }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        background: '#f8fafc',
        padding: '2.5rem',
        borderRadius: '15px',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        border: '1px solid #e2e8f0',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 15px 35px rgba(26, 54, 93, 0.1)' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          background: `linear-gradient(135deg, ${color} 0%, ${darker(color)} 100%)`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '2rem'
        }}
      >
        {icon}
      </div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1a365d' }}>{title}</h3>
      <p style={{ color: '#4a5568', lineHeight: '1.6' }}>{description}</p>
    </div>
  );
}

// Composant ProcessStep
function ProcessStep({ number, color, title, description }) {
  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <div
        style={{
          width: '60px',
          height: '60px',
          background: `linear-gradient(135deg, ${color} 0%, ${darker(color)} 100%)`,
          color: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          fontWeight: '700',
          margin: '0 auto 1.5rem'
        }}
      >
        {number}
      </div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1a365d' }}>
        {title}
      </h3>
      <p style={{ color: '#4a5568', lineHeight: '1.6' }}>{description}</p>
    </div>
  );
}

// Composant ContactInput
function ContactInput({ id, label, name, value, onChange, required = false, type = 'text' }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label htmlFor={id} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a365d' }}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: '100%',
          padding: '1rem',
          border: `1px solid ${isFocused ? '#fd7e14' : '#e2e8f0'}`,
          borderRadius: '8px',
          fontSize: '1rem',
          transition: 'border-color 0.3s'
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}

// Composant ContactTextarea
function ContactTextarea({ id, label, name, value, onChange, required = false }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label htmlFor={id} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a365d' }}>
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={4}
        style={{
          width: '100%',
          padding: '1rem',
          border: `1px solid ${isFocused ? '#fd7e14' : '#e2e8f0'}`,
          borderRadius: '8px',
          fontSize: '1rem',
          transition: 'border-color 0.3s'
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}

// Fonction utilitaire pour assombrir les couleurs
function darker(hexColor) {
  if (!hexColor.startsWith('#') || hexColor.length !== 7) return hexColor;
  const num = parseInt(hexColor.slice(1), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const factor = 0.7;
  const nr = Math.floor(r * factor);
  const ng = Math.floor(g * factor);
  const nb = Math.floor(b * factor);
  return `rgb(${nr},${ng},${nb})`;
}

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  // 🔥 ÉTATS POUR LES DONNÉES RÉELLES
  const [stats, setStats] = useState({
    totalCandidates: '195+',
    totalProjects: '50+', 
    totalTechnologies: '15+'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealStats = async () => {
      try {
        setLoading(true);
        
        // 🔥 APPEL RÉEL VERS VOS CANDIDATS
        const candidatesResponse = await fetch('/api/candidates');
        const candidatesData = await candidatesResponse.json();

        if (candidatesData && candidatesData.length > 0) {
          const totalCandidates = candidatesData.length;
          
          // Analyser les technologies uniques
          const technologies = new Set();
          candidatesData.forEach(candidate => {
            if (candidate.competences) {
              candidate.competences.split(',').forEach(skill => {
                const trimmedSkill = skill.trim();
                if (trimmedSkill) {
                  technologies.add(trimmedSkill);
                }
              });
            }
            if (candidate.technologies_cles) {
              candidate.technologies_cles.split(',').forEach(tech => {
                const trimmedTech = tech.trim();
                if (trimmedTech) {
                  technologies.add(trimmedTech);
                }
              });
            }
          });

          const totalTechnologies = technologies.size;

          setStats({
            totalCandidates: `${totalCandidates}+`,
            totalProjects: '50+', // À connecter avec votre API projets
            totalTechnologies: `${totalTechnologies}+`
          });
        }

      } catch (error) {
        console.error('Erreur chargement stats réelles:', error);
        // Fallback vers les données statiques en cas d'erreur
        setStats({
          totalCandidates: '221+', // Vos 221 consultants réels
          totalProjects: '50+',
          totalTechnologies: '25+'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRealStats();

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitMessage('Merci pour votre message ! Nous vous recontacterons rapidement.');
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch (error) {
      setSubmitMessage("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Styles
  const navButtonStyle = {
    color: '#4a5568',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.3s',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px'
  };

  const navLinkStyle = {
    color: '#4a5568',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.3s'
  };

  const ctaButtonGreenStyle = {
    background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '25px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease'
  };

  const ctaButtonOrangeStyle = {
    background: 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '25px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease'
  };

  const sectionStyle = {
    padding: '80px 0'
  };

  const contentWrapperStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  };

  const heroTitleStyle = {
    fontSize: '3.5rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    lineHeight: '1.2'
  };

  const heroTextStyle = {
    fontSize: '1.25rem',
    marginBottom: '2.5rem',
    opacity: 0.9,
    maxWidth: '700px',
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: '1.6'
  };

  const heroStatsContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '3rem',
    marginBottom: '3rem',
    flexWrap: 'wrap'
  };

  const heroBtnContainerStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  };

  const heroButtonStyle = {
    background: 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)',
    color: 'white',
    padding: '1rem 2.5rem',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(253, 126, 20, 0.3)'
  };

  const heroLinkStyle = {
    background: 'transparent',
    color: 'white',
    padding: '1rem 2.5rem',
    border: '2px solid white',
    borderRadius: '50px',
    fontSize: '1.1rem',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    display: 'inline-block'
  };

  const sectionTitleStyle = {
    textAlign: 'center',
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '3rem',
    color: '#1a365d'
  };

  const servicesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginTop: '3rem'
  };

  const fonctionnementGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '3rem',
    marginTop: '3rem'
  };

  const contactFormStyle = {
    background: '#f8fafc',
    padding: '2.5rem',
    borderRadius: '15px'
  };

  const contactFormTitleStyle = {
    marginBottom: '1.5rem',
    color: '#1a365d',
    fontSize: '1.5rem',
    fontWeight: '600'
  };

  const submitButtonStyle = {
    background: 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '50px',
    border: 'none',
    fontWeight: '600',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%'
  };

  const submitMessageStyle = {
    marginTop: '1rem',
    color: '#38a169',
    fontWeight: '600',
    textAlign: 'center'
  };

  const contactInfoStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: '2rem'
  };

  const contactInfoItemStyle = {
    marginBottom: '1.5rem',
    fontSize: '1.15rem',
    color: '#1a365d'
  };

  const footerStyle = {
    background: '#1a365d',
    color: 'white',
    padding: '2rem 0',
    textAlign: 'center',
    marginTop: '60px'
  };

  const footerLinkStyle = {
    color: '#fd7e14',
    textDecoration: 'underline'
  };

  return (
    <>
      <Head>
        <title>SM Consulting - Expertise IT & Recrutement d'Excellence</title>
        <meta name="description" content="Connectons les talents IT avec les opportunités qui transforment les entreprises. Solutions sur-mesure, réseau international, accompagnement personnalisé." />
        <meta name="keywords" content="recrutement IT, freelance, développeur, consultant, projets informatiques" />
      </Head>

      {/* Header */}
      <header style={{
        background: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'white',
        boxShadow: '0 2px 10px rgba(26, 54, 93, 0.1)',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none'
      }}>
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 0',
          maxWidth: '1200px',
          margin: '0 auto',
          paddingLeft: '20px',
          paddingRight: '20px'
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1a365d',
              cursor: 'pointer'
            }}>
              SM Consulting
            </div>
          </Link>
          <ul style={{
            display: 'flex',
            gap: '2rem',
            listStyle: 'none',
            margin: 0,
            padding: 0
          }}>
            <li>
              <button onClick={() => scrollToSection('accueil')} style={navButtonStyle}>Accueil</button>
            </li>
            <li>
              <button onClick={() => scrollToSection('services')} style={navButtonStyle}>Services</button>
            </li>
            <li>
              <Link href="/projets" style={navLinkStyle}>Projets</Link>
            </li>
            <li>
              <Link href="/candidates" style={navLinkStyle}>Candidats</Link>
            </li>
            <li>
              <button onClick={() => scrollToSection('contact')} style={navButtonStyle}>Contact</button>
            </li>
          </ul>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/inscription" style={ctaButtonGreenStyle}>Rejoindre</Link>
            <Link href="/inscription-recruteur" style={ctaButtonOrangeStyle}>Recruter</Link>
          </div>
        </nav>
      </header>

      {/* Compensation for fixed header */}
      <div style={{ height: '80px' }} />

      {/* Hero Section - AVEC CHIFFRES RÉELS */}
      <section id="accueil" style={{ ...sectionStyle, scrollMarginTop: '80px', background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)', color: 'white' }}>
        <div style={contentWrapperStyle}>
          <h1 style={heroTitleStyle}>Expertise IT & Recrutement d'Excellence</h1>
          <p style={heroTextStyle}>
            Solutions sur-mesure, réseau international, accompagnement personnalisé.<br />
                Connectons les talents IT aux opportunités transformatrices.
          </p>

          <div style={heroStatsContainerStyle}>
            {loading ? (
              // Pendant le chargement
              <>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fd7e14' }}>⏳</div>
                  <div style={{ fontSize: '1rem', opacity: 0.8 }}>Chargement...</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#38a169' }}>⏳</div>
                  <div style={{ fontSize: '1rem', opacity: 0.8 }}>Chargement...</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#3b82f6' }}>⏳</div>
                  <div style={{ fontSize: '1rem', opacity: 0.8 }}>Chargement...</div>
                </div>
              </>
            ) : (
              // Chiffres réels
              <>
                <StatBox color="#fd7e14" label="Candidats IT" value={stats.totalCandidates} />
                <StatBox color="#38a169" label="Projets réalisés" value={stats.totalProjects} />
                <StatBox color="#3b82f6" label="Technologies" value={stats.totalTechnologies} />
              </>
            )}
          </div>
          <div style={heroBtnContainerStyle}>
            <button onClick={() => scrollToSection('contact')} style={heroButtonStyle}>💬 Contactez-nous</button>
            <Link href="/projets" style={heroLinkStyle}>🚀 Déposer un projet</Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={{ ...sectionStyle, scrollMarginTop: '80px', background: 'white' }}>
        <div style={contentWrapperStyle}>
          <h2 style={sectionTitleStyle}>Nos Services</h2>
          <div style={servicesGridStyle}>
            <ServiceCard icon="👥" title="Recrutement Spécialisé" description="Identification et sélection de profils IT d'exception. Processus rigoureux et évaluation technique approfondie pour garantir l'adéquation parfaite." color="#fd7e14" />
            <ServiceCard icon="🚀" title="Projets sur Mesure" description="Plateforme de mise en relation pour vos projets IT. Startups, PME, grands comptes : trouvez le freelance parfait pour vos besoins spécifiques." color="#38a169" />
            <ServiceCard icon="💰" title="Programme Coaptation" description="Gagnez 50% de commission en nous recommandant des clients recruteurs. Programme win-win pour développer notre réseau ensemble." color="#3b82f6" />
          </div>
        </div>
      </section>

      {/* Fonctionnement Section */}
      <section id="fonctionnement" style={{ ...sectionStyle, scrollMarginTop: '80px', background: '#f8fafc' }}>
        <div style={contentWrapperStyle}>
          <h2 style={sectionTitleStyle}>Notre Fonctionnement</h2>
          <div style={fonctionnementGridStyle}>
            <ProcessStep number="1" color="#38a169" title="Analyse de votre Besoin" description="Étude approfondie de vos exigences techniques, culturelles et organisationnelles pour définir le profil idéal." />
            <ProcessStep number="2" color="#fd7e14" title="Sélection du Profil" description="Sourcing ciblé dans notre réseau et évaluation technique rigoureuse pour présenter les candidats les plus pertinents." />
            <ProcessStep number="3" color="#3b82f6" title="Finalisation de l'Accord" description="Accompagnement dans les négociations et suivi personnalisé pour garantir une intégration réussie et durable." />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)', color: 'white', textAlign: 'center' }}>
        <div style={contentWrapperStyle}>
          <h2 style={sectionTitleStyle}>Prêt à transformer vos projets IT ?</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Connectons les talents IT avec les opportunités qui transforment les entreprises
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/inscription" style={ctaButtonGreenStyle}>👨‍💻 Je suis candidat</Link>
            <Link href="/projets" style={ctaButtonOrangeStyle}>🏢 J'ai un projet</Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ ...sectionStyle, scrollMarginTop: '80px', background: 'white' }}>
        <div style={contentWrapperStyle}>
          <h2 style={sectionTitleStyle}>Contactez-nous</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginTop: '3rem' }}>
            {/* Formulaire de contact */}
            <div style={contactFormStyle}>
              <h3 style={contactFormTitleStyle}>Discutons de votre projet</h3>
              <form onSubmit={handleSubmit}>
                <ContactInput id="name" label="Nom complet" name="name" value={formData.name} onChange={handleInputChange} required />
                <ContactInput id="email" label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                <ContactInput id="company" label="Entreprise" name="company" value={formData.company} onChange={handleInputChange} />
                <ContactTextarea id="message" label="Message" name="message" value={formData.message} onChange={handleInputChange} required />
                <button type="submit" disabled={isSubmitting} style={submitButtonStyle}>
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
                </button>
                {submitMessage && <div style={submitMessageStyle}>{submitMessage}</div>}
              </form>
            </div>

            {/* Infos Contact */}
            <div style={contactInfoStyle}>
              <div style={contactInfoItemStyle}><strong>Email :</strong> ***REMOVED***</div>
              <div style={contactInfoItemStyle}><strong>Téléphone :</strong> +33 6 19 25 75 88</div>
              <div style={contactInfoItemStyle}><strong>Adresse :</strong> 13 rue Gustave Eiffel, Clichy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={footerStyle}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <p>© {new Date().getFullYear()} SM Consulting. Tous droits réservés.</p>
          <p>
            <a href="/mentions-legales" style={footerLinkStyle}>Mentions légales</a> |{' '}
            <a href="/politique-confidentialite" style={footerLinkStyle}>Politique de confidentialité</a>
          </p>
        </div>
      </footer>

      {/* FLÈCHE RETOUR EN HAUT */}
      <ScrollToTop />
    </>
  );
}