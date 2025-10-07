import Link from 'next/link';

export default function Header() {
  return (
    <header style={{
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 0',
      position: 'fixed',
      width: '100%',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold', color: '#1a365d' }}>
          SM Consulting
        </Link>

        {/* Menu */}
        <nav style={{ display: 'flex', gap: '2rem' }}>
          <Link href="/" style={{ color: '#4a5568', textDecoration: 'none' }}>Accueil</Link>
          <Link href="/services" style={{ color: '#4a5568', textDecoration: 'none' }}>Services</Link>
          <Link href="/projets" style={{ color: '#4a5568', textDecoration: 'none' }}>Projets</Link>
          <Link href="/candidates" style={{ color: '#4a5568', textDecoration: 'none' }}>Candidats</Link>
          <Link href="/offres-emploi" style={{ color: '#4a5568', textDecoration: 'none' }}>Offres d&apos;emploi</Link>
          <Link href="/contact" style={{ color: '#4a5568', textDecoration: 'none' }}>Contact</Link>
        </nav>

        {/* Boutons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/inscription" style={{ background: '#38a169', color: 'white', padding: '0.5rem 1rem', borderRadius: '25px', textDecoration: 'none' }}>
            Rejoindre
          </Link>
          <Link href="/inscription-recruteur" style={{ background: '#fd7e14', color: 'white', padding: '0.5rem 1rem', borderRadius: '25px', textDecoration: 'none' }}>
            Recruter
          </Link>
        </div>
      </div>
    </header>
  );
}
