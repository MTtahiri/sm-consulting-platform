// pages/portage-salarial.js - Page complète portage salarial
import { useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Composant Simulation Calculator
const SimulationCalculator = () => {
  const [tjm, setTjm] = useState(500);
  const [days, setDays] = useState(20);
  const [formula, setFormula] = useState('premium');

  const calculateRevenue = useCallback(() => {
    const commissionRate = formula === 'premium' ? 0.06 : 0.08;
    const monthlyRevenue = tjm * days;
    const commission = monthlyRevenue * commissionRate;
    const netRevenue = monthlyRevenue - commission;
    
    return {
      monthlyRevenue,
      commission,
      netRevenue,
      dailyNet: netRevenue / days
    };
  }, [tjm, days, formula]);

  const results = calculateRevenue();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
      <div>
        <h3 style={{ color: '#1a365d', marginBottom: '30px', fontSize: '1.5rem' }}>Paramètres de simulation</h3>
        
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151' }}>
            TJM (Taux Journalier Moyen)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <input
              type="range"
              min="300"
              max="1000"
              step="50"
              value={tjm}
              onChange={(e) => setTjm(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ fontWeight: '700', color: '#fd7e14', minWidth: '80px' }}>{tjm}€</span>
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151' }}>
            Jours travaillés par mois
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <input
              type="range"
              min="10"
              max="22"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ fontWeight: '700', color: '#fd7e14', minWidth: '50px' }}>{days}j</span>
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151' }}>
            Formule choisie
          </label>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={() => setFormula('premium')}
              style={{
                flex: 1,
                padding: '15px',
                border: formula === 'premium' ? '2px solid #22c55e' : '2px solid #e5e7eb',
                borderRadius: '12px',
                backgroundColor: formula === 'premium' ? '#f0fdf4' : 'white',
                color: formula === 'premium' ? '#22c55e' : '#374151',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Premium (6%)
            </button>
            <button
              onClick={() => setFormula('standard')}
              style={{
                flex: 1,
                padding: '15px',
                border: formula === 'standard' ? '2px solid #fd7e14' : '2px solid #e5e7eb',
                borderRadius: '12px',
                backgroundColor: formula === 'standard' ? '#fff7ed' : 'white',
                color: formula === 'standard' ? '#fd7e14' : '#374151',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Standard (8%)
            </button>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '30px' }}>
        <h3 style={{ color: '#1a365d', marginBottom: '25px', fontSize: '1.5rem' }}>Résultats de simulation</h3>
        
        <div style={{ display: 'grid', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: 'white', borderRadius: '10px' }}>
            <span style={{ color: '#6b7280' }}>Chiffre d'affaires mensuel</span>
            <span style={{ fontWeight: '700', color: '#1a365d' }}>{results.monthlyRevenue.toLocaleString()}€</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: 'white', borderRadius: '10px' }}>
            <span style={{ color: '#6b7280' }}>Commission SM Consulting</span>
            <span style={{ fontWeight: '700', color: '#ef4444' }}>-{results.commission.toLocaleString()}€</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#22c55e', borderRadius: '10px' }}>
            <span style={{ color: 'white', fontWeight: '600' }}>Revenu net mensuel</span>
            <span style={{ fontWeight: '800', color: 'white', fontSize: '1.2rem' }}>{results.netRevenue.toLocaleString()}€</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '10px' }}>
            <span style={{ color: '#1e40af' }}>TJ Net après commission</span>
            <span style={{ fontWeight: '700', color: '#1e40af' }}>{results.dailyNet.toFixed(0)}€</span>
          </div>
        </div>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fffbeb', borderRadius: '10px', border: '1px solid #fcd34d' }}>
          <p style={{ color: '#92400e', fontSize: '14px', margin: 0 }}>
            💡 <strong>Estimation basée sur {days} jours/mois.</strong> Votre salaire net réel dépendra de votre situation fiscale et des charges sociales.
          </p>
        </div>
      </div>
    </div>
  );
};

