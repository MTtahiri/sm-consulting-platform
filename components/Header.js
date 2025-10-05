import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
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
            <button onClick={() => scrollToSection('accueil')} style={{
              color: '#4a5568',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.3s',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}>Accueil</button>
          </li>
          <li>
            <button onClick={() => scrollToSection('services')} style={{
              color: '#4a5568',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.3s',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}>Services</button>
          </li>
          <li>
            <Link href="/projets" style={{
              color: '#4a5568',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.3s'
            }}>Projets</Link>
          </li>
          <li>
            <Link href="/candidates" style={{
              color: '#4a5568',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.3s'
            }}>Candidats</Link>
          </li>
          <li>
            <button onClick={() => scrollToSection('contact')} style={{
              color: '#4a5568',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.3s',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}>Contact</button>
          </li>
        </ul>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/inscription" style={{
            background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '25px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.3s ease'
          }}>Rejoindre</Link>
          <Link href="/inscription-recruteur" style={{
            background: 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '25px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.3s ease'
          }}>Recruter</Link>
        </div>
      </nav>
    </header>
  );
}
