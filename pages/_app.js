import '../styles/globals.css';
import Header from '../components/Header';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      {/* CONTENEUR PRINCIPAL AVEC PADDING POUR HEADER FIXE */}
      <div style={{ 
        paddingTop: '80px', 
        minHeight: '100vh',
        background: '#ffffff' // Fond blanc
      }}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
