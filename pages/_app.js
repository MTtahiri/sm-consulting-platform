import '../styles/globals.css';
import Header from '../components/Header';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      {/* CONTENEUR PRINCIPAL AVEC PADDING */}
      <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
