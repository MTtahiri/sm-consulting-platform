// components/Layout.js
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ 
  children, 
  title = 'SM Consulting - Recrutement IT & Portage Salarial',
  description = 'Plateforme de recrutement IT spécialisée et solutions de portage salarial',
  showBackButton = false 
}) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo et navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <Link href="/" style={{
              textDecoration: 'none',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: '#1a365d'
            }}>
              SM Consulting
            </Link>

            <nav style={{ display: 'flex', gap: '24px' }}>
              <Link href="/services" style={{
                color: router.pathname === '/services' ? '#fd7e14' : '#6b7280',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Services
              </Link>
              <Link href="/recruteurs" style={{
                color: router.pathname === '/recruteurs' ? '#fd7e14' : '#6b7280',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Recruteurs
              </Link>
              <Link href="/candidats" style={{
                color: router.pathname === '/candidats' ? '#fd7e14' : '#6b7280',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Candidats
              </Link>
              <Link href="/projets" style={{
                color: router.pathname === '/projets' ? '#fd7e14' : '#6b7280',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Projets
              </Link>
              <Link href="/contact" style={{
                color: router.pathname === '/contact' ? '#fd7e14' : '#6b7280',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Contact
              </Link>
            </nav>
          </div>

          {/* Bouton portage salarial */}
          <Link href="/portage-salarial" style={{
            background: 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '25px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            💼 Portage Salarial
          </Link>
        </div>
      </header>

      {/* Bouton retour */}
      {showBackButton && (
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
          <button
            onClick={() => router.back()}
            style={{
              background: 'none',
              border: '1px solid #d1d5db',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#6b7280',
              fontSize: '14px'
            }}
          >
            ← Retour
          </button>
        </div>
      )}

      {/* Contenu principal */}
      <main>{children}</main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#1a365d',
        color: 'white',
        padding: '60px 20px',
        marginTop: '80px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px' }}>
                SM Consulting
              </h3>
              <p style={{ color: '#cbd5e0', lineHeight: '1.6' }}>
                Spécialiste du recrutement IT et du portage salarial depuis 2015.
              </p>
            </div>
            
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '20px' }}>
                Liens rapides
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link href="/services" style={{ color: '#cbd5e0', textDecoration: 'none' }}>
                  Services
                </Link>
                <Link href="/recruteurs" style={{ color: '#cbd5e0', textDecoration: 'none' }}>
                  Recruteurs
                </Link>
                <Link href="/candidats" style={{ color: '#cbd5e0', textDecoration: 'none' }}>
                  Candidats
                </Link>
                <Link href="/projets" style={{ color: '#cbd5e0', textDecoration: 'none' }}>
                  Projets
                </Link>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '20px' }}>
                Contact
              </h4>
              <div style={{ color: '#cbd5e0' }}>
                <p>📧 ***REMOVED***</p>
                <p>📱 +33 6 19 25 75 88</p>
                <p>📍 13 rue Gustave Eiffel, 92110 Clichy</p>
              </div>
            </div>
          </div>
          
          <div style={{
            borderTop: '1px solid #2d3748',
            paddingTop: '30px',
            textAlign: 'center',
            color: '#cbd5e0'
          }}>
            <p>© 2024 SM Consulting. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </>
  );
}