import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navStyle = {
    background: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'white',
    boxShadow: isScrolled ? '0 2px 10px rgba(26, 54, 93, 0.1)' : 'none',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease',
    backdropFilter: isScrolled ? 'blur(10px)' : 'none',
  };

  const linkStyle = {
    color: '#1a365d',
    textDecoration: 'none',
    marginRight: '2rem',
    fontWeight: '600',
    cursor: 'pointer',
  };

  return (
    <header style={navStyle}>
      <nav style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 20px', display: 'flex', alignItems: 'center' }}>
        <Link href="/">
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a365d', cursor: 'pointer' }}>
            SM Consulting
          </div>
        </Link>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={linkStyle}>Accueil</Link>
          <Link href="/offres-emploi" style={linkStyle}>Offres d'emploi</Link>
          <Link href="/projets" style={linkStyle}>Projets</Link>
          <Link href="/candidates" style={linkStyle}>Consultants</Link>
          <Link href="/contact" style={linkStyle}>Contact</Link>
          <Link href="/inscription" style={{...linkStyle, background: '#38a169', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px'}}>Rejoindre</Link>
        </div>
      </nav>
    </header>
  );
}
