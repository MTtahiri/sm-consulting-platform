import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: '#1a365d',
      color: 'white',
      padding: '40px 20px',
      marginTop: '60px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px'
      }}>
        <div>
          <h3 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>SM Consulting</h3>
          <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
            Votre partenaire recrutement IT & Consulting. 
            Connectons les talents aux opportunités.
          </p>
        </div>

        <div>
          <h4 style={{ marginBottom: '15px' }}>Liens Rapides</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/candidates" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
              👥 Candidats
            </Link>
            <Link href="/projets" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
              🚀 Projets
            </Link>
            <Link href="/coaptation" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
              💰 Coaptation
            </Link>
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: '15px' }}>Informations Légales</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/mentions-legales" style={{ color: '#fd7e14', textDecoration: 'underline' }}>
              Mentions Légales
            </Link>
            <Link href="/politique-confidentialite" style={{ color: '#fd7e14', textDecoration: 'underline' }}>
              Politique de Confidentialité
            </Link>
            <a 
              href="https://www.cnil.fr/fr/formulaire-en-ligne-pour-effectuer-une-reclamation"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#fd7e14', textDecoration: 'underline' }}
            >
              Formulaire CNIL RGPD
            </a>
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: '15px' }}>Contact</h4>
          <div style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
            <p>📞 +33 6 19 25 75 88</p>
            <p>✉️ contact@rhprospects.fr</p>
            <p>📍 13 rue Gustave Eiffel, Clichy</p>
          </div>
        </div>
      </div>

      <div style={{ 
        borderTop: '1px solid #2d3748', 
        marginTop: '40px', 
        paddingTop: '20px',
        textAlign: 'center',
        color: '#94a3b8'
      }}>
        <p>© {new Date().getFullYear()} SM Consulting. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
