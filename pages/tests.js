// pages/tests.js - Page de tests complète pour diagnostiquer la plateforme
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Tests() {
  const [testResults, setTestResults] = useState({});
  const [runningTests, setRunningTests] = useState([]);
  const [activeTab, setActiveTab] = useState('cv');

  // Fonction pour exécuter un test
  const runTest = async (testType, endpoint, params = {}) => {
    setRunningTests(prev => [...prev, testType]);
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      const result = await response.json();
      
      setTestResults(prev => ({
        ...prev,
        [testType]: {
          success: response.ok,
          data: result,
          timestamp: new Date().toISOString()
        }
      }));
      
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testType]: {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      setRunningTests(prev => prev.filter(t => t !== testType));
    }
  };

  // Test des CVs
  const testCVs = async () => {
    try {
      const response = await fetch('/api/test-cv');
      const result = await response.json();
      
      setTestResults(prev => ({
        ...prev,
        cv: {
          success: response.ok,
          data: result,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        cv: {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }));
    }
  };

  // Test des emails
  const testEmails = (type, sendReal = false) => {
    runTest('email', '/api/test-emails', {
      testType: type,
      recipient: 'test@example.com',
      sendReal: sendReal
    });
  };

  // Test d'inscription recruteur
  const testRecruiterSignup = () => {
    runTest('recruiterSignup', '/api/inscription-recruteur', {
      prenom: 'Jean',
      nom: 'Test',
      email: 'jean.test@exemple.com',
      telephone: '06 12 34 56 78',
      poste: 'Directeur RH',
      entreprise: 'Entreprise Test',
      secteurActivite: 'E-commerce/Retail',
      tailleEntreprise: 'PME (50-250)',
      adresseEntreprise: 'Paris, France',
      volumeRecrutementAnnuel: '3-5 recrutements',
      rolesCherches: 'Développeur Frontend, Développeur Backend',
      accepteConditions: true,
      accepteRGPD: true
    });
  };

  // Test des APIs
  const testAPI = async (endpoint) => {
    try {
      const response = await fetch(endpoint);
      const result = await response.json();
      
      setTestResults(prev => ({
        ...prev,
        [`api_${endpoint.replace('/', '_')}`]: {
          success: response.ok,
          data: result,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [`api_${endpoint.replace('/', '_')}`]: {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }));
    }
  };

  // Composant pour afficher les résultats
  const TestResult = ({ testKey, result }) => {
    if (!result) return null;
    
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        border: `2px solid ${result.success ? '#bbf7d0' : '#fecaca'}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{
            margin: 0,
            color: result.success ? '#16a34a' : '#dc2626',
            fontSize: '1.2rem',
            fontWeight: '600'
          }}>
            {result.success ? '✅' : '❌'} Test: {testKey}
          </h3>
          <span style={{
            fontSize: '12px',
            color: '#6b7280',
            backgroundColor: '#f3f4f6',
            padding: '4px 8px',
            borderRadius: '12px'
          }}>
            {new Date(result.timestamp).toLocaleTimeString()}
          </span>
        </div>
        
        {result.error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '12px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Erreur: {result.error}
          </div>
        )}
        
        {result.data && (
          <details style={{ fontSize: '14px' }}>
            <summary style={{ 
              cursor: 'pointer', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '8px'
            }}>
              Voir les détails
            </summary>
            <pre style={{
              backgroundColor: '#f8fafc',
              padding: '12px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '12px',
              border: '1px solid #e2e8f0'
            }}>
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Tests Plateforme - SM Consulting</title>
        <meta name="description" content="Page de tests pour diagnostiquer la plateforme" />
      </Head>

      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <h1 style={{ 
                fontSize: '1.8rem', 
                fontWeight: 'bold', 
                color: '#1a365d', 
                margin: 0
              }}>
                SM Consulting - Tests
              </h1>
            </Link>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Link href="/dashboard" style={{ 
                color: '#6b7280', 
                textDecoration: 'none', 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                📊 Dashboard
              </Link>
              <Link href="/candidates" style={{ 
                color: '#6b7280', 
                textDecoration: 'none', 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                👥 Candidats
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
          🧪 Tests Plateforme
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: '0.9' }}>
          Diagnostics complets de toutes les fonctionnalités
        </p>
      </div>

      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Navigation des tests */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '40px',
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}>
            {[
              { key: 'cv', label: '📄 CVs', icon: '📄' },
              { key: 'emails', label: '📧 Emails', icon: '📧' },
              { key: 'signup', label: '📝 Inscriptions', icon: '📝' },
              { key: 'apis', label: '🔌 APIs', icon: '🔌' },
              { key: 'navigation', label: '🧭 Navigation', icon: '🧭' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '12px',
                  backgroundColor: activeTab === tab.key ? '#3b82f6' : 'transparent',
                  color: activeTab === tab.key ? 'white' : '#6b7280',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '15px'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Test CVs */}
          {activeTab === 'cv' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
              marginBottom: '30px'
            }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1a365d', marginBottom: '20px' }}>
                📄 Tests des CVs
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '30px' }}>
                Vérification du stockage, de la réception et de l'affichage des CVs consultants
              </p>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
                <button
                  onClick={testCVs}
                  disabled={runningTests.includes('cv')}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: runningTests.includes('cv') ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    opacity: runningTests.includes('cv') ? 0.6 : 1
                  }}
                >
                  {runningTests.includes('cv') ? '⏳ Test en cours...' : '🔍 Analyser les CVs'}
                </button>

                <button
                  onClick={() => window.open('/api/upload-cv', '_blank')}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  🧪 Tester API Upload
                </button>
              </div>

              {testResults.cv && <TestResult testKey="Analyse CVs" result={testResults.cv} />}

              {/* Instructions spécifiques CVs */}
              <div style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h4 style={{ color: '#0c4a6e', marginBottom: '12px' }}>📋 Checklist CVs</h4>
                <ul style={{ color: '#0369a1', paddingLeft: '20px' }}>
                  <li>Dossier <code>public/uploads/cv/</code> existe et accessible</li>
                  <li>Permissions d'écriture correctes</li>
                  <li>Formats PDF, DOC, DOCX acceptés</li>
                  <li>Limitation 10MB respectée</li>
                  <li>Upload drag & drop fonctionnel</li>
                  <li>Progress bar et validation côté client</li>
                </ul>
              </div>
            </div>
          )}

          {/* Test Emails */}
          {activeTab === 'emails' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
              marginBottom: '30px'
            }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1a365d', marginBottom: '20px' }}>
                📧 Tests des Emails
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '30px' }}>
                Vérification de l'envoi et réception des emails (confirmations, notifications)
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '30px' }}>
                <button
                  onClick={() => testEmails('welcome', false)}
                  disabled={runningTests.includes('email')}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: runningTests.includes('email') ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    opacity: runningTests.includes('email') ? 0.6 : 1
                  }}
                >
                  🧪 Test Configuration
                </button>

                <button
                  onClick={() => testEmails('candidateConfirmation', false)}
                  disabled={runningTests.includes('email')}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: runningTests.includes('email') ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    opacity: runningTests.includes('email') ? 0.6 : 1
                  }}
                >
                  👨‍💻 Email Candidat
                </button>

                <button
                  onClick={() => testEmails('recruiterAccess', false)}
                  disabled={runningTests.includes('email')}
                  style={{
                    backgroundColor: '#fd7e14',
                    color: 'white',
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: runningTests.includes('email') ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    opacity: runningTests.includes('email') ? 0.6 : 1
                  }}
                >
                  🏢 Email Recruteur
                </button>

                <button
                  onClick={() => testEmails('welcome', true)}
                  disabled={runningTests.includes('email')}
                  style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: runningTests.includes('email') ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    opacity: runningTests.includes('email') ? 0.6 : 1
                  }}
                >
                  📨 Envoi Réel
                </button>
              </div>

              {testResults.email && <TestResult testKey="Test Email" result={testResults.email} />}

              {/* Configuration Email */}
              <div style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fed7aa',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h4 style={{ color: '#92400e', marginBottom: '12px' }}>⚙️ Configuration Email</h4>
                <div style={{ fontSize: '14px', color: '#a16207' }}>
                  <p><strong>Variables d'environnement requises :</strong></p>
                  <ul>
                    <li><code>SMTP_HOST</code> - Serveur SMTP</li>
                    <li><code>SMTP_PORT</code> - Port (587 ou 465)</li>
                    <li><code>SMTP_USER</code> - Nom d'utilisateur</li>
                    <li><code>SMTP_PASS</code> - Mot de passe</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Test Inscriptions */}
          {activeTab === 'signup' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
              marginBottom: '30px'
            }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1a365d', marginBottom: '20px' }}>
                📝 Tests des Inscriptions
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '30px' }}>
                Test des processus d'inscription candidats et recruteurs
              </p>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', flexWrap: 'wrap' }}>
                <button
                  onClick={testRecruiterSignup}
                  disabled={runningTests.includes('recruiterSignup')}
                  style={{
                    backgroundColor: '#fd7e14',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: runningTests.includes('recruiterSignup') ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    opacity: runningTests.includes('recruiterSignup') ? 0.6 : 1
                  }}
                >
                  {runningTests.includes('recruiterSignup') ? '⏳ Test en cours...' : '🏢 Test Inscription Recruteur'}
                </button>

                <Link href="/inscription" style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '12px 24px',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  display: 'inline-block'
                }}>
                  👨‍💻 Tester Inscription Candidat
                </Link>

                <Link href="/inscription-recruteur" style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '12px 24px',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  display: 'inline-block'
                }}>
                  🏢 Formulaire Recruteur
                </Link>
              </div>

              {testResults.recruiterSignup && <TestResult testKey="Inscription Recruteur" result={testResults.recruiterSignup} />}

              {/* Checklist Inscriptions */}
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h4 style={{ color: '#166534', marginBottom: '12px' }}>✅ Checklist Inscriptions</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '14px' }}>
                  <div>
                    <strong style={{ color: '#166534' }}>Candidats :</strong>
                    <ul style={{ color: '#166534', paddingLeft: '20px', marginTop: '8px' }}>
                      <li>Formulaire complet (39 métiers IT)</li>
                      <li>Upload CV drag & drop</li>
                      <li>Validation champs obligatoires</li>
                      <li>Email de confirmation</li>
                      <li>Redirection après succès</li>
                    </ul>
                  </div>
                  <div>
                    <strong style={{ color: '#166534' }}>Recruteurs :</strong>
                    <ul style={{ color: '#166534', paddingLeft: '20px', marginTop: '8px' }}>
                      <li>Processus 4 étapes</li>
                      <li>Multi-sélection rôles IT</li>
                      <li>Acceptation RGPD obligatoire</li>
                      <li>Email validation + accès</li>
                      <li>Redirection dashboard</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Test APIs */}
          {activeTab === 'apis' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
              marginBottom: '30px'
            }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1a365d', marginBottom: '20px' }}>
                🔌 Tests des APIs
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '30px' }}>
                Vérification du bon fonctionnement de toutes les APIs
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '30px' }}>
                {[
                  { endpoint: '/api/candidates', name: 'Candidats', color: '#3b82f6' },
                  { endpoint: '/api/stats', name: 'Statistiques', color: '#10b981' },
                  { endpoint: '/api/upload-cv', name: 'Upload CV', color: '#fd7e14' },
                  { endpoint: '/api/inscription-recruteur', name: 'Inscription', color: '#8b5cf6' }
                ].map(api => (
                  <button
                    key={api.endpoint}
                    onClick={() => testAPI(api.endpoint)}
                    style={{
                      backgroundColor: api.color,
                      color: 'white',
                      padding: '12px 16px',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    {api.name}
                  </button>
                ))}
              </div>

              {Object.entries(testResults).filter(([key]) => key.startsWith('api_')).map(([key, result]) => (
                <TestResult key={key} testKey={key.replace('api_', 'API ')} result={result} />
              ))}

              {/* Documentation APIs */}
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h4 style={{ color: '#1f2937', marginBottom: '12px' }}>📚 Documentation APIs</h4>
                <div style={{ fontSize: '14px', color: '#4a5568' }}>
                  <ul>
                    <li><code>GET /api/candidates</code> - Récupération des candidats avec filtres</li>
                    <li><code>GET /api/stats</code> - Statistiques du dashboard</li>
                    <li><code>POST /api/upload-cv</code> - Upload de fichiers CV</li>
                    <li><code>POST /api/inscription-recruteur</code> - Inscription recruteurs</li>
                    <li><code>POST /api/test-emails</code> - Tests des emails</li>
                    <li><code>GET /api/test-cv</code> - Diagnostic des CVs</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Test Navigation */}
          {activeTab === 'navigation' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
              marginBottom: '30px'
            }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1a365d', marginBottom: '20px' }}>
                🧭 Tests de Navigation
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '30px' }}>
                Vérification de la cohérence et du fonctionnement de toutes les pages
              </p>

              {/* Test de toutes les pages */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '30px' }}>
                {[
                  { url: '/', name: '🏠 Accueil', description: 'Hero, services, contact' },
                  { url: '/candidates', name: '👥 Candidats', description: 'Vivier, recherche, pagination' },
                  { url: '/projets', name: '🚀 Projets', description: 'Dépôt missions, filtres' },
                  { url: '/coaptation', name: '💰 Coaptation', description: 'Programme 50% commission' },
                  { url: '/dashboard', name: '📊 Dashboard', description: 'Analytics recruteur' },
                  { url: '/inscription', name: '📝 Candidat', description: 'Formulaire + CV upload' },
                  { url: '/inscription-recruteur', name: '🏢 Recruteur', description: 'Inscription 4 étapes' }
                ].map(page => (
                  <div key={page.url} style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px'
                  }}>
                    <h4 style={{ color: '#1f2937', marginBottom: '8px', fontSize: '16px' }}>
                      {page.name}
                    </h4>
                    <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '12px' }}>
                      {page.description}
                    </p>
                    <Link href={page.url} style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '8px 16px',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'inline-block'
                    }}>
                      Tester →
                    </Link>
                  </div>
                ))}
              </div>

              {/* Checklist fonctionnalités */}
              <div style={{
                backgroundColor: '#fef3c7',
                border: '1px solid #fed7aa',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h4 style={{ color: '#92400e', marginBottom: '16px' }}>🎯 Checklist Fonctionnalités</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', fontSize: '14px' }}>
                  <div>
                    <strong style={{ color: '#92400e' }}>Navigation :</strong>
                    <ul style={{ color: '#a16207', paddingLeft: '20px', marginTop: '8px' }}>
                      <li>Header présent sur toutes les pages</li>
                      <li>Footer RGPD complet</li>
                      <li>Liens fonctionnels entre pages</li>
                      <li>Bouton retour opérationnel</li>
                      <li>Responsive design mobile</li>
                    </ul>
                  </div>
                  <div>
                    <strong style={{ color: '#92400e' }}>Interactivité :</strong>
                    <ul style={{ color: '#a16207', paddingLeft: '20px', marginTop: '8px' }}>
                      <li>Recherche temps réel (500ms)</li>
                      <li>Filtres multiples fonctionnels</li>
                      <li>Pagination dynamique</li>
                      <li>Formulaires avec validation</li>
                      <li>Messages de confirmation</li>
                    </ul>
                  </div>
                  <div>
                    <strong style={{ color: '#92400e' }}>Performance :</strong>
                    <ul style={{ color: '#a16207', paddingLeft: '20px', marginTop: '8px' }}>
                        <li>Chargement &lt; 3 secondes</li>
                        <li>Pas d'erreurs console</li>
                        <li>Images optimisées</li>
                        <li>CSS/JS minifiés</li>
                        <li>APIs réactives</li>
                    </ul>
                </div>

                </div>
              </div>
            </div>
          )}

          {/* Résumé des tests */}
          {Object.keys(testResults).length > 0 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
            }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1a365d', marginBottom: '20px' }}>
                📈 Résumé des Tests
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{
                  backgroundColor: '#dcfce7',
                  border: '2px solid #bbf7d0',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#16a34a' }}>
                    {Object.values(testResults).filter(r => r.success).length}
                  </div>
                  <div style={{ color: '#166534', fontWeight: '500' }}>Tests Réussis</div>
                </div>

                <div style={{
                  backgroundColor: '#fee2e2',
                  border: '2px solid #fecaca',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>❌</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#dc2626' }}>
                    {Object.values(testResults).filter(r => !r.success).length}
                  </div>
                  <div style={{ color: '#dc2626', fontWeight: '500' }}>Tests Échoués</div>
                </div>

                <div style={{
                  backgroundColor: '#f0f9ff',
                  border: '2px solid #bae6fd',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📊</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0284c7' }}>
                    {Object.keys(testResults).length}
                  </div>
                  <div style={{ color: '#0369a1', fontWeight: '500' }}>Total Tests</div>
                </div>

                <div style={{
                  backgroundColor: '#fefbeb',
                  border: '2px solid #fed7aa',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⏳</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#d97706' }}>
                    {runningTests.length}
                  </div>
                  <div style={{ color: '#a16207', fontWeight: '500' }}>En Cours</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        a:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
        }
        
        @media (max-width: 768px) {
          .test-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}