import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="header-v2-fixed" style={{
      background: 'white',
      boxShadow: '0 2px 10px rgba(26, 54, 93, 0.1)',
      position: 'fixed',
      width: '100%',
      top: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease'
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
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="/" style={{ color: '#4a5568', textDecoration: 'none', fontWeight: '500' }}>Accueil</Link>
          <Link href="/services" style={{ color: '#4a5568', textDecoration: 'none', fontWeight: '500' }}>Services</Link>
          <Link href="/projets" style={{ color: '#4a5568', textDecoration: 'none', fontWeight: '500' }}>Projets</Link>
          <Link href="/candidates" style={{ color: '#4a5568', textDecoration: 'none', fontWeight: '500' }}>Candidats</Link>
          <Link href="/contact" style={{ color: '#4a5568', textDecoration: 'none', fontWeight: '500' }}>Contact</Link>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/inscription" style={{
            background: '#38a169',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '25px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            Rejoindre
          </Link>
          <Link href="/inscription-recruteur" style={{
            background: '#fd7e14',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '25px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            Recruter
          </Link>
        </div>
      </nav>
    </header>
  );
}
