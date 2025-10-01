import Head from 'next/head';
import Link from 'next/link';
import ScrollToTop from '../components/ScrollToTop';

export default function MentionsLegales() {
  return (
    <>
      <Head>
        <title>Mentions Légales - SM Consulting</title>
        <meta name="description" content="Mentions légales de SM Consulting - Informations légales et conditions d'utilisation" />
      </Head>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', lineHeight: '1.6' }}>
        <Link href="/" style={{ color: '#003366', textDecoration: 'none', marginBottom: '30px', display: 'inline-block' }}>
          ← Retour à l'accueil
        </Link>

        <h1 style={{ color: '#003366', marginBottom: '30px' }}>Mentions Légales</h1>

        <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '10px' }}>
          <h2 style={{ color: '#003366' }}>Informations légales</h2>
          
          <h3>Éditeur du site</h3>
          <p>
            <strong>SM Consulting</strong><br />
            SAS au capital de 5 000 €<br />
            RCS Paris 123 456 789<br />
            SIRET : 123 456 789 00012<br />
            TVA intracommunautaire : FR 12 123456789<br />
            Siège social : 13 rue Gustave Eiffel, 92110 Clichy
          </p>

          <h3>Responsable de publication</h3>
          <p>Mohamed AIT TALEB - Directeur Général</p>

          <h3>Hébergement</h3>
          <p>
            <strong>Vercel Inc.</strong><br />
            340 S Lemon Ave #4133<br />
            Walnut, CA 91789<br />
            United States<br />
            Site web : <a href="https://vercel.com" style={{ color: '#003366' }}>vercel.com</a>
          </p>

          <h3>Propriété intellectuelle</h3>
          <p>
            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
            Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
          </p>

          <h3>Protection des données personnelles</h3>
          <p>
            Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), 
            vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité des données vous concernant.
          </p>

          <h3>Cookies</h3>
          <p>
            Ce site utilise des cookies pour améliorer l'expérience utilisateur. En naviguant sur ce site, vous acceptez l'utilisation de cookies.
          </p>

          <h3>Contact</h3>
          <p>
            Pour toute question relative aux mentions légales :<br />
            Email : <a href="mailto:legal@sm-consulting.fr" style={{ color: '#003366' }}>legal@sm-consulting.fr</a><br />
            Téléphone : +33 6 19 25 75 88
          </p>

          <p style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>

      <ScrollToTop />
    </>
  );
}
