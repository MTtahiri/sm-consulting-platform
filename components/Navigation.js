// components/Navigation.js - VERSION SIMPLIFIÉE
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navigation = () => {
  const router = useRouter();

  const navigationItems = [
    { name: 'Accueil', href: '/', icon: '🏠' },
    { name: 'Services', href: '/services', icon: '⚙️' },
    { name: 'Projets', href: '/projets', icon: '💼' },
    { name: 'Candidats', href: '/candidates', icon: '👥' },
    { name: 'Offres d\'emploi', href: '/offres-emploi', icon: '📋' },
    { name: 'Contact', href: '/contact', icon: '📞' }
  ];

  return (
    <header style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '70px'
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#fd7e14',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'white'
          }}>
            SM
          </div>
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#1a365d',
            margin: 0
          }}>
            SM Consulting
          </h1>
        </Link>

        {/* Menu principal - TOUJOURS VISIBLE */}
        <nav style={{ 
          display: 'flex', 
          gap: '4px',
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
        </nav>

        {/* CTA */}
        <Link
          href="/projets"
          style={{
            background: 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '25px',
            fontWeight: '600',
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
      </div>
    </header>
  );
};

export default Navigation;