export default function PortageSalarial() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [selectedSection, setSelectedSection] = useState('avantages');
  
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentStatus: '',
    experience: '',
    skills: '',
    tjm: '',
    availability: '',
    projectType: '',
    message: ''
  });

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Validation améliorée
      const errors = [];
      if (!contactForm.firstName.trim()) errors.push('Le prénom est requis');
      if (!contactForm.lastName.trim()) errors.push('Le nom est requis');
      if (!contactForm.email.trim()) errors.push('L\'email est requis');
      if (contactForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
        errors.push('Format d\'email invalide');
      }

      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSubmitMessage('✅ Votre demande a été envoyée avec succès ! Nous vous recontacterons sous 24h.');
      
      // Reset form
      setContactForm({
        firstName: '', lastName: '', email: '', phone: '',
        currentStatus: '', experience: '', skills: '', tjm: '',
        availability: '', projectType: '', message: ''
      });
      
      setTimeout(() => {
        setShowForm(false);
        setSubmitMessage('');
      }, 4000);

    } catch (error) {
      setSubmitMessage(`❌ ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Données FAQ complétées
  const faqData = [
    {
      question: 'Quelle est la différence avec une SASU ?',
      answer: 'En portage salarial, vous gardez votre statut de salarié avec tous les avantages sociaux (chômage, retraite, mutuelle). Pas de création d\'entreprise, pas de comptabilité, pas de TVA à gérer. En SASU, vous êtes dirigeant et devez gérer tous les aspects administratifs et fiscaux.'
    },
    {
      question: 'Comment fonctionne la rémunération ?',
      answer: 'Vous facturez vos prestations via SM Consulting. Une fois le paiement reçu, nous déduisons notre commission et les charges sociales, puis vous versons votre salaire sous 24h. Vous recevez un bulletin de salaire détaillé chaque mois.'
    },
    {
      question: 'Puis-je garder mes clients actuels ?',
      answer: 'Oui, absolument ! Vous pouvez continuer à travailler avec vos clients existants. Nous nous occupons de la contractualisation et de la facturation. Nous pouvons également vous aider à négocier de meilleures conditions.'
    },
    {
      question: 'Quelle est la durée d\'engagement ?',
      answer: 'Aucune durée d\'engagement n\'est requise. Le contrat de travail est conclu pour la durée de la mission. Vous êtes libre de partir à tout moment, dans le respect des préavis légaux.'
    },
    {
      question: 'Comment sont gérées les congés payés ?',
      answer: 'Vous accumulez des congés payés comme tout salarié (2.5 jours par mois). Vous pouvez les poser en accord avec votre client. Ils sont rémunérés et inclus dans votre salaire.'
    },
    {
      question: 'Quelle assurance professionnelle est incluse ?',
      answer: 'Nous fournissons une assurance RC Pro (Responsabilité Civile Professionnelle) complète, ainsi qu\'une assurance perte d\'exploitation. Ces assurances sont incluses dans nos formules.'
    },
    {
      question: 'Puis-je travailler à l\'étranger ?',
      answer: 'Oui, sous certaines conditions. Pour les missions de moins de 3 mois dans l\'UE, c\'est généralement possible. Pour les séjours plus longs ou hors UE, nous étudions au cas par cas les implications fiscales et sociales.'
    },
    {
      question: 'Comment se passe la facturation ?',
      answer: 'Nous établissons les factures pour vous et les envoyons à vos clients. Nous effectuons le suivi des paiements et les relances si nécessaire. Vous avez accès à un espace client pour suivre l\'état de vos factures.'
    }
  ];

  return (
    <>
      <Head>
        <title>Portage Salarial IT - SM Consulting</title>
        <meta name="description" content="Portage salarial pour freelances IT : sécurité, simplicité et accompagnement personnalisé" />
        <meta name="keywords" content="portage salarial, freelance IT, consultant, développeur" />
      </Head>

      {/* Header */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1a365d', margin: 0 }}>
                SM Consulting
              </h1>
            </Link>

            <nav style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Link href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                🏠 Accueil
              </Link>
              <Link href="/projets" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                💼 Projets
              </Link>
              <Link href="/candidates" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                👥 Candidats
              </Link>
              <Link href="/dashboard" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                📊 Dashboard
              </Link>
            </nav>

            <button
              onClick={() => setShowForm(true)}
              style={{
                background: 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '25px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '15px',
                boxShadow: '0 4px 12px rgba(253, 126, 20, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(253, 126, 20, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(253, 126, 20, 0.3)';
              }}
            >
              📞 Contact Portage
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
        color: 'white',
        padding: '100px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: 'rgba(253, 126, 20, 0.2)',
            padding: '10px 24px',
            borderRadius: '25px',
            marginBottom: '24px',
            fontSize: '15px',
            fontWeight: '600'
          }}>
            💼 PORTAGE SALARIAL IT
          </div>

          <h1 style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '2rem', lineHeight: '1.1' }}>
            Freelance IT en toute <span style={{ color: '#fd7e14' }}>sérénité</span>
          </h1>
          
          <p style={{ fontSize: '1.5rem', marginBottom: '3rem', opacity: '0.9', maxWidth: '900px', margin: '0 auto 3rem' }}>
            Concentrez-vous sur vos missions pendant que nous gérons l'administratif, les contrats et les paiements
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: '#fd7e14' }}>0%</div>
              <div style={{ fontSize: '1rem', opacity: '0.8' }}>Frais cachés</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: '#22c55e' }}>24h</div>
              <div style={{ fontSize: '1rem', opacity: '0.8' }}>Paiement garanti</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: '#3b82f6' }}>100%</div>
              <div style={{ fontSize: '1rem', opacity: '0.8' }}>Accompagnement</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: '#8b5cf6' }}>195+</div>
              <div style={{ fontSize: '1rem', opacity: '0.8' }}>Freelances portés</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowForm(true)}
              style={{
                background: 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)',
                color: 'white',
                padding: '18px 36px',
                border: 'none',
                borderRadius: '30px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '18px',
                boxShadow: '0 8px 20px rgba(253, 126, 20, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 12px 25px rgba(253, 126, 20, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 20px rgba(253, 126, 20, 0.4)';
              }}
            >
              🚀 Devenir freelance porté
            </button>
            <button
              onClick={() => setSelectedSection('simulation')}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                padding: '18px 36px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '30px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '18px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
            >
              📊 Simuler mon salaire
            </button>
          </div>
        </div>

        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(253, 126, 20, 0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }}></div>
      </section>

      {/* Navigation sections */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '20px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { key: 'avantages', label: '✨ Avantages', icon: '⭐' },
              { key: 'simulation', label: '📊 Simulation', icon: '💰' },
              { key: 'process', label: '🚀 Processus', icon: '📋' },
              { key: 'tarifs', label: '💳 Tarifs', icon: '💶' },
              { key: 'faq', label: '❓ FAQ', icon: '🤔' }
            ].map((section) => (
              <button
                key={section.key}
                onClick={() => setSelectedSection(section.key)}
                style={{
                  background: selectedSection === section.key ? 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)' : 'transparent',
                  color: selectedSection === section.key ? 'white' : '#6b7280',
                  padding: '12px 24px',
                  border: selectedSection === section.key ? 'none' : '2px solid #e5e7eb',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedSection === section.key ? '0 4px 12px rgba(253, 126, 20, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (selectedSection !== section.key) {
                    e.target.style.background = '#f8fafc';
                    e.target.style.color = '#374151';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedSection !== section.key) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#6b7280';
                  }
                }}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Formulaire de contact popup */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowForm(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>

            <h2 style={{ color: '#1a365d', marginBottom: '30px', fontSize: '2rem' }}>
              📞 Contact Portage Salarial
            </h2>

            {submitMessage && (
              <div style={{
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                backgroundColor: submitMessage.includes('✅') ? '#d4edda' : '#f8d7da',
                color: submitMessage.includes('✅') ? '#155724' : '#721c24',
                border: `1px solid ${submitMessage.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`
              }}>
                {submitMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label htmlFor="firstName" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    Prénom *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={contactForm.firstName}
                    onChange={handleFormChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    placeholder="Votre prénom"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    Nom *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={contactForm.lastName}
                    onChange={handleFormChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleFormChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    Téléphone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    placeholder="01 23 45 67 89"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label htmlFor="currentStatus" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    Statut actuel
                  </label>
                  <select
                    id="currentStatus"
                    name="currentStatus"
                    value={contactForm.currentStatus}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Sélectionner</option>
                    <option value="Salarié">Salarié</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Demandeur d'emploi">Demandeur d'emploi</option>
                    <option value="Étudiant">Étudiant</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="experience" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    Expérience
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={contactForm.experience}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Sélectionner</option>
                    <option value="moins de 2 ans">moins de 2 ans</option>
                    <option value="2-5 ans">2-5 ans</option>
                    <option value="5-10 ans">5-10 ans</option>
                    <option value="plus de 10 ans">plus de 10 ans</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="skills" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                  Compétences principales
                </label>
                <input
                  id="skills"
                  type="text"
                  name="skills"
                  value={contactForm.skills}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="Ex: React, Node.js, Python, DevOps..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <div>
                  <label htmlFor="tjm" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    TJM souhaité
                  </label>
                  <select
                    id="tjm"
                    name="tjm"
                    value={contactForm.tjm}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Sélectionner</option>
                    <option value="300-400€">300-400€</option>
                    <option value="400-500€">400-500€</option>
                    <option value="500-600€">500-600€</option>
                    <option value="600-800€">600-800€</option>
                    <option value="plus de 800€">plus de 800€</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="availability" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    Disponibilité
                  </label>
                  <select
                    id="availability"
                    name="availability"
                    value={contactForm.availability}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Sélectionner</option>
                    <option value="Immédiate">Immédiate</option>
                    <option value="1 mois">Dans 1 mois</option>
                    <option value="2-3 mois">Dans 2-3 mois</option>
                    <option value="À définir">À définir</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="projectType" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    Type de mission
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={contactForm.projectType}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Sélectionner</option>
                    <option value="Développement Web">Développement Web</option>
                    <option value="Développement Mobile">Développement Mobile</option>
                    <option value="DevOps/Cloud">DevOps/Cloud</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Cybersécurité">Cybersécurité</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                  Message (optionnel)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={contactForm.message}
                  onChange={handleFormChange}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                  placeholder="Dites-nous en plus sur vos attentes, projets ou questions..."
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: '12px 24px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: '#374151',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '12px 32px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)',
                    color: 'white',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? '🔄 Envoi...' : '📞 Envoyer ma demande'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        
        {/* Section Avantages */}
        {selectedSection === 'avantages' && (
          <section>
            <h2 style={{ textAlign: 'center', fontSize: '3rem', fontWeight: '800', color: '#1a365d', marginBottom: '60px' }}>
              ✨ Pourquoi choisir le portage salarial ?
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', marginBottom: '80px' }}>
              {[
                {
                  icon: '🛡️',
                  title: 'Sécurité du salariat',
                  description: 'Contrat de travail, congés payés, mutuelle, prévoyance, chômage et retraite. Tous les avantages du statut salarié.'
                },
                {
                  icon: '⚡',
                  title: 'Simplicité administrative',
                  description: 'Plus de paperasse ! Nous gérons facturation, relances, contrats, déclarations fiscales et sociales.'
                },
                {
                  icon: '💰',
                  title: 'Rémunération optimisée',
                  description: 'Jusqu\'à 85% de votre CA net après frais. Paiement sous 24h après réception des fonds.'
                },
                {
                  icon: '🌍',
                  title: 'Flexibilité totale',
                  description: 'Travaillez où vous voulez, avec les clients de votre choix. Aucune exclusivité requise.'
                },
                {
                  icon: '🚀',
                  title: 'Accompagnement personnalisé',
                  description: 'Un expert dédié, aide à la négociation, support juridique et conseil en développement business.'
                },
                {
                  icon: '📈',
                  title: 'Développement business',
                  description: 'Accès à notre réseau de clients, propositions de missions qualifiées et aide à la valorisation de votre profil.'
                }
              ].map((avantage, index) => (
                <div key={index} style={{
                  backgroundColor: 'white',
                  padding: '40px 30px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #f1f5f9',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{avantage.icon}</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a365d', marginBottom: '15px' }}>
                    {avantage.title}
                  </h3>
                  <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                    {avantage.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section Simulation */}
        {selectedSection === 'simulation' && (
          <section>
            <h2 style={{ textAlign: 'center', fontSize: '3rem', fontWeight: '800', color: '#1a365d', marginBottom: '20px' }}>
              📊 Simulateur de revenus
            </h2>
            <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#6b7280', marginBottom: '60px', maxWidth: '600px', margin: '0 auto 60px' }}>
              Estimez vos revenus nets en fonction de votre TJM et du nombre de jours travaillés
            </p>
            
            <SimulationCalculator />
          </section>
        )}

        {/* Section Processus */}
        {selectedSection === 'process' && (
          <section>
            <h2 style={{ textAlign: 'center', fontSize: '3rem', fontWeight: '800', color: '#1a365d', marginBottom: '60px' }}>
              🚀 Comment ça marche ?
            </h2>
            
            <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '1.2rem' }}>
              <p>Processus simplifié en 5 étapes</p>
            </div>
          </section>
        )}

        {/* Section Tarifs */}
        {selectedSection === 'tarifs' && (
          <section>
            <h2 style={{ textAlign: 'center', fontSize: '3rem', fontWeight: '800', color: '#1a365d', marginBottom: '20px' }}>
              💳 Nos formules de portage
            </h2>
            <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#6b7280', marginBottom: '60px', maxWidth: '600px', margin: '0 auto 60px' }}>
              Des formules transparentes, sans engagement et adaptées à tous les niveaux de chiffre d'affaires
            </p>
            
            <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '1.2rem' }}>
              <p>Formules Standard (8%) et Premium (6%)</p>
            </div>
          </section>
        )}

        {/* Section FAQ */}
        {selectedSection === 'faq' && (
          <section>
            <h2 style={{ textAlign: 'center', fontSize: '3rem', fontWeight: '800', color: '#1a365d', marginBottom: '60px' }}>
              ❓ Questions fréquentes
            </h2>
            
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              {faqData.map((faq, index) => (
                <div key={index} style={{
                  backgroundColor: 'white',
                  marginBottom: '20px',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden'
                }}>
                  <details style={{ padding: '0' }}>
                    <summary style={{
                      padding: '25px 30px',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      color: '#1a365d',
                      cursor: 'pointer',
                      listStyle: 'none',
                      backgroundColor: '#f8fafc'
                    }}>
                      {faq.question}
                      <span style={{
                        float: 'right',
                        fontSize: '1.5rem',
                        color: '#fd7e14'
                      }}>+</span>
                    </summary>
                    <div style={{
                      padding: '30px',
                      borderTop: '1px solid #e5e7eb',
                      color: '#6b7280',
                      lineHeight: '1.6',
                      backgroundColor: 'white'
                    }}>
                      {faq.answer}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1a365d', color: 'white', padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px' }}>SM Consulting</h3>
              <p style={{ color: '#cbd5e0', lineHeight: '1.6' }}>
                Spécialiste du portage salarial IT depuis 2015. Plus de 195 freelances accompagnés vers la réussite.
              </p>
            </div>
            
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '20px' }}>Liens rapides</h4>
              <ul style={{ listStyle: 'none', padding: 0, color: '#cbd5e0' }}>
                <li style={{ marginBottom: '10px' }}><Link href="/" style={{ color: '#cbd5e0', textDecoration: 'none' }}>Accueil</Link></li>
                <li style={{ marginBottom: '10px' }}><Link href="/projets" style={{ color: '#cbd5e0', textDecoration: 'none' }}>Projets</Link></li>
                <li style={{ marginBottom: '10px' }}><Link href="/candidates" style={{ color: '#cbd5e0', textDecoration: 'none' }}>Candidats</Link></li>
                <li style={{ marginBottom: '10px' }}><Link href="/dashboard" style={{ color: '#cbd5e0', textDecoration: 'none' }}>Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '20px' }}>Contact</h4>
              <ul style={{ listStyle: 'none', padding: 0, color: '#cbd5e0' }}>
                <li style={{ marginBottom: '10px' }}>📧 contact@smconsulting.fr</li>
                <li style={{ marginBottom: '10px' }}>📱 01 23 45 67 89</li>
                <li style={{ marginBottom: '10px' }}>🏢 123 Avenue de la République, 75011 Paris</li>
              </ul>
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid #2d3748', paddingTop: '30px', textAlign: 'center', color: '#cbd5e0' }}>
            <p>© 2024 SM Consulting. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </>
  );
}