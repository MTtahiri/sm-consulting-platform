import Head from 'next/head';
import Link from 'next/link';
import ScrollToTop from '../components/ScrollToTop';

export default function PolitiqueConfidentialite() {
  return (
    <>
      <Head>
        <title>Politique de Confidentialité - SM Consulting</title>
        <meta name="description" content="Politique de confidentialité de SM Consulting - Protection des données personnelles et RGPD" />
      </Head>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', lineHeight: '1.6' }}>
        <Link href="/" style={{ color: '#003366', textDecoration: 'none', marginBottom: '30px', display: 'inline-block' }}>
          ← Retour à l'accueil
        </Link>

        <h1 style={{ color: '#003366', marginBottom: '30px' }}>Politique de Confidentialité</h1>

        <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '10px' }}>
          <h2 style={{ color: '#003366' }}>Protection de vos données personnelles</h2>

          <h3>Responsable du traitement</h3>
          <p>
            SM Consulting<br />
            13 rue Gustave Eiffel, 92110 Clichy<br />
            Email : <a href="mailto:dpo@sm-consulting.fr" style={{ color: '#003366' }}>dpo@sm-consulting.fr</a>
          </p>

          <h3>Données collectées</h3>
          <p>
            Nous collectons les données suivantes :<br />
            • Identité (nom, prénom, email)<br />
            • Données professionnelles (CV, compétences, expérience)<br />
            • Données de navigation (cookies, adresse IP)<br />
            • Données de contact (téléphone, entreprise)
          </p>

          <h3>Finalités du traitement</h3>
          <p>
            • Mise en relation candidats/recruteurs<br />
            • Gestion des projets et missions<br />
            • Amélioration de nos services<br />
            • Communication marketing (avec consentement)
          </p>

          <h3>Durée de conservation</h3>
          <p>
            • Données candidats : 2 ans après dernier contact<br />
            • Données recruteurs : 3 ans après dernier projet<br />
            • Données de navigation : 13 mois
          </p>

          <h3>Vos droits</h3>
          <p>
            Conformément au RGPD, vous disposez des droits suivants :<br />
            • Droit d'accès à vos données<br />
            • Droit de rectification<br />
            • Droit à l'effacement<br />
            • Droit à la limitation du traitement<br />
            • Droit à la portabilité des données<br />
            • Droit d'opposition
          </p>

          <h3>Exercer vos droits</h3>
          <p>
            Pour exercer vos droits, contactez notre DPO :<br />
            Email : <a href="mailto:dpo@sm-consulting.fr" style={{ color: '#003366' }}>dpo@sm-consulting.fr</a><br />
            Ou par courrier : SM Consulting - Service DPO, 13 rue Gustave Eiffel, 92110 Clichy
          </p>

          <h3>Sécurité des données</h3>
          <p>
            Nous mettons en œuvre toutes les mesures techniques et organisationnelles nécessaires pour garantir la sécurité de vos données personnelles.
          </p>

          <h3>Cookies</h3>
          <p>
            Nous utilisons des cookies pour :<br />
            • Améliorer l'expérience utilisateur<br />
            • Analyser l'audience du site<br />
            • Personnaliser le contenu
          </p>

          <div style={{ background: '#e7f3ff', padding: '20px', borderRadius: '8px', marginTop: '30px' }}>
            <h4 style={{ color: '#003366' }}>Formulaire CNIL</h4>
            <p>
              Pour exercer vos droits directement auprès de la CNIL :<br />
              <a href="https://www.cnil.fr/fr/formulaire-en-ligne-pour-effectuer-une-reclamation" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 style={{ color: '#003366', fontWeight: 'bold' }}>
                📝 Formulaire en ligne de la CNIL
              </a>
            </p>
          </div>
        </div>
      </div>

      <ScrollToTop />
    </>
  );
}
