// components/Navigation.js - Système de navigation complet
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Navigation = ({ showBackButton = false, customBackUrl = null }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Configuration des onglets
  const navigationItems = [
    {
      name: 'Accueil',
      href: '/',
      icon: '🏠',
      description: 'Page d\'accueil'
    },
    {
      name: 'Services',
      href: '/services',
      icon: '⚙️',
      description: 'Nos services IT'
    },
    {
      name: 'Projets',
      href: '/projets',
      icon: '💼',
      description: 'Missions disponibles'
    },
    {
      name: 'Candidats',
      href: '/candidates',
      icon: '👥',
      description: 'Profils freelances'
    },
    {
      name: 'Recruteurs',
      href: '/recruteurs',
      icon: '🏢',
      description: 'Espace entreprises'
    },
    {
      name: 'Portage salarial',
      href: '/portage-salarial',
      icon: '💰',
      description: 'Solutions de portage'
    },
    {
      name: 'Coaptation',
      href: '/coaptation',
      icon: '🤝',
      description: 'Programme de recommandation'
    },
    {
      name: 'Contact',
      href: '/contact',
      icon: '📞',
      description: 'Nous contacter'
    }
  ];

  const handleBackClick = () => {
    if (customBackUrl) {
      router.push(customBackUrl);
    } else {
      router.back();
    }
  };

  return (
    <>
      {/* Header principal */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {/* Barre principale */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '70px'
          }}>
            {/* Logo et bouton retour */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {showBackButton && (
                <button
                  onClick={handleBackClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                  }}
                >
                  ← Retour
                </button>
              )}

              <Link href="/" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#fd7e14',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    💼
                  </div>
                  <h1 style={{
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    color: '#1a365d',
                    margin: 0
                  }}>
                    SM Consulting
                  </h1>
                </div>
              </Link>
            </div>

            {/* Navigation desktop */}
            <nav style={{ display: 'none', '@media (min-width: 1024px)': { display: 'flex' } }}>
              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                {navigationItems.map((item) => {
                  const isActive = router.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: isActive ? '#fd7e14' : '#6b7280',
                        backgroundColor: isActive ? '#fff7ed' : 'transparent',
                        border: isActive ? '1px solid #fed7aa' : '1px solid transparent',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.target.style.backgroundColor = '#f9fafb';
                          e.target.style.color = '#374151';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#6b7280';
                        }
                      }}
                    >
                      <span>{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* CTA et menu mobile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link
                href="/projets"
                style={{
                  background: 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)',
                  color: 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '25px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(253, 126, 20, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(253, 126, 20, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(253, 126, 20, 0.3)';
                }}
              >
                🚀 Déposer un projet
              </Link>

              {/* Bouton menu mobile */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{
                  display: 'block',
                  '@media (min-width: 1024px)': { display: 'none' },
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                {isMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>

          {/* Menu mobile */}
          {isMenuOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              right: '0',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderTop: 'none',
              borderRadius: '0 0 12px 12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              zIndex: 1000
            }}>
              <div style={{ padding: '20px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px'
                }}>
                  {navigationItems.map((item) => {
                    const isActive = router.pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '16px',
                          borderRadius: '10px',
                          textDecoration: 'none',
                          backgroundColor: isActive ? '#fff7ed' : '#f9fafb',
                          border: isActive ? '1px solid #fed7aa' : '1px solid #e5e7eb',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>{item.icon}</span>
                        <div>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: isActive ? '#fd7e14' : '#374151'
                          }}>
                            {item.name}
                          </div>
                          <div style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            marginTop: '2px'
                          }}>
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Breadcrumb (optionnel) */}
      {showBackButton && (
        <div style={{
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e5e7eb',
          padding: '12px 20px'
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              Accueil
            </Link>
            <span>→</span>
            <span style={{ color: '#374151', fontWeight: '500' }}>
              {navigationItems.find(item => item.href === router.pathname)?.name || 'Page courante'}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;

// Hook personnalisé pour la navigation
export const useNavigation = () => {
  const router = useRouter();

  const navigateTo = (path) => {
    router.push(path);
  };

  const goBack = (fallbackUrl = '/') => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  const isCurrentPage = (path) => {
    return router.pathname === path;
  };

  return {
    navigateTo,
    goBack,
    isCurrentPage,
    currentPath: router.pathname
  };
};